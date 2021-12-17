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
axios.defaults.withCredentials = true;
axios.defaults.headers.post["Content-Type"] = "application/json";
const server = "http://122.51.228.166:8000";
// const server = "http://127.0.0.1:8000";
const useStyles = makeStyles(styles);

export default function ListBox(props) {
  const classes = useStyles();
  const { showFunc, para } = props;
  const [input, setInput] = React.useState("");
  const [openDialog, setOpenDialog] = React.useState(false);
  const initialState = {
    address: "",
    description: "",
    name: "",
    info: [],
  };
  const [formData, setFormData] = React.useState(initialState);
  const [op, setOp] = React.useState("");
  const [index, setIndex] = React.useState(-1);
  const [addressList, setAddressList] = React.useState([
    { address: "1111", checked: false, ready: true, favor: false },
  ]);
  const handleInputChange = (event) => {
    setInput(event.target.value);
  };
  const handleClickDialog = () => {
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
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
    //这里的返回有三种情况，在数据库的仓库，不在数据库的仓库，不是仓库/未开源
    if (res.data === true) {
      // if (account)
      // let info = {
      //   Account: account
      // };
      // let isfavor = await axios.post(`${server}/checkfavor/`,)
      setAddressList([
        ...addressList,
        { address: tmpInput, ready: false, checked: false, favor: true },
      ]);
      alert("数据库里有");
    } else if (res.data === "仓库不存在或未开源") {
      alert("请输入正确的开源github仓库地址");
    } else {
      alert("添加进数据库");
      setAddressList([
        ...addressList,
        { address: tmpInput, ready: false, checked: false, favor: false },
      ]);
    }
  }
  const handleSearch = () => {
    let reg = /^(?=^.{3,255}$)(http(s)?:\/\/)?(www\.)?(github.com\/)*([[a-zA-Z0-9]\/+=%&_\.~?-]*)*/; //正则表达式判断是否为github地址
    let result = reg.test(input);
    if (result) {
      if (
        addressList.some((current) => {
          return input[input.length - 1] === "/"
            ? input === current.address
            : input + "/" === current.address;
        })
      ) {
        alert("项目已在列表中。");
      } else {
        checkurl();
      }
    } else {
      alert("请输入github仓库地址。");
    }
    setInput("");
  };
  const handleToggle = (i) => () => {
    if (para.length >= 2 && !addressList[i].checked) {
      alert("You can only show 2 projects at the same time.");
    } else if (!addressList[i].ready) {
      alert("Please wait.");
    } else {
      setAddressList(
        addressList.map((current, index) => {
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
        })
      );
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
    alert(cookie.load("username"));
    if (!addressList[i].favor) {
      setOp("favor");
      setIndex(i);
      setFormData({ ...formData, address: addressList[i].address });
      handleClickDialog();
    } else {
      setAddressList(
        addressList.map((current, index) => {
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
        })
      );
    }
  };
  const handleSubmitFavor = () => {
    //alert("submit favor");
    setAddressList(
      addressList.map((current) => {
        if (index === index) {
          return {
            address: current.address,
            ready: current.ready,
            checked: current.checked,
            favor: !current.favor,
          };
        } else {
          return current;
        }
      })
    );
    setOpenDialog(false);
  };
  const handleCancel = () => {
    //alert("cancel");
    setOpenDialog(false);
  };
  const handleRemove = (i) => () => {
    setAddressList(
      addressList.filter((current, index) => {
        return index !== i;
      })
    );
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
    let res;
    let promises = addressList.map(async (current) => {
      if (current.ready) {
        return current;
      } else {
        data.Address = current.address;
        //res = await axios.post(`${server}/checkstate/`, data);
        res = { data: "爬好了" };
        if (res.data === "爬好了") {
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
    setAddressList(await Promise.all(promises));
  }
  React.useEffect(() => {
    let interval;
    let state = addressList.some((current) => {
      return current.ready === false;
    });
    //setTimer(state);
    if (state) {
      interval = setInterval(() => {
        checkState();
      }, 1000);
    } else {
      //alert("stop");
    }
    return () => clearInterval(interval);
  });
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
            <ListItemText primary={"暂无项目。"} className={classes.empty} />
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
                onClick={handleCancel}
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
    </Card>
  );
}
ListBox.propTypes = {
  showFunc: PropTypes.func,
  para: PropTypes.array,
};
