import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
// Import Routes all
import { authProtectedRoutes, publicRoutes } from './routes';

// Import all middleware
import Authmiddleware from './routes/route';
import withRouter from 'components/Common/withRouter';

// Import scss
import './assets/scss/theme.scss';

//redux
import { useSelector, useDispatch } from 'react-redux';
import { loginSuccess, selectOrganisation } from 'store/actions';
import {
  getCompanyAttributes,
  getCompanyAttributesSuccess,
} from 'store/actions';

import NonAuthLayout from './components/NonAuthLayout/NonAuthLayout';

//Pages
import Preloader from 'pages/Preloader/Preloader';
import Page404 from 'pages/UtilityPages/Page404/Page404';

//API's
import { reVerifyUser } from 'helpers/backend_helper';
import { Path } from 'routes/constant';

//Components
import { mainToastContainer } from 'components/Notification/ToastNotification';

const App = props => {
  const [isUserDetailsLoading, setIsUserDetailsLoading] = useState(true);
  const dispatch = useDispatch();

  const { isCompanyDetailsLoading, errorInCompany, user, toast } = useSelector(
    state => ({
      isCompanyDetailsLoading: state.Company.isLoading,
      errorInCompany: state.Company.error,
      user: state?.Login?.user,
      toast: state?.toast,
    })
  );

  useEffect(() => {
    if (sessionStorage.getItem('companyDetails')) {
      dispatch(
        getCompanyAttributesSuccess(
          JSON.parse(sessionStorage.getItem('companyDetails'))
        )
      );
    } else {
      dispatch(getCompanyAttributes());
    }
  }, []);

  useEffect(() => {
    async function reVerifyUserWithToken() {
      const authUser = localStorage.getItem('authUser');
      if (authUser) {
        try {
          const parsedAuth = JSON.parse(authUser);
          const response = await reVerifyUser(parsedAuth);
          if (response && response.statusCode === 200) {
            dispatch(
              loginSuccess({
                access_token: parsedAuth.access_token,
                id: response.data.id,
                name: response.data.name,
                organizations: [...response.data.organizations],
              })
            );
            setIsUserDetailsLoading(false);
          } else {
            throw 'Login Session Expired, Moving to Logout Page';
          }
        } catch (error) {
          setIsUserDetailsLoading(false);
          props.router.navigate(Path.LOGOUT);
        }
      } else {
        setIsUserDetailsLoading(false);
      }
    }
    reVerifyUserWithToken();
  }, []);

  useEffect(() => {
    const selectedOrgFromSession = sessionStorage.getItem(
      'selectedOrganization'
    );

    if (selectedOrgFromSession && user?.organizations) {
      const parsedSelectedOrganization = JSON.parse(selectedOrgFromSession);
      const selectedOrgDetails = user.organizations.filter(org => {
        return org.organizationId == parsedSelectedOrganization.organizationId;
      });
      if (selectedOrgDetails && selectedOrgDetails.length > 0)
        dispatch(selectOrganisation(selectedOrgDetails[0]));
    }
  }, [user]);

  // Toaster for notification
  const toaster = mainToastContainer();

  const getRoutes = () => {
    return (
      <Routes>
        {publicRoutes.map((route, idx) => (
          <Route
            path={route.path}
            element={<NonAuthLayout>{route.component}</NonAuthLayout>}
            key={idx}
            exact={true}
          />
        ))}

        {authProtectedRoutes.map((route, idx) => (
          <Route
            path={route.path}
            element={
              <Authmiddleware routePath={route.path}>
                {route.component}
              </Authmiddleware>
            }
            key={idx}
            exact={true}
          />
        ))}
      </Routes>
    );
  };
  return (
    <React.Fragment>
      {toaster}
      {isUserDetailsLoading || isCompanyDetailsLoading ? (
        <Preloader />
      ) : errorInCompany && errorInCompany.statusCode ? (
        <Page404 />
      ) : (
        getRoutes()
      )}
    </React.Fragment>
  );
};

App.propTypes = {
  layout: PropTypes.any,
};

export default withRouter(App);
