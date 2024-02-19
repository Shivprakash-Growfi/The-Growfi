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

import { useFormik } from 'formik';

import {
  FileUpload,
  allDocumentsUpload,
} from 'components/Common/FileSizeTypeChecker';
import {
  ApiNotificationLoading,
  ApiNotificationUpdate,
  Notification,
} from 'components/Notification/ToastNotification';
import {
  allDocsUpload,
  docUploadToS3Bucket,
  saveOrganizationFinancialDetails,
} from 'helpers/backend_helper';
import { fileLoader } from 'helpers/utilities';

const ItrUploadModal = props => {
  const { isOpen, CustomModalHeader, handleModalCancel, handleModalUpdate } =
    props;
  const [imageFile, setimageFile] = useState(null);
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [imageLink, setImageLink] = useState('');
  const [isImageLoading, setIsImageLoading] = useState(false);

  // Computation upload
  const [imageFileComp, setimageFileComp] = useState(null);
  const [isImageUploadedComp, setIsImageUploadedComp] = useState(false);
  const [imageLinkComp, setImageLinkComp] = useState('');
  const [isImageLoadingComp, setIsImageLoadingComp] = useState(false);

  const { selectedOrganization } = useSelector(state => ({
    selectedOrganization: state.Login.selectedOrganization,
  }));
  const financialYears = {
    'Year 2017-18': '2017-18',
    'Year 2018-19': '2018-19',
    'Year 2019-20': '2019-20',
    'Year 2020-21': '2020-21',
    'Year 2021-22': '2021-22',
    'Year 2022-23': '2022-23',
    'Year 2023-24': '2023-24',
    'Year 2024-25': '2024-25',
    'Year 2025-26': '2025-26',
    'Year 2026-27': '2026-27',
  };
  const inputFields = [
    {
      id: 1,
      type: 'select',
      label: 'Financial Year *',
      name: 'year',
      placeholder: 'Choose a year',
      selectOption: financialYears,
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
          'ITR'
        );
        if (uploadedData && uploadedData.statusCode == 200) {
          setImageLink(uploadedData.data);
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
  // Computation upload handling

  const handleFileCompChange = e => {
    const selectedFile = e.target.files && e.target.files[0];
    setimageFileComp(selectedFile);
    handleFileCompUpload(selectedFile);
  };

  const handleFileCompClick = e => {
    const { target = {} } = e || {};
    target.value = '';

    if (e.target.name === 'imageFileComp') {
      setIsImageUploadedComp(false);
      setImageLinkComp('');
      setimageFileComp(null);
    }
  };

  const handleFileCompUpload = selectedFile => {
    async function fetchFileData() {
      const loadingId = ApiNotificationLoading();
      try {
        setIsImageLoadingComp(true);
        const uploadedData = await allDocumentsUpload(
          selectedOrganization?.organizationId,
          selectedFile,
          'ITR'
        );
        if (uploadedData && uploadedData.statusCode == 200) {
          setImageLinkComp(uploadedData.data);
          setIsImageUploadedComp(true);
          setIsImageLoadingComp(false);
          ApiNotificationUpdate(loadingId, `File uploaded successfully`, 2);
        } else {
          ApiNotificationUpdate(loadingId, `File not uploaded`, 4);
          setImageLinkComp(null);
          setIsImageLoadingComp(false);
        }
      } catch (error) {
        ApiNotificationUpdate(loadingId, `${error?.message}`, 4);
        setImageLinkComp(null);
        setIsImageLoadingComp(false);
        console.error('Error fetching data:', error);
      }
    }
    fetchFileData();
  };

  const fileInputFields = [
    {
      id: 1,
      type: 'file',
      label: 'ITR *',
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

  const fileInputComp = [
    {
      id: 1,
      type: 'file',
      label: 'ITR Computation',
      name: 'fileLinkComp',
      placeholder: '',
      accept: 'image/png, image/jpeg, application/pdf',
      onChange: handleFileCompChange,
      onClick: handleFileCompClick,
      onUpload: handleFileCompUpload,
      file: imageFileComp,
      upload: isImageUploadedComp,
      loading: isImageLoadingComp,
      link: imageLinkComp,
      loader: fileLoader(),
    },
  ];

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      year: '',
      fileLink: '',
      fileLinkComp: '',
    },

    validationSchema: Yup.object({
      year: Yup.string().required('Financial year is required!'),
    }),

    onSubmit: values => {
      if (imageLink.length < 1) {
        validation.setErrors({ fileLink: 'Please upload a file!' });
      } else {
        const itrLinks = {
          period: values.year,
          itr: {
            link: imageLink?.fileLink ? imageLink.fileLink : '',
            fileName: imageLink?.fileName ? imageLink.fileName : '',
          },
          computation: {
            link: imageLinkComp?.fileLink ? imageLinkComp.fileLink : '',
            fileName: imageLinkComp?.fileName ? imageLinkComp.fileName : '',
          },
        };
        const loadingId = ApiNotificationLoading();
        saveOrganizationFinancialDetails(
          selectedOrganization.organizationId,
          [],
          [],
          '',
          {},
          itrLinks
        )
          .then(response => {
            if (response?.statusCode === 200 || response?.statusCode === 201) {
              const respData = response.data;
              ApiNotificationUpdate(loadingId, `${response.message}`, 2);
              respData?.itr && handleModalUpdate([respData.itr]);
              validation.resetForm();
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
      //
    },
  });
  const handleModalClose = () => {
    validation.resetForm();
    setIsImageUploaded(false);
    setImageLink('');
    setimageFile(null);

    setIsImageUploadedComp(false);
    setImageLinkComp('');
    setimageFileComp(null);
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
                      ) : (
                        <></>
                      )}
                    </Input>
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
              {fileInputComp.map(val => {
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
export default ItrUploadModal;
