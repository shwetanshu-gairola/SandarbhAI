import { useState } from "react";
import {
  exportToXML
}
from "../services/xmlExporter";
import {
  importXML
}
from "../services/xmlImporter";
import {
  hasOverlap,
  markablesToBioTags,
  bioTagsToMarkables
} from "../services/markableUtils";

import {
  Box,
  Typography,
  Button
} from "@mui/material";

import api from "../services/api";

import TopToolbar from "../components/TopToolbar";
import DocumentStats from "../components/DocumentStats";
import SentenceCanvas from "../components/SentenceCanvas";
import AnnotationSidebar from "../components/AnnotationSidebar";

export default function AnnotationPage() {

  const [document, setDocument] =
    useState([]);

  const [selectedSentence, setSelectedSentence] =
    useState(null);

  const [selectedMarkable, setSelectedMarkable] =
    useState(null);

  const [panelMode, setPanelMode] =
    useState("sentence");

  const saveAnnotation = (
    updatedSentence
  ) => {

    const updatedDocument =
      document.map((item) =>
        item.id === updatedSentence.id
          ? updatedSentence
          : item
      );

    setDocument(
      updatedDocument
    );

    setSelectedSentence(
      updatedSentence
    );

  };

  const updateMarkable = (
  updatedMarkable
) => {

  const updatedDocument =
    document.map(
      (sentence) => {

        if (
          sentence.id !==
          selectedSentence.id
        ) {
          return sentence;
        }
        if (
  hasOverlap(
    updatedMarkable.start,
    updatedMarkable.end,
    sentence.markables,
    updatedMarkable.id
  )
) {

  alert(
    "Markables cannot overlap"
  );

  return sentence;

}

        const updatedMarkables =
          sentence.markables.map(
            (markable) =>

              markable.id ===
              updatedMarkable.id

                ? {

                    ...updatedMarkable,

                    text:
                      sentence.tokens
                        .slice(
                          updatedMarkable.start,
                          updatedMarkable.end + 1
                        )
                        .join(" ")

                  }

                : markable
          );

        return {

  ...sentence,

  markables:
    updatedMarkables,

  bio_tags:
    markablesToBioTags(
      sentence.tokens.length,
      updatedMarkables
    )

};

      }
    );

  setDocument(
    updatedDocument
  );

  setSelectedMarkable({

    ...updatedMarkable,

    text:
      selectedSentence.tokens
        .slice(
          updatedMarkable.start,
          updatedMarkable.end + 1
        )
        .join(" ")

  });

};
const resizeMarkable = (
  markable,
  action
) => {

  let updated = {
    ...markable
  };

  // ◁ on left side
  if (
    action === "left-expand" &&
    updated.start > 0
  ) {

    updated.start--;

  }

  // ▷ on left side
  if (
    action === "left-shrink" &&
    updated.start < updated.end
  ) {

    updated.start++;

  }

  // ◁ on right side
  if (
    action === "right-shrink" &&
    updated.end > updated.start
  ) {

    updated.end--;

  }

  // ▷ on right side
  if (
    action === "right-expand" &&
    updated.end <
      selectedSentence.tokens.length - 1
  ) {

    updated.end++;

  }

  updateMarkable(
    updated
  );

};
const deleteMarkable = (
  markableId
) => {

  const updatedDocument =
    document.map(
      (sentence) => {

        if (
          sentence.id !==
          selectedSentence.id
        ) {
          return sentence;
        }

        const updatedMarkables =
  sentence.markables.filter(
    (m) =>
      m.id !==
      markableId
  );

return {

  ...sentence,

  markables:
    updatedMarkables,

  bio_tags:
    markablesToBioTags(
      sentence.tokens.length,
      updatedMarkables
    )

};
      }
    );

  setDocument(
    updatedDocument
  );

  setSelectedMarkable(
    null
  );

};
const createMarkable = (
  newMarkable
) => {

  if (!selectedSentence)
    return;
  const allIds =
  document.flatMap(
    (sentence) =>
      sentence.markables.map(
        (m) => m.id
      )
  );

const nextId =
  Math.max(
    ...allIds,
    0
  ) + 1;

newMarkable = {

  ...newMarkable,

  id: nextId

};

  const updatedDocument =
    document.map(
      (sentence) => {

        if (
          sentence.id !==
          selectedSentence.id
        ) {
          return sentence;
        }

        return {

          ...sentence,

          markables: (() => {

  const updated = [

    ...sentence.markables,

    newMarkable

  ];

  const connective =
    updated.find(
      (m) =>
        m.type === "CONN"
    );

  if (connective) {

    updated.forEach(
      (m) => {

        if (
          m.type === "ARG1" ||
          m.type === "ARG2"
        ) {

          m.src =
            connective.id;

        }

      }
    );

  }

  return updated;

})()

        };

      }
    );

  setDocument(
    updatedDocument
  );

};
const handleExportXML =
() => {

  exportToXML(
    document
  );

};


  const uploadFile = async (
    event
  ) => {

    const file =
      event.target.files[0];

    if (!file) return;

    const formData =
      new FormData();

    formData.append(
      "file",
      file
    );

    try {

      const response =
        await api.post(
          "/upload",
          formData
        );

      let nextId = 1;

const processedDocument =
  response.data.document.map(
    (sentence) => {

      const markables =
  bioTagsToMarkables(
    sentence.tokens || [],
    sentence.bio_tags || [],
    sentence.relation || "",
    nextId
  );

      if (
        markables.length > 0
      ) {

        nextId =
          Math.max(
            ...markables.map(
              (m) => m.id
            )
          ) + 1;

      }

      return {

        ...sentence,

        markables

      };

    }
  );

      console.log(
        processedDocument[0]
      );

      setDocument(
        processedDocument
      );

    } catch (error) {

      console.error(
        "Upload failed:",
        error
      );

    }

  };
const uploadXML =
async (event) => {

  const file =
    event.target.files[0];

  if (!file)
    return;

  const text =
    await file.text();

  const importedDocument =
    importXML(text);

  setDocument(
    importedDocument
  );

  setSelectedSentence(
    null
  );

  setSelectedMarkable(
    null
  );

};
const uploadRawXML =
async (event) => {

  const file =
    event.target.files[0];

  if (!file)
    return;

  const formData =
    new FormData();

  formData.append(
    "file",
    file
  );

  try {

    const response =
      await api.post(
        "/upload-xml",
        formData
      );

    let nextId = 1;

    const processedDocument =
      response.data.document.map(
        (sentence) => {

          const markables =
            bioTagsToMarkables(
              sentence.tokens || [],
              sentence.bio_tags || [],
              sentence.relation || "",
              nextId
            );

          if (
            markables.length > 0
          ) {

            nextId =
              Math.max(
                ...markables.map(
                  (m) => m.id
                )
              ) + 1;

          }

          return {

            ...sentence,

            markables

          };

        }
      );

    setDocument(
      processedDocument
    );

  }

  catch (error) {

    console.error(
      error
    );

  }

};
  return (

    <Box
      sx={{
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        bgcolor: "#eef2f6"
      }}
    >

      {/* TOP TOOLBAR */}

      <TopToolbar
  onExportXML={
    handleExportXML
  }
/>

      {/* MAIN WORKSPACE */}

      <Box
        sx={{
          display: "flex",
          height:
            "calc(100vh - 70px)"
        }}
      >

        {/* DOCUMENT AREA */}

        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            p: 3,
            bgcolor: "#f8fafc"
          }}
        >

          <DocumentStats
            document={document}
          />

          <Button
            component="label"
            variant="contained"
            sx={{
              mb: 3
            }}
          >
            Upload TXT
            
            <input
              hidden
              type="file"
              accept=".txt"
              onChange={uploadFile}
            />

          </Button>
          <Button
  component="label"
  variant="outlined"
  sx={{
    mb: 3,
    ml: 2
  }}
>
  Upload XML

  <input
    hidden
    type="file"
    accept=".xml"
    onChange={uploadXML}
  />

  

</Button>
<Button
  component="label"
  variant="outlined"
  color="success"
  sx={{
    mb: 3,
    ml: 2
  }}
>
  Upload Raw XML

  <input
    hidden
    type="file"
    accept=".xml"
    onChange={
      uploadRawXML
    }
  />

</Button>
          <Typography
            sx={{
              mb: 3,
              fontWeight: 600
            }}
          >
            Loaded Sentences:
            {" "}
            {document.length}
          </Typography>

          {document.map(
            (sentence) => (

              <SentenceCanvas
  key={sentence.id}

  sentence={sentence}

  selected={
    selectedSentence?.id ===
    sentence.id
  }
  selectedMarkable={
  selectedMarkable
}
onResizeMarkable={
  resizeMarkable
}

  onClick={() => {

    setSelectedSentence(
      sentence
    );

    setPanelMode(
      "sentence"
    );

    setSelectedMarkable(
      null
    );

  }}

  onMarkableClick={(markable) => {

    setSelectedSentence(
      sentence
    );

    setSelectedMarkable(
      markable
    );

    setPanelMode(
      "markable"
    );

  }}

  onCreateMarkable={
    createMarkable
  }

/>

            )
          )}

        </Box>

        {/* SIDEBAR */}

        <Box
          sx={{
            width: "450px",
            flexShrink: 0,
            borderLeft:
              "1px solid #d9e2ec",
            bgcolor: "white",
            overflowY: "auto",
            p: 3,
            boxShadow:
              "-2px 0 10px rgba(0,0,0,0.05)"
          }}
        >

          <AnnotationSidebar
  sentence={
    selectedSentence
  }

  selectedMarkable={
    selectedMarkable
  }

  panelMode={
    panelMode
  }

  onSave={
    saveAnnotation
  }

  onMarkableUpdate={
    updateMarkable
  }

  onMarkableDelete={
    deleteMarkable
  }

  onMarkableSelect={(
    markable
  ) => {

    setSelectedMarkable(
      markable
    );

    setPanelMode(
      "markable"
    );

  }}
/>

        </Box>

      </Box>

    </Box>

  );

}