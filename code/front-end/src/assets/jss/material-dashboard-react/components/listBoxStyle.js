const listBoxStyle = {
  root: {
    display: "flex",
  },
  list: {
    width: "auto",
  },
  form: {
    margin: "0 12px",
    padding: "0.25em 0",
    display: "flex",
    flex: 1,
    border: "2px solid #5d99c6",
    boxShadow: "none",
    "&:hover,&:focus": {
      border: "3px solid #5d99c6",
    },
  },
  input: {
    marginLeft: "1.5em",
    lineHeight: "3em",
    flex: 1,
  },
  check: {
    padding: "12px 12px 12px 24px",
  },
  divider: {
    height: 28,
    margin: 4,
  },
  empty: {
    "& span": {
      textAlign: "center",
    },
  },
  listHead: {
    display: "flex",
    alignItems: "center",
    padding: "8px 16px",
  },
  listItem: {
    display: "flex",
    alignItems: "center",
    padding: "0 16px",
  },
  itemText: {
    flex: "1",
    padding: "0 12px",
  },
  itemProgress: {
    width: "28px !important",
    height: "28px !important",
    padding: "10px",
  },
  itemDone: {
    color: "primary",
  },
};
export default listBoxStyle;
