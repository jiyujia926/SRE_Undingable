const colors = ["#391085", "#10239e", "#006d75", "#9e1068", "#ad4e00"];
const cardTextStyle = {
  root: {
    height: "100%",
    display: "flex",
  },
  body: {
    display: "flex",
    flexDirection: "column",
  },
  head: {
    textAlign: "left",
    margin: "10px 16px 0px",
    textTransform: "capitalize",
  },
  content: {
    display: "flex",
    flexDirection: "row",
    height: "100%",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
  },
  text: {
    textAlign: "center",
    width: "50%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  itemProgress: {
    color: "primary",
    marginLeft: "45%",
    textAlign: "center",
  },
  number: {
    color: colors[4],
  },
  number0: {
    color: colors[0],
  },
  number1: {
    color: colors[1],
  },
  number2: {
    color: colors[2],
  },
  number3: {
    color: colors[3],
  },
  item: {
    textTransform: "capitalize",
  },
};
export default cardTextStyle;
