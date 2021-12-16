import React from "react";
import cookie from "react-cookies";
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Poppers from "@material-ui/core/Popper";
// @material-ui/icons
import Person from "@material-ui/icons/Person";
// core components
import Button from "@material-ui/core/Button";

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
// const server = "http://127.0.0.1:8000";

const useStyles = makeStyles(styles);

export default function AdminNavbarLinks() {
  const classes = useStyles();
  const [op, setOp] = React.useState("login");
  const [account, setAccount] = React.useState({
    email: cookie.load("username") ? cookie.load("account") : "",
    username: cookie.load("username") ? cookie.load("username") : "",
  });
  const [openProfile, setOpenProfile] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [remember, setRemember] = React.useState(cookie.load("remember"));
  const [ready, setReady] = React.useState(false);
  const initialFormState = {
    email: cookie.load("account") ? cookie.load("account") : "",
    password:
      remember && cookie.load("password") ? cookie.load("password") : "",
    username: "",
    email_check: "",
    password_check: "",
    username_check: "",
    oldpassword: "",
    newpassword: "",
    newpassword_check: "",
    checksum: "",
    checksum_check: "",
  };
  const [formData, setFormData] = React.useState(initialFormState);
  const handleClickProfile = (event) => {
    if (openProfile && openProfile.contains(event.target)) {
      setOpenProfile(false);
    } else {
      setOpenProfile(event.currentTarget);
    }
  };
  const handleCloseProfile = () => {
    setOpenProfile(false);
  };
  const handleLogin = () => {
    handleCloseProfile();
    handleClickDialog();
  };
  const handleLogout = () => {
    handleCloseProfile();
    setAccount({ email: "", username: "" });
    cookie.remove("username");
  };
  const handleClickDialog = () => {
    setOp("login");
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData(initialFormState);
  };
  const handleInputChange = (event) => {
    let { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmitLogin = () => {
    let ec = "";
    let pc = "";
    if (formData.email === "") {
      ec = "Email address cannot be Empty!";
    } else if (
      !/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(
        formData.email
      )
    ) {
      ec = "Email address cannot be Wrong!";
    }
    if (formData.password === "") {
      pc = "Password cannot be Empty!";
    }
    setFormData({ ...formData, email_check: ec, password_check: pc });
    //初步验证完成，连接后端，尝试登录
    if (ec === "" && pc === "") {
      login();
    }
  };
  async function login() {
    let ec = "";
    let pc = "";
    let data = {
      Password: formData.password,
      Email: formData.email,
    };
    let res = await axios.post(`${server}/login/`, data);
    if (res.data === "密码正确") {
      let name = await axios.post(`${server}/getusername/`, data);
      setAccount({ email: formData.email, username: name.data });
      handleCloseDialog();
      cookie.save("account", formData.email);
      cookie.save("username", name.data);
      if (remember) {
        cookie.save("password", formData.password);
      } else {
        cookie.remove("password");
      }
    } else {
      if (res.data === "密码错误") {
        pc = "Password is incorrect.";
      } else {
        ec = "This email address has not been registered.";
      }
      setFormData({
        ...formData,
        email_check: ec,
        password_check: pc,
      });
    }
  }
  const handleSubmitRegister = () => {
    let ec = "Correct.";
    let uc = "Correct.";
    let pc = "Correct.";
    if (formData.email === "") {
      ec = "Email address cannot be Empty!";
    } else if (
      !/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(
        formData.email
      )
    ) {
      ec = "Email address cannot be Wrong!";
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
    let ec = "";
    let data = {
      Name: formData.username,
      Password: formData.password,
      Email: formData.email,
    };
    console.log(data);
    let res = await axios.post(`${server}/register/`, data);
    if (res.data === "注册成功！") {
      alert("Account registered successfully! Please sign in.");
      handleToLogin();
    } else {
      ec = "This email address has been registered.";
      setFormData({
        ...formData,
        email_check: ec,
      });
    }
  }
  const handleSubmitChangePassword = () => {
    let ec = "";
    let pc = "";
    let npc = "";
    if (formData.email === "") {
      ec = "Email address cannot be Empty!";
    } else if (
      !/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(
        formData.email
      )
    ) {
      ec = "Email address cannot be Wrong!";
    }
    if (formData.oldpassword === "") {
      pc = "Old password cannot be Empty!";
    }
    if (formData.newpassword === "") {
      npc = "New password cannot be Empty!";
    } else if (
      !/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/.test(formData.newpassword)
    ) {
      npc =
        "The format is incorrect! Password should consist of 6-20 characters, must contain both numbers and letters, and cannot contain other characters.";
    }
    setFormData({
      ...formData,
      email_check: ec,
      password_check: pc,
      newpassword_check: npc,
    });
    //初步验证完成，连接后端，尝试修改密码
    if (ec === "" && pc === "" && npc === "") {
      change();
    }
  };
  async function change() {
    let ec = "";
    let pc = "";
    let data = {
      Email: formData.email,
      Password: formData.oldpassword,
      Newpassword: formData.newpassword,
    };
    console.log(data);
    // let res = { data: "修改成功" };
    let res = await axios.post(`${server}/modifypassword/`, data);
    if (res.data === "修改成功") {
      handleToLogin();
      setFormData({ ...formData, password: "" });
      setAccount({ ...account, email: "", username: "" });
      cookie.remove("username");
      if (cookie.load("password")) {
        cookie.remove("password");
      }
      alert("Password modified successfully! Please sign in.");
    } else {
      if (res.data === "密码错误") {
        pc = "Password is incorrect.";
      } else {
        ec = "This email address has not been registered.";
      }
      setFormData({
        ...formData,
        email_check: ec,
        password_check: pc,
        newpassword_check: "",
      });
    }
  }
  const handleSubmitSendEmail = () => {
    //alert("email");
    if (formData.email === "") {
      setFormData({
        ...formData,
        email_check: "Email address cannot be Empty.",
      });
    } else if (
      !/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(
        formData.email
      )
    ) {
      setFormData({
        ...formData,
        email_check: "Email address cannot be Wrong.",
      });
    } else {
      sendemail();
    }
  };
  async function sendemail() {
    // let res = { data: "邮箱已注册" };
    let res = await axios.post(`${server}/find_pwd/`, {
      Email: formData.email,
    });
    if (res.data === "邮箱未注册") {
      setFormData({
        ...formData,
        email_check: "This email address has not been registered.",
      });
    } else {
      setReady(true);
      setFormData({ ...formData, email_check: "" });
      alert("Email has been sent.");
    }
  }
  const handleSubmitSetPassword = () => {
    if (ready) {
      let ec = "";
      let cc = "";
      let npc = "";
      if (formData.email === "") {
        ec = "Email address cannot be Empty.";
      } else if (
        !/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(
          formData.email
        )
      ) {
        ec = "Email address cannot be Wrong.";
      }
      if (formData.checksum === "") {
        cc = "Please enter the verification code.";
      }
      if (formData.newpassword === "") {
        npc = "New password cannot be Empty.";
      } else if (
        !/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/.test(
          formData.newpassword
        )
      ) {
        npc =
          "The format is incorrect! Password should consist of 6-20 characters, must contain both numbers and letters, and cannot contain other characters.";
      }
      setFormData({
        ...formData,
        email_check: ec,
        checksum_check: cc,
        newpassword_check: npc,
      });
      if (ec === "" && cc === "" && npc === "") {
        setpassword();
      }
    } else {
      alert("Please send the verification code to email first.");
    }
  };
  async function setpassword() {
    let ec = "";
    let cc = "";
    let data = {
      Email: formData.email,
      Checksum: formData.checksum,
      Newpassword: formData.newpassword,
    };
    console.log(data);
    // let res = { data: "设置成功" };
    let res = await axios.post(`${server}/verify_code/`, data);
    if (res.data === "设置成功") {
      handleToLogin();
      setFormData({ ...formData, email: "", password: "" });
      alert("New password set successfully! Please sign in.");
    } else {
      if (res.data === "邮箱未注册") {
        ec = "This email address has not been registered.";
      } else if (res.data === "邮箱无验证码") {
        ec =
          "This email address has no verification code for password setting.";
      } else {
        cc = "Verification is incorrect.";
      }
      setFormData({ ...formData, email_check: ec, checksum_check: cc });
    }
  }
  const handleToLogin = () => {
    setFormData(initialFormState);
    setOp("login");
  };
  const handleToRegister = () => {
    setFormData(initialFormState);
    setFormData({ ...formData, email: "", password: "" });
    setOp("register");
  };
  const handleToForgetPassword = () => {
    setFormData(initialFormState);
    setOp("forgetpassword");
  };
  const handleToChangePassword = () => {
    setFormData(initialFormState);
    setOp("changepassword");
    setOpenDialog(true);
  };
  const handleRemember = (e) => {
    let tmp = e.target.checked;
    setRemember(tmp);
    cookie.save("remember", tmp);
    if (!tmp && cookie.load("password")) {
      cookie.remove("password");
    }
  };
  return (
    <div className={classes.navbar}>
      <div className={classes.manager}>
        <Button
          color="transparent"
          justIcon="true"
          simple="false"
          aria-owns={openProfile ? "profile-menu-list-grow" : null}
          aria-haspopup="true"
          onClick={handleClickProfile}
        >
          <Person className={classes.icons} />
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
                  {account.email === "" ? (
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
                        onClick={handleToChangePassword}
                        className={classes.dropdownItem}
                      >
                        修改密码
                      </MenuItem>
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
        {op === "login" && (
          <form className={classes.form} noValidate>
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
                control={
                  <Checkbox
                    name="remember"
                    color="default"
                    checked={remember}
                    onChange={handleRemember}
                  />
                }
                label="Remember me"
              />
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                className={classes.submit}
                onClick={handleSubmitLogin}
              >
                Sign in
              </Button>
              <Grid container className={classes.form_option}>
                <Grid item xs>
                  <Link onClick={handleToForgetPassword} variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link onClick={handleToRegister} variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </DialogContent>
          </form>
        )}
        {op === "register" && (
          <form className={classes.form} noValidate>
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
                color="secondary"
                className={classes.submit}
                onClick={handleSubmitRegister}
              >
                Sign Up
              </Button>
              <Grid container className={classes.form_option}>
                <Grid item>
                  <Link onClick={handleToLogin} variant="body2">
                    Already have an account? Sign In
                  </Link>
                </Grid>
              </Grid>
            </DialogContent>
          </form>
        )}
        {op === "changepassword" && (
          <form className={classes.form} noValidate>
            <DialogTitle id="form-dialog-title" className={classes.form_head}>
              <Typography component="h1" variant="h5">
                修改密码
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
                label="邮箱"
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
                id="oldpassword"
                label="旧密码"
                type="password"
                name="oldpassword"
                autoComplete="oldpassword"
                value={formData.oldpassword}
                helperText={formData.password_check}
                onChange={handleInputChange}
              />
              <TextField
                error={formData.newpassword_check !== ""}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="newpassword"
                label="新密码"
                type="password"
                id="newpassword"
                autoComplete="newpassword"
                value={formData.newpassword}
                helperText={formData.newpassword_check}
                onChange={handleInputChange}
              />
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                className={classes.form_button}
                onClick={handleSubmitChangePassword}
              >
                确定
              </Button>
              <Grid container className={classes.form_option} />
            </DialogContent>
          </form>
        )}
        {op === "forgetpassword" && (
          <form className={classes.form} noValidate>
            <DialogTitle id="form-dialog-title" className={classes.form_head}>
              <Typography component="h1" variant="h5">
                找回密码
              </Typography>
            </DialogTitle>
            <DialogContent className={classes.form_content}>
              <div className={classes.form_email}>
                <TextField
                  error={formData.email_check !== ""}
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="邮箱"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={formData.email}
                  helperText={formData.email_check}
                  className={classes.form_email_input}
                  onChange={handleInputChange}
                />
                <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  className={classes.form_email_button}
                  onClick={handleSubmitSendEmail}
                >
                  发送验证码
                </Button>
              </div>
              <TextField
                error={formData.checksum_check !== ""}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="checksum"
                label="验证码"
                id="checksum"
                autoComplete="checksum"
                value={formData.checksum}
                helperText={formData.checksum_check}
                onChange={handleInputChange}
              />
              <TextField
                error={formData.newpassword_check !== ""}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="newpassword"
                label="密码"
                type="password"
                id="newpassword"
                autoComplete="newassword"
                value={formData.newpassword}
                helperText={formData.newpassword_check}
                onChange={handleInputChange}
              />
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                className={classes.form_button}
                onClick={handleSubmitSetPassword}
              >
                确定
              </Button>
              <Grid container className={classes.form_option}>
                <Grid item xs>
                  <Link onClick={handleToLogin} variant="body2">
                    登录
                  </Link>
                </Grid>
                <Grid item>
                  <Link onClick={handleToRegister} variant="body2">
                    注册账号
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
