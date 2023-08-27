import React from "react";
import {
  InputGroup,
  Form,
  Button,
  Table,
  ButtonGroup,
  Modal,
} from "react-bootstrap";
import { BsPencilSquare, BsTrash } from "react-icons/bs";

import columns from "../helper/columnConfig";
import { useDispatch, useSelector } from "react-redux";
import { addRow, deleteRow, importRows } from "../slices/tableSlice";
import RowEditForm from "../components/RowEditForm";
import { updateSource, updateGraph } from "../slices/graphSlice";
import { closeModal } from "../slices/uiSlice";
import "../assets/depTable.css";
import tableToDot from "../helper/tableToDot";
import dotToReactFlow from "../helper/dotToReactFlow";
import { csvToRows, rowsToCsv } from "../helper/csvTableConvert";

const DepTable = () => {
  const dispatch = useDispatch();
  const { rows } = useSelector((state) => state.table);
  const [newId, setNewId] = React.useState("");
  const [editIdx, setEditIdx] = React.useState(-1);

  const importCSV = async (event) => {
    const [file] = event.target.files;
    if (!file) return;

    const data = await file.text();
    const parsedRows = csvToRows(data);
    dispatch(importRows(parsedRows));
  };

  const exportCSV = () => {
    const filename = Math.round(new Date().getTime() / 1000);
    const data = rowsToCsv(rows);
    const blob = new Blob([data], { type: "text/csv" });
    const downloadAnchor = document.createElement("a");
    downloadAnchor.href = URL.createObjectURL(blob);
    downloadAnchor.download = `${filename}.csv`;
    downloadAnchor.click();
  };

  const handleAddRow = () => dispatch(addRow(newId));

  const handleDeleteRow = () => dispatch(deleteRow(newId));

  const handleOpenEditor = (ridx) => setEditIdx(ridx);

  const handleCloseEditor = () => setEditIdx(-1);

  const handleGenerate = async () => {
    const source = tableToDot(rows);
    dispatch(updateSource({ source, isTable: true }));
    const { nodes, edges } = await dotToReactFlow(source);
    dispatch(updateGraph({ nodes, edges }));
    dispatch(closeModal());
  };

  return (
    <>
      <div className="d-flex justify-content-between my-2 align-items-center">
        <ButtonGroup>
          <Button as="label" variant="success">
            <input
              type="file"
              accept="text/csv"
              style={{ display: "none" }}
              onChange={importCSV}
            />
            Import
          </Button>
          <Button variant="secondary" onClick={exportCSV}>
            Export
          </Button>
        </ButtonGroup>
        <InputGroup style={{ width: "50%", marginBottom: 0 }}>
          <Form.Control
            value={newId}
            onChange={(e) => setNewId(e.target.value)}
            placeholder="Input an Id to create a row"
          />
          <Button variant="primary" onClick={handleAddRow}>
            Add Row
          </Button>
        </InputGroup>
      </div>
      <Table striped bordered hover size="md">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.title}</th>
            ))}
            <th style={{ width: 200 }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ridx) => (
            <tr key={row.id}>
              {columns.map((column) => (
                <td key={column.key}>{row[column.key]}</td>
              ))}
              <td>
                <ButtonGroup>
                  <Button
                    variant="success"
                    onClick={() => handleOpenEditor(ridx)}
                  >
                    <BsPencilSquare />
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteRow(ridx)}
                  >
                    <BsTrash />
                  </Button>
                </ButtonGroup>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="d-flex justify-content-end">
        <Button variant="primary" onClick={handleGenerate}>
          Generate
        </Button>
      </div>
      {editIdx !== -1 && (
        <Modal
          show={editIdx !== -1}
          onHide={handleCloseEditor}
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit {rows[editIdx].id}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <RowEditForm ridx={editIdx} onClose={handleCloseEditor} />
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default DepTable;
