import {
  Card,
  CardContent,
  Typography
} from "@mui/material";

export default function DocumentStats({
  document
}) {

  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: 3
      }}
    >
      <CardContent>

        <Typography
          variant="h6"
        >
          Statistics
        </Typography>

        <Typography>
          Sentences: {document.length}
        </Typography>

      </CardContent>
    </Card>
  );
}