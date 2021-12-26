import React, { useState } from "react";
import userGuidance from "assets/jss/userGuidance";
// import PropTypes from "prop-types";
import GridItem from "components/Grid/GridItem";
import Card from "components/Card/Card";
import CardHeader from "components/Card/CardHeader";
import CardBody from "components/Card/CardBody";
import { Button } from "@material-ui/core";
import CardFooter from "components/Card/CardFooter";
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
          <CardHeader color="info">
            <h4 className={classes.cardCategoryWhite}>用户指南</h4>
          </CardHeader>
          <CardBody profile>
            <h4>{userGuidance.Chinese.welcome}</h4>
            <h4>
              <strong>功能概览</strong>
            </h4>
            <h4>{userGuidance.Chinese.basic}</h4>
            <h4>
              <strong>如何注册或登录云钉</strong>
            </h4>
            <h4>{userGuidance.Chinese.login}</h4>
            <h4>
              <strong>如何导入仓库</strong>
            </h4>
            <h4>{userGuidance.Chinese.import}</h4>
            <h4>
              <strong>如何显示图片</strong>
            </h4>
            <h4>{userGuidance.Chinese.show}</h4>
            <h4>
              <strong>如何定制仪表盘</strong>
            </h4>
            <h4>{userGuidance.Chinese.dashboard}</h4>
            <h4>
              <strong>如何收藏项目</strong>
            </h4>
            <h4>{userGuidance.Chinese.favor}</h4>
          </CardBody>
          <CardFooter>
            <Button onClick={handleClick}>
              {language ? "English" : "中文"}
            </Button>
          </CardFooter>
        </Card>
      </GridItem>
    );
  } else {
    return (
      <GridItem xs={12} sm={12} md={12} className={classes.root}>
        <Card>
          <CardHeader color="info">
            <h4 className={classes.cardCategoryWhite}>User Guidance</h4>
          </CardHeader>
          <CardBody profile>
            <h4>{userGuidance.English.welcome}</h4>
            <h4>
              <strong>Function Introduction</strong>
            </h4>
            <h4>{userGuidance.English.basic}</h4>
            <h4>
              <strong>How to log or sign in Clouding</strong>
            </h4>
            <h4>{userGuidance.English.login}</h4>
            <h4>
              <strong>How to import repositories</strong>
            </h4>
            <h4>{userGuidance.English.import}</h4>
            <h4>
              <strong>How to display figures</strong>
            </h4>
            <h4>{userGuidance.English.show}</h4>
            <h4>
              <strong>How to customilize dashboard</strong>
            </h4>
            <h4>{userGuidance.English.dashboard}</h4>
            <h4>
              <strong>How to favor projects</strong>
            </h4>
            <h4>{userGuidance.English.favor}</h4>
          </CardBody>
          <CardFooter>
            <Button onClick={handleClick}>
              {language ? "English" : "中文"}
            </Button>
          </CardFooter>
        </Card>
      </GridItem>
    );
  }
};

export default UserGuidance;
