import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styles from "assets/jss/material-dashboard-react/components/cardTextStyle.js";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import { Card } from "@material-ui/core";
import CardBody from "./CardBody";
import Typography from "@material-ui/core/Typography";
import Divider from "@mui/material/Divider";

axios.defaults.withCredentials = true;
axios.defaults.headers.post["Content-Type"] = "application/json";
const server = "https://yunding.zjuers.com:8000";
//const server = "http://127.0.0.1:8000";

const useStyles = makeStyles(styles);
//commit——add, change, deletion,commit
//issue——open, closed
//pullrequest——open, closed, merged
//contributor只有总数

//数据格式
// const d = {
//   first: {
//     total: [
//       { name: "open", value: 10 },
//       { name: "closed", value: 10 },
//       { name: "merged", value: 10 },
//       { name: "add", value: 10 },
//     ],
//     participate: 10,
//     repoName: "adamwiggins/merb-on-heroku",
//   },
//   second: {
//     //注意如果是commit的话这边会给四个
//     total: [
//       { name: "open", value: 10 },
//       { name: "closed", value: 10 },
//       { name: "merged", value: 10 },
//       { name: "add", value: 10 },
//     ],
//     participate: 10,
//     repoName: "huzhifeng/py12306",
//   },
// };

export default function Cardtext(props) {
  const classes = useStyles();
  const datatype = props.datatype;
  const address = props.address;
  const [res, setTextdata] = useState({});
  const [loading, setloading] = useState(true);

  useEffect(() => {
    setloading(true);
    upload();
  }, [address]);

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
  if (res.second !== undefined && res.second.repoName === undefined) {
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
            </div>
          )}
        </CardBody>
      </Card>
    );
  } else if (res.second !== undefined) {
    return (
      <Card className={classes.root}>
        <CardBody className={classes.body}>
          <Typography variant="h6" gutterBottom className={classes.head}>
            {datatype}
          </Typography>
          {loading ? (
            <CircularProgress className={classes.itemProgress} />
          ) : (
            <>
              <div className={classes.repos}>
                <div className={classes.reponame}>
                  <Typography variant="string" align="center">
                    {res.first.repoName.slice(
                      0,
                      res.first.repoName.indexOf("/")
                    )}
                  </Typography>
                  <Typography variant="string" align="center">
                    {res.first.repoName.slice(
                      res.first.repoName.indexOf("/") + 1
                    )}
                  </Typography>
                </div>
                <div className={classes.doublecontent}>
                  {res.first.total.map((current, index) => {
                    return (
                      <div
                        className={classes["text" + res.first.total.length]}
                        key={index}
                      >
                        <Typography
                          variant="h5"
                          className={classes["number" + index]}
                        >
                          {current.value}
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          className={classes.item}
                        >
                          {current.name}
                        </Typography>
                      </div>
                    );
                  })}
                  <div className={classes["text" + res.first.total.length]}>
                    <Typography variant="h5" className={classes["number"]}>
                      {res.first.participate}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      className={classes.item}
                    >
                      Participant
                    </Typography>
                  </div>
                </div>
              </div>
              <Divider textAlign="right" className={classes.divider} />
              {/* {res.second.repoName}
              </Divider> */}
              <div className={classes.repos}>
                <div className={classes.reponame}>
                  <Typography variant="string" align="center">
                    {res.second.repoName.slice(
                      0,
                      res.second.repoName.indexOf("/")
                    )}
                  </Typography>
                  <Typography variant="string" align="center">
                    {res.second.repoName.slice(
                      res.second.repoName.indexOf("/") + 1
                    )}
                  </Typography>
                </div>
                <div className={classes.doublecontent}>
                  {res.second.total.map((current, index) => {
                    return (
                      <div
                        className={classes["text" + res.first.total.length]}
                        key={index}
                      >
                        <Typography
                          variant="h5"
                          className={classes["number" + index]}
                        >
                          {current.value}
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          className={classes.item}
                        >
                          {current.name}
                        </Typography>
                      </div>
                    );
                  })}

                  <div className={classes["text" + res.first.total.length]}>
                    <Typography variant="h5" className={classes["number"]}>
                      {res.second.participate}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      className={classes.item}
                    >
                      Participant
                    </Typography>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardBody>
      </Card>
    );
  } else {
    return <div>nothing</div>;
  }
}

Cardtext.propTypes = {
  datatype: PropTypes.oneOf(["pullrequest", "issue", "commit", "contributor"]),
  address: PropTypes.string,
};
