import { configureStore } from "@reduxjs/toolkit";
import graphReducer from "./slices/graphSlice";
import tableReducer from "./slices/tableSlice";
import uiReducer from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    graph: graphReducer,
    table: tableReducer,
    ui: uiReducer,
  },
});
