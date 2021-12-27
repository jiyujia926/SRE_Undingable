import React, { useState } from "react";
import userGuidance from "assets/jss/userGuidance";
// import PropTypes from "prop-types";
import GridItem from "components/Grid/GridItem";
import Card from "components/Card/Card";
import CardHeader from "components/Card/CardHeader";
import CardBody from "components/Card/CardBody";
import { Button } from "@material-ui/core";
import useStyles from "./styles";

const UserGuidance = () => {
  const classes = useStyles();
  const [language, setLanguage] = useState(false);

  const handleClick = () => {
    let curLanguage = language;
    setLanguage(!curLanguage);
    console.log("test: ", curLanguage);
  };

  if (language === true) {
    // true: chinese
    return (
      <GridItem xs={12} sm={12} md={12} className={classes.root}>
        <Card>
          <CardHeader color="info" className={classes.head}>
            <h4 className={classes.cardCategoryWhite}>用户指南</h4>
            <Button onClick={handleClick} className={classes.button}>
              {language ? "English" : "中文"}
            </Button>
          </CardHeader>
          <CardBody profile className={classes.gdBody}>
            <h4>{userGuidance.Chinese.welcome}</h4>
            <h4>
              <strong>功能概览</strong>
            </h4>
            <h5>{userGuidance.Chinese.basic}</h5>
            <h4>
              <strong>如何注册或登录云钉</strong>
            </h4>
            <h5>{userGuidance.Chinese.login}</h5>
            <h4>
              <strong>如何导入仓库</strong>
            </h4>
            <h5>{userGuidance.Chinese.import}</h5>
            <h4>
              <strong>如何显示图片</strong>
            </h4>
            <h5>{userGuidance.Chinese.show}</h5>
            <h4>
              <strong>如何定制仪表盘</strong>
            </h4>
            <h5>{userGuidance.Chinese.dashboard}</h5>
            <h4>
              <strong>如何收藏项目</strong>
            </h4>
            <h5>{userGuidance.Chinese.favor}</h5>
          </CardBody>
        </Card>
      </GridItem>
    );
  } else {
    return (
      <GridItem xs={12} sm={12} md={12} className={classes.root}>
        <Card>
          <CardHeader color="info" className={classes.head}>
            <h4 className={classes.cardCategoryWhite}>User Guidance</h4>
            <Button onClick={handleClick} className={classes.button}>
              {language ? "English" : "中文"}
            </Button>
          </CardHeader>
          <CardBody profile className={classes.gdBody}>
            <h4>{userGuidance.English.welcome}</h4>
            <h4>
              <strong>Function Introduction</strong>
            </h4>
            <h5>{userGuidance.English.basic}</h5>
            <h4>
              <strong>How to log or sign in Clouding</strong>
            </h4>
            <h5>{userGuidance.English.login}</h5>
            <h4>
              <strong>How to import repositories</strong>
            </h4>
            <h5>{userGuidance.English.import}</h5>
            <h4>
              <strong>How to display figures</strong>
            </h4>
            <h5>{userGuidance.English.show}</h5>
            <h4>
              <strong>How to customize dashboard</strong>
            </h4>
            <h5>{userGuidance.English.dashboard}</h5>
            <h4>
              <strong>How to favor projects</strong>
            </h4>
            <h5>{userGuidance.English.favor}</h5>
          </CardBody>
        </Card>
      </GridItem>
    );
  }
};

export default UserGuidance;
