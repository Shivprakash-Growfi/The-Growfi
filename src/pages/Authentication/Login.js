import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Path } from 'routes/constant';
import PropTypes from 'prop-types';

import { Col, Container, Row, Alert, Card, CardBody } from 'reactstrap';

import withRouter from 'components/Common/withRouter';

// import images
import profile from '../../assets/images/profile-img.png';
import logo from '../../assets/images/growfi3x.png';
import lightlogo from '../../assets/images/logo-light.svg';
import CarouselPage from '../../components/LoginComponents/CarouselPage/CarouselPage';

//import Login Components
import LoginForm from 'components/LoginComponents/LoginForm/LoginForm';
import OtpForm from 'components/LoginComponents/OtpForm/OtpForm';

//redux
import { useSelector, useDispatch } from 'react-redux';

const Login = props => {
  const navigate = useNavigate();
  //meta title
  document.title = 'Login | Welcome to GrowFi';

  const { error, otpProcess, companyDetails, user } = useSelector(state => ({
    error: state.Login.error,
    otpProcess: state.Login.otpProcess,
    user: state.Login.user,
    companyDetails: state.Company.companyDetails,
  }));

  useEffect(() => {
    if (user && user.id) {
      navigate(Path.DASHBOARD);
    }
  }, []);
  return (
    <React.Fragment>
      <div>
        <Container fluid className="p-0">
          <Row className="g-0">
            <CarouselPage imageLink={companyDetails.imageLink} />

            <Col xl={3}>
              <div className="auth-full-page-content p-md-5 p-4">
                <div className="w-100">
                  <div className="d-flex flex-column h-100">
                    <div className="mb-4 mb-md-5">
                      <Link to={Path.DASHBOARD} className="d-block auth-logo">
                        <img src={logo} alt="" height="50" />
                      </Link>
                    </div>
                    {error && <Alert color="danger">{error}</Alert>}
                    {otpProcess ? <OtpForm /> : <LoginForm> </LoginForm>}
                    <div className="mt-4 mt-md-5 text-center">
                      <p className="mb-0">
                        © {new Date().getFullYear()} Crafted with{' '}
                        <i className="mdi mdi-heart text-primary"></i> by GrowFi
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};
export default withRouter(Login);

Login.propTypes = {
  history: PropTypes.object,
};
