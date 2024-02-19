import React from 'react';
import { Navigate } from 'react-router-dom';
import { Path } from './constant';

//redux
import { useSelector, useDispatch } from 'react-redux';

// layouts Format
import VerticalLayout from 'components/VerticalLayout/';
import withRouter from 'components/Common/withRouter';

// Permissions Constant
import { permissionsConstant } from 'utility/permissionsConstant';
import { object } from 'prop-types';

const getLayout = layoutType => {
  let Layout = VerticalLayout;
  return Layout;
};

const permissionsConstantStrings = permissionsConstant.map(permission => {
  if (permission.path.length > 0) {
    return permission.path;
  }
});

let permissionObj = permissionsConstant.reduce(
  (obj, item) => Object.assign(obj, { [item.path]: item.name }),
  {}
);

const checkPermissions = (selectedOrganization, path) => {
  let permissionPathRequired = '';
  for (let i = 0; i < permissionsConstantStrings.length; i++) {
    if (path.includes(permissionsConstantStrings[i])) {
      permissionPathRequired = permissionsConstantStrings[i];
      break;
    }
  }

  if (
    !permissionPathRequired.length > 0 ||
    selectedOrganization.userType === 'admin' ||
    (permissionObj[permissionPathRequired] &&
      selectedOrganization.permission.includes(
        permissionObj[permissionPathRequired]
      ))
  ) {
    return true;
  } else {
    return false;
  }
};

const Authmiddleware = props => {
  const { user, selectedOrganization, layoutType } = useSelector(state => ({
    user: state.Login.user,
    selectedOrganization: state.Login.selectedOrganization,
    layoutType: state.Layout.layoutType,
  }));

  const Layout = getLayout(layoutType);
  if (user && selectedOrganization) {
    if (checkPermissions(selectedOrganization, props.routePath)) {
      return (
        <React.Fragment>
          <Layout>{props.children}</Layout>
        </React.Fragment>
      );
    } else {
      return (
        <Navigate
          to={{
            pathname: Path.AUTH_PAGE_FORBIDDEN,
          }}
          replace
        />
      );
    }
  } else if (!user) {
    return (
      <Navigate
        state={{ from: props.router.location }}
        to={{
          pathname: Path.LOGIN,
        }}
      />
    );
  } else {
    if (props.routePath === Path.SELECT_ORGANIZATION) {
      return <React.Fragment>{props.children}</React.Fragment>;
    } else {
      return (
        <Navigate
          state={{ from: props.router.location }}
          to={{
            pathname: Path.SELECT_ORGANIZATION,
          }}
        />
      );
    }
  }
};

export default withRouter(Authmiddleware);
