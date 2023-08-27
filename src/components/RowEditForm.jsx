import React from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { Button, Form, InputGroup } from "react-bootstrap";

import { updateRow } from "../slices/tableSlice";
import columns from "../helper/columnConfig";

const PlainField = ({ value, label }) => {
  return (
    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
      <Form.Label>{label}</Form.Label>
      <Form.Control type="text" value={value} disabled />
    </Form.Group>
  );
};

PlainField.propTypes = {
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

const InputField = ({ value, label, onFieldChange }) => {
  return (
    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
      <Form.Label>{label}</Form.Label>
      <Form.Control
        type="text"
        value={value}
        onChange={(e) => onFieldChange(e.target.value)}
      />
    </Form.Group>
  );
};

InputField.propTypes = {
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onFieldChange: PropTypes.func.isRequired,
};

const SelectField = ({ value, label, options, onFieldChange }) => {
  return (
    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
      <Form.Label>{label}</Form.Label>
      <Form.Select
        value={value}
        onChange={(e) => onFieldChange(e.target.value)}
      >
        {["", ...options].map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
};

SelectField.propTypes = {
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  onFieldChange: PropTypes.func.isRequired,
};

const RowEditForm = ({ ridx, onClose }) => {
  const dispatch = useDispatch();
  const { rows } = useSelector((state) => state.table);
  const [memorized, setMemorized] = React.useState(rows[ridx]);

  const handleFieldUpdate = (value, key) =>
    setMemorized({
      ...memorized,
      [key]: value,
    });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    dispatch(updateRow(memorized));
  };

  return (
    <Form onSubmit={handleFormSubmit}>
      {columns.map((column) => {
        switch (column.editType ?? "") {
          case "input":
            return (
              <InputField
                value={memorized[column.key]}
                label={column.title}
                onFieldChange={(value) => handleFieldUpdate(value, column.key)}
              />
            );
          case "select":
            return (
              <SelectField
                value={memorized[column.key]}
                label={column.title}
                options={rows.map((row) => row[column.optionSource])}
                onFieldChange={(value) => handleFieldUpdate(value, column.key)}
              />
            );
          default:
            return (
              <PlainField value={memorized[column.key]} label={column.title} />
            );
        }
      })}
      <InputGroup>
        <Button type="submit" variant="success">
          Save
        </Button>
        <Button type="reset" variant="danger" onClick={onClose}>
          Discard
        </Button>
      </InputGroup>
    </Form>
  );
};

RowEditForm.propTypes = {
  ridx: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default RowEditForm;
