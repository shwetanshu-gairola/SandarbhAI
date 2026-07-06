// =====================================
// PALINKA STYLE MARKABLE UTILITIES
// =====================================

export function generateMarkableId(markables) {

  if (!markables || markables.length === 0) {
    return 1;
  }

  return (
    Math.max(
      ...markables.map((m) => m.id || 0)
    ) + 1
  );

}

// =====================================
// CREATE PALINKA MARKABLE
// =====================================

export function createPalinkaMarkable({
  type,
  start,
  end,
  tokens,
  relation = ""
}) {

  return {

    id: Date.now(),

    kind: type,

    comment: type,

    certain: "TRUE",

    rel_comment:
      relation || "",

    src: "",

    type_arg: type,

    type_ref: type,

    start,

    end,

    type,

    text:
      tokens
        .slice(start, end + 1)
        .join(" ")

  };

}

// =====================================
// BUILD FROM BIO TAGS
// =====================================

export function bioTagsToMarkables(
  tokens,
  bioTags,
  relation = "",
  startingId = 1
) {

  const markables = [];

  let current = null;

  let currentId = startingId;

  for (
    let i = 0;
    i < bioTags.length;
    i++
  ) {

    const tag =
      bioTags[i] || "O";

    // START

    if (
      tag.startsWith("B-")
    ) {

      if (current) {

        markables.push(
          current
        );

      }

      const type =
        tag.replace(
          "B-",
          ""
        );

      current = {

        id: currentId++,

  kind: type,

  comment: type,

  certain: "TRUE",

  rel_comment: relation || "",

        src: "",

        type_arg:
          type,

        type_ref:
          type,

        start: i,

        end: i,

        type

      };

    }

    // CONTINUE

    else if (
      tag.startsWith("I-") &&
      current
    ) {

      current.end = i;

    }

    // OUTSIDE

    else {

      if (current) {

        markables.push(
          current
        );

        current = null;

      }

    }

  }

  if (current) {

    markables.push(
      current
    );

  }

  // ADD TEXT

  const enriched =
    markables.map(
      (m) => ({

        ...m,

        text:
          tokens
            .slice(
              m.start,
              m.end + 1
            )
            .join(" ")

      })
    );

  // =====================================
  // PALINKA SRC LOGIC
  // ARG1 ---> CONN
  // ARG2 ---> CONN
  // =====================================

  const connective =
    enriched.find(
      (m) =>
        m.type ===
          "CONN" ||
        m.type ===
          "CONNECTIVE"
    );

  if (connective) {

    enriched.forEach(
      (m) => {

        if (
          m.type ===
            "ARG1" ||
          m.type ===
            "ARG2"
        ) {

          m.src =
            connective.id;

        }

      }
    );

  }

  return enriched;

}

// =====================================
// CHECK OVERLAP
// =====================================

export function hasOverlap(
  start,
  end,
  markables,
  ignoreId = null
) {

  return markables.some(
    (m) => {

      if (
        ignoreId &&
        m.id === ignoreId
      ) {
        return false;
      }

      return !(
        end < m.start ||
        start > m.end
      );

    }
  );

}

// =====================================
// UPDATE MARKABLE
// =====================================

export function updateMarkableSpan(
  markable,
  start,
  end,
  tokens
) {

  return {

    ...markable,

    start,

    end,

    text:
      tokens
        .slice(
          start,
          end + 1
        )
        .join(" ")

  };

}

// =====================================
// RECALCULATE SRC LINKS
// =====================================

export function relinkMarkables(
  markables
) {

  const connective =
    markables.find(
      (m) =>
        m.type ===
          "CONN" ||
        m.type ===
          "CONNECTIVE"
    );

  return markables.map(
    (m) => {

      if (
        m.type ===
          "ARG1" ||
        m.type ===
          "ARG2"
      ) {

        return {

          ...m,

          src:
            connective
              ? connective.id
              : ""

        };

      }

      return m;

    }
  );

}

// =====================================
// MARKABLES -> BIO TAGS
// =====================================

export function markablesToBioTags(
  tokenCount,
  markables
) {

  const bioTags =
    Array(tokenCount).fill("O");

  markables.forEach(
    (markable) => {

      const type =
        markable.type;

      bioTags[
        markable.start
      ] = `B-${type}`;

      for (
        let i =
          markable.start + 1;
        i <= markable.end;
        i++
      ) {

        bioTags[i] =
          `I-${type}`;

      }

    }
  );

  return bioTags;

}