import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

//redux
import { useSelector, useDispatch } from 'react-redux';

//Bootstrap
import { Form, Input, Label, FormFeedback } from 'reactstrap';

//Components
import withRouter from 'components/Common/withRouter';

// Redux Store
import { loginUser, loginUserOtp } from 'store/actions';
// Formik validation
import * as Yup from 'yup';
import { useFormik } from 'formik';

// Utilities
import { phoneRegex, emailRegex } from 'helpers/utilities';

const LoginForm = props => {
  const dispatch = useDispatch();

  //meta title
  // document.title = 'Login 2 | GrowFi - Login';

  const { loading } = useSelector(state => ({
    loading: state.Login.loading,
  }));

  // Form validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      username: '',
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .test('phoneOrEmail', 'Invalid Input', function (value) {
          if (phoneRegex.test(value)) {
            return true; // Input is a valid phone number
          } else if (emailRegex.test(value)) {
            return true; // Input is a valid email address
          }

          return false; // Input is neither a phone number nor an email address
        })
        .required('Please enter valid input'),
    }),
    onSubmit: user => {
      const userDetails = {
        ...user,
        isPhoneNumber: phoneRegex.test(user.username),
      };
      dispatch(loginUser(userDetails));
    },
  });

  return (
    <React.Fragment>
      <div>
        <div className="my-auto">
          <div>
            <h5 className="text-primary">Welcome Back !</h5>
            <p className="text-muted">Sign in to continue to GrowFi.</p>
          </div>

          <div className="mt-4">
            <Form
              className="form-horizontal"
              onSubmit={e => {
                e.preventDefault();
                validation.handleSubmit();
                return false;
              }}
            >
              <div className="mb-3">
                <Label className="form-label">Username</Label>
                <Input
                  name="username"
                  className="form-control"
                  placeholder="Enter Email or Phone Number"
                  type="text"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.username || ''}
                  invalid={
                    validation.touched.username && validation.errors.username
                      ? true
                      : false
                  }
                />
                {validation.touched.username && validation.errors.username ? (
                  <FormFeedback type="invalid">
                    {validation.errors.username}
                  </FormFeedback>
                ) : null}
              </div>

              {/* <div className="form-check">
                <Input
                  type="checkbox"
                  className="form-check-input"
                  id="auth-remember-check"
                />
                <label
                  className="form-check-label"
                  htmlFor="auth-remember-check"
                >
                  Remember me
                </label>
              </div> */}

              <div className="mt-3 d-grid">
                <button
                  disabled={loading}
                  className="btn btn-primary btn-block "
                  type="submit"
                >
                  Log In
                </button>
              </div>
            </Form>

            {/* <Form action="dashboard">
              <div className="mt-4 text-center">
                <h5 className="font-size-14 mb-3">Sign in with</h5>

                <ul className="list-inline">
                  <li className="list-inline-item">
                    <Link
                      to="#"
                      className="social-list-item bg-danger text-white border-danger"
                    >
                      <i className="mdi mdi-google"></i>
                    </Link>
                  </li>
                </ul>
              </div>
            </Form> */}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default withRouter(LoginForm);

LoginForm.propTypes = {
  history: PropTypes.object,
};
