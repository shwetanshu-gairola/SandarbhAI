import torch
import torch.nn as nn
from transformers import AutoTokenizer, AutoModel
from config import MURIL_MODEL_PATH, MODEL_NAME

torch.backends.cudnn.deterministic = True
torch.backends.cudnn.benchmark = False

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

HINDI_PRONOUNS = {
    'वह', 'वे', 'यह', 'ये',
    'उसने', 'उसको', 'उसे', 'उसका', 'उसकी', 'उसके', 'उसमें', 'उससे',
    'इसने', 'इसको', 'इसे', 'इसका', 'इसकी', 'इसके', 'इसमें', 'इससे',
    'उन्होंने', 'उनको', 'उन्हें', 'उनका', 'उनकी', 'उनके', 'उनमें', 'उनसे',
    'इन्होंने', 'इनको', 'इन्हें', 'इनका', 'इनकी', 'इनके', 'इनमें', 'इनसे',
    'जो', 'जिसने', 'जिसको', 'जिसे', 'जिसका', 'जिसकी', 'जिसके', 'जिससे', 'जिसमें',
    'जिन्होंने', 'जिन्हें', 'जिनका', 'जिनकी', 'जिनके',
    'इस', 'उस', 'इसी', 'उसी', 'इन', 'उन',
    'वहाँ', 'यहाँ', 'वहां', 'यहां',
    'जिससे', 'जिसमें', 'जिसकी', 'जिसको',
}


class MuRILCorefClassifier(nn.Module):

    def __init__(self, model_name=MODEL_NAME, dropout=0.1):
        super().__init__()
        self.encoder = AutoModel.from_pretrained(model_name)
        h = self.encoder.config.hidden_size

        self.classifier = nn.Sequential(
            nn.Dropout(dropout),
            nn.Linear(h + 1, 2)
        )

    def forward(self, input_ids, attention_mask, token_type_ids, sent_dist):
        out = self.encoder(
            input_ids=input_ids,
            attention_mask=attention_mask,
            token_type_ids=token_type_ids
        )
        cls = out.last_hidden_state[:, 0, :]
        x   = torch.cat([cls, sent_dist], dim=1)
        return self.classifier(x)


print("Loading MuRIL model...")

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)

muril_model = MuRILCorefClassifier().to(device)
muril_model.load_state_dict(
    torch.load(MURIL_MODEL_PATH, map_location=device)
)
muril_model.eval()

print("MuRIL model loaded!")


def predict_pair(antecedent: str, anaphor: str, sent_dist: int = 0):
    encoding = tokenizer(
        antecedent,
        anaphor,
        max_length=128,
        padding="max_length",
        truncation=True,
        return_tensors="pt"
    )

    input_ids      = encoding["input_ids"].to(device)
    attention_mask = encoding["attention_mask"].to(device)
    token_type_ids = encoding["token_type_ids"].to(device)
    dist_tensor    = torch.tensor([[sent_dist]], dtype=torch.float).to(device)

    with torch.no_grad():
        logits      = muril_model(input_ids, attention_mask, token_type_ids, dist_tensor)
        probs       = torch.softmax(logits, dim=1)
        pred        = torch.argmax(probs, dim=1).item()
        conf        = probs[0][pred].item()
        coref_score = probs[0][1].item()  # raw class-1 probability

    return {
        "coreferent":  bool(pred == 1),
        "confidence":  round(conf, 4),
        "coref_score": round(coref_score, 4)
    }