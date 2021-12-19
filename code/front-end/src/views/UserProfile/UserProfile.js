import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import UserGuidance from "components/Guidance/userGuidance";

const styles = {
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
  cardBody: {
    padding: "0 0 30px 30px",
  },
};

const useStyles = makeStyles(styles);

export default function UserProfile() {
  const classes = useStyles();
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={4}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Welcome</h4>
            </CardHeader>
            <CardBody profile className={classes.cardBody}>
              <h4 className={classes.cardCategory}>👽User Name: Fine</h4>
              <h4 className={classes.cardTitle}>
                📧Email: 3190103044@zju.edu.cn
              </h4>
              <h4>📅Login Date: 2021.12.10.</h4>
            </CardBody>
          </Card>
        </GridItem>
        <UserGuidance />
      </GridContainer>
    </div>
  );
}
