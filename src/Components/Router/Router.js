// App.js

import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  useLocation,
} from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Login from "./Login";
import Dashboard from "./DashBoard";
function PageTitleUpdater() {
  const location = useLocation();

  React.useEffect(() => {
    const path = location.pathname;
    let pageTitle = "IWAKI"; // Đặt tiêu đề mặc định

    // Cập nhật tiêu đề dựa trên URL
    if (path === "/") {
      pageTitle = "FormSelect";
    }
    // Cập nhật tiêu đề trang
    document.title = pageTitle;
  }, [location]);

  return null;
}
function Main() {
  const [lsPermissions, setLsPermissions] = useState([]);
  const [lsPermissionsType, setLsPermissionsType] = useState([]);
  const auth = sessionStorage.getItem("token");
  const userInfo = sessionStorage.getItem("userInfo");
  useEffect(() => {
    if (auth === true) {
      const userInfo = sessionStorage.getItem("userInfo");
    }
  }, [auth]);
  useEffect(() => {
    if (userInfo !== null && userInfo !== undefined) {
      setLsPermissions([userInfo.user_role_title]);
    }
  }, [userInfo]);

  return (
    <Router>
      <PageTitleUpdater />
      <Switch>
        <ProtectLoginRoute
          exact
          path="/login"
          protect={auth}
          user_info={userInfo}
        >
          <Login />
        </ProtectLoginRoute>
        <PrivateRoute component={Dashboard} path="/" />
        {/* <RouteWithoutLayout
          component={Dashboard}
          path="/"
          isPrivate={true}
          lsPermissions={lsPermissions}
          permission={["APP_USER"]}
          isLogged={auth}
        /> */}
      </Switch>
    </Router>
  );
}
const RouteWithoutLayout = (props) => {
  const {
    isLogged: isLogged,
    component: Component,
    isPrivate: isPrivate,
    lsPermissions: lsPermissions,
    permission: permission,
    path: path,
    ...rest
  } = props;
  return (
    <Route
      {...rest}
      render={() =>
        isPrivate ? (
          isLogged ? (
            lsPermissions ? (
              <Component
                islogged={isLogged}
                permission={lsPermissions}
                {...props}
              />
            ) : (
              <span></span>
            )
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: props.location },
              }}
            />
          )
        ) : (
          <Component
            isLogged={isLogged}
            permission={lsPermissions}
            {...props}
          />
        )
      }
    />
  );
};

const RouteWithLayout = (props) => {
  const {
    isLogged: isLogged,
    component: Component,
    isPrivate: isPrivate,
    lsPermissions: lsPermissions,
    permission: permission,

    path: path,
    ...rest
  } = props;

  const getRejectRoute = (type) => {
    if (type !== "404" && path !== "/") {
      type = "403";
    }
  };
  return (
    <Route
      {...rest}
      render={() =>
        isPrivate ? (
          isLogged ? (
            lsPermissions && lsPermissions.length > 0 ? (
              lsPermissions.some((r) => permission.includes(r)) ? (
                <Component {...props} />
              ) : (
                getRejectRoute(permission)
              )
            ) : (
              <span></span>
            )
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: props.location },
              }}
            />
          )
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};
const ProtectLoginRoute = ({
  protect,
  lsPermissionsType,
  lsPermissions,
  user_info,
  children,
  ...rest
}) => {
  return (
    <>
      <Route
        {...rest}
        render={() =>
          !protect ? (
            children
          ) : (
            <>
              <Redirect to="/"></Redirect>
            </>
          )
        }
      />
    </>
  );
};
export default Main;
