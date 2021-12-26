import React from "react";
import cookie from "react-cookies";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import UserGuidance from "components/Guidance/userGuidance";
import Reward from "components/Guidance/rewards";

const styles = {
  root: {
    margin: "30px 0 0 0",
    height: "400px",
  },
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0",
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
  },
  card: {
    maxHeight: "400px",
  },
  cardBody: {
    padding: "0 0 30px 30px",
  },
};

const useStyles = makeStyles(styles);

export default function UserProfile() {
  const classes = useStyles();
  const userName = cookie.load("username");
  const email = cookie.load("account");
  const createDate = cookie.load("time");
  return (
    <div>
      <GridContainer className={classes.root}>
        <GridItem xs={12} sm={12} md={4} className={classes.card}>
          <Card>
            <CardHeader color="info">
              <h4 className={classes.cardTitleWhite}>Welcome</h4>
            </CardHeader>
            <CardBody profile className={classes.cardBody}>
              <h4 className={classes.cardCategory}>👽User Name: {userName}</h4>
              <h4 className={classes.cardTitle}>📧Email: {email}</h4>
              <h4>📅Login Date: {createDate}</h4>
            </CardBody>
          </Card>
        </GridItem>
        <Reward className={classes.card} />
        <div className={classes.root}>
          <UserGuidance />
        </div>
      </GridContainer>
    </div>
  );
}
