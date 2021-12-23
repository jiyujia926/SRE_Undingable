import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styles from "assets/jss/material-dashboard-react/components/cardTextStyle.js";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import { Card } from "@material-ui/core";
import CardBody from "./CardBody";

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
  const [loading, setloading] = useState(false);
  
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
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card chart>
          <CardBody>
            {loading ? (
              <CircularProgress className={classes.itemProgress} />
            ) : (
              <>
                {res.total.map((current) => {
                  return (
                    <>
                      <h3 className={classes.head}>
                        {datatype} - {current.name} {current.value}
                      </h3>
                    </>
                  );
                })}
                {res["participate"] != -1 ? (
                  <>
                    <h3 className={classes.head}>
                      {datatype} 参与人数 {res.participate}
                    </h3>
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}

Cardtext.propTypes = {
  datatype: PropTypes.oneOf(["pullrequest", "issue", "commit", "contributor"]),
  address: PropTypes.String,
};
