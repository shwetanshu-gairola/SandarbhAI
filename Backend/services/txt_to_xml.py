import re


def split_sentences(text: str):

    sentences = re.split(r"[।!?]+", text)

    sentences = [
        s.strip()
        for s in sentences
        if s.strip()
    ]

    return sentences


def txt_to_document(text: str):

    sentences = split_sentences(text)

    document = []

    for idx, sentence in enumerate(sentences):

        document.append(
            {
                "id": idx + 1,
                "text": sentence
            }
        )

    return document