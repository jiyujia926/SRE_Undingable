import React from "react";
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Hidden from "@material-ui/core/Hidden";
import Poppers from "@material-ui/core/Popper";
// @material-ui/icons
import Person from "@material-ui/icons/Person";
// core components
import Button from "components/CustomButtons/Button.js";

import styles from "assets/jss/material-dashboard-react/components/headerLinksStyle.js";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";

import axios from "axios";
axios.defaults.withCredentials = true;
axios.defaults.headers.post["Content-Type"] = "application/json";
const server = "http://122.51.228.166:8000";
//const server = "http://127.0.0.1:8000";

const useStyles = makeStyles(styles);

export default function AdminNavbarLinks() {
  const classes = useStyles();
  const [op, setOp] = React.useState("login");
  const [account, setAccount] = React.useState(null);
  const [openProfile, setOpenProfile] = React.useState(null);
  const [openDialog, setOpenDialog] = React.useState(false);
  const initialFormState = {
    email: "",
    password: "",
    username: "",
    email_check: "",
    password_check: "",
    username_check: "",
  };
  const [formData, setFormData] = React.useState(initialFormState);
  const handleClickProfile = (event) => {
    if (openProfile && openProfile.contains(event.target)) {
      setOpenProfile(null);
    } else {
      setOpenProfile(event.currentTarget);
    }
  };
  const handleCloseProfile = () => {
    setOpenProfile(null);
  };
  const handleLogin = () => {
    handleCloseProfile();
    handleClickDialog();
  };
  const handleLogout = () => {
    handleCloseProfile();
    setAccount(null);
  };
  const handleClickDialog = () => {
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setOp("login");
    setFormData(initialFormState);
  };
  const handleInputChange = (event) => {
    let { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmitLogin = () => {
    // console.log({ ...formData });
    let ec = "";
    let pc = "";
    if (formData.email === "") {
      ec = "Email cannot be Empty!";
    } else if (
      !/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(
        formData.email
      )
    ) {
      ec = "Email cannot be Wrong!";
    }
    if (formData.password === "") {
      pc = "Password cannot be Empty!";
    }
    setFormData({ ...formData, email_check: ec, password_check: pc });
    //初步验证完成，连接后端，尝试登录
    // console.log(ec);
    // console.log(pc);
    if (ec === "" && pc === "") {
      // alert("try login");
      login();
    }
  };
  async function login() {
    // alert("!");
    let data = {
      Password: formData.password,
      Email: formData.email,
    };
    // console.log(data);
    let res = await axios.post(`${server}/login/`, data);
    alert(res.data);
  }
  const handleSubmitRegister = () => {
    let ec = "Correct.";
    let uc = "Correct.";
    let pc = "Correct.";
    if (formData.email === "") {
      ec = "Email cannot be Empty!";
    } else if (
      !/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(
        formData.email
      )
    ) {
      ec = "Email cannot be Wrong!";
    }
    if (formData.username === "") {
      uc = "Username cannot be Empty!";
    }
    if (formData.password === "") {
      pc = "Password cannot be Empty! ";
    } else if (
      !/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/.test(formData.password)
    ) {
      pc = "The format is incorrect. ";
    }
    setFormData({
      ...formData,
      email_check: ec,
      password_check: pc,
      username_check: uc,
    });
    //初步验证完成，连接后端，尝试注册
    if (ec === "Correct." && pc === "Correct." && uc === "Correct.") {
      // alert("try register");
      register();
    }
  };
  async function register() {
    let data = {
      Name: formData.username,
      Password: formData.password,
      Email: formData.email,
      Github: "ababa",
    };
    console.log(data);
    let res = await axios.post(`${server}/register/`, data);
    alert(res.data);
  }
  const handleChangeOp = () => {
    setFormData(initialFormState);
    if (op === "register") {
      setOp("login");
    } else {
      setOp("register");
    }
  };
  return (
    <div className={classes.navbar}>
      <div className={classes.manager}>
        <Button
          color={window.innerWidth > 959 ? "transparent" : "white"}
          justIcon={window.innerWidth > 959}
          simple={!(window.innerWidth > 959)}
          aria-owns={openProfile ? "profile-menu-list-grow" : null}
          aria-haspopup="true"
          onClick={handleClickProfile}
          className={classes.buttonLink}
        >
          <Person className={classes.icons} />
          <Hidden mdUp implementation="css">
            <p className={classes.linkText}>Profile</p>
          </Hidden>
        </Button>
        <Poppers
          open={Boolean(openProfile)}
          anchorEl={openProfile}
          transition
          disablePortal
          className={
            classNames({ [classes.popperClose]: !openProfile }) +
            " " +
            classes.popperNav
          }
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              id="profile-menu-list-grow"
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom",
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleCloseProfile}>
                  {account == null ? (
                    <MenuList role="menu">
                      <MenuItem
                        onClick={handleLogin}
                        className={classes.dropdownItem}
                      >
                        Login
                      </MenuItem>
                    </MenuList>
                  ) : (
                    <MenuList role="menu">
                      <MenuItem
                        onClick={handleLogout}
                        className={classes.dropdownItem}
                      >
                        Logout
                      </MenuItem>
                    </MenuList>
                  )}
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Poppers>
      </div>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="form-dialog-title"
      >
        {op === "login" ? (
          <form
            className={classes.form}
            noValidate
            onSubmit={handleSubmitLogin}
          >
            <DialogTitle id="form-dialog-title" className={classes.form_head}>
              <Typography component="h1" variant="h5">
                Sign in
              </Typography>
            </DialogTitle>
            <DialogContent className={classes.form_content}>
              <TextField
                error={formData.email_check !== ""}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                helperText={formData.email_check}
                onChange={handleInputChange}
              />
              <TextField
                error={formData.password_check !== ""}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={formData.password}
                helperText={formData.password_check}
                onChange={handleInputChange}
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={handleSubmitLogin}
              >
                Sign in
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link onClick={handleChangeOp} variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </DialogContent>
          </form>
        ) : (
          <form
            className={classes.form}
            noValidate
            onSubmit={handleSubmitRegister}
          >
            <DialogTitle id="form-dialog-title" className={classes.form_head}>
              <Typography component="h1" variant="h5">
                Sign Up
              </Typography>
            </DialogTitle>
            <DialogContent className={classes.form_content}>
              <TextField
                error={
                  formData.email_check !== "" &&
                  formData.email_check !== "Correct."
                }
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                helperText={formData.email_check}
                onChange={handleInputChange}
              />
              <TextField
                error={
                  formData.username_check !== "" &&
                  formData.username_check !== "Correct."
                }
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={formData.username}
                helperText={formData.username_check}
                onChange={handleInputChange}
              />
              <TextField
                error={
                  formData.password_check !== "" &&
                  formData.password_check !== "Correct."
                }
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={formData.password}
                helperText={
                  formData.password_check === "Correct."
                    ? "Correct."
                    : formData.password_check +
                      "Password should consist of 6-20 characters, must contain both numbers and letters, and cannot contain other characters."
                }
                onChange={handleInputChange}
              />
              <Button
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={handleSubmitRegister}
              >
                Sign Up
              </Button>
              <Grid container className={classes.form_option_register}>
                <Grid item>
                  <Link onClick={handleChangeOp} variant="body2">
                    {"Already have an account? Sign In"}
                  </Link>
                </Grid>
              </Grid>
            </DialogContent>
          </form>
        )}
      </Dialog>
    </div>
  );
}
