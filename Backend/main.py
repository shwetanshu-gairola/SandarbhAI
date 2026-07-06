from fastapi import FastAPI
from fastapi import UploadFile
from fastapi import File
from fastapi.middleware.cors import CORSMiddleware
from services.txt_to_xml import txt_to_document
from services.xml_to_document import xml_to_document
from services.discourse_pipeline import predict_sentence, reset_document
from fastapi.responses import Response
import xml.etree.ElementTree as ET
from fastapi import WebSocket
import asyncio


app = FastAPI(
    title="SandarbhAI — Hindi Anaphora Detection"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "SandarbhAI Backend Running"
    }


@app.post("/upload")
async def upload_file(
    file: UploadFile = File(...)
):
    contents = await file.read()
    text     = contents.decode("utf-8")
    document = txt_to_document(text)

    reset_document()
    results = []

    for sentence in document:
        prediction = predict_sentence(sentence["text"])
        results.append({
            **sentence,
            **prediction
        })

    return {
        "document": results
    }


@app.post("/upload-xml")
async def upload_xml(
    file: UploadFile = File(...)
):
    contents = await file.read()
    xml_text = contents.decode("utf-8")
    document = xml_to_document(xml_text)

    reset_document()
    results = []

    for sentence in document:
        prediction = predict_sentence(sentence["text"])
        results.append({
            **sentence,
            **prediction
        })

    return {
        "document": results
    }


@app.post("/export-xml")
async def export_xml(request: dict):
    document = request.get("document", [])

    root = ET.Element("DOCUMENT")
    ET.SubElement(root, "DESC")
    ET.SubElement(root, "DESC")

    markable_id = 0
    coref_id    = 1000

    # Build GLOBAL antecedent ID map across all sentences
    ant_ids = {}
    for sent in document:
        for a in sent.get("anaphoras", []):
            if a["antecedent"] not in ant_ids:
                ant_ids[a["antecedent"]] = markable_id
                markable_id += 1

    # Reset markable_id for per-sentence use
    markable_id = max(ant_ids.values()) + 1 if ant_ids else 0

    for sent in document:
        p_el      = ET.SubElement(root, "P")
        anaphoras = sent.get("anaphoras", [])
        ana_map   = {a["anaphor"]: a for a in anaphoras}
        tokens    = sent.get("tokens", sent["text"].split())

        for token in tokens:
            if token in ant_ids:
                m_el = ET.SubElement(p_el, "MARKABLE",
                    ID=str(ant_ids[token]),
                    COMMENT=""
                )
                ET.SubElement(m_el, "W").text = token

            elif token in ana_map:
                rel = ana_map[token]
                src = ant_ids.get(rel["antecedent"], 0)
                m_el = ET.SubElement(p_el, "MARKABLE",
                    ID=str(coref_id),
                    COMMENT=""
                )
                ET.SubElement(m_el, "COREF",
                    ID=str(coref_id),
                    SRC=str(src),
                    CERTAIN="TRUE",
                    COMMENT="",
                    TYPE_ANA="ANAPHORA",
                    TYPE_REF="ANAPHORA"
                )
                ET.SubElement(m_el, "W").text = token
                coref_id += 1

            else:
                ET.SubElement(p_el, "W").text = token

    ET.indent(root, space="  ")
    xml_str = ET.tostring(root, encoding="unicode", xml_declaration=False)
    xml_str = '<?xml version="1.0" encoding="UTF-8"?>\n' + xml_str

    return Response(
        content=xml_str,
        media_type="application/xml",
        headers={"Content-Disposition": "attachment; filename=sandarbhai_output.xml"}
    )

@app.post("/export-txt")
async def export_txt(request: dict):
    document = request.get("document", [])
    filename = request.get("filename", "output")

    lines = []
    lines.append("=" * 60)
    lines.append("SandarbhAI — Hindi Anaphora Detection Report")
    lines.append("संदर्भ पहचान रिपोर्ट")
    lines.append("=" * 60)
    lines.append(f"File: {filename}")

    total_ana = sum(len(s.get("anaphoras", [])) for s in document)
    sent_with = sum(1 for s in document if s.get("anaphoras"))

    lines.append(f"Total Sentences: {len(document)}")
    lines.append(f"Total Anaphoras: {total_ana}")
    lines.append(f"Sentences with links: {sent_with}")
    lines.append("=" * 60)
    lines.append("")

    for sent in document:
        anaphoras = sent.get("anaphoras", [])
        lines.append(f"S{sent['id']}: {sent['text']}")
        if anaphoras:
            for a in anaphoras:
                conf = int(a['confidence'] * 100)
                lines.append(f"  → {a['antecedent']} → {a['anaphor']} ({conf}%, dist: {a['sent_dist']})")
        else:
            lines.append("  → No anaphoras detected")
        lines.append("")

    lines.append("=" * 60)
    lines.append("Generated by SandarbhAI | MuRIL F1: 92.96%")
    lines.append("=" * 60)

    txt_content = "\n".join(lines)

    return Response(
        content=txt_content.encode("utf-8"),
        media_type="text/plain",
        headers={"Content-Disposition": f"attachment; filename=sandarbhai_report.txt"}
    )

@app.websocket("/ws/analyse")
async def websocket_analyse(websocket: WebSocket):
    await websocket.accept()
    
    try:
        data     = await websocket.receive_json()
        text     = data.get("text", "")
        filetype = data.get("filetype", "txt")
        
        if filetype == "xml":
            document = xml_to_document(text)
        else:
            document = txt_to_document(text)
        
        reset_document()
        results = []
        total   = len(document)
        
        await websocket.send_json({
            "type":    "start",
            "message": f"Starting analysis · विश्लेषण शुरू",
            "total":   total
        })

        for i, sentence in enumerate(document):
            try:
                await websocket.send_json({
                    "type":    "progress",
                    "message": f"Processing S{sentence['id']}: {sentence['text'][:50]}...",
                    "current": i + 1,
                    "total":   total
                })
            except Exception:
                break

            prediction = await asyncio.get_event_loop().run_in_executor(
                None, predict_sentence, sentence["text"]
            )
            results.append({**sentence, **prediction})

            ana_count = len(prediction.get("anaphoras", []))
            if ana_count > 0:
                links = ", ".join(
                    f"{a['antecedent']} → {a['anaphor']}"
                    for a in prediction["anaphoras"]
                )
                try:
                    await websocket.send_json({
                        "type":    "found",
                        "message": f"Found {ana_count} link(s): {links}",
                        "current": i + 1,
                        "total":   total
                    })
                except Exception:
                    break

            await asyncio.sleep(0.01)

        try:
            await websocket.send_json({
                "type":     "done",
                "message":  "Analysis complete · विश्लेषण पूर्ण",
                "document": results
            })
        except Exception:
            pass

    except Exception as e:
        try:
            await websocket.send_json({
                "type":    "error",
                "message": str(e)
            })
        except Exception:
            pass