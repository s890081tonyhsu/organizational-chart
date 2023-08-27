# Organizational Chart

A tool to generate organizational chart in a dependency table.

## Feature

1. Edit or load fixed format dependency table to generate graph.
2. Modify the graph by dot language.
3. The graph is a reactflow-based graph, you can move the nodes to better position.

NOTE: This repo only support the following generate flows, reverse is not support currently.

- Dependency Table -> DOT Source Code -> Reactflow.
- DOT Source Code -> Reactflow.

## Todo

- [ ] Support color on group.
- [ ] Enable inspector on a node.

## Reference

- [Graphviz JSON format](https://graphviz.org/docs/outputs/json/)
- [Reactflow Props List](https://reactflow.dev/docs/api/react-flow-props/)
