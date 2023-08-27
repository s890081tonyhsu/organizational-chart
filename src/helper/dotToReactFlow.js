import { instance } from "@viz-js/viz";

const dotToReactFlow = async (dotSource) => {
  try {
    const viz = await instance();
    const jsonGraph = viz.renderJSON(dotSource, {
      format: "dot",
      yInvert: true,
    });

    console.log(jsonGraph);

    const { objects: vizNodes, edges: vizEdges } = jsonGraph;

    const { subGraphs, subNodes, parent } = vizNodes.reduce(
      (acc, vizNode) => {
        if (vizNode.nodes) {
          acc.subGraphs.push(vizNode);
          acc.parent = {
            ...acc.parent,
            ...Object.fromEntries(
              vizNode.nodes.map((node) => [node, vizNode._gvid])
            ),
          };
        } else acc.subNodes.push(vizNode);
        return acc;
      },
      { subGraphs: [], subNodes: [], parent: {} }
    );

    const groupsAsNodes = subGraphs.map((node) => {
      const _draw_P = node._draw_.find((o) => o.op === "P");
      return {
        id: `node_${node._gvid}`,
        className: "organization_group",
        position: { x: _draw_P.points[1][0], y: _draw_P.points[1][1] },
        data: {
          label: node.label ?? `node_${node._gvid}`,
        },
        style: {
          width: _draw_P.points[2][0] - _draw_P.points[1][0],
          height: _draw_P.points[0][1] - _draw_P.points[1][1],
        },
      };
    });

    const nodesAsNodes = subNodes.map((node) => {
      let _draw_P = node._draw_.find((o) => o.op === "p");
      if (parent[node._gvid] !== undefined) {
        const subGroup = groupsAsNodes.find(
          (gNode) => gNode.id === `node_${parent[node._gvid]}`
        );
        _draw_P.points = _draw_P.points.map((pt) => [
          pt[0] - subGroup.position.x,
          pt[1] - subGroup.position.y,
        ]);
      }
      return {
        id: `node_${node._gvid}`,
        className: "organization_node",
        position: { x: _draw_P.points[1][0], y: _draw_P.points[1][1] },
        data: {
          label: node.label ?? `node_${node._gvid}`,
        },
        style: {
          width: _draw_P.points[0][0] - _draw_P.points[1][0],
          height: _draw_P.points[2][1] - _draw_P.points[1][1],
          textAlign: "center",
        },
        parentNode:
          parent[node._gvid] !== undefined
            ? `node_${parent[node._gvid]}`
            : undefined,
      };
    });

    const edges = vizEdges.map((edge) => ({
      id: `edge_${edge._gvid}`,
      source: `node_${edge.tail}`,
      target: `node_${edge.head}`,
      markerStart: { type: "arrow" },
      style: { zIndex: 1000 },
    }));

    return { nodes: [...groupsAsNodes, ...nodesAsNodes], edges };
  } catch (e) {
    console.log(e);
    return { nodes: [], edges: [] };
  }
};

export default dotToReactFlow;
