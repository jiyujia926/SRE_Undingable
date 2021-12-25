import React from "react";
import cookie from "react-cookies";
// @material-ui/core components
//import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
//import Card from "components/Card/Card.js";

//import styles from "assets/jss/material-dashboard-react/views/iconsStyle.js";
import TablePro from "../../components/TablePro/TablePro";
import axios from "axios";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
axios.defaults.withCredentials = true;
axios.defaults.headers.post["Content-Type"] = "application/json";
const server = "http://122.51.228.166:8000";
//const server = "http://127.0.0.1:8000";

//const useStyles = makeStyles(styles);

export default function Favorites() {
  //const classes = useStyles();
  let history = useHistory();
  const col = ["ID", "Repo Name", "Repo Address", "Description"];
  const [addressList, setAddressList] = React.useState([]);
  async function view(index) {
    let tmpList = cookie.load("addressList") ? cookie.load("addressList") : [];
    let isExisted = tmpList.some((current) => {
      return current.address === addressList[index]["Repo Address"];
    });
    if (isExisted) {
      tmpList = tmpList.map((current) => {
        return {
          ...current,
          checked: current.address === addressList[index]["Repo Address"],
        };
      });
    } else {
      let res = await axios.post(`${server}/checkstate/`, {
        Address: addressList[index]["Repo Address"],
      });
      let isDone = res.data === "爬好了";
      tmpList = tmpList.map((current) => ({ ...current, checked: false }));
      tmpList = [
        ...tmpList,
        {
          address: addressList[index]["Repo Address"],
          ready: isDone,
          checked: true,
          favor: true,
        },
      ];
    }
    cookie.save("addressList", tmpList, {
      maxAge: 3600,
    });
    history.push("/admin/dashboard");
  }
  async function remove(index) {
    let data = {
      Email: cookie.load("account"),
      Repo: addressList[index]["Repo Address"],
    };
    let res = await axios.post(`${server}/deletefavor/`, data);
    let tmpList = cookie.load("addressList") ? cookie.load("addressList") : [];
    let isExisted = tmpList.some((current) => {
      return current.address === addressList[index]["Repo Address"];
    });
    if (isExisted) {
      cookie.save(
        "addressList",
        cookie.load("addressList").map((current) => {
          return {
            ...current,
            favor:
              current.address !== addressList[index]["Repo Address"]
                ? current.favor
                : false,
          };
        }),
        {
          maxAge: 3600,
        }
      );
    }
    if (res.data === "删除成功") {
      alert("Success");
    } else {
      alert("Error");
    }
  }

  React.useEffect(async () => {
    if (cookie.load("username") !== undefined) {
      let data = {
        Email: cookie.load("account"),
      };
      let res = await axios.post(`${server}/returnfavor/`, data);
      let list = res.data;
      if (list.length > 0) {
        setAddressList(
          list.map((current, index) => {
            return {
              ID: index + 1,
              "Repo Name": current.Name,
              "Repo Address": current.Url,
              Description: current.Description,
            };
          })
        );
      }
    }
  }, [remove]);
  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        {addressList !== [] && (
          <TablePro
            data={{
              columns: col,
              rows: addressList,
            }}
            buttonType="view"
            removeFunc={remove}
            jumpFunc={view}
          />
        )}
      </GridItem>
    </GridContainer>
  );
}
