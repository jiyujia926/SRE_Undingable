import React from "react";
import cookie from "react-cookies";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
//import Card from "components/Card/Card.js";

import styles from "assets/jss/material-dashboard-react/views/customizationStyle.js";
import TablePro from "../../components/TablePro/TablePro";
import CustomizedSnackbars from "../../components/Alert/Alert";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import {
  Dialog,
  DialogContent,
  ListItem,
  ListItemText,
} from "@material-ui/core";
import List from "@material-ui/core/List";
import axios from "axios";
axios.defaults.withCredentials = true;
axios.defaults.headers.post["Content-Type"] = "application/json";
const server = "https://yunding.zjuers.com:8000";
//const server = "http://127.0.0.1:8000";

const useStyles = makeStyles(styles);

export default function CustomizationList() {
  const classes = useStyles();
  let history = useHistory();
  const col = ["ID", "Template Name", "Create Time", "Description"];
  const [templateList, setTemplateList] = React.useState([]);
  const [openIndex, setOpenIndex] = React.useState(-1);
  const [snackbar, setSnackbar] = React.useState({
    rmvDone: false,
    rmvError: false,
    applyError: false,
  });
  function closeSnackbar(name) {
    setSnackbar({ ...snackbar, [name]: false });
  }
  async function apply(index) {
    let tmpList = cookie.load("addressList") ? cookie.load("addressList") : [];
    let isExisted = tmpList.some((current) => {
      return current.checked === true;
    });
    if (isExisted) {
      history.push("/admin/dashboard");
      cookie.save("dashboard", templateList[index].dashboard);
    } else {
      setSnackbar({ ...snackbar, applyError: true });
    }
  }
  async function remove(index) {
    let data = {
      Email: cookie.load("account"),
      Id: templateList[index].hash,
    };
    console.log(data);
    let res = await axios.post(`${server}/delete/`, data);
    if (res.data === "删除成功") {
      setSnackbar({ ...snackbar, rmvDone: true });
      fetch();
    } else {
      setSnackbar({ ...snackbar, rmvError: true });
    }
  }
  function view(index) {
    setOpenIndex(index);
  }
  const handleCloseDialog = () => {
    setOpenIndex(-1);
  };
  async function fetch() {
    if (cookie.load("username") !== undefined) {
      let data = {
        Email: cookie.load("account"),
      };
      console.log(data);
      let res = await axios.post(`${server}/fetch/`, data);
      let list = res.data;
      if (list.length > 0) {
        setTemplateList(
          list.map((current, index) => {
            return {
              ID: index + 1,
              "Template Name": current.Name,
              "Create Time": current.Time,
              Description: current.Description,
              hash: current.Id,
              dashboard: current.Dashboard,
            };
          })
        );
      }
    }
  }
  React.useEffect(() => {
    fetch();
  }, []);
  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        {templateList !== [] && (
          <TablePro
            data={{
              columns: col,
              rows: templateList,
            }}
            buttonType="apply"
            removeFunc={remove}
            jumpFunc={apply}
            popFunc={view}
          />
        )}
      </GridItem>
      <Dialog
        open={openIndex >= 0}
        onClose={handleCloseDialog}
        aria-labelledby="form-dialog-title"
        className={classes.dialog}
      >
        {openIndex >= 0 && (
          <div>
            <DialogTitle id="form-dialog-title" className={classes.form_head}>
              <Typography component="h1" variant="h5">
                Detail of Template {templateList[openIndex]["Template Name"]}
              </Typography>
            </DialogTitle>
            <DialogContent className={classes.form_content}>
              <List className={classes.form_list} subheader={<li />}>
                <ListItem className={classes.form_listHead}>
                  <ListItemText
                    primary="DataType"
                    className={classes.form_listText1}
                  />
                  <ListItemText
                    primary="ChartType"
                    className={classes.form_listText2}
                  />
                  <ListItemText
                    primary="TimeScale"
                    className={classes.form_listText3}
                  />
                  <ListItemText
                    primary="CheckBox"
                    className={classes.form_listText4}
                  />
                </ListItem>
                {templateList[openIndex].dashboard
                  .filter((current) => current.Visible)
                  .map((current, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={current.DataType}
                        className={classes.form_listText1}
                      />
                      <ListItemText
                        primary={current.ChartType}
                        className={classes.form_listText2}
                      />
                      <ListItemText
                        primary={current.TimeScale}
                        className={classes.form_listText3}
                      />
                      <ListItemText
                        primary={current.CheckBox}
                        className={classes.form_listText4}
                      />
                    </ListItem>
                  ))}
              </List>
            </DialogContent>
          </div>
        )}
      </Dialog>
      <CustomizedSnackbars
        name="rmvDone"
        message="Remove the project successfully!"
        type="success"
        open={snackbar.rmvDone}
        close={closeSnackbar}
      />
      <CustomizedSnackbars
        name="rmvError"
        message="You have already remove this project."
        type="error"
        open={snackbar.rmvError}
        close={closeSnackbar}
      />
      <CustomizedSnackbars
        name="applyError"
        message="You have no project to apply now."
        type="warning"
        open={snackbar.applyError}
        close={closeSnackbar}
      />
    </GridContainer>
  );
}
