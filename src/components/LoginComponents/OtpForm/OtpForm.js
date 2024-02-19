import React, { useEffect, useState } from 'react';

// import images
import { Form, Button } from 'reactstrap';
import OTPInput from 'otp-input-react';

import withRouter from 'components/Common/withRouter';

import { loginReset, loginVerifyUser, loginUser } from 'store/actions';

//redux
import { useSelector, useDispatch } from 'react-redux';

// Utilities
import { phoneRegex } from 'helpers/utilities';

const OtpForm = props => {
  document.title = 'OTP Verification | GrowFi';

  const dispatch = useDispatch();

  const initialSeconds = 60;
  const [OTP, setOTP] = useState('');
  const [seconds, setSeconds] = useState(initialSeconds);

  const { username, access_token } = useSelector(state => ({
    username: state.Login.username,
    access_token: state.Login.access_token,
  }));

  useEffect(() => {
    let myInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        clearInterval(myInterval);
      }
    }, 1000);
    return () => {
      clearInterval(myInterval);
    };
  }, [seconds]);

  const handleGoBack = () => {
    dispatch(loginReset());
  };

  const handleResendOTP = () => {
    const userDetails = {
      username,
      isPhoneNumber: phoneRegex.test(username),
    };
    setSeconds(60);
    dispatch(loginUser(userDetails));
  };

  const handleVerifyLogin = () => {
    dispatch(loginVerifyUser(OTP, access_token, props.router.navigate));
  };

  return (
    <React.Fragment>
      <div>
        <div className="my-auto">
          <div className="text-center">
            <div className="avatar-md mx-auto">
              <div className="avatar-title rounded-circle bg-light">
                <i className="bx bxs-envelope h1 mb-0 text-primary"></i>
              </div>
            </div>
            <div className="p-2 mt-4">
              <h4>Verify User</h4>
              <p className="mb-0">
                Please enter the 6 digit code sent to{' '}
                <span className="fw-semibold">{username}</span>
              </p>
              <div className="mt-1 mb-2">
                <Button onClick={handleGoBack} color="link" className="p-0">
                  Click here to go back
                </Button>
              </div>
              <Form
                className="form-horizontal"
                onSubmit={e => {
                  e.preventDefault();
                  handleVerifyLogin();
                }}
              >
                <div>
                  <OTPInput
                    value={OTP}
                    onChange={setOTP}
                    autoFocus
                    OTPLength={6}
                    otpType="number"
                    disabled={false}
                    inputClassName={
                      'form-control form-control-lg text-center two-step p-0'
                    }
                    inputStyles={{ marginRight: '10px' }}
                    style={{ justifyContent: 'center' }}
                    secure
                  />
                </div>
                <div className="mt-2 text-center">
                  <p>
                    <Button
                      disabled={seconds <= 0 ? false : true}
                      color="link"
                      className="pe-1"
                      onClick={handleResendOTP}
                    >
                      Resend OTP
                    </Button>
                    in {`${seconds} Seconds`}
                  </p>
                </div>
                {/* {anyErrorFound({}) ? (
                  <Alert color="danger">{'Please Enter Your Valid OTP'}</Alert>
                ) : null} */}
                <div className="mt-3 d-grid">
                  <button
                    className="btn btn-primary btn-block "
                    type="submit"
                    disabled={OTP.length < 6 ? true : false}
                  >
                    Log In
                  </button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default withRouter(OtpForm);
