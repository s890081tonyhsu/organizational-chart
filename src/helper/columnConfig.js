const columns = [
  {
    key: "id",
    title: "ID",
  },
  {
    key: "name",
    title: "Name",
    editType: "input",
  },
  {
    key: "group",
    title: "Group",
    editType: "input",
  },
  {
    key: "parent",
    title: "Parent ID",
    editType: "select",
    optionSource: "id",
  },
];

export default columns;
