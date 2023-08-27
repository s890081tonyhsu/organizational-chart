const INDENT = 2;

export const formatString = (str) => {
  // Add line break before opening curly bracket
  str = str.replace(/{/g, "{\n");
  // Add line break and indentation after closing curly bracket
  str = str.replace(/}/g, "\n}\n");
  // Add line break after semicolon
  str = str.replace(/;/g, ";\n");
  // Split string into lines
  let lines = str.split("\n");
  // Trim lines and remove blank lines
  lines = lines.map((line) => line.trim()).filter((line) => line !== "");
  // Initialize indentation level
  let indentLevel = 0;
  // Loop through lines
  for (let i = 0; i < lines.length; i++) {
    // Decrease indentation level if line contains just a closing curly bracket
    if (lines[i] === "}") {
      indentLevel--;
    }
    // Add indentation to line
    lines[i] = " ".repeat(indentLevel * INDENT) + lines[i];
    // Increase indentation level if line ends with an opening curly bracket
    if (lines[i].endsWith("{")) {
      indentLevel++;
    }
  }
  // Join lines into formatted string
  return lines.join("\n");
};

const rowToNode = (row) => {
  if (row.name.length === 0) return "";
  return `${row.id} [label=${row.name}];`;
};

const rowToEdge = (row) => {
  if (row.parent.length === 0) return "";
  return `${row.parent} -> ${row.id} [dir = back];`;
};

const subgraphGenerate = (rows) => {
  const groups = rows.reduce((acc, row) => {
    if (row.group === "") return acc;

    if (!acc[row.group]) acc[row.group] = [];
    acc[row.group].push(row.id);

    return acc;
  }, {});

  return Object.entries(groups)
    .filter(
      ([groupName, groupItems]) =>
        groupName.length !== 0 && groupItems.length !== 0
    )
    .map(([groupName, groupItems], idx) => {
      const content = groupItems.map((item) => `${item};`);
      return [
        `subgraph cluster_${idx} {`,
        "style=filled;",
        "margin=20.0;",
        ...content,
        `label="${groupName}";`,
        "}",
      ].join("\n");
    })
    .join("\n");
};

const tableToDot = (rows) => {
  const nodeStmt = rows
    .map(rowToNode)
    .filter((str) => str.length !== 0)
    .join("\n");
  const lineStmt = rows
    .map(rowToEdge)
    .filter((str) => str.length !== 0)
    .join("\n");
  const subgraphes = subgraphGenerate(rows);

  return (
    "digraph {\n" +
    `node [shape=rect];` +
    `${nodeStmt}\n` +
    `${lineStmt}\n` +
    `${subgraphes}\n` +
    "}\n"
  );
};

export default tableToDot;
