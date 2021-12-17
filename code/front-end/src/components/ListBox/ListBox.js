import React from "react";
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
import { Divider, InputBase, Paper } from "@material-ui/core";
import axios from "axios";
axios.defaults.withCredentials = true;
axios.defaults.headers.post["Content-Type"] = "application/json";
const server = "http://122.51.228.166:8000";
// const server = "http://127.0.0.1:8000";
const useStyles = makeStyles(styles);

export default function ListBox(props) {
  const classes = useStyles();
  const { showFunc, para } = props;
  const [input, setInput] = React.useState("");
  //const [timer, setTimer] = React.useState(false);
  //const [address, setAddress] = React.useState([]);
  const [addressList, setAddressList] = React.useState([]);
  const handleInputChange = (event) => {
    setInput(event.target.value);
  };
  async function checkurl() {
    // console.log(1);
    let data = {
      RepositoryURL: input,
    };
    // console.log(data);
    let res = await axios.post(`${server}/checkurl/`, data);
    // return res;
    // console.log(res);
    //这里的返回有三种情况，在数据库的仓库，不在数据库的仓库，不是仓库/未开源
    if (res.data === true) {
      setAddressList([
        ...addressList,
        { address: input, ready: false, checked: false },
      ]);
      alert("数据库里有");
    } else if (res.data === "仓库不存在或未开源") {
      alert("请输入正确的开源github仓库地址");
    } else {
      alert("添加进数据库");
      setAddressList([
        ...addressList,
        { address: input, ready: false, checked: false },
      ]);
    }
  }
  const handleSearch = () => {
    let reg = /^(?=^.{3,255}$)(http(s)?:\/\/)?(www\.)?(github.com\/)*([[a-zA-Z0-9]\/+=%&_\.~?-]*)*/; //正则表达式判断是否为github地址
    let result = reg.test(input);
    if (result) {
      // let res = spider();
      // 此处调用后端函数, 参数就是{Address: input}
      // （根据之前的设想，先判断仓库能不能在数据库找到，可以就返回true；
      // 不能找到就现场爬取，但要先判断是不是仓库(?)，能就返回true，同时更新数据库，没法爬返回false）
      //alert("good");
      //res = { data: true };
      checkurl();
      //console.log(address); //暂时无用应付编译器
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
    alert("favor " + i);
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
        res = await axios.post(`${server}/checkstate/`, data);
        //res = { data: "爬好" };
        if (res.data === "爬好了") {
          return {
            address: current.address,
            ready: true,
            checked: current.checked,
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
      // alert("stop");
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
                  onClick={handleToggle(i)}
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
                  onClick={handleFavor(i)}
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
    </Card>
  );
}
ListBox.propTypes = {
  showFunc: PropTypes.func,
  para: PropTypes.array,
};
