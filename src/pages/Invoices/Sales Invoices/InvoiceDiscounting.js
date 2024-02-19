import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import withRouter from 'components/Common/withRouter';
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Spinner,
  Button,
  UncontrolledTooltip,
} from 'reactstrap';

import * as Yup from 'yup';
import { useFormik } from 'formik';
import { ToProperCase } from 'components/Common/ToProperCase';
import { allDocumentsUpload } from 'components/Common/FileSizeTypeChecker';

//Import Components
import Breadcrumbs from 'components/Common/Breadcrumb';
import {
  Notification,
  ApiNotificationLoading,
  ApiNotificationUpdate,
} from 'components/Notification/ToastNotification';

//API Imports
import {
  getAllChallans,
  getRetailerList,
  createChallan,
  getSalesChannelByOrgId,
} from 'helpers/backend_helper.js';

// file loader, input array for add challans, regex for amount
import { fileLoader } from 'helpers/utilities';
import { challanInput } from 'components/SalesChannelComponents/inputFieldsArray';
import { AMOUNT_REGEX } from 'helpers/utilities';

//redux
import { useSelector, useDispatch } from 'react-redux';
import { Path } from 'routes/constant';

//add challan modal, loader for table
import CreateChallanModal from 'components/Common/CreateChallanModal';
import ApiLoader from 'components/Common/Ui/ApiLoader';

import { invoiceNumberRegex } from 'helpers/utilities';

//scss
import 'pages/Invoices/invoices.scss';
import InvoiceDiscountingTable from 'components/InvoiceComponents/InvoiceDiscountingTable';

//Please read this before using the common components
//id --> to identify from which page we are calling.
//callfrom --> to identify from which page we are calling from i.e purchase finance page or invoice discounting page
//Here I have named two identifiers as 'id' and 'callfrom'.
//The 'callfrom' identifier is used to identify the page i.e sales invoice and purchase invoice.
//The 'id' identifier is used to identify the difference in pending,accepted and rejected page.
//otpmethod --> to call otp api
//invoicemethod --> to call lender and product api.

const InvoiceDiscounting = ({ router, ...props }) => {
  const [allInvoices, setAllInvoices] = useState([]);
  const [allFilteredInovices, setAllFilteredInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openAddModal, setOpenAddModal] = useState(false);
  const { id } = router.params;
  const [searchParams, setSearchParams] = useSearchParams();
  const orgID = searchParams.get('orgID');
  const orgList = useRef([]); //list of retailers
  const [challanFileDetails, setChallanFileDetails] = useState({
    challanFile: null,
    ischallanFileUploaded: false,
    challanLink: '',
    challanFileLoading: false,
    challanFileName: '',
  });

  const idToArray = {
    pending: ['pending'],
    accepted: ['accepted'],
    rejected: ['rejected'],
    'accepted-paid': ['paid', 'accepted'],
    paid: ['paid'],
  };
  //meta title
  document.title = 'Invoices | GrowFi';

  const dispatch = useDispatch();
  const { selectedOrg } = useSelector(state => ({
    selectedOrg: state.Login.selectedOrganization,
  }));

  // convert arr to arr of object for org list
  const convertArrToObj = a1 => {
    const convertedArray = a1.map((item, index) => {
      return {
        index: index,
        label: ToProperCase(item?.retailersName ? item.retailersName : ''),
        value: item?.retailersName ? item.retailersName : '',
        retailerOrgId: item?.retailerId ? item.retailerId : '',
      };
    });

    return convertedArray;
  };

  const fetchAPI = async () => {
    try {
      setIsLoading(true);
      const jsonData = await getAllChallans(
        selectedOrg.organizationId,
        idToArray[id],
        orgID
      );
      if (
        jsonData &&
        Array.isArray(jsonData.data) &&
        jsonData.data.length > 0
      ) {
        setAllInvoices(jsonData.data);
      } else {
        setAllInvoices([]);
      }
      setIsLoading(false);
    } catch (error) {
      Notification('Server Error Occured, Please try again later', 4);
      setAllInvoices([]);
      setIsLoading(false);
    }
  };

  const filterOutInvoices = () => {
    setAllFilteredInvoices(allInvoices);
  };

  // Fetching permission list from const file and permission data for individual levels
  useEffect(() => {
    if (id === 'pending' || id === 'accepted-paid' || id === 'rejected') {
      fetchAPI();
    } else {
      setTimeout(() => {
        router.navigate(Path.DASHBOARD);
      }, 0);
    }
  }, [id]);

  useEffect(() => {
    if (allInvoices && allInvoices.length > 0) {
      filterOutInvoices();
    } else {
      setAllFilteredInvoices([]);
    }
  }, [allInvoices]);

  // retailer list api
  const callRetailerListApi = async () => {
    try {
      const response = await getRetailerList(selectedOrg?.organizationId);
      if (
        response &&
        (response.statusCode === 200 || response.statusCode === 201)
      ) {
        let convertedArray = convertArrToObj(response?.data);
        orgList.current = convertedArray;
        return { response, orgList };
      } else {
        return { response };
      }
    } catch (error) {
      throw { error };
    }
  };

  const handleCloseSearchHistory = () => {
    router.navigate({
      pathname: `${Path.SALES_CHANNEL}`,
    });
  };

  const handleStatusChange = e => {
    const value = e.target.value;
    router.navigate({
      pathname: `${Path.VIEW_INVOICES}/${value}`,
      search: `?${searchParams.toString()}`,
    });
  };

  const getPageHeading = () => {
    if (orgID && orgID.length > 0) {
      return 'Invoice History';
    } else {
      return 'All Invoices';
    }
  };

  // VALIDATION FOR CHALLAN UPLOAD
  const challanValidation = useFormik({
    initialValues: {
      invoiceNumber: '',
      amount: '',
      challanFile: '',
      selectedRetailer: '',
    },

    validationSchema: Yup.object({
      invoiceNumber: Yup.string()
        .matches(invoiceNumberRegex, 'No special characters allowed')
        .required('Please enter invoice number'),
      amount: Yup.string()
        .matches(AMOUNT_REGEX, 'Please enter valid amount')
        .max(13, 'Amount cannot exceed 13 digits')
        .required('Please enter valid amount'),
      selectedRetailer: Yup.string().required('Please Select a Organization'),
    }),

    onSubmit: values => {
      if (challanFileDetails?.challanLink?.length < 1) {
        challanValidation.setErrors({
          challanFile: 'Please upload a challan file',
        });
      } else {
        const retailerOrgId =
          orgList?.current[values?.selectedRetailer]?.retailerOrgId;
        getSalesChannelByOrgId(retailerOrgId)
          .then(response1 => {
            if (
              response1 &&
              (response1.statusCode === 200 || response1.statusCode === 201)
            ) {
              const challan = {
                invoiceNumber: values?.invoiceNumber?.toUpperCase(),
                amount: Number(values?.amount),
                challanFile: challanFileDetails?.challanLink,
                currentOrgId: selectedOrg?.organizationId,
                childSaleschannelId: response1?.data[0]?.id,
                fileName: challanFileDetails?.challanFileName,
              };
              const toastId = ApiNotificationLoading();
              if (response1) {
                createChallan(
                  challan.childSaleschannelId,
                  challan.currentOrgId,
                  challan.amount,
                  challan.invoiceNumber,
                  challan.challanFile,
                  challan.fileName
                )
                  .then(response => {
                    if (
                      response &&
                      (response.statusCode === 200 ||
                        response.statusCode === 201)
                    ) {
                      ApiNotificationUpdate(
                        toastId,
                        'Challan successfully created',
                        2
                      );
                      challanValidation.resetForm();
                      handleAddChallanModal();
                      fetchAPI();
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
              }
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

  // Handlers functions and Modal Helpers and truncate text
  const handleAddChallanModal = () => {
    setOpenAddModal(!openAddModal);
    challanValidation.resetForm();
  };

  /*************************************** Challan upload handlers ***************************/
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
      challanFileName: '',
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
          selectedOrg?.organizationId,
          selectedFile,
          'challan',
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
      label: 'Upload challan file *',
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
          <Breadcrumbs title="Invoices" breadcrumbItem={`${id} Invoices`} />
          {isLoading ? (
            <ApiLoader loadMsg={'Please Wait...'} />
          ) : (
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody className="border-bottom">
                    <div className="d-sm-block d-md-flex align-items-center">
                      <div className="mb-0 card-title flex-grow-1">
                        <h5 className="d-inline">{getPageHeading()}</h5>
                      </div>

                      <div className="flex-shrink-0">
                        <select
                          value={id}
                          onChange={handleStatusChange}
                          className="form-select"
                        >
                          <option disabled>Status</option>
                          <option value="pending">Pending</option>
                          <option value="rejected">Rejected</option>
                          <option value="accepted-paid">
                            Accepted or Paid
                          </option>
                        </select>
                      </div>
                      {orgID && orgID.length > 0 ? (
                        <div
                          key={orgID + '_closeSearchHistory'}
                          className="flex-shrink-0"
                        >
                          <button
                            onClick={handleCloseSearchHistory}
                            className="btn btn-danger ms-1"
                          >
                            <i className="mdi mdi-close-thick"></i>
                          </button>
                        </div>
                      ) : null}
                      <div className="mt-1 mt-lg-0 flex-shrink-0">
                        <Button
                          type="button"
                          color="success"
                          className="btn mx-1 me-2"
                          onClick={handleAddChallanModal}
                          name="addChannel"
                        >
                          <i className="mdi mdi-plus me-1" />
                          Add Challan
                        </Button>
                      </div>
                    </div>
                  </CardBody>
                  <CardBody>
                    <InvoiceDiscountingTable
                      data={allFilteredInovices}
                      id={id}
                      refreshDataAPI={fetchAPI}
                    />
                  </CardBody>
                </Card>
              </Col>
            </Row>
          )}
          {openAddModal && (
            <CreateChallanModal
              isOpen={openAddModal}
              handleModalCancel={handleAddChallanModal}
              validation={challanValidation}
              CustomModalHeader={'Create Challan For Retailers'}
              challanUploadFile={challanUploadFile}
              showOrgSelectField={true}
              inputArrFields={challanInput}
              callFrom={'InvoiceDiscountingPage'}
              callRetailerListApi={callRetailerListApi}
              invoiceMethod={'invoiceDiscounting'}
            />
          )}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withRouter(InvoiceDiscounting);
