import {
  Box,
  Button,
  Typography
} from "@mui/material";

export default function TopToolbar({
  onExportXML
}) {

  return (

    <Box
      sx={{
        height: 70,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 3,
        bgcolor: "white",
        borderBottom:
          "1px solid #ddd",
        position: "sticky",
        top: 0,
        zIndex: 1000
      }}
    >

      <Typography
        variant="h5"
        fontWeight="bold"
      >
        Hindi Discourse Annotation Workbench
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 2
        }}
      >

        <Button
          variant="contained"
        >
          Save
        </Button>

        <Button
          variant="outlined"
          onClick={
            onExportXML
          }
        >
          Export XML
        </Button>

      </Box>

    </Box>

  );

}