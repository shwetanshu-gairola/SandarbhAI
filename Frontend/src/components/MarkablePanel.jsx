import {
  Box,
  Typography,
  List,
  ListItemButton
} from "@mui/material";

export default function MarkablePanel({
  markables,
  onSelect
}) {

  return (

    <Box>

      <Typography
  variant="subtitle1"
  sx={{
    mb: 1,
    fontWeight: 700
  }}
>
        Markables
      </Typography>

      <List>

        {markables.map(
          (markable) => (

            <ListItemButton
              key={markable.id}
              onClick={() =>
                onSelect(markable)
              }
            >
              {markable.kind}
              {" "}
              (
              {markable.start}
              -
              {markable.end}
              )
            </ListItemButton>

          )
        )}

      </List>

    </Box>

  );

}