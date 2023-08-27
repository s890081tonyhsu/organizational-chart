import ReactFlow, { Controls, Background, MiniMap } from "reactflow";
import { useDispatch, useSelector } from "react-redux";
import Modal from "react-bootstrap/Modal";

import { closeModal } from "./slices/uiSlice";
import { onNodesChange, onEdgesChange } from "./slices/graphSlice";
import Navbar from "./layout/Navbar";
import * as Pages from "./pages";
import modals from "./static/modal.json";
import "reactflow/dist/style.css";

function App() {
  const { nodes, edges } = useSelector((state) => state.graph);
  const { modal } = useSelector((state) => state.ui);
  const dispatch = useDispatch();

  const handleClose = () => dispatch(closeModal());

  const ModalBody = modal !== "" ? Pages[modals[modal].component] : "div";

  return (
    <>
      <Navbar />
      <main>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={(changes) => dispatch(onNodesChange(changes))}
          onEdgesChange={(changes) => dispatch(onEdgesChange(changes))}
          selectionKeyCode={null}
          multiSelectionKeyCode={null}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap nodeStrokeWidth={3} zoomable pannable />
        </ReactFlow>
      </main>
      {modal !== "" && (
        <Modal show={modal !== ""} onHide={handleClose} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>{modals[modal].title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ModalBody />
          </Modal.Body>
        </Modal>
      )}
    </>
  );
}

export default App;
