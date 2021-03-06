import {
  successColor,
  whiteColor,
  grayColor,
  hexToRgb,
} from "assets/jss/material-dashboard-react.js";

import dropdownStyle from "assets/jss/material-dashboard-react/dropdownStyle.js";

const dashboardStyle = (theme) => ({
  ...dropdownStyle(theme),
  search: {
    "& > div": {
      marginTop: "0",
    },
    [theme.breakpoints.down("sm")]: {
      margin: "10px 15px !important",
      float: "none !important",
      paddingTop: "1px",
      paddingBottom: "1px",
      padding: "0!important",
      width: "60%",
      marginTop: "40px",
      "& input": {
        color: whiteColor,
      },
    },
  },
  margin: {
    zIndex: "4",
    margin: "0",
    flex: "1",
    paddingRight: "5px",
  },
  searchWrapper: {
    [theme.breakpoints.down("sm")]: {
      width: "-webkit-fill-available",
      margin: "10px 15px 0",
    },
    display: "flex",
    width: "400px",
  },
  searchInput: {
    flex: "1",
  },
  successText: {
    color: successColor[0],
  },
  upArrowCardCategory: {
    width: "16px",
    height: "16px",
  },
  stats: {
    color: grayColor[0],
    display: "inline-flex",
    fontSize: "12px",
    lineHeight: "22px",
    "& svg": {
      top: "4px",
      width: "16px",
      height: "16px",
      position: "relative",
      marginRight: "3px",
      marginLeft: "3px",
    },
    "& .fab,& .fas,& .far,& .fal,& .material-icons": {
      top: "4px",
      fontSize: "16px",
      position: "relative",
      marginRight: "3px",
      marginLeft: "3px",
    },
  },
  cardCategory: {
    color: grayColor[0],
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    paddingTop: "10px",
    marginBottom: "0",
  },
  cardCategoryWhite: {
    color: "rgba(" + hexToRgb(whiteColor) + ",.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0",
  },
  cardTitle: {
    color: grayColor[2],
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: grayColor[1],
      fontWeight: "400",
      lineHeight: "1",
    },
  },
  cardTitleWhite: {
    color: whiteColor,
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: grayColor[1],
      fontWeight: "400",
      lineHeight: "1",
    },
  },
  infoCard: {
    height: "100%",
    padding: "0px 0",
  },
  body: {
    //height: "350px",
    display: "flex",
    //flexDirection: "column",
  },
  head: {
    textAlign: "left",
    margin: "10px 16px 0px",
    textTransform: "capitalize",
  },
  subtitle: {
    margin: "10px 16px 0px",
    textTransform: "capitalize",
    fontWeight: "500",
  },
  fabSet: {
    position: "fixed",
    display: "flex",
    flexDirection: "column",
    bottom: theme.spacing(4),
    right: theme.spacing(2),
  },
  fab: {
    margin: "7px 0",
    padding: "0 22px",
  },
  form_head: {
    textAlign: "center",
    padding: "20px 24px 0",
  },
  form_content: {
    padding: "8px 24px 20px",
  },
  form_button: {
    width: "30%",
    margin: "15px 10% 0px",
  },
  form_list: {
    width: "100%",
    minWidth: "350px",
    maxHeight: "288px",
    overflowY: "auto",
    margin: "10px 0",
  },
  form_listHead: {
    backgroundColor: "#ffeeff",
    color: "rgb(0,0,0,0.87)",
    fontSize: "1rem",
  },
});

export default dashboardStyle;
