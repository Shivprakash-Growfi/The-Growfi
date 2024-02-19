import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
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
  Notification,
  ApiNotificationLoading,
  ApiNotificationUpdate,
} from 'components/Notification/ToastNotification';
import { AMOUNT_REGEX, fileLoader } from 'helpers/utilities';
import { allDocumentsUpload } from 'components/Common/FileSizeTypeChecker';
import {
  getAllProductsDataByOrgId,
  addCanceledCheque,
} from 'helpers/backend_helper';

const AddChequeModal = props => {
  const { handleModalClose, settableData } = props;

  const [productOpt, setProductOpt] = useState([]); // arr for product

  // cheque file states
  const [chequeFileDetails, setChequeFileDetails] = useState({
    chequeFile: null,
    ischequeFileUploaded: false,
    chequeFileLink: '',
    chequeFileLoading: false,
    chequeFileName: '',
  });

  // selected organization
  const { selectedOrg } = useSelector(state => ({
    selectedOrg: state.Login.selectedOrganization,
  }));

  const inputFieldsArray = [
    {
      id: 1,
      type: 'string',
      label: 'Cheque Number *',
      name: 'chequeNumber',
      placeholder: 'Enter cheque number',
    },
    {
      id: 2,
      type: 'string',
      label: 'Cheque Limit/Amount *',
      name: 'chequeLimit',
      placeholder: 'Enter limit or amount of the cheque',
    },
  ];

  // validation
  const validation = useFormik({
    initialValues: {
      selectedProduct: '',
      chequeLimit: '',
      chequeFile: '',
      chequeNumber: '',
    },

    validationSchema: Yup.object({
      selectedProduct: Yup.string().required('Please Select a Product'),
      chequeLimit: Yup.string()
        .matches(AMOUNT_REGEX, 'Invalid cheque limit amount')
        .max(13, 'Cheque limit cannot exceed 13 digits')
        .required('Please enter the amount of the cheque limit'),
      chequeNumber: Yup.string()
        .max(20, 'Cheque number cannot exceed more than 25 charachters')
        .required('Please enter the cheque number'),
    }),

    onSubmit: values => {
      if (chequeFileDetails?.chequeFileLink?.length < 1) {
        validation.setErrors({
          chequeFile: 'Please upload a cancelled cheque file',
        });
      } else {
        const chequeDetails = {
          orgId: selectedOrg.organizationId,
          productSelected: productOpt[values.selectedProduct].id || '',
          chequeLimit: parseFloat(values?.chequeLimit),
          chequeNumber: values.chequeNumber,
          chequeFileName: chequeFileDetails?.chequeFileName || '',
          chequeFileLink: chequeFileDetails?.chequeFileLink || '',
        };

        const toastId = ApiNotificationLoading(
          'Please wait, saving cheque data'
        );
        addCanceledCheque(
          chequeDetails.orgId,
          chequeDetails.productSelected,
          chequeDetails.chequeLimit,
          chequeDetails.chequeNumber,
          chequeDetails.chequeFileName,
          chequeDetails.chequeFileLink
        )
          .then(response => {
            if (
              response &&
              (response.statusCode === 200 || response.statusCode === 201)
            ) {
              ApiNotificationUpdate(
                toastId,
                'Cheque details successfully saved.',
                2
              );
              //Api response is only sending product id, but in table we need product name
              let productId = response?.data?.chequeDetails?.productId; //for getting product name
              let product = productOpt.find(obj => {
                if (obj?.id === productId) {
                  return obj;
                }
              });
              settableData(prevData => [
                ...prevData,
                {
                  chequeLimit: response?.data?.chequeDetails?.chequeAmount,
                  chequeNumber:
                    response?.data?.chequeDetails?.chequeNumber || '',
                  docLink: response?.data?.fileDetails?.docLink || '',
                  fileName: response?.data?.fileDetails?.fileName || '',
                  productName: product?.label || '',
                },
              ]);
              handleModalClose();
            } else {
              ApiNotificationUpdate(
                toastId,
                'Something went wrong, please verify the details are correct or not',
                4
              );
            }
          })
          .catch(err => {
            ApiNotificationUpdate(
              toastId,
              'Something went wrong, please try again later',
              4
            );
          });
      }
    },
  });

  // convert reponse to object for product list
  const makeProductList = data => {
    const convertedArray = data.map((item, index) => {
      return {
        index: index,
        label: item?.product?.productIdentifier || '',
        value: item?.product?.id,
        id: item?.product?.id,
      };
    });

    return convertedArray;
  };

  // call get all products data api
  useEffect(() => {
    getAllProductsDataByOrgId(selectedOrg?.organizationId)
      .then(response => {
        if (
          response &&
          (response.statusCode === 200 || response.statusCode === 201)
        ) {
          let convertedArray = makeProductList(response.data);
          setProductOpt(convertedArray);
        } else {
          Notification(
            'Product details could not be found, please try again later',
            4
          );
        }
      })
      .catch(err => {
        Notification('Request failed, please try again later', 4);
      });
  }, []);

  const handleChequeFileChange = e => {
    const selectedFile = e.target.files && e.target.files[0];
    if (selectedFile) {
      setChequeFileDetails(prevState => ({
        ...prevState,
        chequeFile: selectedFile,
      }));
      handleChequeFileUpload(selectedFile);
    } else {
      const { target = {} } = e || {};
      target.value = '';
      setChequeFileDetails(prevState => ({
        ...prevState,
        ischequeFileUploaded: false,
        chequeFileLink: '',
        chequeFile: null,
      }));
    }
  };

  const handleChequeFileUpload = selectedFile => {
    async function fetchFileData() {
      const loadingId = ApiNotificationLoading();
      try {
        setChequeFileDetails(prevState => ({
          ...prevState,
          chequeFileLoading: true,
        }));
        const uploadedData = await allDocumentsUpload(
          selectedOrg?.organizationId,
          selectedFile,
          'others',
          ['image/jpeg', 'image/png', 'application/pdf'],
          'jpg, png and pdf',
          2
        );
        if (uploadedData && uploadedData.statusCode == 200) {
          setChequeFileDetails(prevState => ({
            ...prevState,
            ischequeFileUploaded: true,
            chequeFileLink: uploadedData?.data?.fileLink,
            chequeFileName: uploadedData?.data?.fileName,
            chequeFileLoading: false,
          }));
          ApiNotificationUpdate(loadingId, `File uploaded successfully`, 2);
        } else {
          ApiNotificationUpdate(loadingId, `File not uploaded`, 4);
          setChequeFileDetails(prevState => ({
            ...prevState,
            chequeFileLink: null,
            chequeFileLoading: false,
          }));
        }
      } catch (error) {
        ApiNotificationUpdate(loadingId, `hii`, 4);
        setChequeFileDetails(prevState => ({
          ...prevState,
          chequeFileLink: null,
          chequeFileLoading: false,
        }));
      }
    }
    fetchFileData();
  };

  const fileUploadInputFields = [
    {
      id: 1,
      type: 'file',
      label: 'Upload Cancelled Cheque *',
      name: 'chequeFile',
      placeholder: '',
      accept: 'image/png, image/jpeg, application/pdf',
      onChange: handleChequeFileChange,
      onUpload: handleChequeFileUpload,
      file: chequeFileDetails?.chequeFile,
      upload: chequeFileDetails?.ischequeFileUploaded,
      loading: chequeFileDetails?.chequeFileLoading,
      link: chequeFileDetails?.chequeFileLink,
      loader: fileLoader(),
    },
  ];

  return (
    <>
      <Modal isOpen={true} size="md">
        <ModalHeader tag="h4">
          Add Canceled Cheque
          <Button
            type="button"
            onClick={handleModalClose}
            className="close font-size-14 m-2"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </Button>
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
                      label={'Product *'}
                      name={'selectedProduct'}
                      optionsArr={productOpt}
                      validation={validation}
                    />
                  </Col>
                </Row>

                {inputFieldsArray.map(val => {
                  return (
                    <div className="mb-3" key={val.id}>
                      <Label className="form-label">{val.label}</Label>
                      <Input
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
                      />
                      {validation.touched[val.name] &&
                      validation.errors[val.name] ? (
                        <FormFeedback type="invalid">
                          {validation.errors[val.name]}
                        </FormFeedback>
                      ) : null}
                    </div>
                  );
                })}

                {fileUploadInputFields.map(val => {
                  return (
                    <div className="mb-3" key={val.id}>
                      <Label className="form-label">{val.label}</Label>
                      <Input
                        className="form-control"
                        name={val.name}
                        type={val.type}
                        accept={val.accept}
                        onChange={val['onChange']}
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
          </ModalBody>
          <ModalFooter>
            <Button className={'btn btn-danger'} onClick={handleModalClose}>
              Cancel
            </Button>
            <Button type="submit" className={'btn btn-success'}>
              Save
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </>
  );
};

export default AddChequeModal;
