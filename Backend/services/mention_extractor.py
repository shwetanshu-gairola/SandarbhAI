import stanza

print("Loading Stanza Hindi pipeline...")

nlp = stanza.Pipeline(
    lang='hi',
    processors='tokenize,pos',
    use_gpu=False,
    download_method=None
)

print("Stanza loaded!")

ANTECEDENT_POS = {'NOUN', 'PROPN'}
ANAPHOR_POS    = {'PRON', 'DET'}

# ONE unified list — function words that can NEVER be a mention,
# whether Stanza tags them as NOUN/PROPN or PRON/DET
NEVER_A_MENTION = {
    # Time/temporal adverbs
    'आज', 'कल', 'परसों', 'अभी', 'तब', 'जब', 'अब', 'फिर',
    'पहले', 'बाद', 'तुरंत', 'धीरे', 'जल्दी', 'अचानक', 'थोड़ी',
    'यहाँ', 'वहाँ', 'यहां', 'वहां', 'कहाँ', 'कहां', 'जहां', 'जहाँ', 'जिधर',

    # Conjunctions / particles / connectors
    'और', 'भी', 'तो', 'ही', 'या', 'बल्कि', 'लेकिन', 'परंतु',
    'क्योंकि', 'इसलिए', 'इसीलिए', 'इसीसे', 'यानी', 'यदि', 'अगर',
    'जैसे', 'जैसा', 'जैसी', 'वैसे', 'ऐसा', 'ऐसी', 'ऐसे',

    # Quantifiers / comparatives
    'एक', 'कई', 'सभी', 'हर', 'कुछ', 'कोई', 'सब', 'बहुत',
    'थोड़ा', 'थोड़ी', 'ज्यादा', 'अधिक', 'कम', 'पूरे', 'पूरा', 'पूरी',
    'जितना', 'जितनी', 'जितने',

    # Question words
    'कैसे', 'कैसा', 'कितना', 'कितनी', 'कितने',
    'क्या', 'क्यों', 'कब', 'कौन', 'कहीं',

    # Postpositions
    'पर', 'से', 'में', 'को', 'का', 'की', 'के', 'ने', 'तक',
    'साथ', 'बिना', 'लिए', 'द्वारा', 'बारे', 'ऊपर', 'नीचे',

    # Personal pronouns (handled separately, never mentions themselves)
    'हम', 'आप', 'मैं', 'तुम', 'वो', 'ये', 'हमें', 'आपको',
    'उन्हें', 'उन्होंने', 'हमारा', 'हमारी', 'हमारे',

    # Verb forms slipping through as NOUN/PROPN sometimes
    'था', 'थी', 'थे', 'है', 'हैं', 'हो', 'गया', 'गई', 'गए',
    'दिया', 'किया', 'लगा', 'लगी', 'आया', 'आई', 'देखा',

    # Misc noise words seen so far
    'विरोध', 'कभी', 'वाला', 'वाली', 'साल', 'वर्ष', 'समय', 'बार',
    'तरह', 'तरफ', 'ओर', 'नया', 'नई', 'तीन', 'चार', 'पांच',
    'अगला', 'अगले', 'पिछला', 'पिछले', 'काम', 'पता', 'SIR',
    'शुरू', 'प्रत्येक', 'कुल',
}

def extract_mentions(sentence_text, sent_idx):
    doc      = nlp(sentence_text)
    mentions = []

    for sent in doc.sentences:
        i     = 0
        words = sent.words

        while i < len(words):
            word = words[i]

            if word.upos in ANTECEDENT_POS:
                span = [word.text]
                j    = i + 1

                while j < len(words) and words[j].upos in ANTECEDENT_POS:
                    span.append(words[j].text)
                    j += 1

                for w in span:
                    if w not in NEVER_A_MENTION and len(w) > 2:
                        mentions.append({
                            "text":        w,
                            "sent_idx":    sent_idx,
                            "is_pronoun":  False,
                            "is_stopword": False,
                        })

                filtered_span = [w for w in span if w not in NEVER_A_MENTION and len(w) > 2]
                if len(filtered_span) > 1:
                    mentions.append({
                        "text":        " ".join(filtered_span),
                        "sent_idx":    sent_idx,
                        "is_pronoun":  False,
                        "is_stopword": False,
                    })

                i = j

            elif word.upos in ANAPHOR_POS:
                if word.text not in NEVER_A_MENTION:
                    mentions.append({
                        "text":        word.text,
                        "sent_idx":    sent_idx,
                        "is_pronoun":  True,
                        "is_stopword": False,
                    })
                i += 1

            else:
                i += 1

    return mentions