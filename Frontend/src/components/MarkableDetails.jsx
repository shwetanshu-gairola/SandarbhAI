import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Divider
} from "@mui/material";

import {
  useState,
  useEffect
} from "react";

export default function MarkableDetails({
  markable,
  onSave,
  onDelete
}) {

  const [form, setForm] =
    useState({});

  useEffect(() => {

    if (!markable) return;

    setForm(markable);

  }, [markable]);

  if (!markable) {

    return (
      <Typography>
        No Markable Selected
      </Typography>
    );

  }

  const updateField = (
    key,
    value
  ) => {

    setForm({
      ...form,
      [key]: value
    });

  };

  const handleSave = () => {

    onSave(form);

  };

  return (

    <Box>

      <Typography
        variant="h5"
        sx={{
          mb: 2,
          fontWeight: 700
        }}
      >
        Details
      </Typography>

      <Divider
        sx={{ mb: 3 }}
      />

      {/* KIND */}

      <TextField
        label="KIND"
        fullWidth
        value={
          form.kind || ""
        }
        margin="dense"
        onChange={(e) =>
          updateField(
            "kind",
            e.target.value
          )
        }
      />

      {/* COMMENT */}

      <TextField
        label="COMMENT"
        fullWidth
        value={
          form.comment || ""
        }
        margin="dense"
        onChange={(e) =>
          updateField(
            "comment",
            e.target.value
          )
        }
      />

      {/* ID */}

      <TextField
        label="ID"
        fullWidth
        value={
          form.id || ""
        }
        margin="dense"
        slotProps={{
  input:{
    readOnly:true
  }
}}
      />

      {/* CERTAIN */}

      <TextField
        select
        label="CERTAIN"
        fullWidth
        value={
          form.certain ||
          "TRUE"
        }
        margin="dense"
        onChange={(e) =>
          updateField(
            "certain",
            e.target.value
          )
        }
      >

        <MenuItem value="TRUE">
          TRUE
        </MenuItem>

        <MenuItem value="FALSE">
          FALSE
        </MenuItem>

      </TextField>

      {/* REL COMMENT */}

      <TextField
        label="REL_COMMENT"
        fullWidth
        value={
          form.rel_comment ||
          ""
        }
        margin="dense"
        onChange={(e) =>
          updateField(
            "rel_comment",
            e.target.value
          )
        }
      />

      {/* SRC */}

      <TextField
        label="SRC"
        fullWidth
        value={
          form.src || ""
        }
        margin="dense"
        slotProps={{
  input:{
    readOnly:true
  }
}}
      />

      {/* TYPE ARG */}

      <TextField
        select
        label="TYPE_ARG"
        fullWidth
        value={
          form.type_arg ||
          ""
        }
        margin="dense"
        onChange={(e) =>
          updateField(
            "type_arg",
            e.target.value
          )
        }
      >

        <MenuItem value="ARG1">
          ARG1
        </MenuItem>

        <MenuItem value="ARG2">
          ARG2
        </MenuItem>

        <MenuItem value="CONN">
          CONNECTIVE
        </MenuItem>

      </TextField>

      {/* TYPE REF */}

      <TextField
        select
        label="TYPE_REF"
        fullWidth
        value={
          form.type_ref ||
          ""
        }
        margin="dense"
        onChange={(e) =>
          updateField(
            "type_ref",
            e.target.value
          )
        }
      >

        <MenuItem value="ARG1">
          ARG1
        </MenuItem>

        <MenuItem value="ARG2">
          ARG2
        </MenuItem>

        <MenuItem value="CONN">
          CONNECTIVE
        </MenuItem>

      </TextField>

      {/* START */}

      <Box sx={{ mt: 2 }}>

  <Typography
    sx={{
      mb: 1,
      fontWeight: 600
    }}
  >
    START TOKEN
  </Typography>

  <Box
    sx={{
      display: "flex",
      gap: 1
    }}
  >

    <Button
      variant="outlined"
      onClick={() => {

        if (
          form.start > 0
        ) {

          updateField(
            "start",
            form.start - 1
          );

        }

      }}
    >
      -
    </Button>

    <TextField
      fullWidth
      value={
        form.start ?? 0
      }
      slotProps={{
        input:{
          readOnly:true
        }
      }}
    />

    <Button
      variant="outlined"
      onClick={() => {

        if (
          form.start <
          form.end
        ) {

          updateField(
            "start",
            form.start + 1
          );

        }

      }}
    >
      +
    </Button>

  </Box>

</Box>

      {/* END */}

      <Box sx={{ mt: 2 }}>

  <Typography
    sx={{
      mb: 1,
      fontWeight: 600
    }}
  >
    END TOKEN
  </Typography>

  <Box
    sx={{
      display: "flex",
      gap: 1
    }}
  >

    <Button
      variant="outlined"
      onClick={() => {

        if (
          form.end >
          form.start
        ) {

          updateField(
            "end",
            form.end - 1
          );

        }

      }}
    >
      -
    </Button>

    <TextField
      fullWidth
      value={
        form.end ?? 0
      }
      slotProps={{
        input:{
          readOnly:true
        }
      }}
    />

    <Button
      variant="outlined"
      onClick={() => {

        updateField(
          "end",
          form.end + 1
        );

      }}
    >
      +
    </Button>

  </Box>

</Box>

      {/* TEXT */}

      <Typography
  sx={{
    mt: 2,
    mb: 1,
    fontWeight: 600
  }}
>
  Span Length:
  {" "}
  {(
    (form.end ?? 0)
    -
    (form.start ?? 0)
  ) + 1}
  {" "}
  tokens
</Typography>
      <TextField
        label="TEXT"
        fullWidth
        multiline
        rows={4}
        value={
          form.text || ""
        }
        margin="dense"
        slotProps={{
  input:{
    readOnly:true
  }
}}
      />

      <Box
        sx={{
          display: "flex",
          gap: 2,
          mt: 3
        }}
      >

        <Button
          variant="contained"
          fullWidth
          onClick={
            handleSave
          }
        >
          Save Details
        </Button>

        <Button
          variant="outlined"
          color="error"
          fullWidth
          onClick={() =>
            onDelete?.(
              form.id
            )
          }
        >
          Delete Markable
        </Button>

      </Box>

    </Box>

  );

}