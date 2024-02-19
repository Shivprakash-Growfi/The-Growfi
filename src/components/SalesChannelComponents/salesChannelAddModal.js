import React, { useEffect, useState } from 'react';
import {
  Button,
  Col,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  Input,
  FormFeedback,
  Label,
  Form,
} from 'reactstrap';
import {
  inputFields,
  inputFieldsForExistingOrg,
} from 'components/SalesChannelComponents/inputFieldsArray';
import { allDocumentsUpload } from 'components/Common/FileSizeTypeChecker';
import {
  ApiNotificationLoading,
  ApiNotificationUpdate,
} from 'components/Notification/ToastNotification';
import { fileLoader } from 'helpers/utilities';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { addOrgToSalesChannel, addSalesChannel } from 'helpers/backend_helper';
const SalesChannelCreateModal = ({
  isOpenModal,
  addChannelToggle,
  modalHeader,
  fetchedDataByPan = {},
  isOrgExistByPan = false,
  handleAddModalUpdate,
  channelId,
}) => {
  //IMAGE AND LOGO STATES
  // handling Direct PAN inputs

  /**************File change,click,upload functions *************/
  const [imageFile, setimageFile] = useState(null);
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [imageLink, setImageLink] = useState('');
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [formInputFields, setFormInputFields] = useState([]);

  const { selectedOrganization } = useSelector(state => ({
    selectedOrganization: state.Login.selectedOrganization,
  }));
  const { companyDetails } = useSelector(state => ({
    companyDetails: state.Company.companyDetails,
  }));

  useEffect(() => {
    if (isOrgExistByPan) {
      setFormInputFields(inputFieldsForExistingOrg);
    } else {
      setFormInputFields(inputFields);
    }
  }, [isOrgExistByPan]);

  //File handling
  const handleFileChange = e => {
    const selectedFile = e.target.files && e.target.files[0];
    setimageFile(selectedFile);
    handleFileUpload(selectedFile);
  };

  const handleFileClick = e => {
    const { target = {} } = e || {};
    target.value = '';

    if (e.target.name === 'imageFile') {
      setIsImageUploaded(false);
      setImageLink('');
      setimageFile(null);
    }
  };

  const handleFileUpload = selectedFile => {
    async function fetchFileData() {
      const loadingId = ApiNotificationLoading();
      try {
        setIsImageLoading(true);
        const uploadedData = await allDocumentsUpload(
          selectedOrganization?.organizationId,
          selectedFile,
          'channelLogo'
        );
        if (uploadedData && uploadedData.statusCode == 200) {
          setImageLink(uploadedData.data.fileLink);
          setIsImageUploaded(true);
          setIsImageLoading(false);
          ApiNotificationUpdate(loadingId, `File uploaded successfully`, 2);
        } else {
          ApiNotificationUpdate(loadingId, `File not uploaded`, 4);
          setImageLink(null);
          setIsImageLoading(false);
        }
      } catch (error) {
        ApiNotificationUpdate(loadingId, `${error?.message}`, 4);
        setImageLink(null);
        setIsImageLoading(false);
        console.error('Error fetching data:', error);
      }
    }
    fetchFileData();
  };
  const fileInputFields = [
    {
      id: 1,
      type: 'file',
      label: 'Channel logo',
      name: 'imageFile',
      placeholder: '',
      accept: 'image/png, image/jpeg, application/pdf',
      onChange: handleFileChange,
      onClick: handleFileClick,
      onUpload: handleFileUpload,
      file: imageFile,
      upload: isImageUploaded,
      loading: isImageLoading,
      link: imageLink,
      loader: fileLoader(),
    },
  ];
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: isOrgExistByPan
      ? {
          nameAsPerPAN: fetchedDataByPan?.nameAsPerPAN
            ? fetchedDataByPan.nameAsPerPAN
            : '',
          nameAsPerGST: fetchedDataByPan?.nameAsPerGST
            ? fetchedDataByPan.nameAsPerGST
            : '',
          panNumber: fetchedDataByPan?.panNumber
            ? fetchedDataByPan.panNumber
            : '',
          organizationType: fetchedDataByPan?.organizationType
            ? fetchedDataByPan.organizationType
            : '',
          organizationOperationType: fetchedDataByPan?.organizationOperationType
            ? fetchedDataByPan.organizationOperationType
            : '',
          dueDate: '',
          retailerType: '',
          mId: '',
        }
      : {
          nameAsPerPAN: '',
          userName: '',
          nameAsPerGST: '',
          userEmail: '',
          userPhone: '',
          imageLink: '',
          panNumber: '',
          userType: '',
          organizationType: '',
          organizationOperationType: '',
          dueDate: '',
          retailerType: '',
          mId: '',
        },

    validationSchema: isOrgExistByPan
      ? Yup.object({
          nameAsPerPAN: Yup.string()
            .matches(
              /^[a-zA-Z0-9\s]+$/,
              'Only alphabets and numbers is allowed for Username '
            )
            .required('Organization Name is required'),
          nameAsPerGST: Yup.string().required('Channel Name is required'),
          organizationType: Yup.string().required(
            'Organization type is required'
          ),
          organizationOperationType: Yup.string().required(
            'Organization operation type is required'
          ),
          panNumber: Yup.string().required('PAN is required'),
          dueDate: Yup.number().required('Please select number of days'),
          mId: Yup.string().required('MID is required'),
          retailerType: Yup.string(),
        })
      : Yup.object({
          nameAsPerPAN: Yup.string()
            .matches(
              /^[a-zA-Z0-9\s]+$/,
              'Only alphabets and numbers is allowed for Username '
            )
            .required('Organization Name is required'),
          userName: Yup.string()
            .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed for Username ')
            .required('User Name is required'),
          nameAsPerGST: Yup.string().required('Channel Name is required'),
          userEmail: Yup.string()
            .email('Email should be in correct format')
            .required('Email address is required'),
          userPhone: Yup.string()
            .matches(/^\d{10}$/, 'Phone number must digits only')
            .required('Phone number is required'),
          organizationType: Yup.string().required(
            'Organization type is required'
          ),
          organizationOperationType: Yup.string().required(
            'Organization operation type is required'
          ),
          panNumber: Yup.string().required('PAN is required'),
          userType: Yup.string().required('User type is required'),
          dueDate: Yup.number().required('Please select number of days'),
          mId: Yup.string().required('MID is required'),
          retailerType: Yup.string(),
        }),

    onSubmit: values => {
      if (isOrgExistByPan) {
        const newChannel = {
          nameAsPerPAN: values.nameAsPerPAN,
          organizationType: values.organizationType,
          organizationOperationType: values.organizationOperationType,
          nameAsPerGST: values.nameAsPerGST,
          panNumber: values.panNumber.toUpperCase(),
          imageLink: imageLink && imageLink.length > 0 ? imageLink : '',
          currentSaleschannelId: Number(channelId),
          manufacturerOrgId: companyDetails.id,
          currentOrgId: selectedOrganization.organizationId,
          dueDate: values.dueDate,
          retailerSubType: values.retailerType,
          mId: values.mId,
          childOrgId: fetchedDataByPan?.id ? fetchedDataByPan.id : '',
        };
        const notificationId = ApiNotificationLoading();
        addOrgToSalesChannel(newChannel)
          .then(response => {
            if (response.statusCode === 200 || response.statusCode === 201) {
              ApiNotificationUpdate(notificationId, `${response.message}`, 2);
              validation.resetForm();
              setimageFile(null);
              setImageLink(null);
              handleAddModalUpdate();
            } else {
              ApiNotificationUpdate(notificationId, `${response.message}`, 4);
            }
          })
          .catch(err => {
            ApiNotificationUpdate(
              notificationId,
              `Unable to serve the request. Please try again!`,
              4
            );
          });
      } else {
        const newChannel = {
          nameAsPerPAN: values.nameAsPerPAN,
          organizationType: values.organizationType,
          organizationOperationType: values.organizationOperationType,
          nameAsPerGST: values.nameAsPerGST,
          userName: values.userName,
          userEmail: values.userEmail,
          userPhone: values.userPhone,
          userType: values.userType,
          panNumber: values.panNumber.toUpperCase(),
          imageLink: imageLink && imageLink.length > 0 ? imageLink : '',
          currentSaleschannelId: Number(channelId),
          manufacturerOrgId: companyDetails.id,
          currentOrgId: selectedOrganization.organizationId,
          dueDate: values.dueDate,
          retailerSubType: values.retailerType,
          mId: values.mId,
        };
        const notificationId = ApiNotificationLoading();
        addSalesChannel(newChannel)
          .then(response => {
            if (response.statusCode === 200 || response.statusCode === 201) {
              ApiNotificationUpdate(notificationId, `${response.message}`, 2);
              validation.resetForm();
              setimageFile(null);
              setImageLink(null);
              handleAddModalUpdate();
            } else {
              ApiNotificationUpdate(notificationId, `${response.message}`, 4);
            }
          })
          .catch(err => {
            ApiNotificationUpdate(
              notificationId,
              `Unable to serve the request. Please try again!`,
              4
            );
          });
      }
    },
  });

  return (
    <>
      <Modal isOpen={isOpenModal}>
        <ModalHeader tag="h4">
          {modalHeader}
          <button
            type="button"
            onClick={addChannelToggle}
            className="close font-size-14 m-2"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </ModalHeader>
        <ModalBody>
          <Form
            onSubmit={e => {
              e.preventDefault();
              validation.handleSubmit();
            }}
          >
            <Row>
              <Col className="col-12">
                {formInputFields.map(val => {
                  return val.id !== 11 ? (
                    <div className="mb-3" key={val.id}>
                      <div className="mb-0 d-flex flex-column">
                        <Label className=" mb-0 form-label">{val.label}</Label>
                        <small className="mb-1">{val.descp && val.descp}</small>
                      </div>
                      <Input
                        className="form-control"
                        name={val.name}
                        type={val.type}
                        disabled={!!fetchedDataByPan[val.name]}
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
                      >
                        {val.type === 'select' ? (
                          <>
                            <option disabled value="">
                              {val.placeholder}
                            </option>
                            {Object.keys(val.selectOption).map((item, key) => (
                              <option key={key} value={val.selectOption[item]}>
                                {item}
                              </option>
                            ))}
                          </>
                        ) : null}
                      </Input>
                      {validation.touched[val.name] &&
                      validation.errors[val.name] ? (
                        <FormFeedback type="invalid">
                          {validation.errors[val.name]}
                        </FormFeedback>
                      ) : null}
                    </div>
                  ) : (
                    validation.values.organizationOperationType ===
                      'retailer' && (
                      <div className="mb-3" key={val.id}>
                        <Label className="form-label">{val.label}</Label>
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
                        >
                          <option disabled value="">
                            {val.placeholder}
                          </option>
                          {Object.keys(val.selectOption).map((item, key) => (
                            <option key={key} value={val.selectOption[item]}>
                              {item}
                            </option>
                          ))}
                        </Input>
                        {validation.touched[val.name] &&
                        validation.errors[val.name] ? (
                          <FormFeedback type="invalid">
                            {validation.errors[val.name]}
                          </FormFeedback>
                        ) : null}
                      </div>
                    )
                  );
                })}
                {fileInputFields.map(val => {
                  return (
                    <div className="mb-3" key={val.id}>
                      <Label className="form-label">{val.label}</Label>
                      <Input
                        className="form-control"
                        name={val.name}
                        type={val.type}
                        accept={val.accept}
                        onChange={val['onChange']}
                        onClick={val['onClick']}
                        onBlur={validation.handleBlur}
                        invalid={
                          validation.touched[val.name] &&
                          validation.errors[val.name]
                            ? true
                            : false
                        }
                      />
                      {val.file && (
                        <div>
                          <Label className="file-name mt-1">
                            {val.file['name']}
                          </Label>
                          {true ? (
                            val.loading ? (
                              val.loader
                            ) : val.link ? (
                              <>
                                <Label className="text-primary mx-1">
                                  File Uploaded Successfully.
                                </Label>
                                <i className="fas fa-check-circle m-2" />
                              </>
                            ) : (
                              <div className="text-danger">
                                File upload process took too long. Please try
                                again!{' '}
                              </div>
                            )
                          ) : (
                            <></>
                          )}
                        </div>
                      )}
                      {validation.touched[val.name] &&
                      validation.errors[val.name] ? (
                        <FormFeedback type="invalid">
                          {validation.errors[val.name]}
                        </FormFeedback>
                      ) : null}
                    </div>
                  );
                })}
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="text-end">
                  <button
                    type="button"
                    onClick={addChannelToggle}
                    className="btn btn-success save-customer me-3"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success save-customer"
                  >
                    Save
                  </button>
                </div>
              </Col>
            </Row>
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
};

export default SalesChannelCreateModal;
