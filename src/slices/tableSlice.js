import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  rows: [
    {
      id: "child",
      name: "Child",
      parent: "parent",
      group: "home",
    },
    {
      id: "parent",
      name: "Parent",
      parent: "",
      group: "home",
    },
  ],
};

const newData = (id) => ({
  id,
  name: "",
  parent: "",
  group: "",
});

export const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    addRow: (state, action) => ({
      ...state,
      rows: [...state.rows, newData(action.payload)],
    }),
    updateRow: (state, action) => {
      const row = action.payload;
      const nextRows = [...state.rows];
      const index = nextRows.findIndex((item) => row.id === item.id);
      const nextRow = { ...nextRows[index], ...row };
      nextRows.splice(index, 1, nextRow);
      return { ...state, rows: [...nextRows] };
    },
    deleteRow: (state, action) => {
      const { key } = action.payload;
      console.log(key);
      const nextRows = state.rows.filter((item) => item.key !== key);
      return { ...state, rows: [...nextRows] };
    },
    importRows: (state, action) => {
      return {
        ...state,
        ...action.payload.map((row) => ({
          ...newData(row.id),
          ...row,
        })),
      };
    },
  },
});

export const { addRow, updateRow, deleteRow, importRows } = tableSlice.actions;

export default tableSlice.reducer;
