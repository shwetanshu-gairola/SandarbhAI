import {
  Paper,
  Box,
  Chip,
  Stack,
  Menu,
  MenuItem
} from "@mui/material";

import {
  useState
} from "react";

const COLORS = {
  ARG1: "#DFF7DF",
  CONN: "#FFE8CC",
  CONNECTIVE: "#FFE8CC",
  ARG2: "#DDEBFF"
};

export default function SentenceCanvas({
  sentence,
  selected,
  selectedMarkable,
  onClick,
  onMarkableClick,
  onCreateMarkable,
  onResizeMarkable
}) {

  const [selectedTokens, setSelectedTokens] =
    useState([]);

  const [menuAnchor, setMenuAnchor] =
    useState(null);

  const [hoveredHandle, setHoveredHandle] =
   useState(null);

  const getTokenStyle = (index) => {

  if (!sentence.markables)
    return {};

  const markable =
    sentence.markables.find(
      (m) =>
        index >= m.start &&
        index <= m.end
    );

  if (!markable)
    return {};

  const isStart =
    index === markable.start;

  const isEnd =
    index === markable.end;

  const isSelected =
    selectedMarkable?.id ===
    markable.id;
  
 

  return {

    background:
      COLORS[
        markable.type
      ] || "#eee",

    padding:
      "2px 0",

    margin: 0,

    borderRadius: 0,

    borderTop:
  isSelected
    ? "3px solid #1976d2"
    : "2px solid rgba(0,0,0,0.15)",

borderBottom:
  isSelected
    ? "3px solid #1976d2"
    : "2px solid rgba(0,0,0,0.15)",

    borderLeft:
      isStart
        ? "2px solid rgba(0,0,0,0.15)"
        : "none",

    borderRight:
      isEnd
        ? "2px solid rgba(0,0,0,0.15)"
        : "none",

    borderTopLeftRadius:
      isStart
        ? "8px"
        : 0,

    borderBottomLeftRadius:
      isStart
        ? "8px"
        : 0,

    borderTopRightRadius:
      isEnd
        ? "8px"
        : 0,

    borderBottomRightRadius:
      isEnd
        ? "8px"
        : 0

  };

};

  const toggleToken = (index) => {

    setSelectedTokens((prev) => {

      if (
        prev.includes(index)
      ) {

        return prev.filter(
          (i) => i !== index
        );

      }

      return [
        ...prev,
        index
      ];

    });

  };

  const openMenu = (
    event
  ) => {

    event.preventDefault();

    if (
      selectedTokens.length === 0
    ) {
      return;
    }

    setMenuAnchor(
      event.currentTarget
    );

  };

  const createMarkable = (
    type
  ) => {

    const start =
      Math.min(
        ...selectedTokens
      );

    const end =
      Math.max(
        ...selectedTokens
      );

  const newMarkable = {

  kind: type,

  type: type,

  comment: type,

  certain: "TRUE",

  rel_comment:
    sentence.relation || "",

  src: "",

  type_arg: type,

  type_ref: type,

  start,

  end,

  text:
    sentence.tokens
      .slice(
        start,
        end + 1
      )
      .join(" ")

};

    onCreateMarkable(
      newMarkable
    );

    setSelectedTokens([]);

    setMenuAnchor(null);

  };

  return (

    <Paper
      elevation={
        selected ? 6 : 2
      }
      onClick={onClick}
      sx={{
        p: 2,
        mb: 2,
        border: selected
          ? "2px solid #1976d2"
          : "2px solid transparent",
        borderRadius: "14px",
        cursor: "pointer"
      }}
    >

      <Box
  sx={{
    lineHeight: 2,
    fontSize: "16px",
    userSelect: "none"
  }}
>

        {sentence.tokens.map(
          (
            token,
            index
          ) => {

            const markable =
              sentence.markables?.find(
                (m) =>
                  index >= m.start &&
                  index <= m.end
              );
              const isSelected =
  selectedMarkable?.id ===
  markable?.id;

const showLeftHandle =
  markable &&
  isSelected &&
  index === markable.start;

const showRightHandle =
  markable &&
  isSelected &&
  index === markable.end;
            return (

              <span
                key={index}

                onClick={(e) => {

                  e.stopPropagation();

                  if (
                    markable
                  ) {

                    onMarkableClick(
                      markable
                    );

                  }

                  else {

                    toggleToken(
                      index
                    );

                  }

                }}

                onContextMenu={
                  openMenu
                }

               style={{
  ...getTokenStyle(index),

  background:
    selectedTokens.includes(index)
      ? "#fff3bf"
      : getTokenStyle(index).background,

  display: "inline",

  cursor: "pointer"
}}
              >
               <>

  {showLeftHandle && (

  <>
   <span
  onClick={(e) => {

    e.stopPropagation();

    onResizeMarkable?.(
      markable,
      "left-expand"
    );

  }}

  onMouseEnter={() =>
    setHoveredHandle(
      `${markable.id}-left-expand`
    )
  }

  onMouseLeave={() =>
    setHoveredHandle(null)
  }

  style={{
    color:
      hoveredHandle ===
      `${markable.id}-left-expand`
        ? "#0d47a1"
        : "#1976d2",

    fontWeight: "bold",

    marginRight: "2px",

    cursor: "pointer"
  }}
>
  ◁
</span>

    <span
      onClick={(e) => {

        e.stopPropagation();

        onResizeMarkable?.(
          markable,
          "left-shrink"
        );

      }}
      onMouseEnter={() =>
  setHoveredHandle(
    `${markable.id}-left-shrink`
  )
}

onMouseLeave={() =>
  setHoveredHandle(null)
}

style={{
  color:
    hoveredHandle ===
    `${markable.id}-left-shrink`
      ? "#0d47a1"
      : "#1976d2",

  fontWeight: "bold",

  marginRight: "4px",

  cursor: "pointer"
}}
    >
      ▷
    </span>
  </>

)}

{token}
{" "}

{showRightHandle && (

  <>
    <span
      onClick={(e) => {

        e.stopPropagation();

        onResizeMarkable?.(
          markable,
          "right-shrink"
        );

      }}
     onMouseEnter={() =>
  setHoveredHandle(
    `${markable.id}-right-shrink`
  )
}

onMouseLeave={() =>
  setHoveredHandle(null)
}

style={{
  color:
    hoveredHandle ===
    `${markable.id}-right-shrink`
      ? "#0d47a1"
      : "#1976d2",
  fontWeight: "bold",

  marginRight: "4px",

  cursor: "pointer"
}}
    >
      ◁
    </span>

    <span
      onClick={(e) => {

        e.stopPropagation();

        onResizeMarkable?.(
          markable,
          "right-expand"
        );

      }}
      onMouseEnter={() =>
  setHoveredHandle(
    `${markable.id}-right-expand`
  )
}

onMouseLeave={() =>
  setHoveredHandle(null)
}

style={{
  color:
    hoveredHandle ===
    `${markable.id}-right-expand`
      ? "#0d47a1"
      : "#1976d2",
      fontWeight: "bold",

  marginRight: "4px",

  cursor: "pointer"
}}
    >
      ▷
    </span>
  </>

)}

</>
              </span>

            );

          }
        )}

      </Box>

      <Stack
        direction="row"
        spacing={1}
        sx={{
          mt: 2
        }}
      >

        <Chip
          label={
            sentence.relation
          }
          size="small"
          color="primary"
        />

        <Chip
          label={`${(
            sentence.confidence *
            100
          ).toFixed(1)}%`}
          size="small"
        />

      </Stack>

      <Menu
        anchorEl={menuAnchor}
        open={
          Boolean(
            menuAnchor
          )
        }
        onClose={() =>
          setMenuAnchor(
            null
          )
        }
      >

        <MenuItem
          onClick={() =>
            createMarkable(
              "ARG1"
            )
          }
        >
          Create ARG1
        </MenuItem>

        <MenuItem
          onClick={() =>
            createMarkable(
              "ARG2"
            )
          }
        >
          Create ARG2
        </MenuItem>

        <MenuItem
          onClick={() =>
            createMarkable(
              "CONN"
            )
          }
        >
          Create CONNECTIVE
        </MenuItem>

      </Menu>

    </Paper>

  );

}