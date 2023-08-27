import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "react-bootstrap/Button";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-dot";
import "prismjs/themes/prism-dark.css";

import { updateSource, updateGraph } from "../slices/graphSlice";
import { closeModal } from "../slices/uiSlice";
import dotToReactFlow from "../helper/dotToReactFlow";
import { formatString } from "../helper/tableToDot";
import "../assets/source.css";
import { ButtonGroup } from "react-bootstrap";

const Source = () => {
  const dispatch = useDispatch();
  const { source } = useSelector((state) => state.graph);
  const [memorized, setMemorized] = React.useState("");

  const handleChangeMemorized = (value) => setMemorized(value);

  const handleGenerateRaw = async () => {
    dispatch(updateSource({ source: memorized }));
    const { nodes, edges } = await dotToReactFlow(memorized);
    dispatch(updateGraph({ nodes, edges }));
    dispatch(closeModal());
  };

  React.useEffect(() => {
    setMemorized(formatString(source));
  }, [source]);

  const importDOT = async (event) => {
    const [file] = event.target.files;
    if (!file) return;

    const data = await file.text();
    setMemorized(data);
  };

  const exportDOT = () => {
    const filename = Math.round(new Date().getTime() / 1000);
    const blob = new Blob([memorized], { type: "text/plain" });
    const downloadAnchor = document.createElement("a");
    downloadAnchor.href = URL.createObjectURL(blob);
    downloadAnchor.download = `${filename}.dot`;
    downloadAnchor.click();
  };

  return (
    <>
      <div className="my-2 d-flex justify-content-start">
        <ButtonGroup>
          <Button as="label" variant="success">
            <input
              type="file"
              accept=".dot"
              style={{ display: "none" }}
              onChange={importDOT}
            />
            Import
          </Button>
          <Button variant="secondary" onClick={exportDOT}>
            Export
          </Button>
        </ButtonGroup>
      </div>
      <div className="source-editor-container">
        <Editor
          className="source-editor"
          value={memorized}
          onValueChange={handleChangeMemorized}
          highlight={(code) =>
            highlight(code, languages.dot)
              .split("\n")
              .map(
                (line, i) =>
                  `<span class='editorLineNumber'>${i + 1}</span>${line}`
              )
              .join("\n")
          }
          padding={10}
          preClassName="language-dot"
        />
      </div>
      <div className="my-2 d-flex justify-content-end">
        <Button onClick={handleGenerateRaw}>Generate</Button>
      </div>
    </>
  );
};

export default Source;
