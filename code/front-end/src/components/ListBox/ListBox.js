import React from "react";
import cookie from "react-cookies";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from "@material-ui/core/CircularProgress";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import Card from "../Card/Card";
import styles from "assets/jss/material-dashboard-react/components/listBoxStyle.js";
import { Favorite, FavoriteBorder } from "@material-ui/icons";
import {
  Dialog,
  DialogContent,
  Divider,
  InputBase,
  Paper,
} from "@material-ui/core";
import axios from "axios";
import Typography from "@material-ui/core/Typography";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CustomizedSnackbars from "../Alert/Alert";
axios.defaults.withCredentials = true;
axios.defaults.headers.post["Content-Type"] = "application/json";
const server = "https://yunding.zjuers.com:8000";
//const server = "http://127.0.0.1:8000";
const useStyles = makeStyles(styles);

export default function ListBox(props) {
  const classes = useStyles();
  const { showFunc, para } = props;
  const [input, setInput] = React.useState("");
  const [openDialog, setOpenDialog] = React.useState(false);
  const initialState = {
    address: "",
    description: "",
  };
  const [formData, setFormData] = React.useState(initialState);
  const [op, setOp] = React.useState("");
  const [index, setIndex] = React.useState(-1);
  const [addressList, setAddressList] = React.useState(
    cookie.load("addressList") ? cookie.load("addressList") : []
  );
  const [snackbar, setSnackbar] = React.useState({
    addDone: false,
    addError: false, // ("????????????????????????github????????????");
    addNoNeed: false, //("????????????????????????");
    noAccount: false, //("Please sign in first.");
    showLimit: false, //("You can only show 2 projects at the same time.");
    showWait: false, // ("Please wait.");
    favorDone: false, //("Success")
    favorNoNeed: false, // ("You have already favored.");
    rmvFavorDone: false, //("Success");
    rmvFavorNoNeed: false, //("You have already canceled.");
  });
  function closeSnackbar(name) {
    setSnackbar({ ...snackbar, [name]: false });
  }
  const handleInputChange = (event) => {
    setInput(event.target.value);
  };
  const handleClickDialog = () => {
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData(initialState);
  };
  const handleFormChange = (event) => {
    let { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };
  async function checkurl() {
    let tmpInput = input[input.length - 1] === "/" ? input : input + "/";
    let data = {
      RepositoryURL: tmpInput,
    };
    let res = await axios.post(`${server}/checkurl/`, data);
    //????????????????????????????????????????????????????????????????????????????????????????????????/?????????
    if (res.data === true) {
      let isFavored, isDone;
      let res = await axios.post(`${server}/checkstate/`, {
        Address: tmpInput,
      });
      isDone = res.data === "?????????";
      if (cookie.load("username") === undefined) {
        isFavored = false;
      } else {
        let data = {
          Email: cookie.load("account"),
          Repo: tmpInput,
        };
        let res = await axios.post(`${server}/checkfavor/`, data);
        isFavored = res.data === "?????????";
      }
      let tmpList = [
        ...addressList,
        {
          address: tmpInput,
          ready: isDone,
          checked: false,
          favor: isFavored,
        },
      ];
      setAddressList(tmpList);
      cookie.save("addressList", tmpList, {
        maxAge: 3600,
      });
      setSnackbar({ ...snackbar, addDone: true });
    } else if (res.data === "???????????????????????????") {
      setSnackbar({ ...snackbar, addError: true });
    } else {
      setSnackbar({ ...snackbar, addDone: true });
      let tmpList = [
        ...addressList,
        { address: tmpInput, ready: false, checked: false, favor: false },
      ];
      setAddressList(tmpList);
      cookie.save("addressList", tmpList, {
        maxAge: 3600,
      });
    }
  }
  const handleSearch = () => {
    let reg = /^(?=^.{3,255}$)(http(s)?:\/\/)?(www\.)?(github.com\/)([\w+=%.&_~?-]+)\/([\w+=%.&_~?-]+)(\/)?/; //??????????????????????????????github??????
    let result = reg.test(input);
    if (result) {
      if (
        addressList.some((current) => {
          return input[input.length - 1] === "/"
            ? input === current.address
            : input + "/" === current.address;
        })
      ) {
        setSnackbar({ ...snackbar, addNoNeed: true });
      } else {
        checkurl();
      }
    } else {
      setSnackbar({ ...snackbar, addError: true });
    }
    setInput("");
  };
  const handleToggle = (i) => () => {
    if (para.length >= 2 && !addressList[i].checked) {
      setSnackbar({ ...snackbar, showLimit: true });
    } else if (!addressList[i].ready) {
      setSnackbar({ ...snackbar, showWait: true });
    } else {
      let tmpList = addressList.map((current, index) => {
        if (index === i) {
          return {
            address: current.address,
            ready: current.ready,
            checked: !current.checked,
            favor: current.favor,
          };
        } else {
          return current;
        }
      });
      setAddressList(tmpList);
      cookie.save("addressList", tmpList, {
        maxAge: 3600,
      });
      if (addressList[i].checked) {
        showFunc(
          para.filter((current) => {
            return current !== addressList[i].address;
          })
        );
      } else {
        showFunc([...para, addressList[i].address]);
      }
    }
  };
  const handleFavor = (i) => () => {
    if (cookie.load("username") === undefined) {
      setSnackbar({ ...snackbar, noAccount: true });
    } else if (!addressList[i].favor) {
      setIndex(i);
      setOp("favor");
      setFormData({ ...formData, address: addressList[i].address });
      handleClickDialog();
    } else {
      handleRemoveFavor(i);
    }
  };
  async function handleSubmitFavor() {
    setOpenDialog(false);
    let data = {
      Email: cookie.load("account"),
      Repo: addressList[index].address,
      Description: formData.description,
    };
    let res = await axios.post(`${server}/addfavor/`, data);
    let tmpList = addressList.map((current, i) => {
      if (index === i) {
        return {
          address: current.address,
          ready: current.ready,
          checked: current.checked,
          favor: true,
        };
      } else {
        return current;
      }
    });
    setAddressList(tmpList);
    cookie.save("addressList", tmpList, {
      maxAge: 3600,
    });
    if (res.data === "????????????") {
      setSnackbar({ ...snackbar, favorDone: true });
    } else {
      setSnackbar({ ...snackbar, favorNoNeed: true });
    }
  }
  async function handleRemoveFavor(index) {
    let data = {
      Email: cookie.load("account"),
      Repo: addressList[index].address,
    };
    let res = await axios.post(`${server}/deletefavor/`, data);
    let tmpList = addressList.map((current, i) => {
      if (index === i) {
        return {
          address: current.address,
          ready: current.ready,
          checked: current.checked,
          favor: false,
        };
      } else {
        return current;
      }
    });
    setAddressList(tmpList);
    cookie.save("addressList", tmpList, {
      maxAge: 3600,
    });
    if (res.data === "????????????") {
      setSnackbar({ ...snackbar, rmvFavorDone: true });
    } else {
      setSnackbar({ ...snackbar, rmvFavorNoNeed: true });
    }
  }
  const handleRemove = (i) => () => {
    let tmpList = addressList.filter((current, index) => {
      return index !== i;
    });
    setAddressList(tmpList);
    cookie.save("addressList", tmpList, {
      maxAge: 3600,
    });
    showFunc(
      para.filter((current) => {
        return current !== addressList[i].address;
      })
    );
  };
  async function checkState() {
    let data = {
      Address: "",
    };
    let promises = addressList.map(async (current) => {
      if (current.ready) {
        return current;
      } else {
        data.Address = current.address;
        let res = await axios.post(`${server}/checkstate/`, data);
        if (res.data === "?????????") {
          return {
            address: current.address,
            ready: true,
            checked: current.checked,
            favor: current.favor,
          };
        } else {
          return current;
        }
      }
    });
    let tmpList = await Promise.all(promises);
    setAddressList(tmpList);
    cookie.save("addressList", tmpList, {
      maxAge: 3600,
    });
  }
  React.useEffect(() => {
    showFunc(
      addressList
        .filter((current) => {
          return current.checked;
        })
        .map((current) => {
          return current.address;
        })
    );
  }, []);
  React.useEffect(() => {
    let interval;
    let state = addressList.some((current) => {
      return current.ready === false;
    });
    //setTimer(state);
    if (state) {
      interval = setInterval(() => {
        checkState();
      }, 30000);
    }
    return () => clearInterval(interval);
  });
  React.useEffect(() => {
    setAddressList(
      cookie.load("addressList") ? cookie.load("addressList") : []
    );
  }, []);
  return (
    <Card className={classes.root}>
      <List className={classes.list}>
        <ListItem className={classes.listHead}>
          <Paper component="form" className={classes.form}>
            <InputBase
              className={classes.input}
              value={input}
              placeholder="Address of the repository"
              onChange={handleInputChange}
            />
          </Paper>
          <Divider className={classes.divider} orientation="vertical" />
          <IconButton onClick={handleSearch} aria-label="add">
            <AddCircleOutlineIcon color="primary" />
          </IconButton>
        </ListItem>
        {addressList.length !== 0 ? (
          addressList.map((value, i) => {
            return (
              <ListItem key={i} className={classes.listItem}>
                <Checkbox
                  checked={value.checked}
                  tabIndex={-1}
                  inputProps={{ "aria-labelledby": i }}
                  onChange={handleToggle(i)}
                />
                <Divider className={classes.divider} orientation="vertical" />
                <ListItemText
                  id={i}
                  primary={value.address}
                  onClick={handleToggle(i)}
                  className={classes.itemText}
                />
                <Divider className={classes.divider} orientation="vertical" />
                {value.ready ? (
                  <IconButton disabled aria-label="done">
                    <CheckCircleOutlineIcon color="primary" />
                  </IconButton>
                ) : (
                  <CircularProgress
                    color="secondary"
                    className={classes.itemProgress}
                  />
                )}
                <Divider className={classes.divider} orientation="vertical" />
                <Checkbox
                  icon={<FavoriteBorder />}
                  checkedIcon={<Favorite />}
                  checked={value.favor}
                  onChange={handleFavor(i)}
                  aria-label="favor"
                />
                <Divider className={classes.divider} orientation="vertical" />
                <IconButton onClick={handleRemove(i)} aria-label="remove">
                  <RemoveCircleOutlineIcon />
                </IconButton>
              </ListItem>
            );
          })
        ) : (
          <ListItem dense className={classes.listItem}>
            <ListItemText primary={"???????????????"} className={classes.empty} />
          </ListItem>
        )}
      </List>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="form-dialog-title"
      >
        {op === "favor" && (
          <div>
            <DialogTitle id="form-dialog-title" className={classes.form_head}>
              <Typography component="h1" variant="h5">
                Favor
              </Typography>
            </DialogTitle>
            <DialogContent className={classes.form_content}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
                id="address"
                label="Repository address"
                name="address"
                autoFocus
                autoComplete="address"
                value={formData.address}
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
                onClick={handleSubmitFavor}
              >
                OK
              </Button>
            </DialogContent>
          </div>
        )}
      </Dialog>
      <CustomizedSnackbars
        name="addDone"
        message="Project added successfully!"
        type="success"
        open={snackbar.addDone}
        close={closeSnackbar}
      />
      <CustomizedSnackbars
        name="addError"
        message="Please enter a correct address of github repository."
        type="warning"
        open={snackbar.addError}
        close={closeSnackbar}
      />
      <CustomizedSnackbars
        name="addNoNeed"
        message="This project is already in the list."
        type="info"
        open={snackbar.addNoNeed}
        close={closeSnackbar}
      />
      <CustomizedSnackbars
        name="noAccount"
        message="Please sign in first."
        type="warning"
        open={snackbar.noAccount}
        close={closeSnackbar}
      />
      <CustomizedSnackbars
        name="showLimit"
        message="You can only show 2 projects at the same time."
        type="warning"
        open={snackbar.showLimit}
        close={closeSnackbar}
      />
      <CustomizedSnackbars
        name="showWait"
        message="Please wait."
        type="info"
        open={snackbar.showWait}
        close={closeSnackbar}
      />
      <CustomizedSnackbars
        name="favorDone"
        message="Favor successfully!"
        type="success"
        open={snackbar.favorDone}
        close={closeSnackbar}
      />
      <CustomizedSnackbars
        name="favorNoNeed"
        message="You have already favored."
        type="warning"
        open={snackbar.favorNoNeed}
        close={closeSnackbar}
      />
      <CustomizedSnackbars
        name="rmvFavorDone"
        message="Remove favor successfully!"
        type="success"
        open={snackbar.rmvFavorDone}
        close={closeSnackbar}
      />
      <CustomizedSnackbars
        name="rmvFavorNoNeed"
        message="You have already canceled."
        type="warning"
        open={snackbar.rmvFavorNoNeed}
        close={closeSnackbar}
      />
    </Card>
  );
}
ListBox.propTypes = {
  showFunc: PropTypes.func,
  para: PropTypes.array,
};
