import React, { useEffect, useState, useRef, useMemo } from 'react';
import withRouter from 'components/Common/withRouter';
import moment from 'moment';
import { Card, CardBody, Col, Container, Row, Button } from 'reactstrap';
import * as Yup from 'yup';
import { useFormik } from 'formik';

import { allDocumentsUpload } from 'components/Common/FileSizeTypeChecker';

//Import Components
import Breadcrumbs from 'components/Common/Breadcrumb';
import { AMOUNT_REGEX } from 'helpers/utilities';

//regex
import { invoiceNumberRegex, orgNameRegex } from 'helpers/utilities';

//redux
import { useSelector } from 'react-redux';

import { fileLoader } from 'helpers/utilities';

import {
  ApiNotificationLoading,
  ApiNotificationUpdate,
  Notification,
} from 'components/Notification/ToastNotification';

import ApiLoader from 'components/Common/Ui/ApiLoader';

//API Imports
import {
  getAllDistInvoices,
  addDistInvoices,
  getSalesChannelByOrgId,
} from 'helpers/backend_helper.js';

import { challanInputForDistributor } from 'components/SalesChannelComponents/inputFieldsArray';

import CreateChallanModal from 'components/Common/CreateChallanModal';

//scss
import 'pages/Invoices/invoices.scss';
import PurchaseFinanceTable from 'components/InvoiceComponents/PurchaseFinanceTable';

//Please read this before using the common components
//callfrom --> to identify from which page we are calling from i.e purchase finance page or invoice discounting page
//The 'callfrom' identifier is used to identify the page i.e sales invoice and purchase invoice.
//otpmethod --> to call otp api
//invoicemethod --> to call lender and product api.

const PurchaseFinance = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const [challanFileDetails, setChallanFileDetails] = useState({
    challanFile: null,
    ischallanFileUploaded: false,
    challanLink: '',
    challanFileLoading: false,
    challanFileName: '',
  });

  const { selectedOrganization } = useSelector(state => ({
    selectedOrganization: state.Login.selectedOrganization,
  }));

  useEffect(() => {
    apiCallForTableData();
  }, []);

  const apiCallForTableData = () => {
    getAllDistInvoices(selectedOrganization?.organizationId)
      .then(response => {
        if (
          response &&
          (response.statusCode === 200 || response.statusCode === 201)
        ) {
          //makeTableData(response.data);
          setTableData(response.data);
          setIsLoading(false);
        } else {
          Notification('Sorry. Please Reload the page', 4);
        }
      })
      .catch(err => {
        Notification('Sorry. Please Reload the page', 4);
      });
  };

  // VALIDATION FOR CHALLAN UPLOAD
  const challanValidation = useFormik({
    initialValues: {
      invoiceNumber: '',
      amount: '',
      challanFile: '',
      invoiceGeneratedBy: '',
      dueDateByDistributor: '',
    },

    validationSchema: Yup.object({
      invoiceNumber: Yup.string()
        .required('Please enter invoice number')
        .matches(invoiceNumberRegex, 'Invalid Invoice number'),
      amount: Yup.string()
        .matches(AMOUNT_REGEX, 'Please enter valid amount')
        .max(13, 'Amount cannot exceed 13 digits')
        .required('Please enter valid amount'),
      invoiceGeneratedBy: Yup.string()
        .required('Please enter organization name')
        .matches(
          orgNameRegex,
          'Invalid organization name format. Must be 3-50 characters long and can only contain letters, digits, spaces, underscores, or hyphens.'
        ),
      dueDateByDistributor: Yup.string().required(
        'Please enter due date for this invoice or challan'
      ),
    }),

    onSubmit: values => {
      if (challanFileDetails?.challanLink?.length < 1) {
        challanValidation.setErrors({
          challanFile: 'Please upload a challan file',
        });
      } else {
        getSalesChannelByOrgId(selectedOrganization?.organizationId)
          .then(response1 => {
            if (
              response1 &&
              (response1.statusCode === 200 || response1.statusCode === 201)
            ) {
              const currentTimestamp = moment(new Date()).format(
                'YYYY-MM-DDTHH:mm:ss.SSSZ'
              );
              const replacedTimestamp = moment(
                `${values?.dueDateByDistributor}${currentTimestamp.slice(10)}`
              ).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
              const challan = {
                currentOrgId: selectedOrganization?.organizationId,
                totalPrice: Number(values?.amount),
                invoiceNumber: values?.invoiceNumber || '',
                docLink:
                  challanFileDetails?.challanLink !== null
                    ? challanFileDetails.challanLink
                    : '',
                dueDateByDistributor: replacedTimestamp,
                fileName:
                  challanFileDetails?.challanFileName !== null
                    ? challanFileDetails.challanFileName
                    : '',
                invoiceGeneratedBy: values?.invoiceGeneratedBy,
              };

              const toastId = ApiNotificationLoading();
              addDistInvoices(challan)
                .then(response2 => {
                  if (
                    response2 &&
                    (response2.statusCode === 200 ||
                      response2.statusCode === 201)
                  ) {
                    ApiNotificationUpdate(
                      toastId,
                      'Challan successfully created',
                      2
                    );
                    challanValidation.resetForm();
                    handleAddInvoiceModal();
                    apiCallForTableData();
                  } else {
                    ApiNotificationUpdate(
                      toastId,
                      'Something went wrong! Please try again after some time',
                      4
                    );
                  }
                  setChallanFileDetails(prevState => ({
                    ...prevState,
                    ischallanFileUploaded: false,
                    challanLink: '',
                    challanFile: null,
                    challanFileName: '',
                  }));
                })
                .catch(err => {
                  ApiNotificationUpdate(
                    toastId,
                    'Something went wrong! Please try again after some time',
                    4
                  );
                });
            } else {
              Notification(
                'Something went wrong! Please try again after some time',
                4
              );
            }
          })
          .catch(err => {
            Notification(
              'Something went wrong! Please try again after some time',
              4
            );
          });
      }
    },
  });

  // handle functions
  const handleAddInvoiceModal = () => {
    setShowAddModal(!showAddModal);
    challanValidation.resetForm();
  };

  /*************************************** Challan upload ***************************/
  const handleChallanFileChange = e => {
    const selectedFile = e.target.files && e.target.files[0];
    setChallanFileDetails(prevState => ({
      ...prevState,
      challanFile: selectedFile,
    }));
    handleChallanFileUpload(selectedFile);
  };

  const handleChallanFileClick = e => {
    const { target = {} } = e || {};
    target.value = '';
    setChallanFileDetails(prevState => ({
      ...prevState,
      ischallanFileUploaded: false,
      challanLink: '',
      challanFile: null,
    }));
  };

  const handleChallanFileUpload = selectedFile => {
    async function fetchFileData() {
      const loadingId = ApiNotificationLoading();
      try {
        setChallanFileDetails(prevState => ({
          ...prevState,
          challanFileLoading: true,
        }));
        const uploadedData = await allDocumentsUpload(
          selectedOrganization?.organizationId,
          selectedFile,
          'others',
          ['image/jpeg', 'image/png', 'application/pdf'],
          'jpg, png and pdf',
          2
        );
        if (uploadedData && uploadedData.statusCode == 200) {
          setChallanFileDetails(prevState => ({
            ...prevState,
            ischallanFileUploaded: true,
            challanLink: uploadedData?.data?.fileLink,
            challanFileName: uploadedData?.data?.fileName,
            challanFileLoading: false,
          }));
          ApiNotificationUpdate(loadingId, `File uploaded successfully`, 2);
        } else {
          ApiNotificationUpdate(loadingId, `File not uploaded`, 4);
          setChallanFileDetails(prevState => ({
            ...prevState,
            challanLink: null,
            challanFileLoading: false,
          }));
        }
      } catch (error) {
        ApiNotificationUpdate(loadingId, `${error?.message}`, 4);
        setChallanFileDetails(prevState => ({
          ...prevState,
          challanLink: null,
          challanFileLoading: false,
        }));
      }
    }
    fetchFileData();
  };

  // file upload array
  const challanUploadFile = [
    {
      id: 1,
      type: 'file',
      label: 'Upload Invoice file *',
      name: 'challanFile',
      placeholder: '',
      accept: 'image/png, image/jpeg, application/pdf',
      onChange: handleChallanFileChange,
      onClick: handleChallanFileClick,
      onUpload: handleChallanFileUpload,
      file: challanFileDetails?.challanFile,
      upload: challanFileDetails?.ischallanFileUploaded,
      loading: challanFileDetails?.challanFileLoading,
      link: challanFileDetails?.challanLink,
      loader: fileLoader(),
    },
  ];

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs title="Invoices" breadcrumbItem={`Purchase Invoices`} />
          {isLoading ? (
            <ApiLoader loadMsg="Please Wait..." />
          ) : (
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody className="border-bottom">
                    <div className="d-sm-block d-md-flex align-items-center">
                      <div className="mb-0 card-title flex-grow-1">
                        <h5 className="d-inline">All Purchase Invoices</h5>
                      </div>
                      <div className="flex-shrink-0">
                        <Button
                          type="button"
                          color="success"
                          className="btn mx-1 me-2"
                          onClick={handleAddInvoiceModal}
                          name="addChannel"
                        >
                          <i className="mdi mdi-plus me-1" />
                          Add Invoice
                        </Button>
                      </div>
                    </div>
                  </CardBody>
                  <CardBody>
                    <PurchaseFinanceTable
                      data={tableData}
                      refreshDataAPI={apiCallForTableData}
                    />
                    <CreateChallanModal
                      isOpen={showAddModal}
                      handleModalCancel={handleAddInvoiceModal}
                      validation={challanValidation}
                      CustomModalHeader={'Create Puchase Invoice'}
                      challanUploadFile={challanUploadFile}
                      callFrom={'PurchaseInvoicePage'}
                      invoiceMethod={'purchaseFinance'}
                      inputArrFields={challanInputForDistributor}
                    />
                  </CardBody>
                </Card>
              </Col>
            </Row>
          )}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withRouter(PurchaseFinance);
