export function importXML(
  xmlText
) {

  const parser =
    new DOMParser();

  const xmlDoc =
    parser.parseFromString(
      xmlText,
      "application/xml"
    );

  const document = [];

  const paragraphs =
    xmlDoc.getElementsByTagName(
      "P"
    );

  for (
    let p = 0;
    p < paragraphs.length;
    p++
  ) {

    const paragraph =
      paragraphs[p];

    const markableNodes =
  paragraph.getElementsByTagName(
    "MARKABLE"
  );

const tokens = [];

const markables = [];

let tokenIndex = 0;

// No markables present
if (
  markableNodes.length === 0
) {

  const wordNodes =
    paragraph.getElementsByTagName(
      "W"
    );

  for (
    let j = 0;
    j < wordNodes.length;
    j++
  ) {

    tokens.push(
      wordNodes[j]
        .textContent
        .trim()
    );

  }

  document.push({

    id: p + 1,

    relation: "",

    confidence: 1,

    tokens,

    markables: [],

    bio_tags:
      Array(tokens.length)
        .fill("O")

  });

  continue;

}

    for (
      let i = 0;
      i < markableNodes.length;
      i++
    ) {

      const markableNode =
        markableNodes[i];

      const argNode =
        markableNode.children[0];

      const wordNodes =
        markableNode.getElementsByTagName(
          "W"
        );

      const start =
        tokenIndex;

      const words = [];

      for (
        let j = 0;
        j < wordNodes.length;
        j++
      ) {

        const word =
          wordNodes[j]
            .textContent
            .trim();

        words.push(word);

        tokens.push(word);

        tokenIndex++;

      }

      const end =
        tokenIndex - 1;

      markables.push({

        id: Number(
          argNode.getAttribute(
            "ID"
          )
        ),

        kind:
          argNode.tagName,

        type:
          argNode.tagName,

        comment:
          markableNode.getAttribute(
            "COMMENT"
          ),

        certain:
          argNode.getAttribute(
            "CERTAIN"
          ),

        rel_comment:
          argNode.getAttribute(
            "COMMENT"
          ),

        src:
          argNode.getAttribute(
            "SRC"
          ),

        type_arg:
          argNode.getAttribute(
            "TYPE_ARG"
          ),

        type_ref:
          argNode.getAttribute(
            "TYPE_REF"
          ),

        start,

        end,

        text:
          words.join(" ")

      });

    }

    document.push({

      id: p + 1,

      relation:
        markables.find(
          (m) =>
            m.rel_comment
        )?.rel_comment || "",

      confidence: 1,

      tokens,

      markables,

      bio_tags: []

    });

  }

  return document;

}