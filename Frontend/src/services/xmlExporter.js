function escapeXml(value = "") {

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

}

function relinkMarkables(
  markables = []
) {

  const connectives =
    markables.filter(
      (m) =>
        m.type === "CONN" ||
        m.type === "CONNECTIVE"
    );

  return markables.map(
    (m) => {

      if (
        m.type === "ARG1" ||
        m.type === "ARG2"
      ) {

        const nearestConn =
          connectives.find(
            (c) =>
              c.start >= m.start
          );

        return {

          ...m,

          src:
            nearestConn
              ? nearestConn.id
              : ""

        };

      }

      return m;

    }
  );

}


export function exportToXML(
  annotationDocument
) {

 
let markableCounter = 1;
  let xml =
`<?xml version="1.0" encoding="UTF-8"?>
<DOCUMENT>
`;

  annotationDocument.forEach(
    (sentence) => {

      if (
        !sentence.markables
      ) {
        return;
      }

      const markables =
  relinkMarkables(
    [...sentence.markables]
      .sort(
        (a, b) =>
          a.start - b.start
      )
  );

      xml += `
<P>
`;
if (
  markables.length === 0
) {

  sentence.tokens.forEach(
    (token) => {

      xml += `
<W>${escapeXml(token)}</W>
`;

    }
  );

  xml += `
</P>
`;

  return;

}

      markables.forEach((m) => {

  xml += `
<MARKABLE
  COMMENT="${escapeXml(m.type)}"
  ID="${markableCounter++}"
>
`;

  xml += `
<${m.type}
  CERTAIN="${escapeXml(m.certain || "TRUE")}"
  COMMENT="${escapeXml(m.rel_comment || "")}"
  ID="${escapeXml(m.id)}"
  SRC="${escapeXml(m.src || "")}"
  TYPE_ARG="${escapeXml(m.type_arg || m.type)}"
  TYPE_REF="${escapeXml(m.type_ref || m.type)}"
/>
`;

  sentence.tokens
    .slice(
      m.start,
      m.end + 1
    )
    .forEach((token) => {

      xml += `
<W>${escapeXml(token)}</W>
`;

    });

  xml += `
</MARKABLE>
`;

});

    xml += `
</P>
`;

    }
  );

  xml += `
</DOCUMENT>
`;

  const blob =
    new Blob(
      [xml],
      {
        type:
          "application/xml"
      }
    );

  const url =
    window.URL.createObjectURL(
      blob
    );

  const link =
    window.document.createElement(
      "a"
    );

  link.href = url;

  link.download =
    "annotations.xml";

  window.document.body.appendChild(
    link
  );

  link.click();

  window.document.body.removeChild(
    link
  );

  window.URL.revokeObjectURL(
    url
  );

}