# SandarbhAI — Hindi Anaphora Detection

An end-to-end Hindi anaphora resolution tool built with MuRIL, FastAPI and React.

## 🧠 Model
- **MuRIL** (Google's Multilingual Representations for Indian Languages)
- Trained on 1114 CDAC Hindi XML files
- Best F1 Score: **0.9296** (Epoch 5)

## 🏗️ Architecture
- **Backend**: FastAPI + MuRIL + Stanza (Hindi POS)
- **Frontend**: React + Vite (Glassmorphism dark theme)
- **Export**: CDAC-compatible XML + TXT report

## 🚀 Setup

### Backend
```bash
cd Backend
pip install fastapi uvicorn transformers torch stanza python-multipart
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend
```bash
cd Frontend
npm install
npm run dev
```

> **Note**: Place `muril_best.pt` in `Backend/models/` before running.  
> Download from: [Google Drive link]

## ✨ Features
- Upload Hindi `.txt` or `.xml` files
- Real-time live monitoring during analysis
- Color-coded anaphora visualization
- Confidence threshold slider
- Export results as CDAC XML or TXT report
- Local network deployment

## 📊 Results
| Model | F1 Score |
|-------|----------|
| mBERT (5 files) | 0.76 |
| MuRIL (5 files) | 0.74 |
| **MuRIL (1114 files)** | **0.9296** |

## 🏫 Developed at
CDAC Noida — Hindi NLP Internship