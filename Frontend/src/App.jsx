import { useState, useRef, useEffect } from "react"

const API = "http://10.226.53.203:8000"

const COLORS = [
  { bg: "#A855F7", glow: "#A855F733", text: "#fff" },
  { bg: "#06B6D4", glow: "#06B6D433", text: "#fff" },
  { bg: "#F59E0B", glow: "#F59E0B33", text: "#fff" },
  { bg: "#EF4444", glow: "#EF444433", text: "#fff" },
  { bg: "#10B981", glow: "#10B98133", text: "#fff" },
  { bg: "#EC4899", glow: "#EC489933", text: "#fff" },
]

const G = {
  bg:        "#070B14",
  surface:   "rgba(255,255,255,0.04)",
  glass:     "rgba(255,255,255,0.06)",
  border:    "rgba(255,255,255,0.08)",
  borderHi:  "rgba(168,85,247,0.5)",
  text:      "#F1F5F9",
  muted:     "#64748B",
  dim:       "#334155",
  purple:    "#A855F7",
  cyan:      "#06B6D4",
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    background: ${G.bg};
    font-family: 'Inter', 'Noto Sans Devanagari', sans-serif;
    color: ${G.text};
    min-height: 100vh;
  }

  .glow-orb-1 {
    position: fixed; top: -200px; left: -200px;
    width: 600px; height: 600px; border-radius: 50%;
    background: radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }
  .glow-orb-2 {
    position: fixed; bottom: -200px; right: -200px;
    width: 500px; height: 500px; border-radius: 50%;
    background: radial-gradient(circle, rgba(6,182,212,0.10) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }

  .glass-card {
    background: ${G.glass};
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid ${G.border};
    border-radius: 16px;
  }

  .glass-card-hi {
    background: ${G.glass};
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid ${G.borderHi};
    border-radius: 16px;
    box-shadow: 0 0 30px rgba(168,85,247,0.08);
  }

  .btn-primary {
    width: 100%;
    padding: 0.9rem;
    border-radius: 12px;
    border: none;
    cursor: pointer;
    font-weight: 700;
    font-size: 1rem;
    font-family: inherit;
    background: linear-gradient(135deg, #A855F7, #06B6D4);
    color: #fff;
    transition: all 0.2s;
    position: relative;
    overflow: hidden;
  }
  .btn-primary:disabled {
    background: rgba(255,255,255,0.05);
    color: ${G.dim};
    cursor: not-allowed;
  }
  .btn-primary:not(:disabled):hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 30px rgba(168,85,247,0.3);
  }

  .btn-export {
    padding: 0.45rem 1.1rem;
    border-radius: 8px;
    border: 1px solid rgba(6,182,212,0.4);
    cursor: pointer;
    font-weight: 600;
    font-size: 0.82rem;
    font-family: inherit;
    background: rgba(6,182,212,0.08);
    color: ${G.cyan};
    transition: all 0.2s;
  }
  .btn-export:hover {
    background: rgba(6,182,212,0.15);
    border-color: ${G.cyan};
    box-shadow: 0 0 16px rgba(6,182,212,0.2);
  }

  .tab-btn {
    padding: 0.4rem 1.2rem;
    border-radius: 8px;
    border: 1px solid transparent;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.82rem;
    font-family: inherit;
    transition: all 0.2s;
  }
  .tab-active {
    background: rgba(168,85,247,0.15);
    border-color: rgba(168,85,247,0.5);
    color: ${G.purple};
  }
  .tab-inactive {
    background: transparent;
    border-color: ${G.border};
    color: ${G.muted};
  }
  .tab-inactive:hover { color: ${G.text}; border-color: ${G.dim}; }

  .drop-zone {
    border: 2px dashed ${G.border};
    border-radius: 12px;
    padding: 2.5rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    margin-bottom: 1.25rem;
  }
  .drop-zone:hover, .drop-zone.dragging {
    border-color: rgba(168,85,247,0.6);
    background: rgba(168,85,247,0.04);
  }

  .stat-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid ${G.border};
    border-radius: 12px;
    padding: 1rem;
    text-align: center;
    transition: all 0.2s;
  }
  .stat-card:hover {
    border-color: rgba(168,85,247,0.3);
    background: rgba(168,85,247,0.04);
  }

  .sent-card {
    background: rgba(255,255,255,0.025);
    border: 1px solid ${G.border};
    border-radius: 14px;
    padding: 1.25rem 1.5rem;
    margin-bottom: 0.875rem;
    transition: border-color 0.2s;
  }
  .sent-card.has-links {
    border-color: rgba(168,85,247,0.2);
  }
  .sent-card.has-links:hover {
    border-color: rgba(168,85,247,0.4);
    box-shadow: 0 0 20px rgba(168,85,247,0.06);
  }

  .legend-bar {
    background: rgba(255,255,255,0.03);
    border: 1px solid ${G.border};
    border-radius: 8px;
    padding: 0.6rem 1rem;
    margin-bottom: 1.25rem;
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
    font-size: 0.78rem;
    color: ${G.muted};
    align-items: center;
  }

  .tag {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 1px 8px;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 600;
  }

  .s-badge {
    background: rgba(255,255,255,0.05);
    color: ${G.muted};
    border-radius: 5px;
    padding: 1px 8px;
    font-size: 0.72rem;
    font-weight: 600;
  }

  .link-badge {
    background: rgba(168,85,247,0.12);
    color: ${G.purple};
    border-radius: 5px;
    padding: 1px 8px;
    font-size: 0.72rem;
    font-weight: 600;
  }

  .rel-card {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.35rem 0.75rem;
    border-radius: 8px;
    font-size: 0.82rem;
    border: 1px solid;
    background: rgba(255,255,255,0.03);
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.3); }
  }

  .error-box {
    background: rgba(239,68,68,0.08);
    border: 1px solid rgba(239,68,68,0.3);
    border-radius: 10px;
    padding: 1rem 1.5rem;
    color: #FCA5A5;
    margin-bottom: 1.5rem;
    font-size: 0.9rem;
  }
`

export default function App() {
  const [file, setFile]         = useState(null)
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [document_, setDoc]     = useState(null)
  const [error, setError]       = useState(null)
  const [fileType, setFileType] = useState("txt")
  const [logs, setLogs]         = useState([])
  const [minConf, setMinConf]   = useState(0.30)
  const [progress, setProgress] = useState(0)
  const logsEndRef              = useRef(null)
  const wsRef                   = useRef(null)
  const inputRef                = useRef()

  // Auto scroll logs to bottom
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [logs])

  async function handleUpload() {
    if (!file) return
    setLoading(true); setError(null); setDoc(null)
    setLogs([]); setProgress(0)

    try {
      const text = await file.text()
      const WS_URL = "ws://10.226.53.203:8000"
      const ws = new WebSocket(`${WS_URL}/ws/analyse`)
      wsRef.current = ws

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data)

        if (msg.type === "start") {
          setLogs([{ type: "info", text: msg.message, time: new Date().toLocaleTimeString() }])
        } else if (msg.type === "progress") {
          setProgress(Math.round((msg.current / msg.total) * 100))
          setLogs(prev => [...prev, {
            type: "progress",
            text: msg.message,
            time: new Date().toLocaleTimeString()
          }])
        } else if (msg.type === "found") {
          setLogs(prev => [...prev, {
            type: "found",
            text: msg.message,
            time: new Date().toLocaleTimeString()
          }])
        } else if (msg.type === "done") {
          setProgress(100)
          setLogs(prev => [...prev, {
            type: "done",
            text: msg.message,
            time: new Date().toLocaleTimeString()
          }])
          setDoc(msg.document)
          setLoading(false)
          ws.close()
        } else if (msg.type === "error") {
          setError(msg.message)
          setLoading(false)
          ws.close()
        }
      }

      ws.onerror = () => {
        setError("WebSocket error. Make sure backend is running.")
        setLoading(false)
      }

      ws.onopen = () => {
        ws.send(JSON.stringify({
          text:     text,
          filetype: fileType
        }))
      }

    } catch {
      setError("Backend not reachable. Make sure uvicorn is running on port 8000.")
      setLoading(false)
    }
  }

  async function handleExport() {
    if (!document_) return
    try {
      const res  = await fetch(`${API}/export-xml`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ document: document_ }),
      })
      const blob = await res.blob()
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement("a")
      a.href     = url
      a.download = (file?.name?.replace(/\.(txt|xml)$/, "") || "output") + "_sandarbhai.xml"
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      setError("Export failed.")
    }
  }

  async function handleExportTxt() {
    if (!document_) return
    try {
    const res  = await fetch(`${API}/export-txt`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({
        document: document_,
        filename: file?.name || "output"
      }),
    })
    const blob = await res.blob()
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement("a")
    a.href     = url
    a.download = (file?.name?.replace(/\.(txt|xml)$/, "") || "output") + "_report.txt"
    a.click()
    URL.revokeObjectURL(url)
  } catch {
    setError("TXT export failed.")
  }
}

  function onDrop(e) {
    e.preventDefault(); setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) pickFile(f)
  }

  function pickFile(f) {
    setFile(f); setDoc(null); setError(null)
    setFileType(f.name.endsWith(".xml") ? "xml" : "txt")
  }

  function buildColorMap(anaphoras) {
    const map = {}; let idx = 0
    anaphoras.forEach(a => {
      if (!(a.anaphor    in map)) map[a.anaphor]    = COLORS[idx % COLORS.length]
      if (!(a.antecedent in map)) map[a.antecedent] = COLORS[idx % COLORS.length]
      idx++
    })
    return map
  }

  function SentenceView({ sentence, minConf }) {
    const { tokens } = sentence
    const anaphoras = (sentence.anaphoras || []).filter(a => a.confidence >= minConf)
    if (!anaphoras || anaphoras.length === 0) {
      return (
        <p style={{ color: G.muted, lineHeight: "2.2", fontSize: "1.05rem" }}>
          {tokens.join(" ")}
        </p>
      )
    }
    const colorMap   = buildColorMap(anaphoras)
    const anaphorSet = new Set(anaphoras.map(a => a.anaphor))

    return (
      <div>
        <p style={{ lineHeight: "2.6", fontSize: "1.05rem", marginBottom: "0.875rem" }}>
          {tokens.map((tok, i) => {
            const c = colorMap[tok]
            if (!c) return <span key={i} style={{ color: "#CBD5E1" }}>{tok} </span>
            const isAna = anaphorSet.has(tok)
            return (
              <span key={i} title={isAna ? "Anaphor · अनुसंदर्भ" : "Antecedent · पूर्वसंदर्भ"}
                style={{
                  background:   isAna ? c.bg : "transparent",
                  color:        isAna ? "#fff" : c.bg,
                  borderRadius: "5px",
                  padding:      "2px 8px",
                  marginRight:  "3px",
                  fontWeight:   700,
                  border:       isAna ? `2px solid ${c.bg}` : `2px dashed ${c.bg}`,
                  display:      "inline-block",
                  fontSize:     "0.97rem",
                  boxShadow:    isAna ? `0 0 10px ${c.glow}` : "none",
                  transition:   "all 0.15s",
                }}
              >{tok}</span>
            )
          })}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {anaphoras.map((a, i) => {
            const c = colorMap[a.anaphor] || COLORS[0]
            return (
              <div key={i} className="rel-card" style={{ borderColor: c.bg + "44" }}>
                <span style={{ color: c.bg, fontWeight: 700 }}>{a.antecedent}</span>
                <span style={{ color: G.dim }}>→</span>
                <span style={{ color: c.bg, fontWeight: 700 }}>{a.anaphor}</span>
                <span style={{
                  background: c.bg + "22", color: c.bg,
                  borderRadius: "4px", padding: "1px 6px",
                  fontSize: "0.73rem", fontWeight: 700,
                }}>
                  {(a.confidence * 100).toFixed(0)}%
                </span>
                <span style={{ color: G.dim, fontSize: "0.73rem" }}>
                  dist: {a.sent_dist}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  function Stats({ doc }) {
    const totalAna    = doc.reduce((s, d) => s + (d.anaphoras?.length || 0), 0)
    const sentWithAna = doc.filter(d => d.anaphoras?.length > 0).length
    const items = [
      { label: "Sentences / वाक्य",     value: doc.length,   icon: "📄" },
      { label: "Anaphoras / अनुसंदर्भ", value: totalAna,     icon: "🔗" },
      { label: "Sentences with links",   value: sentWithAna,  icon: "✨" },
    ]
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem", marginBottom: "1.25rem" }}>
        {items.map((s, i) => (
          <div key={i} className="stat-card">
            <div style={{ fontSize: "1.5rem", marginBottom: "0.2rem" }}>{s.icon}</div>
            <div style={{ fontSize: "1.9rem", fontWeight: 700, color: G.purple, lineHeight: 1 }}>
              {s.value}
            </div>
            <div style={{ color: G.muted, fontSize: "0.75rem", marginTop: "0.3rem" }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      <style>{css}</style>
      <div className="glow-orb-1" />
      <div className="glow-orb-2" />

      <div style={{ position: "relative", zIndex: 1, minHeight: "100vh" }}>

        {/* Header */}
        <header style={{
          borderBottom: `1px solid ${G.border}`,
          padding: "0.9rem 2rem",
          display: "flex", alignItems: "center", gap: "1rem",
          backdropFilter: "blur(20px)",
          background: "rgba(7,11,20,0.8)",
          position: "sticky", top: 0, zIndex: 10,
        }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "9px",
            background: "linear-gradient(135deg, #A855F7, #06B6D4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, fontSize: "0.7rem",
            boxShadow: "0 0 16px rgba(168,85,247,0.4)",
          }}>सAI</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "1.05rem", letterSpacing: "0.03em" }}>
              SandarbhAI
            </div>
            <div style={{ color: G.muted, fontSize: "0.72rem" }}>
              Hindi Anaphora Detection · संदर्भ पहचान
            </div>
          </div>

          {/* Header right — model badge */}
          <div style={{ marginLeft: "auto" }}>
            <span style={{
              background: "rgba(168,85,247,0.1)",
              border: "1px solid rgba(168,85,247,0.25)",
              borderRadius: "20px", padding: "0.3rem 0.9rem",
              fontSize: "0.75rem", color: G.purple, fontWeight: 600,
            }}>
              MuRIL · F1 92.96%
            </span>
          </div>
        </header>

        <main style={{ maxWidth: "860px", margin: "0 auto", padding: "2.5rem 1.5rem" }}>

          {/* Hero */}
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div style={{
              display: "inline-block",
              background: "rgba(168,85,247,0.1)",
              border: "1px solid rgba(168,85,247,0.25)",
              borderRadius: "20px", padding: "0.3rem 1rem",
              fontSize: "0.78rem", color: G.purple, fontWeight: 600,
              marginBottom: "1rem", letterSpacing: "0.05em",
            }}>
              HINDI NLP · हिंदी अनुसंदर्भ पहचान
            </div>
            <h1 style={{
              fontSize: "2.6rem", fontWeight: 800,
              background: "linear-gradient(135deg, #F1F5F9 30%, #A855F7 70%, #06B6D4 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              backgroundClip: "text", lineHeight: 1.15, marginBottom: "0.75rem",
            }}>
              Anaphora Detection
            </h1>
            <p style={{ color: G.muted, fontSize: "1rem" }}>
              Upload Hindi text · अनुसंदर्भ संबंध स्वतः खोजें
            </p>
          </div>

          {/* Upload card */}
          <div className="glass-card" style={{ padding: "1.75rem", marginBottom: "2rem" }}>

            {/* File type toggle */}
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem" }}>
              {["txt", "xml"].map(t => (
                <button key={t} onClick={() => setFileType(t)}
                  className={`tab-btn ${fileType === t ? "tab-active" : "tab-inactive"}`}>
                  .{t.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Drop zone */}
            <div
              className={`drop-zone${dragging ? " dragging" : ""}`}
              onClick={() => inputRef.current.click()}
              onDragOver={e => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
            >
              <div style={{ fontSize: "2.2rem", marginBottom: "0.6rem" }}>
                {file ? "📝" : "📂"}
              </div>
              {file ? (
                <div>
                  <div style={{ color: G.purple, fontWeight: 700, fontSize: "1rem" }}>
                    {file.name}
                  </div>
                  <div style={{ color: G.muted, fontSize: "0.78rem", marginTop: "0.3rem" }}>
                    {(file.size / 1024).toFixed(1)} KB · Click to change
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ color: "#94A3B8", fontWeight: 500 }}>
                    Drop your file here or click to browse
                  </div>
                  <div style={{ color: G.dim, fontSize: "0.8rem", marginTop: "0.3rem" }}>
                    फ़ाइल यहाँ खींचें या क्लिक करें · .{fileType.toUpperCase()} supported
                  </div>
                </div>
              )}
              <input ref={inputRef} type="file"
                accept={fileType === "xml" ? ".xml" : ".txt"}
                style={{ display: "none" }}
                onChange={e => e.target.files[0] && pickFile(e.target.files[0])}
              />
            </div>

            {/* Analyse button */}
            <button className="btn-primary" onClick={handleUpload} disabled={!file || loading}>
              {loading
                ? "Analysing… विश्लेषण हो रहा है…"
                : "Analyse · विश्लेषण करें"}
            </button>
          </div>

          {/* Error */}
          {error && <div className="error-box">⚠️ {error}</div>}

          {/* Live Monitoring Panel */}
          {(loading || logs.length > 0) && !document_ && (
            <div className="glass-card" style={{ padding: "1.25rem", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                <div style={{
                  width: "8px", height: "8px", borderRadius: "50%",
                  background: loading ? "#10B981" : "#A855F7",
                  boxShadow: loading ? "0 0 8px #10B981" : "none",
                  animation: loading ? "pulse 1s infinite" : "none"
                }} />
                <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                  {loading ? "Analysing... · विश्लेषण जारी है" : "Analysis Complete · विश्लेषण पूर्ण"}
                </span>
                {loading && (
                  <span style={{
                    marginLeft: "auto", color: G.purple,
                    fontSize: "0.85rem", fontWeight: 700
                  }}>
                    {progress}%
                  </span>
                )}
              </div>

              {/* Progress bar */}
              <div style={{
                height: "4px", background: "rgba(255,255,255,0.06)",
                borderRadius: "2px", marginBottom: "1rem", overflow: "hidden"
              }}>
                <div style={{
                  height: "100%", borderRadius: "2px",
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, #A855F7, #06B6D4)",
                  transition: "width 0.3s ease"
                }} />
              </div>

              {/* Log entries */}
              <div style={{
                maxHeight: "220px", overflowY: "auto",
                display: "flex", flexDirection: "column", gap: "0.4rem"
              }}>
                {logs.map((log, i) => (
                  <div key={i} style={{
                    display: "flex", gap: "0.75rem", alignItems: "flex-start",
                    padding: "0.4rem 0.6rem", borderRadius: "6px",
                    background: log.type === "found"
                      ? "rgba(168,85,247,0.08)"
                      : log.type === "done"
                      ? "rgba(16,185,129,0.08)"
                      : "rgba(255,255,255,0.02)",
                    borderLeft: `2px solid ${
                      log.type === "found" ? "#A855F7"
                      : log.type === "done" ? "#10B981"
                      : log.type === "info" ? "#06B6D4"
                      : "rgba(255,255,255,0.08)"
                    }`
                  }}>
                    <span style={{ color: G.dim, fontSize: "0.72rem", whiteSpace: "nowrap", marginTop: "1px" }}>
                      {log.time}
                    </span>
                    <span style={{
                      fontSize: "0.82rem",
                      color: log.type === "found" ? "#C084FC"
                        : log.type === "done" ? "#34D399"
                        : log.type === "info" ? "#22D3EE"
                        : G.muted
                    }}>
                      {log.type === "found" ? "🔗 " : log.type === "done" ? "✅ " : log.type === "info" ? "🚀 " : "⚙️ "}
                      {log.text}
                    </span>
                  </div>
                ))}
                <div ref={logsEndRef} />
              </div>
            </div>
          )}

          {/* Results */}
          {document_ && (
            <div>
              {/* Results header */}
              <div style={{
                display: "flex", alignItems: "center",
                gap: "0.75rem", marginBottom: "1.25rem", flexWrap: "wrap",
              }}>
                <h2 style={{ fontSize: "1.15rem", fontWeight: 700, margin: 0 }}>
                  Results · परिणाम
                </h2>
                <span style={{
                  background: "rgba(168,85,247,0.12)",
                  color: G.purple, borderRadius: "6px",
                  padding: "2px 10px", fontSize: "0.78rem", fontWeight: 600,
                }}>
                  {file?.name}
                </span>
                <div style={{ marginLeft: "auto", display: "flex", gap: "0.5rem" }}>
                  <button className="btn-export" onClick={handleExportTxt}>
                    ⬇ Report .TXT
                  </button>
                  <button className="btn-export" onClick={handleExport}>
                    ⬇ Export .XML
                  </button>
                </div>
              </div>

              <Stats doc={document_} />

              {/* Confidence Slider */}
              <div style={{
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${G.border}`,
                borderRadius: "10px",
                padding: "0.75rem 1.25rem",
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                flexWrap: "wrap",
              }}>
                <span style={{ color: G.muted, fontSize: "0.82rem", whiteSpace: "nowrap" }}>
                  Min Confidence · न्यूनतम विश्वास:
                </span>
                <input
                  type="range"
                  min="0"
                  max="0.9"
                  step="0.05"
                  value={minConf}
                  onChange={e => setMinConf(parseFloat(e.target.value))}
                  style={{
                    flex: 1,
                    accentColor: G.purple,
                    cursor: "pointer",
                    minWidth: "120px",
                  }}
                />
                <span style={{
                  color: G.purple,
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  minWidth: "40px",
                  textAlign: "right",
                }}>
                  {(minConf * 100).toFixed(0)}%
                </span>
                <span style={{ color: G.dim, fontSize: "0.78rem" }}>
                  {document_.reduce((acc, s) =>
                    acc + (s.anaphoras?.filter(a => a.confidence >= minConf).length || 0), 0
                  )} links shown
                </span>
              </div>

              {/* Legend */}
              <div className="legend-bar">
                <span>
                  <span className="tag" style={{ background: G.purple, color: "#fff", marginRight: "5px" }}>bold</span>
                  Anaphor · अनुसंदर्भ
                </span>
                <span>
                  <span className="tag" style={{
                    border: `2px dashed ${G.purple}`, color: G.purple,
                    background: "transparent", marginRight: "5px",
                  }}>dashed</span>
                  Antecedent · पूर्वसंदर्भ
                </span>
                <span>Same color = same coreference chain · एक रंग = एक श्रृंखला</span>
              </div>

              {/* Sentence cards */}
              {document_.map((sent, i) => (
                <div key={i} className={`sent-card${(sent.anaphoras?.filter(a => a.confidence >= minConf).length || 0) > 0 ? " has-links" : ""}`}>
                  <div style={{
                    display: "flex", alignItems: "center",
                    gap: "0.5rem", marginBottom: "0.75rem",
                  }}>
                    <span className="s-badge">S{sent.id}</span>
                    {(sent.anaphoras?.filter(a => a.confidence >= minConf).length || 0) > 0 && (
                      <span className="link-badge">
                        {sent.anaphoras.filter(a => a.confidence >= minConf).length} link{sent.anaphoras.filter(a => a.confidence >= minConf).length > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                  <SentenceView sentence={sent} minConf={minConf} />
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!document_ && !loading && !error && (
            <div style={{
              textAlign: "center", color: G.dim,
              padding: "3rem", fontSize: "0.92rem",
            }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🔍</div>
              Upload a Hindi .txt or .xml file to detect anaphoric relations
              <br />
              <span style={{ fontSize: "0.82rem", color: G.dim }}>
                हिंदी फ़ाइल अपलोड करें · अनुसंदर्भ संबंध देखें
              </span>
            </div>
          )}
        </main>
      </div>
    </>
  )
}
