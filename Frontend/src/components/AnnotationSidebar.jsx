import {
  Box,
  Typography,
  Divider,
  TextField,
  Button,
  MenuItem
} from "@mui/material";
import MarkablePanel
from "./MarkablePanel";

import MarkableDetails
from "./MarkableDetails";
import TokenViewer from "./TokenViewer";
import { useState, useEffect } from "react";

export default function AnnotationSidebar({
  sentence,
  selectedMarkable,
  panelMode,
  onSave,
  onMarkableUpdate,
  onMarkableDelete,
  onMarkableSelect
}){
  const [arg1, setArg1] = useState("");
  const [connective, setConnective] = useState("");
  const [arg2, setArg2] = useState("");
  const [relation, setRelation] = useState("");

  useEffect(() => {

    if (!sentence) return;

    setArg1(sentence.arg1 || "");
    setConnective(sentence.connective || "");
    setArg2(sentence.arg2 || "");
    setRelation(sentence.relation || "");

  }, [sentence]);

  if (!sentence) {

    return (
      <Typography>
        Select a sentence
      </Typography>
    );
  }

  if (
  panelMode === "markable" &&
  selectedMarkable
) {

  return (

    <MarkableDetails
      markable={
        selectedMarkable
      }
      onSave={
        onMarkableUpdate
      }
      onDelete={
        onMarkableDelete
      }
    />

  );

}

  const handleSave = () => {

    onSave({
      ...sentence,
      arg1,
      connective,
      arg2,
      relation
    });

  };

  return (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      gap: 3
    }}
  >

      <Typography
        variant="h6"
        gutterBottom
      >
        Annotation Editor
      </Typography>

     <Divider sx={{ mb: 2 }} />
     
    
<Box
  sx={{
    mt: 1,
    mb: 2,
    p: 2,
    border: "1px solid #e0e0e0",
    borderRadius: 2,
    bgcolor: "#fafafa"
  }}
>

  <MarkablePanel
    markables={
      sentence.markables || []
    }

    onSelect={(markable) => {

      onMarkableSelect?.(
        markable
      );

    }}
  />

</Box>
    <Typography
  variant="subtitle2"
  sx={{
    mt: 1,
    mb: 1,
    fontWeight: 700
  }}
>
  BIO Tags
</Typography>

<Box
  sx={{
    maxHeight: 180,
    minHeight: 180,
    overflowY: "auto",
    border: "1px solid #ddd",
    p: 2,
    borderRadius: 2,
    bgcolor: "#fafafa",
    mb: 3
  }}
>

{sentence.tokens.map(
(token,index)=>(

<Box
 key={index}
 sx={{
  display:"flex",
  justifyContent:
   "space-between"
 }}
>

<span>{token}</span>

<span>
{sentence.bio_tags[index]}
</span>

</Box>

))
}

</Box>
     
    
     
     <TextField
        label="ARG1"
        fullWidth
        multiline
        minRows={3}
        value={arg1}
        onChange={(e) =>
          setArg1(e.target.value)
        }
        sx={{ mb: 3 }}
      />

      <TextField
        label="CONNECTIVE"
        fullWidth
        value={connective}
        onChange={(e) =>
          setConnective(e.target.value)
        }
        sx={{ mb: 3 }}
      />

      <TextField
        label="ARG2"
        fullWidth
        multiline
        minRows={3}
        value={arg2}
        onChange={(e) =>
          setArg2(e.target.value)
        }
        sx={{ mb: 3 }}
      />

      <TextField
        select
        label="Relation"
        fullWidth
        value={relation}
        onChange={(e) =>
          setRelation(e.target.value)
        }
        sx={{ mb: 3 }}
      >
        <MenuItem value="No Relation">
         No Relation
        </MenuItem>
        <MenuItem value="Temporal">
          Temporal
        </MenuItem>

        <MenuItem value="Contingency">
          Contingency
        </MenuItem>

        <MenuItem value="Comparison">
          Comparison
        </MenuItem>

        <MenuItem value="Expansion">
          Expansion
        </MenuItem>

        <MenuItem value="Contingency.Goal">
  Contingency.Goal
</MenuItem>

<MenuItem value="Contingency.Cause.Reason">
  Contingency.Cause.Reason
</MenuItem>

<MenuItem value="Expansion.Conjunction">
  Expansion.Conjunction
</MenuItem>
      </TextField>

      <Typography
  sx={{
    mt: 1,
    mb: 3,
    fontWeight: 600
  }}
>
        Confidence:
        {" "}
        {sentence.confidence}
      </Typography>

      <Button
        variant="contained"
        fullWidth
        onClick={handleSave}
      >
        Save Changes
      </Button>

    </Box>
  );
}