import xml.etree.ElementTree as ET


def xml_to_document(xml_text):

    root = ET.fromstring(xml_text)

    document  = []
    sent_id   = 1

    for para in root.findall(".//P"):

        # Get ALL <W> tags anywhere inside <P>
        # including those nested inside <MARKABLE>
        words = []
        for w in para.iter("W"):
            if w.text and w.text.strip():
                word = w.text.strip()
                # Skip punctuation-only tokens
                if word not in {"।", ",", ".", ":", ";", "!", "?", "-"}:
                    words.append(word)

        text = " ".join(words)

        if text:
            document.append({
                "id":   sent_id,
                "text": text
            })
            sent_id += 1

    return document