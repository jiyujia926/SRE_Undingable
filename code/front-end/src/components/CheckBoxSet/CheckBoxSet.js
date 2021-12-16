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
  const { setFunc } = props;
  const [dataTypes, setDataTypes] = React.useState({
    Commit: true,
    Issue: true,
    "Pull/Request": false,
    Contributor: false,
  });
  const types = Object.keys(dataTypes);
  const handleChange = (event) => {
    setDataTypes({ ...dataTypes, [event.target.name]: event.target.checked });
  };
  const handleClick = () => {
    setFunc(dataTypes);
  };
  return (
    <Card className={classes.root}>
      <FormGroup row>
        {types.map((type, i) => (
          <FormControlLabel
            control={
              <Checkbox
                name={type}
                checked={dataTypes[type]}
                onChange={handleChange}
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
        onClick={handleClick}
        color="primary"
        className={classes.button}
      >
        Show
      </Button>
    </Card>
  );
}
CheckBoxSet.propTypes = {
  setFunc: PropTypes.func,
};
