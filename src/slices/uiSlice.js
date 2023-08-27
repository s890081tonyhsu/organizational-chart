import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  modal: "",
};

export const uiSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state, action) => ({
      ...state,
      modal: action.payload,
    }),
    closeModal: (state) => ({
      ...state,
      modal: "",
    }),
  },
});

export const { openModal, closeModal } = uiSlice.actions;

export default uiSlice.reducer;
