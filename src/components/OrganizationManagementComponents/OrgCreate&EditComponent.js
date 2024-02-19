import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Spinner } from 'reactstrap';
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  FormFeedback,
  Form,
  Input,
  Label,
  Row,
  UncontrolledTooltip,
} from 'reactstrap';

import Select from 'react-select';

//Import Breadcrumb
import Breadcrumbs from 'components/Common/Breadcrumb';

//pop up on success and failure of api
import {
  ApiNotificationLoading,
  ApiNotificationUpdate,
  Notification,
} from 'components/Notification/ToastNotification';

//Inutfields array
import {
  inputFieldsForCreateOrg,
  inputFieldsForEditOrg,
} from 'components/OrganizationManagementComponents/inputFieldsArray';

//api's
import {
  createOrganization,
  getStateData,
  getCityData,
  organizationOperationType,
  organizationType,
  updateOrganization,
  docUploadToS3Bucket,
  allDocsUpload,
} from 'helpers/backend_helper';

//path
import { Path } from 'routes/constant';

//router for navigation
import withRouter from 'components/Common/withRouter';

//camel case to proper case
import { ToProperCase } from 'components/Common/ToProperCase';

import { allDocumentsUpload } from 'components/Common/FileSizeTypeChecker';
import { fileLoader } from 'helpers/utilities';

const CreateEditPage = props => {
  const {
    pageTitle,
    breadcrumbTitle = '',
    breadcrumbItem = '',
    showbreadcrumb,
    saveButton,
    organizationData = null,
    showMultipleAddress,
    organizationId = null,
    setOrganizationData = null,
    isEdit = false,
    forcreate = true,
  } = props;

  //CITY AND STATE VARIABLES
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);

  //ORGANIZATION TYPE VARIABLES
  const [organizationTypeData, setOrganizationTypeData] = useState([]);
  const [organizationOperationTypeData, setOrganizationOperationTypeData] =
    useState([]);

  //IMAGE AND LOGO STATES
  const [imageState, setImageState] = useState({
    imageFile: null,
    isImageUploaded: false,
    imageLink: '',
    isImageLoading: false,
  });
  const [logoState, setLogoState] = useState({
    logoFile: null,
    isLogoUploaded: false,
    logoLink: '',
    isLogoLoading: false,
  });

  // inputfields array
  const inputFields = forcreate
    ? inputFieldsForCreateOrg
    : inputFieldsForEditOrg;

  /************** Api calls for get city data, get state data, get organization type data, get organization operation type data *************/

  //get state data
  useEffect(() => {
    getStateData()
      .then(response => {
        if (
          response &&
          (response.statusCode === 200 || response.statusCode === 201)
        ) {
          setStateData(convertArrToObj(response.data));
        } else {
          Notification('Sorry, Please reload the page', 4);
        }
      })
      .catch(err => {
        Notification('Sorry, Please reload the page', 4);
      });
  }, []);

  //get city data
  useEffect(() => {
    getCityData()
      .then(response => {
        if (
          response &&
          (response.statusCode === 200 || response.statusCode === 201)
        ) {
          setCityData(convertArrToObj(response.data));
        } else {
          Notification('Sorry, Please reload the page', 4);
        }
      })
      .catch(err => {
        Notification('Sorry, Please reload the page', 4);
      });
  }, []);

  //get organization type data
  useEffect(() => {
    organizationType()
      .then(response => {
        if (
          response &&
          (response.statusCode === 200 || response.statusCode === 201)
        ) {
          setOrganizationTypeData(convertArrToObj(response.data));
        } else {
          Notification('Sorry, Please reload the page', 4);
        }
      })
      .catch(err => {
        Notification('Sorry, Please reload the page', 4);
      });
  }, []);

  //get organization operation type data
  useEffect(() => {
    organizationOperationType('all')
      .then(response => {
        if (
          response &&
          (response.statusCode === 200 || response.statusCode === 201)
        ) {
          setOrganizationOperationTypeData(convertArrToObj(response.data));
        } else {
          Notification('Sorry, Please reload the page', 4);
        }
      })
      .catch(err => {
        Notification('Sorry, Please reload the page', 4);
      });
  }, []);

  /**************File change,click,upload functions *************/
  const fileNotUploadedSetToastState = (
    e,
    toastId,
    errorMsg = `File not uploaded`
  ) => {
    if (e.target.name === 'imageFile') {
      setImageState(previousState => ({
        ...previousState,
        isImageLoading: false,
      }));
    }
    if (e.target.name === 'logoFile') {
      setLogoState(previousState => ({
        ...previousState,
        isLogoLoading: false,
      }));
    }
    ApiNotificationUpdate(toastId, errorMsg, 4);
  };

  const handleFileChange = e => {
    const selectedFile = e.target.files && e.target.files[0];
    if (e.target.name === 'imageFile') {
      setImageState(previousState => ({
        ...previousState,
        imageFile: selectedFile,
      }));
    }
    if (e.target.name === 'logoFile') {
      setLogoState(previousState => ({
        ...previousState,
        logoFile: selectedFile,
      }));
    }
    handleFileUpload(e, selectedFile);
  };

  const handleFileClick = e => {
    const { target = {} } = e || {};
    target.value = '';

    if (e.target.name === 'imageFile') {
      setImageState(previousState => ({
        ...previousState,
        imageLink: '',
        imageFile: null,
      }));
    }
    if (e.target.name === 'logoFile') {
      setLogoState(previousState => ({
        ...previousState,
        logoLink: '',
        logoFile: null,
      }));
    }
  };

  const handleFileUpload = (e, selectedFile) => {
    const name = e?.target?.name;
    const folder = name === 'imageFile' ? 'companyImage' : 'companyLogo';
    if (name === 'imageFile') {
      setImageState(previousState => ({
        ...previousState,
        isImageLoading: true,
      }));
    } else {
      setLogoState(previousState => ({
        ...previousState,
        isLogoLoading: true,
      }));
    }
    async function fetchFileData() {
      const loadingId = ApiNotificationLoading();
      try {
        const uploadedData = await allDocumentsUpload(
          '',
          selectedFile,
          folder,
          ['image/jpeg', 'image/png', 'application/pdf'],
          '',
          2
        );
        if (uploadedData && uploadedData.statusCode == 200) {
          if (name === 'imageFile') {
            setImageState(previousState => ({
              ...previousState,
              isImageLoading: false,
              imageLink: uploadedData.data.fileLink,
            }));
          } else {
            setLogoState(previousState => ({
              ...previousState,
              isLogoLoading: false,
              logoLink: uploadedData.data.fileLink,
            }));
          }
          ApiNotificationUpdate(loadingId, `File uploaded successfully`, 2);
        } else {
          fileNotUploadedSetToastState(e, loadingId);
        }
      } catch (error) {
        fileNotUploadedSetToastState(e, loadingId, `${error?.message}`);
      }
    }
    fetchFileData();
  };

  /************** array to obj converter and fileloader *************/
  // convert arr to object for city and state data
  const convertArrToObj = a1 => {
    const convertedArray = a1.map((item, index) => {
      return { index: index, label: ToProperCase(item), value: item };
    });

    return convertedArray;
  };

  /************** file Input field array *************/
  const fileInputFields = [
    {
      id: 1,
      type: 'file',
      label: 'Company Image',
      name: 'imageFile',
      placeholder: '',
      onChange: handleFileChange,
      onClick: handleFileClick,
      onUpload: handleFileUpload,
      file: imageState.imageFile,
      upload: imageState.isImageUploaded,
      loading: imageState.isImageLoading,
      link: imageState.imageLink,
      loader: fileLoader(),
    },
    {
      id: 2,
      type: 'file',
      label: 'Company Logo',
      name: 'logoFile',
      placeholder: '',
      onChange: handleFileChange,
      onClick: handleFileClick,
      onUpload: handleFileUpload,
      file: logoState.logoFile,
      upload: logoState.isLogoUploaded,
      loading: logoState.isLogoLoading,
      link: logoState.logoLink,
      loader: fileLoader(),
    },
  ];

  /************** formik declaration *************/
  const validation = useFormik({
    // initialvalues for the input fields
    initialValues: {
      companyName: organizationData?.nameAsPerGST || '',
      registeredName: organizationData?.nameAsPerPAN || '',
      organizationType: organizationData?.organizationType || '',
      organizationOperationType:
        organizationData?.organizationOperationType || '',
      adminName: organizationData?.adminName || '',
      adminEmailId: organizationData?.adminEmailId || '',
      adminPhoneNo: organizationData?.adminPhoneNo || '',
      addressLine1: organizationData?.addressLine1 || '',
      addressLine2: organizationData?.addressLine2 || '',
      city: organizationData?.city || '',
      state: organizationData?.state || '',
      pinCode: organizationData?.pinCode || '',
      panNumber: organizationData?.panNumber || '',
      gstInNumber: organizationData?.gstInNumber || '',
      address: organizationData?.address || [
        {
          addressField: '',
          citys: '',
          states: '',
          pinCodes: '',
        },
      ],
    },

    // validations for input fields
    validationSchema: Yup.object({
      companyName: Yup.string()
        .required('Please Enter Your Company Name As Per GST')
        .matches(
          /^[a-zA-Z0-9_ -]{3,50}$/,
          'Invalid company name format. Must be 3-50 characters long and can only contain letters, digits, spaces, underscores, or hyphens.'
        ),
      registeredName: Yup.string()
        .required('Please Enter Your Registered Company Name As Per PAN')
        .matches(
          /^[a-zA-Z0-9_ -]{3,50}$/,
          'Invalid registered name format. Must be 3-50 characters long and can only contain letters, digits, spaces, underscores, or hyphens.'
        ),
      organizationType: Yup.string().required(
        'Please Select a Organization Type'
      ),
      organizationOperationType: Yup.string().required(
        'Please Select a Organization Operation Type'
      ),
      adminName:
        !isEdit &&
        Yup.string()
          .required('Please Enter Your Name')
          .matches(
            /^[a-zA-Z0-9_ -]{3,50}$/,
            'Invalid admin name format. Must be 3-50 characters long and can only contain letters, digits, spaces, underscores, or hyphens.'
          ),
      adminPhoneNo:
        !isEdit &&
        Yup.string()
          .matches(/^[0-9]{10}$/, 'Invalid Phone Number format')
          .required('Please Enter Your Phone No'),
      adminEmailId:
        !isEdit &&
        Yup.string()
          .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Invalid Email format')
          .required('Please Enter Your Email ID'),
      addressLine1:
        !isEdit &&
        Yup.string()
          .required('Please Enter Your address')
          .min(3, 'Please Enter Address more than 3 charachters')
          .test(
            'word-count-limit',
            'Please Enter Address in 50 characters',
            value => value && value.length <= 50
          ),
      addressLine2:
        !isEdit &&
        Yup.string()
          .nullable()
          .min(3, 'Please Enter Address more than 3 charachters')
          .max(50, 'Please Enter Address in 50 characters'),
      city: !isEdit && Yup.string().required('Please Select a City'),
      state: !isEdit && Yup.string().required('Please Select a State'),
      pinCode:
        !isEdit &&
        Yup.string()
          .matches(/^[0-9]{6}$/, 'Please Enter Valid Pincode')
          .test(
            'is-number',
            'Please Enter Valid Pincode',
            value => !isNaN(value)
          )
          .required('Please Enter Your Pincode'),
      panNumber: Yup.string()
        .min(3, 'Please Enter PAN Number more than 3 characters')
        .max(30, 'Please Enter PAN Number in 30 characters')
        .required('Please Enter Your PAN Number'),
      // .test(
      //   'word-count-limit',
      //   'Please Enter PAN Number in 30 words',
      //   value => value && value.length <= 30
      // )
      //.matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Please Enter Valid PAN Number')
      gstInNumber: Yup.string()
        .min(3, 'Please Enter GST Number more than 3 characters')
        .max(30, 'Please Enter GST Number in 30 characters')
        .required('Please Enter Your GST Number'),
      // .test(
      //   'word-count-limit',
      //   'Please Enter GST Number in 30 words',
      //   value => value && value.length <= 30
      // )
      // .matches(
      //   /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      //   'Please Enter Valid GST Number'
      // )
    }),

    // onsubmit function to create and edit organization
    onSubmit: values => {
      const organizationDetails = {
        nameAsPerGST: values['companyName'],
        nameAsPerPAN: values['registeredName'],
        organizationType: values['organizationType'],
        organizationOperationType: values['organizationOperationType'],
        adminName: values['adminName'],
        adminEmailId: values['adminEmailId'],
        adminPhoneNo: values['adminPhoneNo'],
        addressLine1: values['addressLine1'],
        addressLine2: values['addressLine2'],
        city: values['city'] === '' ? null : values['city'],
        state: values['state'] === '' ? null : values['state'],
        pinCode: values['pinCode'] === '' ? null : values['pinCode'],
        panNumber: values['panNumber'] && values['panNumber'].toUpperCase(),
        gstInNumber:
          values['gstInNumber'] && values['gstInNumber'].toUpperCase(),
        imageLink:
          imageState.imageLink === ''
            ? organizationData?.imageLink
            : imageState.imageLink,
        logoLink:
          logoState.logoLink === ''
            ? organizationData?.logoLink
            : logoState.logoLink,
        storeNo: '',
      };

      if (isEdit) {
        const id = ApiNotificationLoading();
        updateOrganization(organizationDetails, organizationId)
          .then(response => {
            if (
              response &&
              (response.statusCode === 200 || response.statusCode === 201)
            ) {
              validation.resetForm();
              setImageState(previousState => ({
                ...previousState,
                imageLink: '',
                imageFile: null,
              }));
              setLogoState(previousState => ({
                ...previousState,
                logoLink: '',
                logoFile: null,
              }));
              setOrganizationData(null);
              ApiNotificationUpdate(
                id,
                'Organization details updated successfully',
                2
              );
              setTimeout(() => {
                props.router.navigate(Path.VIEW_EDIT_ORGANIZATION);
              }, 1000);
            } else {
              ApiNotificationUpdate(
                id,
                'Please try to update again after some time',
                4
              );
            }
          })
          .catch(err => {
            ApiNotificationUpdate(
              id,
              'Please try to update again after some time',
              4
            );
          });
      } else {
        const id = ApiNotificationLoading();
        createOrganization(organizationDetails)
          .then(response => {
            if (
              response &&
              (response.statusCode === 200 || response.statusCode === 201)
            ) {
              ApiNotificationUpdate(
                id,
                'Organization successfully created.',
                2
              );
              validation.resetForm();
              setImageState(previousState => ({
                ...previousState,
                imageFile: null,
              }));
              setLogoState(previousState => ({
                ...previousState,
                logoFile: null,
              }));
              setTimeout(() => {
                props.router.navigate(Path.VIEW_EDIT_ORGANIZATION);
              }, 1000);
            } else {
              ApiNotificationUpdate(
                id,
                ToProperCase(response.message) ||
                  'Please try to create orgainzation again after some time',
                2
              );
            }
          })
          .catch(err => {
            ApiNotificationUpdate(
              id,
              ToProperCase(err.response.data.message) ||
                'Please try to create orgainzation again after some time',
              2
            );
          });
      }
    },
  });

  // Function to add address fields
  const handleAddAddressFields = () => {
    validation.setFieldValue('address', [
      ...validation.values.address,
      {
        addressField: '',
        citys: '',
        states: '',
        pinCodes: '',
      },
    ]);
  };

  // Function to remove address fields
  const handleRemoveAddressFields = (e, index) => {
    validation.values.address.splice(index, 1);
    validation.setFieldValue('address', validation.values.address);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          {showbreadcrumb && (
            <Breadcrumbs
              title={breadcrumbTitle}
              breadcrumbItem={breadcrumbItem}
            />
          )}

          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <CardTitle className="mb-4">{pageTitle}</CardTitle>

                  <Form
                    onSubmit={e => {
                      e.preventDefault();
                      validation.handleSubmit();
                      return false;
                    }}
                  >
                    {inputFields.map(val => {
                      return (
                        <div className="mb-4 row" key={val.id}>
                          <Label
                            htmlFor="projectname"
                            className="col-form-label col-lg-2"
                          >
                            {val.label}
                          </Label>
                          <Col lg="10">
                            {val.name !== 'city' && val.name !== 'state' ? (
                              <Input
                                className="form-control"
                                name={val.name}
                                type={val.type}
                                placeholder={val.placeholder}
                                {...validation.getFieldProps(`${val.name}`)}
                                invalid={
                                  validation.touched[val.name] &&
                                  validation.errors[val.name]
                                    ? true
                                    : false
                                }
                              >
                                {val.type === 'select' ? (
                                  <>
                                    <option disabled value="">
                                      {val.placeholder}
                                    </option>
                                    {val.name === 'organizationType' &&
                                      organizationTypeData &&
                                      organizationTypeData.map(
                                        (item, index) => (
                                          <option
                                            key={index}
                                            value={item.value}
                                          >
                                            {item.label}
                                          </option>
                                        )
                                      )}

                                    {val.name === 'organizationOperationType' &&
                                      organizationOperationTypeData &&
                                      organizationOperationTypeData.map(
                                        (item, index) => (
                                          <option
                                            key={index}
                                            value={item.value}
                                          >
                                            {item.label}
                                          </option>
                                        )
                                      )}
                                  </>
                                ) : null}
                              </Input>
                            ) : (
                              <Select
                                name={val.name}
                                isClearable={true}
                                isRtl={false}
                                isSearchable={true}
                                options={
                                  val.name === 'city' ? cityData : stateData
                                }
                                styles={{
                                  menu: (provided, state) => ({
                                    ...provided,
                                    maxHeight: '200px', // Set the maximum height of the dropdown
                                    overflowY: 'auto',
                                    scrollbarWidth: 'none', // Hide default scrollbar
                                    '&::-webkit-scrollbar': {
                                      display: 'none', // Hide default scrollbar in Webkit browsers
                                    },
                                  }),
                                }}
                                value={
                                  val.name === 'city'
                                    ? cityData[validation.values[val.name]] ||
                                      ''
                                    : stateData[validation.values[val.name]] ||
                                      ''
                                }
                                onChange={selectedOption => {
                                  let event = {
                                    target: {
                                      name: val.name,
                                      value: selectedOption.index,
                                    },
                                  };
                                  validation.handleChange(event);
                                }}
                                onBlur={() => {
                                  validation.setFieldTouched(val.name);
                                }}
                              ></Select>
                            )}

                            {validation.touched[val.name] &&
                            validation.errors[val.name] ? (
                              <span className="text-danger">
                                {validation.errors[val.name]}
                              </span>
                            ) : null}
                          </Col>
                        </div>
                      );
                    })}

                    {fileInputFields.map(val => {
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
                              className="form-control"
                              name={val.name}
                              type={val.type}
                              onChange={val['onChange']}
                              onClick={val['onClick']}
                            />
                            {val.name === 'imageFile' &&
                              (organizationData?.imageLink ||
                                imageState.imageLink) && (
                                <a
                                  href={
                                    imageState.imageLink === ''
                                      ? organizationData.imageLink
                                      : imageState.imageLink
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Click here for preview
                                </a>
                              )}
                            {val.name === 'logoFile' &&
                              (organizationData?.logoLink ||
                                logoState.logoLink) && (
                                <a
                                  href={
                                    logoState.logoLink === ''
                                      ? organizationData.logoLink
                                      : logoState.logoLink
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Click here for preview
                                </a>
                              )}
                            {val.file && (
                              <div>
                                <Label className="file-name">
                                  {val.file['name']}
                                </Label>
                                {val.loading ? (
                                  val.loader
                                ) : val.link ? (
                                  <>
                                    <Label className="text-primary mx-1">
                                      File Uploaded Successfully.
                                    </Label>
                                    <i className="fas fa-check-circle m-2" />
                                  </>
                                ) : (
                                  <Label className="text-danger m-2">
                                    File upload process took too long. Please
                                    try again!{' '}
                                  </Label>
                                )}
                              </div>
                            )}
                          </Col>
                        </div>
                      );
                    })}

                    {showMultipleAddress &&
                      validation.values.address.map((address, index) => (
                        <div
                          key={index}
                          className="mb-4 row align-items-center"
                        >
                          <Label className="col-form-label col-lg-2">
                            Address {index + 1}
                          </Label>

                          <Col sm="3">
                            <input
                              className="form-control"
                              name="addressField"
                              type="text"
                              placeholder="Enter Address..."
                              id={'addressFieldToolTip' + index}
                              {...validation.getFieldProps(
                                `address[${index}].addressField`
                              )}

                              // onChange={validation.handleChange}
                              // onBlur={validation.handleBlur}
                              // value={
                              //   validation.values.address['addressField'] || ''
                              // }
                            />
                            <UncontrolledTooltip
                              placement="top"
                              target={'addressFieldToolTip' + index}
                            >
                              {validation.values.address[index]['addressField']}
                            </UncontrolledTooltip>
                          </Col>
                          <Col>
                            <input
                              className="form-control"
                              list="datalistCityOptions"
                              id="cityDataList"
                              placeholder="Enter City..."
                              name="citys"
                              type="text"
                              {...validation.getFieldProps(
                                `address[${index}].citys`
                              )}

                              // onChange={validation.handleChange}
                              // onBlur={validation.handleBlur}
                              // value={validation.values.address['citys'] || ''}
                            />
                            {cityData && (
                              <datalist id="datalistCityOptions">
                                {cityData.map((item, cityIndex) => (
                                  <option key={cityIndex} value={item.value} />
                                ))}
                              </datalist>
                            )}
                          </Col>
                          <Col>
                            <input
                              className="form-control"
                              list="datalistStateOptions"
                              id="stateDataList"
                              placeholder="Enter State..."
                              name="states"
                              type="text"
                              {...validation.getFieldProps(
                                `address[${index}].states`
                              )}

                              // onChange={validation.handleChange}
                              // onBlur={validation.handleBlur}
                              // value={validation.values.address['states'] || ''}
                            />
                            {stateData && (
                              <datalist id="datalistStateOptions">
                                {stateData.map((item, stateIndex) => (
                                  <option key={stateIndex} value={item.value} />
                                ))}
                              </datalist>
                            )}
                          </Col>
                          <Col>
                            <Input
                              className="inner form-control"
                              placeholder="Enter Pincode..."
                              name="pinCodes"
                              type="text"
                              {...validation.getFieldProps(
                                `address[${index}].pinCodes`
                              )}

                              // onChange={validation.handleChange}
                              // onBlur={validation.handleBlur}
                              // value={validation.values.address['pinCodes'] || ''}
                            />
                          </Col>
                          <Col sm="1">
                            <i
                              id={'removeAddress' + index}
                              onClick={e => handleRemoveAddressFields(e, index)}
                              className="fas fa-trash-alt font-size-20"
                            ></i>
                            <UncontrolledTooltip
                              placement="top"
                              target={'removeAddress' + index}
                            >
                              Remove Address {index + 1}
                            </UncontrolledTooltip>
                          </Col>
                        </div>
                      ))}

                    {showMultipleAddress && (
                      <Row className="justify-content-start">
                        <Col lg="10">
                          <Button
                            color="success"
                            className="mb-4"
                            onClick={() => {
                              handleAddAddressFields();
                            }}
                          >
                            Add Address
                          </Button>
                        </Col>
                      </Row>
                    )}

                    <Row className="justify-content-end">
                      <Col lg="10">
                        <Button type="submit" color="primary">
                          {saveButton}
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withRouter(CreateEditPage);
