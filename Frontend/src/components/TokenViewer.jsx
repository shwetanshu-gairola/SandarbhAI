import {
  Box,
  Chip
} from "@mui/material";

export default function TokenViewer({
  sentence
}) {

  if (!sentence) return null;

  const getColor = (tag) => {

    if (tag.includes("ARG1"))
      return "#DFF7DF";

    if (tag.includes("CONN"))
      return "#FFE8CC";

    if (tag.includes("ARG2"))
      return "#DDEBFF";

    return "#f5f5f5";
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 1
      }}
    >
      {sentence.tokens.map(
        (token, index) => (

          <Chip
            key={index}
            label={token}
            sx={{
              bgcolor: getColor(
                sentence.bio_tags[index]
              )
            }}
          />

        )
      )}
    </Box>
  );
}