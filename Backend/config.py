from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

UPLOAD_FOLDER = BASE_DIR / "uploads"

MURIL_MODEL_PATH = BASE_DIR / "models" / "muril_best.pt"

MODEL_NAME = "google/muril-base-cased"