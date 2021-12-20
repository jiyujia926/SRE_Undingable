import React from "react";
// react plugin for creating charts
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
//import ArrowUpward from "@material-ui/icons/ArrowUpward";
//import AccessTime from "@material-ui/icons/AccessTime";
import Typography from "@material-ui/core/Typography";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
//import CardBody from "components/Card/CardBody.js";
//import CardFooter from "components/Card/CardFooter.js";
import CheckBoxSet from "../../components/CheckBoxSet/CheckBoxSet";
import ListBox from "../../components/ListBox/ListBox";
import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import {
  Dialog,
  DialogContent,
  Fab,
  ListItem,
  ListItemText,
  ListSubheader,
} from "@material-ui/core";
import Cardshow from "../../components/Card/Cardshow";
import cookie from "react-cookies";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
//import Cardtext from "../../components/Card/Cardtext";
//import PieChart from "../../components/Charts/PieChart";
//import BarChart from "../../components/Charts/BarChart";
//import StackedBarChart from "../../components/Charts/StackedBarChart";
import axios from "axios";
axios.defaults.withCredentials = true;
axios.defaults.headers.post["Content-Type"] = "application/json";
const server = "http://122.51.228.166:8000";
// const server = "http://127.0.0.1:8000";

const useStyles = makeStyles(styles);
//let newChartsData = [];
export default function Dashboard() {
  const classes = useStyles();
  const [address, setAddress] = React.useState([]);
  const defaultDashboard = [
    {
      Position: 0,
      DataType: "contributor",
      ChartType: "table",
      TimeScale: "day",
      CheckBox: "",
      Visible: true,
    },
    {
      Position: 1,
      DataType: "contributor",
      ChartType: "piechart",
      TimeScale: "day",
      CheckBox: "",
      Visible: true,
    },
    {
      Position: 2,
      DataType: "commit",
      ChartType: "stackedbarchart",
      TimeScale: "day",
      CheckBox: "",
      Visible: true,
    },
    {
      Position: 3,
      DataType: "subcommit",
      ChartType: "stackedbarchart",
      TimeScale: "day",
      CheckBox: "add-change-remove",
      Visible: true,
    },
    {
      Position: 4,
      DataType: "issue",
      ChartType: "stackedbarchart",
      TimeScale: "day",
      CheckBox: "open-closed",
      Visible: true,
    },
    {
      Position: 5,
      DataType: "issue",
      ChartType: "piechart",
      TimeScale: "day",
      CheckBox: "",
      Visible: true,
    },
    {
      Position: 6,
      DataType: "pullrequest",
      ChartType: "stackedbarchart",
      TimeScale: "day",
      CheckBox: "open-closed-merged",
      Visible: true,
    },
    {
      Position: 7,
      DataType: "pullrequest",
      ChartType: "piechart",
      TimeScale: "day",
      CheckBox: "",
      Visible: true,
    },
  ];
  const [dashboard, setDashboard] = React.useState(
    cookie.load("dashboard") ? cookie.load("dashboard") : defaultDashboard
  );
  const [openDialog, setOpenDialog] = React.useState(false);
  const initialState = {
    name: "",
    description: "",
  };
  const [formData, setFormData] = React.useState(initialState);
  const handleFormChange = (event) => {
    let { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };
  const [op, setOp] = React.useState("");
  const [applyList, setApplyList] = React.useState([]);
  function changeDashboard(position, timeScale, checkBox) {
    let tmpDashboard = dashboard.map((current) => {
      if (current.Position === position) {
        return {
          ...current,
          TimeScale: timeScale,
          CheckBox: checkBox,
        };
      } else {
        return current;
      }
    });
    setDashboard(tmpDashboard);
    cookie.save("dashboard", tmpDashboard, {
      maxAge: 3600,
    });
  }
  const handleSetDataTypeSet = (data) => {
    if (address.length > 0) {
      let tmpDashboard = dashboard.map((current) => {
        return {
          ...current,
          Visible: data[Math.floor(current.Position / 2)],
        };
      });
      setDashboard(tmpDashboard);
      cookie.save("dashboard", tmpDashboard, {
        maxAge: 3600,
      });
    } else {
      alert("请选择项目！");
    }
  };
  const handleCustomize = () => {
    if (cookie.load("username")) {
      setOp("customize");
      setOpenDialog(true);
    } else {
      alert("Please sign in first.");
    }
  };
  async function customize() {
    let data = {
      Email: cookie.load("account"),
      Name: formData.name,
      Description: formData.description,
      Dashboard: dashboard,
    };
    console.log(data);
    let res = await axios.post(`${server}/customize/`, data);
    if (res.data === "定制成功") {
      alert("定制成功");
      handleCloseDialog();
    } else {
      alert("Error");
    }
  }
  const handleApply = () => {
    if (cookie.load("username")) {
      setOp("apply");
      setOpenDialog(true);
      fetch();
    } else {
      alert("Please sign in first.");
    }
  };
  async function fetch() {
    let res = await axios.post(`${server}/fetch/`, {
      Email: cookie.load("account"),
    });
    console.log(res.data);
    // let res = { data: [{ name: "template1" }, { name: "template2" }] };
    if (res.data.length > 0) {
      setApplyList(res.data);
    }
  }
  const apply = (i) => () => {
    //alert(applyList[i].Name);
    setDashboard(applyList[i].Dashboard);
    cookie.save("dashboard", applyList[i].Dashboard, {
      maxAge: 3600,
    });
    handleCloseDialog();
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData(initialState);
    setOp("");
  };
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <ListBox showFunc={setAddress} para={address} />
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <Card className={classes.infoCard}>
            <Typography variant="h5" gutterBottom>
              项目基本信息
            </Typography>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <CheckBoxSet
            check={dashboard
              .filter((current, i) => i % 2 === 0)
              .map((current) => current.Visible)}
            setFunc={handleSetDataTypeSet}
          />
        </GridItem>
        {address.length > 0 &&
          dashboard.map(
            (current, index) =>
              current.Visible && (
                <div key={index}>
                  {current.Position % 2 === 0 && (
                    <div onClick={changeDashboard}>1</div>
                    //<Cardtext datatype={current.DataType} address={address} />
                  )}
                  
                    <Cardshow
                      position={current.Position}
                      datatype={current.DataType}
                      charttype={current.ChartType}
                      timescale={current.TimeScale}
                      checkbox={current.CheckBox}
                      func={changeDashboard}
                      address={address}
                    />
                 
                </div>
              )
          )}
        {address[0] && (
          <GridItem xs={12} sm={12} md={12}>
            <Cardshow
              datatype="commit"
              charttype="barchart"
              address={address[0]}
            />
          </GridItem>
        )}
      </GridContainer>
      <div className={classes.fabSet}>
        <Fab
          variant="extended"
          color="secondary"
          onClick={handleApply}
          className={classes.fab}
        >
          Apply
        </Fab>
        <Fab
          variant="extended"
          color="secondary"
          onClick={handleCustomize}
          className={classes.fab}
        >
          Customize
        </Fab>
      </div>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="form-dialog-title"
      >
        {op === "customize" && (
          <div>
            <DialogTitle id="form-dialog-title" className={classes.form_head}>
              <Typography component="h1" variant="h5">
                Customize
              </Typography>
            </DialogTitle>
            <DialogContent className={classes.form_content}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="name"
                label="Name"
                name="name"
                autoComplete="name"
                value={formData.name}
                onChange={handleFormChange}
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="description"
                label="Description"
                name="description"
                autoComplete="description"
                value={formData.description}
                onChange={handleFormChange}
              />
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                className={classes.form_button}
                onClick={handleCloseDialog}
              >
                Cancel
              </Button>
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                className={classes.form_button}
                onClick={customize}
              >
                OK
              </Button>
            </DialogContent>
          </div>
        )}
        {op === "apply" && (
          <div>
            <DialogTitle id="form-dialog-title" className={classes.form_head}>
              <Typography component="h1" variant="h5">
                Apply
              </Typography>
            </DialogTitle>
            <DialogContent className={classes.form_content}>
              <List className={classes.form_list} subheader={<li />}>
                <ListSubheader className={classes.form_listHead}>
                  Names of Templates
                </ListSubheader>
                {applyList.map((current, index) => (
                  <ListItem button onClick={apply(index)} key={index}>
                    <ListItemText primary={current.Name} />
                  </ListItem>
                ))}
              </List>
            </DialogContent>
          </div>
        )}
      </Dialog>
    </div>
  );
}
