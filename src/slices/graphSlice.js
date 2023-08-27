import { createSlice } from "@reduxjs/toolkit";
import { applyNodeChanges, applyEdgeChanges } from "reactflow";

const EXAMPLE = `digraph {
  node [shape=record];
  child [label = Child];
  parent [label = Parent];
  parent -> child [dir = back];
}`;

const initialState = {
  source: EXAMPLE,
  syncTable: true,
  nodes: [],
  edges: [],
};

export const graphSlice = createSlice({
  name: "graph",
  initialState,
  reducers: {
    updateSource: (state, action) => ({
      ...state,
      source: action.payload.source,
      syncTable: action.payload.isTable ?? false,
    }),
    updateGraph: (state, action) => ({
      ...state,
      nodes: action.payload.nodes,
      edges: action.payload.edges,
    }),
    onNodesChange: (state, action) => ({
      ...state,
      nodes: applyNodeChanges(action.payload, state.nodes),
    }),
    onEdgesChange: (state, action) => ({
      ...state,
      edges: applyEdgeChanges(action.payload, state.edges),
    }),
  },
});

export const { updateSource, updateGraph, onNodesChange, onEdgesChange } =
  graphSlice.actions;

export default graphSlice.reducer;
