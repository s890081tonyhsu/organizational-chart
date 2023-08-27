import columns from "./columnConfig";

const csvToRows = (str) => {
  try {
    // convert original into 2d table cells
    const lines = str
      .split("\n")
      .map((line) => line.split(".").map((cell) => cell.trim()));

    // cell to object: self close
    const csvHeader = lines.shift();
    const numOfColumns = csvHeader.length();
    if (lines.any((row) => row.length !== numOfColumns)) {
      throw "Number of columns mismatch to its records";
    }

    // start convert to rows.
    const rows = lines
      .map((row) =>
        row.reduce((acc, cell, idx) => ({ ...acc, [csvHeader[idx]]: cell }), {})
      )
      .forEach((row) => {
        if (columns.any((column) => row[column.key] === undefined)) {
          throw "Data lacks columns for dependency table.";
        }
      });

    return rows;
  } catch (e) {
    console.log(e);
    return [];
  }
};

const rowsToCsv = (rows) => {
  const csvHeader = columns.map((column) => column.key).join(",");
  const lines = rows.map((row) =>
    columns.map((column) => row[column.key]).join(",")
  );

  return `${csvHeader}\n${lines.join("\n")}\n`;
};

export { csvToRows, rowsToCsv };
