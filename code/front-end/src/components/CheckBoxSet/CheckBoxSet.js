import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Card from "../Card/Card";
import Button from "@material-ui/core/Button";
import styles from "assets/jss/material-dashboard-react/components/checkBoxSetStyle.js";
const useStyles = makeStyles(styles);

export default function CheckBoxSet(props) {
  const classes = useStyles();
  const { check, setFunc } = props;
  const types = ["Contributor", "Commit", "Issue", "Pull/Request"];
  const handleReset = () => {
    setFunc([true, true, true, true]);
  };
  const handleClick = (i) => () => {
    let tmp = check.map((current, index) => {
      return i === index ? !current : current;
    });
    setFunc(tmp);
  };
  return (
    <Card className={classes.root}>
      <FormGroup row>
        {types.map((type, i) => (
          <FormControlLabel
            control={
              <Checkbox
                name={type}
                checked={check[i]}
                onChange={handleClick(i)}
                color="primary"
              />
            }
            key={i}
            label={type}
            className={classes.labelbox}
          />
        ))}
      </FormGroup>
      <Button
        variant="contained"
        onClick={handleReset}
        color="primary"
        className={classes.button}
      >
        Reset
      </Button>
    </Card>
  );
}
CheckBoxSet.propTypes = {
  check: PropTypes.array,
  setFunc: PropTypes.func,
};
