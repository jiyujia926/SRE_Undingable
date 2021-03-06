/*!

=========================================================
* Material Dashboard React - v1.10.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import FavoriteIcon from "@material-ui/icons/Favorite";
import DeveloperBoardIcon from "@material-ui/icons/DeveloperBoard";
import Person from "@material-ui/icons/Person";
// core components/views for Admin layout
import DashboardPage from "views/Dashboard/Dashboard.js";
import Favorites from "views/Favorites/Favorites.js";
import CustomizationList from "views/CustomizationList/CustomizationList.js";
import UserProfile from "views/UserProfile/UserProfile.js";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/admin",
  },
  {
    path: "/Favorites",
    name: "Favorites",
    icon: FavoriteIcon,
    component: Favorites,
    layout: "/admin",
  },
  {
    path: "/Customization",
    name: "Customization List",
    icon: DeveloperBoardIcon,
    component: CustomizationList,
    layout: "/admin",
  },
  {
    path: "/user",
    name: "User Profile",
    icon: Person,
    component: UserProfile,
    layout: "/admin",
  },
];

export default dashboardRoutes;
