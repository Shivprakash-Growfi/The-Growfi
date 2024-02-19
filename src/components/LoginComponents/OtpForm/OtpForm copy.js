import React from 'react';

// import images
import { Col, Form, Input, Label, Row, Alert } from 'reactstrap';
import { Link } from 'react-router-dom';

// Formik validation
import * as Yup from 'yup';
import { useFormik } from 'formik';

//redux
import { useSelector, useDispatch } from 'react-redux';

const OtpForm = () => {
  //meta title
  document.title = 'OTP Verification | GrowFi';

  const { error } = useSelector(state => ({
    error: state.Login.error,
  }));

  const yupErrorMessage = Yup.number().required('Please Enter Your Valid OTP');
  // Form validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      digit1: '',
      digit2: '',
      digit3: '',
      digit4: '',
      digit5: '',
      digit6: '',
    },
    validationSchema: Yup.object({
      digit1: yupErrorMessage,
      digit2: yupErrorMessage,
      digit3: yupErrorMessage,
      digit4: yupErrorMessage,
      digit5: yupErrorMessage,
      digit6: yupErrorMessage,
    }),
    onSubmit: values => {},
  });

  const anyErrorFound = obj => {
    for (let key in obj) {
      if (obj.hasOwnProperty(key) && obj[key].length > 0) {
        return true;
      }
    }
    return false;
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
              <h4>Verify your email</h4>
              <p>
                Please enter the 6 digit code sent to{' '}
                <span className="fw-semibold">example@abc.com</span>
              </p>
              <Form
                className="form-horizontal"
                onSubmit={e => {
                  e.preventDefault();
                  validation.handleSubmit();
                  return false;
                }}
              >
                <Row>
                  <Col className="col-2">
                    <div className="mb-3">
                      <Label htmlFor="digit1-input" className="visually-hidden">
                        Dight 1
                      </Label>
                      <Input
                        type="text"
                        name="digit1"
                        className="form-control form-control-lg text-center two-step p-0"
                        maxLength="1"
                        data-value="1"
                        id="digit1-input"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.digit1 || ''}
                        invalid={
                          validation.touched.digit1 && validation.errors.digit1
                            ? true
                            : false
                        }
                      />
                    </div>
                  </Col>

                  <Col className="col-2">
                    <div className="mb-3">
                      <Label htmlFor="digit2-input" className="visually-hidden">
                        Dight 2
                      </Label>
                      <Input
                        type="text"
                        name="digit2"
                        className="form-control form-control-lg text-center two-step p-0"
                        maxLength="1"
                        data-value="2"
                        id="digit2-input"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.digit2 || ''}
                        invalid={
                          validation.touched.digit2 && validation.errors.digit2
                            ? true
                            : false
                        }
                      />
                    </div>
                  </Col>

                  <Col className="col-2">
                    <div className="mb-3">
                      <Label htmlFor="digit3-input" className="visually-hidden">
                        Dight 3
                      </Label>
                      <Input
                        type="text"
                        name="digit3"
                        className="form-control form-control-lg text-center two-step p-0"
                        maxLength="1"
                        data-value="3"
                        id="digit3-input"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.digit3 || ''}
                        invalid={
                          validation.touched.digit3 && validation.errors.digit3
                            ? true
                            : false
                        }
                      />
                    </div>
                  </Col>

                  <Col className="col-2">
                    <div className="mb-3">
                      <Label htmlFor="digit4-input" className="visually-hidden">
                        Dight 4
                      </Label>
                      <Input
                        type="text"
                        name="digit4"
                        className="form-control form-control-lg text-center two-step p-0"
                        maxLength="1"
                        data-value="4"
                        id="digit4-input"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.digit4 || ''}
                        invalid={
                          validation.touched.digit4 && validation.errors.digit4
                            ? true
                            : false
                        }
                      />
                    </div>
                  </Col>
                  <Col className="col-2">
                    <div className="mb-3">
                      <Label htmlFor="digit5-input" className="visually-hidden">
                        Dight 5
                      </Label>
                      <Input
                        type="text"
                        name="digit5"
                        className="form-control form-control-lg text-center two-step p-0"
                        maxLength="1"
                        data-value="5"
                        id="digit5-input"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.digit5 || ''}
                        invalid={
                          validation.touched.digit5 && validation.errors.digit5
                            ? true
                            : false
                        }
                      />
                    </div>
                  </Col>
                  <Col className="col-2">
                    <div className="mb-3">
                      <Label htmlFor="digit6-input" className="visually-hidden">
                        Dight 6
                      </Label>
                      <Input
                        type="text"
                        name="digit6"
                        className="form-control form-control-lg text-center two-step p-0"
                        maxLength="1"
                        data-value="4"
                        id="digit6-input"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.digit6 || ''}
                        invalid={
                          validation.touched.digit6 && validation.errors.digit6
                            ? true
                            : false
                        }
                      />
                    </div>
                  </Col>
                </Row>
                {anyErrorFound(validation.errors) ? (
                  <Alert color="danger">{'Please Enter Your Valid OTP'}</Alert>
                ) : null}
                <div className="mt-3 d-grid">
                  <button className="btn btn-primary btn-block " type="submit">
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

export default OtpForm;
