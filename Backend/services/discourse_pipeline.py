import re
from services.muril_service import predict_pair
from services.mention_extractor import extract_mentions

_all_mentions              = []   # cached mentions across the whole document
_sentence_count            = 0    # tracks how many sentences have been processed
_last_boundary_mention_idx = 0    # mention index where the current "topic" started

# Matches lines like "चीन:", "कनाडा:", "जर्मनी:" — a short label followed by a colon,
# typically used to introduce a new topic/section in list-style documents
TOPIC_BOUNDARY_PATTERN = re.compile(r'^[^\s:]{2,20}\s*:')


def is_topic_boundary(sentence_text: str) -> bool:
    return bool(TOPIC_BOUNDARY_PATTERN.match(sentence_text.strip()))


def reset_document():
    global _all_mentions, _sentence_count, _last_boundary_mention_idx
    _all_mentions              = []
    _sentence_count            = 0
    _last_boundary_mention_idx = 0


def predict_sentence(sentence):
    global _all_mentions, _sentence_count, _last_boundary_mention_idx

    THRESHOLD = 0.30
    WINDOW    = 15

    sent_idx = _sentence_count
    _sentence_count += 1

    start_index_of_new = len(_all_mentions)

    # If this sentence starts a new topic/section, mark the boundary here —
    # future anaphors in this or later sentences won't be able to look back
    # past this point, preventing cross-block leakage.
    if is_topic_boundary(sentence):
        _last_boundary_mention_idx = start_index_of_new

    # Extract mentions for the NEW sentence only — cached, not recomputed
    new_mentions = extract_mentions(sentence, sent_idx)
    _all_mentions.extend(new_mentions)

    relations = []

    for i in range(start_index_of_new, len(_all_mentions)):
        ana = _all_mentions[i]
        if not ana["is_pronoun"]:
            continue

        best_score = 0.0
        best_ant   = None

        # Lookback is clipped to WINDOW size AND cannot cross a topic boundary
        start = max(0, i - WINDOW, _last_boundary_mention_idx)

        for j in range(start, i):
            ant = _all_mentions[j]
            if ant["is_pronoun"] or ant["is_stopword"]:
                continue

            sent_dist   = abs(ana["sent_idx"] - ant["sent_idx"])
            result      = predict_pair(ant["text"], ana["text"], sent_dist)
            coref_score = result["coref_score"]

            if coref_score > best_score:
                best_score = coref_score
                best_ant   = ant

        if best_ant and best_score >= THRESHOLD:
            relations.append({
                "anaphor":    ana["text"],
                "antecedent": best_ant["text"],
                "confidence": best_score,
                "sent_dist":  abs(ana["sent_idx"] - best_ant["sent_idx"]),
            })

    return {
        "tokens":    sentence.split(),
        "anaphoras": relations
    }