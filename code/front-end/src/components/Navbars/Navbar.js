import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Hidden from "@material-ui/core/Hidden";
// @material-ui/icons
import Menu from "@material-ui/icons/Menu";
// core components
import AdminNavbarLinks from "./AdminNavbarLinks.js";
import Button from "@material-ui/core/Button";

//hooks
import { useRouteName } from "hooks";

import styles from "assets/jss/material-dashboard-react/components/headerStyle.js";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import MenuList from "@material-ui/core/MenuList";
import MenuItem from "@material-ui/core/MenuItem";
import Poppers from "@material-ui/core/Popper";

const useStyles = makeStyles(styles);

export default function Header(props) {
  const classes = useStyles();
  const routeName = useRouteName();
  const { color, routes } = props;
  const appBarClasses = classNames({
    [" " + classes[color]]: color,
  });
  const [openMenu, setOpenMenu] = React.useState(null);
  const handleClickMenu = (event) => {
    if (openMenu && openMenu.contains(event.target)) {
      setOpenMenu(null);
    } else {
      setOpenMenu(event.currentTarget);
    }
  };
  const handleCloseMenu = () => {
    setOpenMenu(null);
  };
  return (
    <AppBar className={classes.appBar + appBarClasses}>
      <Toolbar className={classes.container}>
        <div className={classes.flex}>
          {/* Here we create navbar brand, based on route name */}
          <Button color="transparent" href="#" className={classes.title}>
            {routeName}
          </Button>
        </div>
        <AdminNavbarLinks />
        <Hidden mdUp implementation="css">
          <IconButton
            color="transparent"
            justIcon="true"
            simple="false"
            aria-owns={openMenu ? "profile-menu-list-grow" : null}
            aria-haspopup="true"
            onClick={handleClickMenu}
          >
            <Menu />
          </IconButton>
          <Poppers
            open={Boolean(openMenu)}
            anchorEl={openMenu}
            transition
            disablePortal
            placement="bottom-end"
            className={
              classNames({ [classes.popperClose]: !openMenu }) +
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
                  <ClickAwayListener onClickAway={handleCloseMenu}>
                    <MenuList role="menu">
                      {routes.map((prop, key) => {
                        return (
                          <NavLink to={prop.layout + prop.path} key={key}>
                            <MenuItem className={classes.dropdownItem}>
                              {prop.name}
                            </MenuItem>
                          </NavLink>
                        );
                      })}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Poppers>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  color: PropTypes.oneOf(["primary", "info", "success", "warning", "danger"]),
  handleDrawerToggle: PropTypes.func,
  routes: PropTypes.arrayOf(PropTypes.object),
};
