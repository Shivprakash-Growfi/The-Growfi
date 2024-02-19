import React, { useState, useEffect } from 'react';
import {
  Input,
  Form,
  Label,
  FormFeedback,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
  Button,
} from 'reactstrap';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import SelectInputField from 'components/Common/SelectInputField';
import {
  sendOtpToAllAdmins,
  getLenderList,
  getProductList,
} from 'helpers/backend_helper';
import { Notification } from 'components/Notification/ToastNotification';
import moment from 'moment';
import { ToProperCase } from 'components/Common/ToProperCase';
import { otpRegex } from 'helpers/utilities';

const ReedemModal = props => {
  const {
    handleModalClose,
    handleModalConfirm,
    invoicesToBeRedeemed,
    otpMethod,
    orgId,
    callFrom,
    invoiceMethod,
  } = props;
  const initialSeconds = 60;
  const [seconds, setSeconds] = useState(initialSeconds);
  const [lenderOpt, setLenderOpt] = useState([]); // arr for lender
  const [productOpt, setProductOpt] = useState([]); // arr for product

  // send otp function
  const sendOtp = () => {
    sendOtpToAllAdmins(orgId, otpMethod)
      .then(response => {
        if (
          response &&
          (response.statusCode === 200 || response.statusCode === 201)
        ) {
          setSeconds(initialSeconds);
          Notification('OTP successfully sent.', 2);
        } else {
          Notification('Unable to sent OTP, please try again later.', 4);
        }
      })
      .catch(err => {
        Notification('Unable to sent OTP, please try again later.', 4);
      });
  };

  // validation
  const validation = useFormik({
    initialValues: {
      dueDuration: '',
      confirmStatus: false,
      lender: '',
      product: '',
      otpValue: '',
    },

    validationSchema: Yup.object({
      // dueDuration: Yup.string().required(
      //   'Please select proper finance duration'
      // ),
      lender: Yup.string().required('Please Select a Lender'),
      product: Yup.string().required('Please Select a Product'),
      otpValue: Yup.string()
        .matches(otpRegex, 'Invalid OTP format')
        .required('Please Enter OTP value'),
    }),

    onSubmit: values => {
      const challanList = invoicesToBeRedeemed.map(invoice => invoice.id);
      let lenderId = lenderOpt[validation?.values?.lender]?.id || '';
      let productId = productOpt[validation?.values?.product]?.id || '';
      handleModalConfirm(
        challanList,
        productOpt[validation.values.product]?.durationDays,
        values?.otpValue,
        lenderId,
        productId
      );
    },
  });

  // convert response to object for lender list
  const makeLenderList = a1 => {
    const convertedArray = a1.map((item, index) => {
      return {
        index: index,
        label: ToProperCase(item?.lenderName),
        value: item?.lenderName,
        // challanId: item['retailerId'],
        id: item?.lenderId,
      };
    });

    return convertedArray;
  };

  // convert reponse to object for product list
  const makeProductList = a1 => {
    const convertedArray = a1.map((item, index) => {
      return {
        index: index,
        label: item?.productIdentifier || '',
        value: item?.id,
        id: item?.id,
        tooltipData: {
          'Amount Commited by Lender': item?.amountCommitedByLender || '',
          'Daily ROI':
            (item?.dailyRateOfInterest && `${item.dailyRateOfInterest}%`) || '',
          'Finance Duration Date': item?.durationDays
            ? `${item.durationDays} days`
            : '',
          'Default Date': item?.defaultDays ? `${item.defaultDays} days` : '',

          'Penalty Rate per Day':
            (item?.penaltyRatePerDay && `${item.penaltyRatePerDay}%`) || '',
        },
        durationDays: item?.durationDays || '',
        actualData: {
          ...item,
        },
      };
    });

    return convertedArray;
  };

  //product api
  const callProductApi = async lenderId => {
    try {
      const response = await getProductList(orgId, lenderId, invoiceMethod);
      if (
        response &&
        (response.statusCode === 200 || response.statusCode === 201)
      ) {
        let convertedTable = makeProductList(response.data);
        setProductOpt(convertedTable);
      } else {
      }
    } catch (error) {}
  };

  //lender api
  const callLenderApi = async () => {
    try {
      const response = await getLenderList(orgId, invoiceMethod);
      if (
        response &&
        (response.statusCode === 200 || response.statusCode === 201)
      ) {
        let convertedTable = makeLenderList(response.data);
        setLenderOpt(convertedTable);
      } else {
        Notification('Unable to fetch lender data, please try again later.', 4);
      }
    } catch (error) {
      Notification('Unable to fetch lender data, please try again later.', 4);
    }
  };

  //call lender api
  useEffect(() => {
    callLenderApi();
  }, [callFrom, orgId]);

  // call product api
  useEffect(() => {
    callProductApi(lenderOpt[validation?.values?.lender]?.id || '');
  }, [validation?.values?.lender, callFrom, orgId]);

  // calling otp api
  useEffect(() => {
    sendOtp();
  }, [orgId, otpMethod]);

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

  return (
    <>
      <Modal isOpen={true} size="lg">
        <ModalHeader toggle={handleModalClose} tag="h4">
          Confirm Finance
        </ModalHeader>
        <Form
          onSubmit={e => {
            e.preventDefault();
            validation.handleSubmit();
            return false;
          }}
        >
          <ModalBody>
            <Row>
              <Col xs={12}>
                <Row>
                  <Col>
                    <SelectInputField
                      label={'Lender'}
                      name={'lender'}
                      optionsArr={lenderOpt}
                      validation={validation}
                    />
                  </Col>

                  <Col>
                    <SelectInputField
                      label={'Product'}
                      name={'product'}
                      optionsArr={productOpt}
                      validation={validation}
                      showInfoBtn={true}
                      disabled={validation.values.lender !== '' ? false : true}
                    />
                  </Col>
                </Row>

                <div className="mb-3">
                  <Row className="align-items-center">
                    <Col className="form-label mb-0">Enter OTP</Col>
                    <Col className="text-end">
                      <Button
                        disabled={seconds <= 0 ? false : true}
                        color="link"
                        className="pe-1"
                        onClick={sendOtp}
                      >
                        Resend OTP
                      </Button>
                      in {`${seconds} Seconds`}
                    </Col>
                  </Row>
                  <Input
                    className="form-control"
                    name="otpValue"
                    type="password"
                    placeholder={
                      'Please Enter the 6 digit OTP sent to your registered mobile number'
                    }
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.otpValue || ''}
                    invalid={
                      validation.touched.otpValue && validation.errors.otpValue
                        ? true
                        : false
                    }
                    autoComplete="off"
                  ></Input>
                  {validation.touched.otpValue && validation.errors.otpValue ? (
                    <FormFeedback type="invalid">
                      {validation.errors.otpValue}
                    </FormFeedback>
                  ) : null}
                </div>

                <div className="mb-3">
                  <Label className="form-label">Finance Duration</Label>
                  <Input
                    name="dueDuration"
                    type="string"
                    disabled={true}
                    placeholder="Total Invoices"
                    value={
                      validation.values.product !== ''
                        ? ` ${moment()
                            .add(
                              productOpt[validation.values.product]
                                ?.durationDays,
                              'days'
                            )
                            .format('D MMMM, YYYY')} or ${
                            productOpt[validation.values.product]?.durationDays
                          } days`
                        : 'Select a product to choose duration for the finance'
                    }
                  />
                </div>

                <Row>
                  <Col sm={6}>
                    <div className="mb-3">
                      <Label className="form-label">Total Invoices</Label>
                      <Input
                        name="totalInvoices"
                        type="number"
                        disabled={true}
                        placeholder="Total Invoices"
                        value={invoicesToBeRedeemed.length}
                      />
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="mb-3">
                      <Label className="form-label">Amount</Label>
                      <Input
                        name="totalAmount"
                        type="number"
                        disabled={true}
                        placeholder="Total Amount"
                        value={invoicesToBeRedeemed.reduce((prev, cur) => {
                          return (
                            prev + Number(cur.totalPrice ? cur.totalPrice : 0)
                          );
                        }, 0)}
                      />
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col sm={12}>
                <input
                  id="confirmStatus"
                  type="checkbox"
                  checked={validation.values.confirmStatus}
                  onChange={validation.handleChange}
                ></input>
                <Label for="confirmStatus" className="ms-1">
                  Are you sure you want to redeem invoices ?
                </Label>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <>
              <Button className={'btn btn-danger'} onClick={handleModalClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!validation.values.confirmStatus}
                className={'btn btn-success'}
              >
                Confirm
              </Button>
            </>
          </ModalFooter>
        </Form>
      </Modal>
    </>
  );
};

export default ReedemModal;
