import React, { useState, useEffect } from 'react';

import { useFormik } from 'formik';

import { useSelector } from 'react-redux';
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from 'reactstrap';

import classnames from 'classnames';
import * as Yup from 'yup';

//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

import InputFormField from './common/InputFormField';
// Formik Validation

import {
  verifyPan,
  verifyGst,
  verifyBankDetails,
  savePanGstDetails,
} from 'helpers/backend_helper';
import AllButtons from './common/allButtons';
import ConsentModal from './common/ConsentModal';
import withRouter from 'components/Common/withRouter';
import { Path } from 'routes/constant';

import {
  ApiNotificationLoading,
  Notification,
} from 'components/Notification/ToastNotification';
import { ApiNotificationUpdate } from 'components/Notification/ToastNotification';
import FinancialData from './FinancialData';
import FounderData from './FounderData';
import KycNameUpdateModal from 'components/KycApplicationComponents/KycNameUpdateModal';
import { allDocumentsUpload } from 'components/Common/FileSizeTypeChecker';

const KycMainPage = props => {
  //meta title
  const { verificationFlag } = props;

  const { selectedOrganization } = useSelector(state => ({
    selectedOrganization: state.Login.selectedOrganization,
  }));

  const organizationType = selectedOrganization?.organizationType;
  const userTypeStatus = () => {
    switch (organizationType) {
      case 'privateLimited':
        return '1';
      case 'limited':
        return '1';
      case 'partnership':
        return '2';
      case 'llp':
        return '2';
      case 'proprietorship':
        return '0';
      default:
        return '1';
    }
  };
  const userStatus = userTypeStatus();
  const [activeTab, setactiveTab] = useState(1);

  const [passedSteps, setPassedSteps] = useState([1]);

  const [verificationStatus, setVerificationStatus] = useState({
    pan: false,
    gst: false,
    bank: false,
  });

  const [showModal, setShowModal] = useState(false);
  const [bank, setBank] = useState();
  const [holderName, setHolderName] = useState('');

  const [isShowUpdateModal, setIsShowUpdateModal] = useState(false);
  const [nameDataCheck, setNameDataCheck] = useState({
    enteredName: '',
    originalName: '',
  });
  const [nameUpdateType, setNameUpdateType] = useState('');

  // file state for pan and gst files
  const [panFile, setPanFile] = useState({
    fileLink: '',
    fileName: props?.organizationData?.pan?.fileName || '',
    selectedFile: '',
  });

  const [gstFile, setGstFile] = useState({
    fileLink: '',
    fileName: props?.organizationData?.gst?.fileName || '',
    selectedFile: '',
  });

  // gst name update

  const bankDetails = {
    account: '',
    ifsc: '',
  };

  //PAN FORM DATA
  const panInputs = [
    {
      id: 1,
      name: 'pan',
      type: 'text',
      placeholder: 'PAN number',
      label: 'PAN number',
      readOnly: false,
    },
  ];

  //GST FORM DATA
  const gstInputs = [
    {
      id: 1,
      name: 'gst',
      type: 'text',
      placeholder: 'GST number',
      label: 'GST number',
      readOnly: false,
    },
  ];

  //   BANK FORM DATA
  const bankInputs = [
    {
      id: 1,
      name: 'account',
      type: 'text',
      placeholder: 'Account number',
      label: 'Account number',
      readOnly: false,
    },
    {
      id: 2,
      name: 'ifsc',
      type: 'text',
      placeholder: 'IFSC code',
      label: 'IFSC code',
      readOnly: false,
    },
  ];

  const handleFileChange = e => {
    const selectedFile = e?.target?.files && e.target.files[0];
    if (selectedFile) {
      if (e.target.name === 'panFileUpload') {
        setPanFile(previousState => ({
          ...previousState,
          selectedFile: selectedFile,
        }));
      }
      if (e.target.name === 'gstFileUpload') {
        setGstFile(previousState => ({
          ...previousState,
          selectedFile: selectedFile,
        }));
      }
      handleFileUpload(e, selectedFile);
    } else {
      const { target = {} } = e || {};
      target.value = '';
      if (e.target.name === 'panFileUpload') {
        setPanFile(prevState => ({
          ...prevState,
          selectedFile: '',
        }));
      }
      if (e.target.name === 'gstFileUpload') {
        setGstFile(previousState => ({
          ...previousState,
          selectedFile: '',
        }));
      }
    }
  };

  const handleFileUpload = (e, selectedFile) => {
    const name = e?.target?.name;
    const docType = e?.target?.name === 'panFileUpload' ? 4 : 3; //4 means pan card and 3 means gst document
    async function fetchFileData() {
      const loadingId = ApiNotificationLoading();
      try {
        const uploadedData = await allDocumentsUpload(
          '',
          selectedFile,
          'others',
          ['image/jpeg', 'image/png', 'application/pdf'],
          '',
          2
        );
        if (uploadedData && uploadedData.statusCode == 200) {
          savePanGstDetails(
            selectedOrganization?.organizationId,
            docType,
            uploadedData?.data?.fileName,
            uploadedData?.data?.fileLink
          )
            .then(response => {
              if (
                response &&
                (response.statusCode === 200 || response.statusCode === 201)
              ) {
                if (name === 'panFileUpload') {
                  setPanFile(previousState => ({
                    ...previousState,
                    fileLink: uploadedData?.data?.fileLink,
                    fileName: uploadedData?.data?.fileName,
                  }));
                }
                if (name === 'gstFileUpload') {
                  setGstFile(previousState => ({
                    ...previousState,
                    fileLink: uploadedData?.data?.fileLink,
                    fileName: uploadedData?.data?.fileName,
                  }));
                }
                ApiNotificationUpdate(
                  loadingId,
                  `File uploaded successfully`,
                  2
                );
              } else {
                Notification('Something went wrong, please try again later', 4);
              }
            })
            .catch(error => {
              Notification('Something went wrong, please try again later', 4);
            });
        } else {
          ApiNotificationUpdate(loadingId, 'File not uploaded', 4);
        }
      } catch (error) {
        ApiNotificationUpdate(loadingId, `${error?.message}`, 4);
      }
    }
    fetchFileData();
  };

  useEffect(() => {
    const data = props?.organizationData;
    Object.keys(data).map(val => {
      if (data[val].status === 1) {
        setVerificationStatus(prev => ({ ...prev, [val]: true }));
      }
    });
  }, []);
  //   PAN FORM DATA MANAGEMENT
  const formikPan = useFormik({
    initialValues: {
      pan: props?.organizationData?.pan.panNumber
        ? props.organizationData.pan.panNumber
        : '',
    },
    validationSchema: Yup.object({
      pan: Yup.string().required('PAN is required'),
    }),
    onSubmit: (values, action) => {
      // Handle form submission
      const panFinal = values.pan.toUpperCase();
      const loadingId = ApiNotificationLoading();
      verifyPan(selectedOrganization.organizationId, panFinal)
        .then(response => {
          if (response?.statusCode === 201 || response?.statusCode === 200) {
            setVerificationStatus({ ...verificationStatus, pan: true });
            ApiNotificationUpdate(loadingId, `${response.message}`, 2);
          } else {
            formikPan.setErrors({ pan: response.message });
            ApiNotificationUpdate(loadingId, `${response.message}`, 4);
            setNameDataCheck({
              enteredName: response?.data?.enteredName
                ? response?.data?.enteredName
                : '',
              originalName: response?.data?.originalName
                ? response?.data?.originalName
                : '',
            });
            setNameUpdateType('pan');
            setIsShowUpdateModal(true);
          }
        })
        .catch(err => {
          formikPan.setErrors({ error: `${err.response?.data?.message}` });
          ApiNotificationUpdate(loadingId, `Unable to verify!`, 4);
        });
    },
  });

  //   *********************END**************************

  //   GST FORM DATA MANAGEMENT

  const formikGst = useFormik({
    initialValues: {
      gst: props?.organizationData?.gst.gstNumber
        ? props.organizationData.gst.gstNumber
        : '',
    },
    validationSchema: Yup.object({
      gst: Yup.string().required('GST is required'),
    }),
    onSubmit: (values, action) => {
      // Handle form submission
      const loadingId = ApiNotificationLoading();
      verifyGst(selectedOrganization.organizationId, values.gst)
        .then(response => {
          if (response?.statusCode === 201 || response?.statusCode === 200) {
            setVerificationStatus({ ...verificationStatus, gst: true });
            ApiNotificationUpdate(loadingId, `${response.message}`, 2);
          } else {
            formikGst.setErrors({ gst: response.message });
            ApiNotificationUpdate(loadingId, `${response.message}`, 4);
            setNameDataCheck({
              enteredName: response?.data?.enteredName
                ? response?.data?.enteredName
                : '',
              originalName: response?.data?.originalName
                ? response?.data?.originalName
                : '',
            });
            setNameUpdateType('gst');
            setIsShowUpdateModal(true);
          }
        })
        .catch(err => {
          formikGst.setErrors({ error: `${err.response?.data?.message}` });
          ApiNotificationUpdate(loadingId, `Unable to verify!`, 4);
        });
    },
  });
  //   *********************END**************************

  //Bank Verification Data Management

  const formikBank = useFormik({
    initialValues: bankDetails,
    validationSchema: Yup.object({
      ifsc: Yup.string().required('IFSC is required'),
      account: Yup.string().required('Account number is required'),
    }),
    onSubmit: values => {
      // Handle form submission
      setShowModal(true);
      setBank(values);
    },
  });

  //   *********************END**************************

  function toggleTab(tab) {
    if (activeTab === 3 && tab !== 2) {
      props.router.navigate(Path.DASHBOARD);
    }
    if (activeTab !== tab) {
      var modifiedSteps = [...passedSteps, tab];
      if (tab >= 1 && tab <= 3) {
        setactiveTab(tab);
        setPassedSteps(modifiedSteps);
      }
    }
  }

  // ******************** Handling Onclick events **********************

  //PAN and GST Name update modal handling
  const handleNameUpdateModalClose = () => {
    setIsShowUpdateModal(false);
    setNameDataCheck({
      enteredName: '',
      originalName: '',
    });
    setNameUpdateType('');
    window.location.reload();
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleModalSave = () => {
    if (!verificationStatus.bank) {
      const loadingId = ApiNotificationLoading();
      verifyBankDetails(
        selectedOrganization.organizationId,
        bank.account,
        bank.ifsc
      )
        .then(response => {
          if (
            response &&
            (response.statusCode === 201 || response.statusCode === 200)
          ) {
            setVerificationStatus({ ...verificationStatus, bank: true });
            ApiNotificationUpdate(loadingId, `${response.message}`, 2);
            setHolderName(response.beneficiary_name_with_bank);
          } else {
            formikBank.setErrors({ error: response.message });
            ApiNotificationUpdate(loadingId, `${response.message}`, 4);
          }
        })
        .catch(err => {
          formikBank.setErrors({ error: `${err.response?.data?.message}` });
          ApiNotificationUpdate(loadingId, `Unable to verify!`, 4);
        });
    } else {
      setShowModal(false);
    }
  };

  // ************************* END ******************************

  const iconNotVerified = (
    <i
      style={{ color: 'red' }}
      className="fas fa-exclamation-triangle font-size-24"
    ></i>
  );
  // fas fa-check-circle
  const iconVerified = (
    <i
      style={{ color: 'green' }}
      className="fas fa-check-circle font-size-24"
    ></i>
  );
  const navStyle = {
    display: 'flex',
    alignItems: 'center',
  };

  return (
    <React.Fragment>
      <div className="page-content p-0">
        <Container fluid={true}>
          <Breadcrumbs title="KYC" breadcrumbItem="KYC Verification" />

          <Row>
            <Col lg="12">
              {verificationFlag ? (
                <Card>
                  <CardBody className="d-flex align-items-center justify-content-between">
                    <h4 className="card-title m-0">
                      Document Verified (Company PAN ,GST, BANK A/C)
                    </h4>
                    <span>{iconVerified}</span>
                  </CardBody>
                </Card>
              ) : (
                <Card>
                  <CardBody>
                    <h4 className="card-title mb-4">Document verification</h4>
                    <div className="wizard clearfix">
                      <div className="steps clearfix">
                        <ul>
                          <NavItem
                            className={classnames({ current: activeTab === 1 })}
                          >
                            <NavLink
                              className={classnames({
                                active: activeTab === 1,
                              })}
                              onClick={() => {
                                setactiveTab(1);
                              }}
                              style={navStyle}
                            >
                              <span className="number">1.</span> PAN
                              verification
                              {verificationStatus.pan ? (
                                <span className="ms-5">{iconVerified}</span>
                              ) : (
                                <span className="ms-5">{iconNotVerified}</span>
                              )}
                            </NavLink>
                          </NavItem>
                          <NavItem
                            className={classnames({ current: activeTab === 2 })}
                          >
                            <NavLink
                              className={classnames({
                                current: activeTab === 2,
                              })}
                              onClick={() => {
                                setactiveTab(2);
                              }}
                              style={navStyle}
                              // ****************** TO DISABLE STEPS****************
                              // disabled={
                              //   !(passedSteps || []).includes(2, 3) &&
                              //   activeTab === 3
                              // }
                              //  ******************************************
                              // disabled
                              // disabled={!(passedSteps || []).includes(2)}
                            >
                              <span className="number">2.</span> GST
                              verification
                              {verificationStatus.gst ? (
                                <span className="ms-5">{iconVerified}</span>
                              ) : (
                                <span className="ms-5">{iconNotVerified}</span>
                              )}
                            </NavLink>
                          </NavItem>
                          <NavItem
                            className={classnames({ current: activeTab === 3 })}
                          >
                            <NavLink
                              className={classnames({
                                active: activeTab === 3,
                              })}
                              onClick={() => {
                                setactiveTab(3);
                              }}
                              style={navStyle}
                            >
                              <span className="number">3.</span> Bank Details
                              {verificationStatus.bank ? (
                                <span className="ms-5">{iconVerified}</span>
                              ) : (
                                <span className="ms-5">{iconNotVerified}</span>
                              )}
                            </NavLink>
                          </NavItem>
                        </ul>
                      </div>
                      <div className="content clearfix">
                        <TabContent activeTab={activeTab} className="body">
                          <TabPane tabId={1}>
                            <Form onSubmit={formikPan.handleSubmit}>
                              <Row>
                                {panInputs.map(val => (
                                  <InputFormField
                                    key={val.id}
                                    {...val}
                                    errorMessage={formikPan.errors[val.name]}
                                    value={formikPan.values[val.name]}
                                    onChange={formikPan.handleChange}
                                    onBlur={formikPan.handleBlur}
                                    touched={formikPan.touched}
                                    disabled={verificationStatus[val.name]}
                                  />
                                ))}

                                <span>
                                  {formikPan.errors.error && (
                                    <>
                                      <span className="error">
                                        {formikPan.errors.error}
                                      </span>
                                    </>
                                  )}
                                </span>

                                <InputFormField
                                  className="form-control"
                                  name="panFileUpload"
                                  type="file"
                                  onChange={e => handleFileChange(e)}
                                  style={{
                                    display: !verificationStatus?.pan && 'none',
                                  }}
                                  label={
                                    verificationStatus?.pan &&
                                    'Upload Pan Document'
                                  }
                                  fileName={panFile.fileName}
                                  showFileLinks={true}
                                />
                              </Row>

                              <Row>
                                <AllButtons
                                  verificationStatus={verificationStatus.pan}
                                  toggleTab={toggleTab}
                                  activeTab={activeTab}
                                />

                                {/* **************** For Individual Buttons **************** */}
                                {/* <Col lg="2"> */}
                                {/* <div className="d-flex flex-row-reverse">
                                {verificationStatus.pan ? (
                                  <Button
                                    type="button"
                                    onClick={() => {
                                      toggleTab(activeTab + 1);
                                    }}
                                  >
                                    Proceed
                                  </Button>
                                ) : (
                                  <>
                                    <Button className="px-3 ms-4" type="submit">
                                      Verify
                                    </Button>
                                    <Button
                                      onClick={() => {
                                        toggleTab(activeTab + 1);
                                      }}
                                      type="button"
                                    >
                                      Skip
                                    </Button>
                                  </>
                                )}
                              </div> */}
                                {/* </Col> */}
                              </Row>
                            </Form>
                          </TabPane>
                          <TabPane tabId={2}>
                            <Form onSubmit={formikGst.handleSubmit}>
                              <Row>
                                {gstInputs.map(val => (
                                  <InputFormField
                                    key={val.id}
                                    {...val}
                                    errorMessage={formikGst.errors[val.name]}
                                    value={formikGst.values[val.name]}
                                    onChange={formikGst.handleChange}
                                    onBlur={formikGst.handleBlur}
                                    disabled={verificationStatus[val.name]}
                                  />
                                ))}
                                <span>
                                  {formikGst.errors.error && (
                                    <span className="error">
                                      {formikGst.errors.error}
                                    </span>
                                  )}
                                </span>

                                <InputFormField
                                  className="form-control"
                                  name="gstFileUpload"
                                  type="file"
                                  onChange={e => handleFileChange(e)}
                                  style={{
                                    display: !verificationStatus?.gst && 'none',
                                  }}
                                  label={
                                    verificationStatus?.gst &&
                                    'Upload GST Document'
                                  }
                                  fileName={gstFile.fileName}
                                  showFileLinks={true}
                                />
                              </Row>

                              <Row>
                                <AllButtons
                                  verificationStatus={verificationStatus.gst}
                                  toggleTab={toggleTab}
                                  activeTab={activeTab}
                                />
                              </Row>
                            </Form>
                          </TabPane>
                          <TabPane tabId={3}>
                            <Form onSubmit={formikBank.handleSubmit}>
                              <Row>
                                {bankInputs.map(val => (
                                  <InputFormField
                                    key={val.id}
                                    {...val}
                                    errorMessage={formikBank.errors[val.name]}
                                    value={formikBank.values[val.name]}
                                    onChange={formikBank.handleChange}
                                    onBlur={formikBank.handleBlur}
                                    disabled={verificationStatus.bank}
                                  />
                                ))}
                              </Row>
                              <span>
                                {formikBank.errors.error && (
                                  <span className="error">
                                    {formikBank.errors.error}
                                  </span>
                                )}
                              </span>
                              <Row>
                                <AllButtons
                                  verificationStatus={verificationStatus.bank}
                                  toggleTab={toggleTab}
                                  activeTab={activeTab}
                                />
                              </Row>
                            </Form>
                          </TabPane>
                        </TabContent>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              )}
            </Col>
            {userStatus !== '0' ? (
              <>
                <FinancialData userTypeStatus={userStatus} />
                <FounderData userTypeStatus={userStatus} />
              </>
            ) : (
              <FinancialData />
            )}
          </Row>
          {showModal && (
            <ConsentModal
              showModal
              handleModalClose={handleModalClose}
              handleModalSave={handleModalSave}
              formikBank={formikBank}
              bankInputs={bankInputs}
              verificationStatus={verificationStatus.bank}
              holderName={holderName}
            />
          )}
          {isShowUpdateModal && (
            <KycNameUpdateModal
              orgId={selectedOrganization.organizationId}
              nameData={nameDataCheck}
              nameType={nameUpdateType}
              isShowUpdateModal={isShowUpdateModal}
              handleNameUpdateModalClose={handleNameUpdateModalClose}
            />
          )}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withRouter(KycMainPage);
