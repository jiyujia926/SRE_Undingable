import Card from "components/Card/Card";
import CardHeader from "components/Card/CardHeader";
import CardBody from "components/Card/CardBody";
import GridItem from "components/Grid/GridItem";
import React from "react";
import QRCODE_03 from "../../assets/img/QRCODE_03.png";
import useStyles from "./styles";

const Reward = () => {
  const classes = useStyles();
  return (
    <GridItem xs={12} sm={12} md={8}>
      <Card>
        <CardHeader color="info">
          <h4 className={classes.cardCategoryWhite}>
            创作者激励 / Creator motivation
          </h4>
        </CardHeader>
        <CardBody className={classes.body}>
          <img src={QRCODE_03} alt="打赏二维码" className={classes.image} />
          <div className={classes.text}>
            <h4>您的每一次打赏都是对我们开发团队的鼓励与支持。</h4>
            <h4>
              Each of your rewards is an encouragement and support to our
              development team.
            </h4>
            <p>
              如果您在使用期间遇到任何问题，欢迎向邮箱
              <i>3190103044@zju.edu.cn</i>发送邮件咨询。
              <br />
              If you encounter any problems during usage, please send email
              consultation to <i>3190103044@zju.edu.cn</i>
            </p>
          </div>
        </CardBody>
      </Card>
    </GridItem>
  );
};

export default Reward;
