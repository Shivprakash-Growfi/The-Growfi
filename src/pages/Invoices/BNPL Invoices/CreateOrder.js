import React, { useEffect, useState } from 'react';
import {
  Button,
  Input,
  Label,
  FormFeedback,
  Row,
  Col,
  Form,
  Card,
  CardBody,
} from 'reactstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';

import { invoiceNumberRegex, AMOUNT_REGEX } from 'helpers/utilities';

import { ProperMoneyFormat } from 'components/Common/ToProperCase';
import {
  createBnplInvoice,
  verifyOtpForBnpl,
  sendOtpToAllAdmins,
} from 'helpers/backend_helper';
import ApiLoader from 'components/Common/Ui/ApiLoader';

const CreateOrder = props => {
  // to transfer from one page to another
  const [createOrderPage, setCreateOrderPage] = useState(true);
  const [confirmOrderPage, setConfirmOrderPage] = useState();
  const [otpPage, setOtpPage] = useState(false);
  const [otpConfirmationPage, setOtpConfirmationPage] = useState(false);

  const [createInvoiceApiData, setCreateInvoiceApiData] = useState(); // store apidata from create invoice api
  const [otpVerifyApiData, setOtpVerifyApiData] = useState(); // store apidata from create invoice api
  const [isLoading, setIsLoading] = useState(false);

  const initialSeconds = 60;
  const [seconds, setSeconds] = useState(initialSeconds);

  // timer for resend button
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

  const inputFieldsForCreateOrderForm = [
    {
      id: 1,
      type: 'string',
      label: 'Customer MID',
      name: 'customerMid',
      placeholder: 'Enter customer mid number here',
      maxLength: '30',
    },
    ,
    {
      id: 2,
      type: 'string',
      label: 'Invoice Number',
      name: 'invoiceNumber',
      placeholder: 'Create a unique invoice number for this order',
      maxLength: '30',
    },
    {
      id: 3,
      type: 'string',
      label: 'Amount',
      name: 'amount',
      placeholder: 'Enter total amount of the order',
    },
  ];

  const inputFieldsForOtpForm = [
    {
      id: 1,
      type: 'password',
      label: 'Enter OTP',
      name: 'otp',
      placeholder: '******',
    },
  ];

  // VALIDATION FOR create invoice and otp
  const validation = useFormik({
    initialValues: {
      customerMid: '',
      invoiceNumber: '',
      amount: '',
      otp: '',
      otpCheckbox: false,
    },

    validationSchema: Yup.object({
      invoiceNumber:
        createOrderPage &&
        Yup.string()
          .required('Please enter invoice number')
          .matches(invoiceNumberRegex, 'Invalid Invoice number'),
      amount:
        createOrderPage &&
        Yup.string()
          .matches(AMOUNT_REGEX, 'Please enter valid amount')
          .max(13, 'Amount cannot exceed 13 digits')
          .required('Please enter valid amount'),
      customerMid:
        createOrderPage &&
        Yup.string().required('Please enter organization name'),
    }),

    onSubmit: values => {
      setConfirmOrderPage(true);
    },
  });

  // common button
  const commonBtn = (
    btnName,
    handleFncForBtn,
    className,
    disabled,
    type = 'button'
  ) => {
    return (
      <>
        <Button
          className={className}
          type={type}
          name={btnName}
          onClick={handleFncForBtn}
          disabled={disabled}
        >
          {btnName}
        </Button>
      </>
    );
  };

  // handle function for movement between pages
  // to go to last page --> confirmation page
  const handleOtpConfirmationPage = () => {
    if (
      validation?.values?.otp === '' ||
      validation?.values?.otpCheckbox === false
    ) {
      validation?.values?.otp === '' &&
        validation.setErrors({
          otp: 'Please enter OTP',
        });
      validation?.values?.otpCheckbox === false &&
        validation.setErrors({
          otpCheckbox: 'Please agree to the terms and conditions',
        });
    } else {
      setIsLoading(true);
      const data = {
        otp: validation?.values?.otp,
        orgId: createInvoiceApiData?.invoice?.forOrganization?.id,
        invoiceId: createInvoiceApiData?.invoiceId,
        amount: createInvoiceApiData?.invoice?.totalPrice,
        productId: createInvoiceApiData?.productId,
        isOffline: true,
      };

      verifyOtpForBnpl(data)
        .then(response => {
          if (
            response &&
            (response.statusCode === 200 || response.statusCode === 201)
          ) {
            setOtpPage(false);
            setOtpConfirmationPage(true);
            setOtpVerifyApiData(response?.data);
            setIsLoading(false);
          } else {
            validation.setErrors({
              otpPageError: `${response?.message}`,
            });
            setIsLoading(false);
          }
        })
        .catch(err => {
          if (err.response?.data?.statusCode == 400) {
            validation.setErrors({
              otpPageError: `${err.response?.data?.message}`,
            });
          } else {
            validation.setErrors({
              otpPageError:
                'Unable to verify OTP right now, Please try again later!',
            });
          }
          setIsLoading(false);
        });
    }
  };

  // to go to start page
  const handleReset = () => {
    setOtpPage(false);
    setOtpConfirmationPage(false);
    setConfirmOrderPage(false);
    setCreateOrderPage(true);
    validation.setErrors({ error: `` });
    validation.resetForm();
  };

  // to go to enter otp page
  const handleGoOtpPage = orderDetails => {
    setIsLoading(true);
    const data = {
      mid: validation?.values?.customerMid || '',
      amount: Number(validation?.values?.amount),
      invoiceId: validation?.values?.invoiceNumber || '',
      byOrgId: 1,
    };

    createBnplInvoice(data.byOrgId, data.mid, data.amount, data.invoiceId)
      .then(response => {
        if (
          response &&
          (response.statusCode === 200 || response.statusCode === 201)
        ) {
          setCreateOrderPage(false);
          setConfirmOrderPage(false);
          setOtpPage(true);
          setCreateInvoiceApiData(response?.data);
          setIsLoading(false);
        } else {
          validation.setErrors({
            createOrderPageError: `${response?.message}`,
          });
          setIsLoading(false);
        }
      })
      .catch(err => {
        if (err.response?.data?.statusCode == 400) {
          validation.setErrors({
            createOrderPageError: `${err.response?.data?.message}`,
          });
        } else {
          validation.setErrors({
            createOrderPageError:
              'Unable to create invoice right now, Please try again later!',
          });
        }
        setIsLoading(false);
      });
  };

  // re-send otp function
  const reSendOtp = () => {
    sendOtpToAllAdmins(
      createInvoiceApiData?.invoice?.forOrganization?.id,
      'BNPL_FINANCE_OTP'
    )
      .then(response => {
        if (
          response &&
          (response.statusCode === 200 || response.statusCode === 201)
        ) {
          setSeconds(initialSeconds);
          validation.setErrors({
            otpPageError: 'OTP successfully sent!',
          });
        } else {
          validation.setErrors({
            otpPageError: 'Unable to sent OTP, please try again later.',
          });
        }
      })
      .catch(err => {
        validation.setErrors({
          otpPageError: 'Unable to sent OTP, please try again later.',
        });
      });

    setTimeout(() => {
      validation.setErrors({
        otpPageError: '',
      });
    }, 5000);
  };

  // object for details of order to be displayed at last page
  const orderDetails = {
    'Customer MID': validation?.values?.customerMid || '-',
    'LOTS order ID': createInvoiceApiData?.lenderNameAsPerGST || '-',
    'GrowFi order ID': createInvoiceApiData?.invoice?.invoiceId || '-',
    'Available credit limit': otpVerifyApiData?.newLimitAvailable ? (
      <>
        <i className="bx bx-rupee" />
        {ProperMoneyFormat(otpVerifyApiData.newLimitAvailable)}
      </>
    ) : (
      '-'
    ),
  };

  // form which consists all the page
  const createOrderForm = () => {
    return (
      <Form
        onSubmit={e => {
          e.preventDefault();
          validation.handleSubmit();
          return false;
        }}
        className="p-4 bg-white w-75 border rounded"
      >
        {/* create order and confirm order page */}
        {createOrderPage && (
          <>
            <Row className="d-flex justify-content-center">
              {inputFieldsForCreateOrderForm?.map(val => {
                return (
                  <div className="mb-4 row" key={val.id}>
                    <Label
                      htmlFor="projectname"
                      className="col-form-label col-lg-2"
                    >
                      {val.label}
                    </Label>
                    <Col lg="10">
                      <Input
                        className={`form-control`}
                        name={val.name}
                        type={val.type}
                        maxLength={val.maxLength}
                        placeholder={val.placeholder}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values[val.name] || ''}
                        invalid={
                          validation.touched[val.name] &&
                          validation.errors[val.name]
                            ? true
                            : false
                        }
                        disabled={confirmOrderPage ? true : false}
                        // {...validation.getFieldProps(`${val.name}`)}
                        // invalid={
                        //   validation.touched[val.name] &&
                        //   validation.errors[val.name]
                        //     ? true
                        //     : false
                        // }
                      />

                      {validation.touched[val.name] &&
                      validation.errors[val.name] ? (
                        <FormFeedback type="invalid">
                          {validation.errors[val.name]}
                        </FormFeedback>
                      ) : null}
                    </Col>
                  </div>
                );
              })}
              {validation.errors.createOrderPageError && (
                <div className="row d-flex justify-content-center text-danger fs-5 mb-2">
                  {validation.errors.createOrderPageError}
                </div>
              )}
            </Row>
            <Row>
              <div className="text-sm-end">
                {confirmOrderPage &&
                  commonBtn(
                    'Re-enter Details',
                    handleReset,
                    'me-2 btn bg-primary',
                    false,
                    'button'
                  )}
                {confirmOrderPage &&
                  commonBtn(
                    'Confirm',
                    handleGoOtpPage,
                    'me-2 btn bg-success',
                    false,
                    'button'
                  )}
                {!confirmOrderPage &&
                  commonBtn(
                    'Proceed',
                    null,
                    'me-2 btn-success',
                    false,
                    'submit'
                  )}
              </div>
            </Row>{' '}
          </>
        )}

        {/* to enter and verify otp page  */}
        {otpPage && (
          <>
            <Row className="p-3 d-flex justify-content-center">
              <div className="mb-4 row text-wrap">
                Thank You! Customer with Organization Name: "
                {createInvoiceApiData?.invoice?.forOrganization?.nameAsPerPAN ||
                  `-`}
                ", Customer MID: "{validation?.values?.customerMid || `-`}",
                Order ID: "{createInvoiceApiData?.invoice?.invoiceId || `-`}"
                and Order Amount: "{validation?.values?.amount || `-`} Rs" has
                been sent an OTP on his/her registered mobile number XXXXXXXXXX
                for transaction generated on Date{' '}
                {moment(createInvoiceApiData?.invoice?.updatedAt).format(
                  'DD-MM-YYYY hh:mm:ss'
                )}{' '}
                . Kindly enter the OTP and click submit to proceed.
              </div>
              {inputFieldsForOtpForm?.map(val => {
                return (
                  <div className="mb-2 row" key={val.id}>
                    <Label
                      htmlFor="projectname"
                      className="col-form-label col-lg-2 fs-5"
                    >
                      {val.label}
                    </Label>
                    <Col lg="10">
                      <Input
                        className="form-control"
                        name={val.name}
                        type={val.type}
                        maxLength={val.maxLength}
                        placeholder={val.placeholder}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values[val.name] || ''}
                        invalid={
                          validation.touched[val.name] &&
                          validation.errors[val.name]
                            ? true
                            : false
                        }
                      />

                      {validation.errors.otp && (
                        <div className="row d-flex justify-content-center text-danger mb-2">
                          {validation.errors.otp}
                        </div>
                      )}
                    </Col>
                  </div>
                );
              })}
              <div className="mb-4 row">
                <Col className="">
                  <Label>
                    <Input
                      className="me-2"
                      name={'otpCheckbox'}
                      type={'checkbox'}
                      placeholder={'******'}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values['otpCheckbox'] || ''}
                      invalid={
                        validation.touched['otpCheckbox'] &&
                        validation.errors['otpCheckbox']
                          ? true
                          : false
                      }
                    />
                    By clicking you agree to the
                    <a className="text-wrap" href={null}>
                      {' '}
                      terms and conditions
                    </a>
                    {validation.errors.otpCheckbox && (
                      <div className="row d-flex justify-content-center text-danger mb-2">
                        {validation.errors.otpCheckbox}
                      </div>
                    )}
                  </Label>
                </Col>

                <Col className="text-md-end" md={4}>
                  <Button
                    // disabled={seconds <= 0 ? false : true}
                    color="link"
                    className=""
                    type="link"
                    onClick={reSendOtp}
                    disabled={seconds <= 0 ? false : true}
                  >
                    Resend OTP{' '}
                  </Button>
                  in {`${seconds} Seconds`}
                </Col>
              </div>
              {validation.errors.otpPageError && (
                <div className="row d-flex justify-content-center text-danger fs-5 mb-2">
                  {validation.errors.otpPageError}
                </div>
              )}
            </Row>
            <Row>
              <div className="text-md-end d-flex justify-content-end">
                {commonBtn('Back', handleReset, 'me-2 mb-2 btn-secondary')}
                {commonBtn(
                  'Verify',
                  handleOtpConfirmationPage,
                  'me-2 mb-2 btn-success'
                )}
              </div>
            </Row>
          </>
        )}

        {/* last page --> confirmation page */}
        {otpConfirmationPage && (
          <>
            <Row className="p-3 d-flex justify-content-center">
              <div className="mb-4 row text-wrap d-flex justify-content-center">
                Congratulations! OTP has been verified and the order has been
                confirmed.
              </div>
              <div className="table-responsive">
                <table className="table">
                  <tbody>
                    {Object.entries(orderDetails).map(([key, value]) => (
                      <tr key={key}>
                        <th scope="row">{key}</th>
                        <td className="text-end">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Row>
            <Row>
              <div className="d-flex justify-content-center">
                {commonBtn(
                  'Create New Order',
                  handleReset,
                  'btn bg-primary mb-4'
                )}
              </div>
              <div className="mb-4 row text-wrap d-flex justify-content-center">
                Please update the ordering system(POS/BDS app) with growfi order
                idea before printing invoice.
              </div>
            </Row>
          </>
        )}
      </Form>
    );
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Card className="bg-transparent">
          <CardBody className="bg-transparent d-flex justify-content-center row">
            {isLoading ? (
              <ApiLoader loadMsg={'Loading...'} />
            ) : (
              createOrderForm()
            )}
          </CardBody>
        </Card>
      </div>
    </React.Fragment>
  );
};
export default CreateOrder;
