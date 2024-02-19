import {
  FileUpload,
  allDocumentsUpload,
} from 'components/Common/FileSizeTypeChecker';
import {
  ApiNotificationLoading,
  ApiNotificationUpdate,
  Notification,
} from 'components/Notification/ToastNotification';
import { useFormik } from 'formik';
import {
  allDocsUpload,
  docUploadToS3Bucket,
  saveOrganizationFinancialDetails,
} from 'helpers/backend_helper';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Button,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  FormFeedback,
  Row,
  Col,
  Form,
  Spinner,
} from 'reactstrap';
import * as Yup from 'yup';
import { fileLoader } from 'helpers/utilities';

const GstReturnUploadModal = props => {
  const { isOpen, CustomModalHeader, handleModalCancel, handleModalUpdate } =
    props;
  const [imageFile, setimageFile] = useState(null);
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [imageLink, setImageLink] = useState('');
  const [isImageLoading, setIsImageLoading] = useState(false);
  const { selectedOrganization } = useSelector(state => ({
    selectedOrganization: state.Login.selectedOrganization,
  }));
  const inputFields = [
    {
      id: 1,
      type: 'month',
      label: 'Start date *',
      name: 'startDate',
      placeholder: 'Choose a year',
    },
    {
      id: 2,
      type: 'month',
      label: 'End date *',
      name: 'endDate',
      placeholder: 'Choose a year',
    },
  ];
  // File Upload handling
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
          'gstReturn'
        );
        if (uploadedData && uploadedData.statusCode == 200) {
          setIsImageUploaded(true);
          setIsImageLoading(false);
          setImageLink(uploadedData.data);
          ApiNotificationUpdate(loadingId, `File uploaded successfully`, 2);
        } else {
          ApiNotificationUpdate(
            loadingId,
            `File upload Failed! Please try again`,
            4
          );
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
      label: 'GST returns *',
      name: 'fileLink',
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

    initialValues: {
      startDate: '',
      endDate: '',
      fileLink: '',
    },

    validationSchema: Yup.object({
      startDate: Yup.date().required('Start Date is required'),
      endDate: Yup.date()
        .required('End Date is required')
        .min(Yup.ref('startDate'), 'End Date must be after Start Date'),
    }),

    onSubmit: values => {
      if (imageLink?.length < 1) {
        validation.setErrors({ fileLink: 'Please upload a file!' });
      } else {
        const gstLinks = [
          {
            startDate: values.startDate,
            endDate: values.endDate,
            link: imageLink?.fileLink ? imageLink.fileLink : '',
            fileName: imageLink?.fileName ? imageLink.fileName : '',
          },
        ];
        const loadingId = ApiNotificationLoading();
        saveOrganizationFinancialDetails(
          selectedOrganization.organizationId,
          [],
          gstLinks,
          '',
          ''
        )
          .then(response => {
            if (response?.statusCode === 200 || response?.statusCode === 201) {
              const respData = response.data;
              ApiNotificationUpdate(loadingId, `${response.message}`, 2);
              respData?.gstReturn && handleModalUpdate(respData.gstReturn);
              handleModalClose();
            } else {
              ApiNotificationUpdate(loadingId, `${response.message}`, 4);
              validation.resetForm();
              handleModalClose();
            }
          })
          .catch(err => {
            ApiNotificationUpdate(loadingId, `Unable to upload!`, 4);
            validation.resetForm();
            handleModalClose();
          });
      }
    },
  });
  const handleModalClose = () => {
    validation.resetForm();
    setIsImageUploaded(false);
    setImageLink('');
    setimageFile(null);
    handleModalCancel();
  };
  return (
    <Modal isOpen={isOpen}>
      <ModalHeader tag="h4">
        {CustomModalHeader}
        <button
          type="button"
          onClick={handleModalClose}
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
            return false;
          }}
        >
          <Row>
            <Col className="col-12">
              {inputFields.map(val => {
                return (
                  <div className="mb-3" key={val.id}>
                    <Label className="form-label">{val.label}</Label>
                    <Input
                      className="form-control"
                      name={val.name}
                      type={val.type}
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
                    ></Input>
                    {validation.touched[val.name] &&
                    validation.errors[val.name] ? (
                      <FormFeedback type="invalid">
                        {validation.errors[val.name]}
                      </FormFeedback>
                    ) : null}
                  </div>
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
                <Button
                  color="danger"
                  className="me-3"
                  onClick={handleModalClose}
                >
                  Cancel
                </Button>
                <Button color="success" type="submit">
                  Upload
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </ModalBody>
    </Modal>
  );
};
export default GstReturnUploadModal;
