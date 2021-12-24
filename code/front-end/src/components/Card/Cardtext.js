import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styles from "assets/jss/material-dashboard-react/components/cardTextStyle.js";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import { Card } from "@material-ui/core";
import CardBody from "./CardBody";
import Typography from "@material-ui/core/Typography";

axios.defaults.withCredentials = true;
axios.defaults.headers.post["Content-Type"] = "application/json";
const server = "http://122.51.228.166:8000";
//const server = "http://127.0.0.1:8000";

const useStyles = makeStyles(styles);
//commit——add, change, deletion,commit
//issue——open, closed
//pullrequest——open, closed, merged
//contributor只有总数

// const d = {
//   first:{
//     total: [
//       { name: "open", value: 10 },
//       { name: "closed", value: 10 },
//       { name: "merged", value: 10 },
//     ],
//     participate: -1,
//     //参与人数，没有就写-1（contributor）
//   },
//   second:{注意如果是commit的话这边会给四个
//     total: [
//       { name: "commit", value: 10 },
//       { name: "addition", value: 10 },
//       { name: "changedfile", value: 10 },
//       { name: "deletion", value: 10 },
//     ],
//     participate: -1,
//     //参与人数，没有就写-1（contributor）
//   }

// };

export default function Cardtext(props) {
  const classes = useStyles();
  const datatype = props.datatype;
  const address = props.address;
  const [res, setTextdata] = useState({});
  const [loading, setloading] = useState(true);

  useEffect(() => {
    upload();
  }, []);

  async function upload() {
    let data = {
      Datatype: datatype,
      Charttype: "text",
      Address: address,
    };
    let res1 = await axios.post(`${server}/get_data/`, data);
    console.log(res1.data);
    setTextdata(res1.data);
    setloading(false);
    //空数据判断
    if (res.length === 0) {
      alert("无数据，请换数据类型！");
    }
  }

  return (
    <Card className={classes.root}>
      <CardBody className={classes.body}>
        <Typography variant="h6" gutterBottom className={classes.head}>
          {datatype}
        </Typography>
        {loading ? (
          <CircularProgress className={classes.itemProgress} />
        ) : (
          <div className={classes.content}>
            {res.first.total.map((current, index) => {
              return (
                <div className={classes.text} key={index}>
                  <Typography
                    variant="h4"
                    className={classes["number" + index]}
                  >
                    {current.value}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    className={classes.item}
                  >
                    {current.name}
                  </Typography>
                </div>
              );
            })}
            {res.first["participate"] !== -1 && (
              <div className={classes.text}>
                <Typography variant="h4" className={classes["number"]}>
                  {res.first.participate}
                </Typography>
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  className={classes.item}
                >
                  Participant
                </Typography>
              </div>
            )}
          </div>
        )}
      </CardBody>
    </Card>
  );
}

Cardtext.propTypes = {
  datatype: PropTypes.oneOf(["pullrequest", "issue", "commit", "contributor"]),
  address: PropTypes.string,
};
