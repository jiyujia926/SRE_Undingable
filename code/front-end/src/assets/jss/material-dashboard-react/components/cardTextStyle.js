const colors = ["#391085", "#10239e", "#006d75", "#9e1068", "#ad4e00"];
const cardTextStyle = {
  root: {
    height: "100%",
    //height: "300px",
    display: "flex",
  },
  body: {
    //height: "350px",
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
  doublecontent: {
    textAlign: "right",
    display: "flex",
    flexDirection: "row",
    width: "80%",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    marginTop: "10px",
    marginBottom: "10px",
  },
  divider: {
    marginTop: "10px",
    marginBottom: "10px",
    marginLeft: "10%",
  },
  reponame: {
    textAlign: "center",
    flexDirection: "column",
    display: "flex",
    width: "20%",
    marginTop: "7%",
    //writingmode: "vertical-lr",
  },
  repos: {
    height: "100%",
    flexDirection: "row",
    display: "flex",
  },
  text: {
    textAlign: "center",
    width: "50%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  text0: {
    marginTop: "6%",
    textAlign: "center",
    justifyContent: "center",
  },
  text2: {
    textAlign: "center",
    //marginTop: "3%",
    width: "30%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  text3: {
    textAlign: "center",
    width: "50%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  text4: {
    textAlign: "center",
    //width: "30%",
    width: "20%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    //marginTop: "2%",
    marginTop: "3%",
    marginBottom: "2%",
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
