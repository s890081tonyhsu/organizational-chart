import { ButtonGroup, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import {} from "../slices/tableSlice";
import { updateGraph } from "../slices/graphSlice";

const exampleFlow = {
  nodes: [
    {
      id: `node_0`,
      className: "organization_node",
      position: { x: 0, y: 100 },
      data: {
        label: "Node #0",
      },
      style: {
        width: 200,
        height: 100,
      },
    },
    {
      id: `node_1`,
      className: "organization_node",
      position: { x: 0, y: 0 },
      data: {
        label: "Node #1",
      },
      style: {
        width: 200,
        height: 100,
      },
    },
  ],
  edges: [
    {
      id: `edge_0`,
      source: `node_0`,
      target: `node_1`,
      markerStart: { type: "arrow" },
      style: { zIndex: 1000 },
    },
  ],
};

const File = () => {
  const dispatch = useDispatch();
  const { nodes, edges } = useSelector((state) => state.graph);
  const filename = Math.round(new Date().getTime() / 1000);

  const importJSON = async (event) => {
    const [file] = event.target.files;
    if (!file) return;

    const data = await file.text();
    const json = JSON.parse(data);
    dispatch(updateGraph(json));
  };

  const exportJSON = () => {
    const data = JSON.stringify({ nodes, edges });
    const blob = new Blob([data], { type: "application/json" });
    const downloadAnchor = document.createElement("a");
    downloadAnchor.href = URL.createObjectURL(blob);
    downloadAnchor.download = `${filename}.json`;
    downloadAnchor.click();
  };

  return (
    <>
      <ButtonGroup>
        <Button as="label" variant="success">
          <input
            type="file"
            accept="application/json"
            style={{ display: "none" }}
            onChange={importJSON}
          />
          Import
        </Button>
        <Button variant="secondary" onClick={exportJSON}>
          Export
        </Button>
      </ButtonGroup>
      <p>
        The source JSON file should be format as follows.
        <pre style={{ height: "10em", overflow: "scroll" }}>
          <code>{JSON.stringify(exampleFlow, null, 2)}</code>
        </pre>
      </p>
    </>
  );
};

export default File;
