import { useFormik } from 'formik';
import React, { useEffect, useState, useCallback } from 'react';
import Select from 'react-select';
import {
  Button,
  Col,
  Form,
  FormFeedback,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from 'reactstrap';
import * as Yup from 'yup';

import AsyncSelect from 'react-select/async';
import './DropdownStyle.scss';
import {
  createOrganizationAndProductMapping,
  editProductMapping,
  getAllLenders,
  getLenderProductList,
  getOrganizationsByPrefix,
} from 'helpers/backend_helper';
import {
  ApiNotificationLoading,
  ApiNotificationUpdate,
} from 'components/Notification/ToastNotification';
import { debounce } from 'lodash';
import { AMOUNT_REGEX } from 'helpers/utilities';

const OrgLenderMappingModal = props => {
  const {
    isShowCreateModal,
    handleCreateModalClose,
    handleModalUpdate,
    rowData,
    mainRowData,
    isEditOpen = false,
  } = props;
  // const [OrgOptions, setOrgOptions] = useState([]);
  const [lenderOptions, setLenderOptions] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  // const [orgSearchInput, setOrgSearchInput] = useState('');
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: !isEditOpen
      ? {
          org: '',
          lenderOrg: '',
          products: '',
          orgLimit: '',
        }
      : {
          org: mainRowData,
          lenderOrg: rowData.lenderId,
          products: rowData.product.id,
          orgLimit: rowData.amountCommited,
        },

    validationSchema: Yup.object({
      org: Yup.object().required('Organization is required!'),
      lenderOrg: Yup.string().required('Lender is required!'),
      products: Yup.string().required('Product is required!'),
      orgLimit: Yup.string()
        .matches(AMOUNT_REGEX, 'Please enter valid amount')
        .max(13, 'Amount cannot exceed 13 digits')
        .required('Limit is required!'),
    }),

    onSubmit: values => {
      const mappingDataObj = {
        productId: parseInt(values.products),
        orgId: parseInt(values.org.value),
        amountCommited: parseFloat(values.orgLimit),
      };
      if (!isEditOpen) {
        const loadingId = ApiNotificationLoading();
        createOrganizationAndProductMapping(mappingDataObj)
          .then(response => {
            if (response.statusCode === 200 || response.statusCode === 200) {
              ApiNotificationUpdate(loadingId, `${response.message}`, 2);
              handleCreateModalClose();
              handleModalUpdate();
            } else {
              ApiNotificationUpdate(loadingId, `${response.message}`, 4);
            }
          })
          .catch(err => {
            console.log(err);
            ApiNotificationUpdate(loadingId, `Unable to upload!`, 4);
          });
      } else {
        const mappingId = rowData ? rowData.mappingId : ' ';
        const amount = parseFloat(values.orgLimit);
        const loadingId = ApiNotificationLoading();
        editProductMapping(mappingId, amount)
          .then(response => {
            if (response.statusCode === 200 || response.statusCode === 200) {
              ApiNotificationUpdate(loadingId, `${response.message}`, 2);
              handleCreateModalClose();
              handleModalUpdate();
            } else {
              ApiNotificationUpdate(loadingId, `${response.message}`, 4);
            }
          })
          .catch(err => {
            ApiNotificationUpdate(loadingId, `Unable to upload!`, 4);
          });
      }
    },
  });
  const secondFieldValue = validation.values.lenderOrg;
  useEffect(() => {
    if (secondFieldValue) {
      // Fetch the third field options based on the selected value of the second field.
      getLenderProductList(secondFieldValue)
        .then(response => {
          response.data.map(val => {
            setProductOptions(prev => ({
              ...prev,
              [val.productIdentifier]: val.id,
            }));
          });
        })
        .catch(error => {
          console.error('Error fetching third field options:', error);
        });
    }
  }, [secondFieldValue]);

  // Function to fetch options asynchronously
  const loadOrgOptions = (inputValue, callback) => {
    if (inputValue.length > 0) {
      getOrganizationsByPrefix(`${inputValue}`)
        .then(response => {
          const data = response.data;

          const options = data.map(item => ({
            value: item.id,
            label: item.nameAsPerGST,
          }));

          callback(options);
        })
        .catch(error => {
          console.error('Error loading options:', error);
        });
    }
  };
  const debouncedLoadOptions = useCallback(debounce(loadOrgOptions, 300), []);

  const loadSecondFieldOptions = async () => {
    try {
      // Fetch options for the second field
      const jsonData = await getAllLenders();
      if (
        jsonData &&
        (jsonData.statusCode === 200 || jsonData.statusCode === 201)
      ) {
        jsonData.data.map(val => {
          setLenderOptions(prev => ({
            ...prev,
            [val.nameAsPerGST]: val.id,
          }));
        });
      } else {
        Notification(`${jsonData.message}`, 4);
      }
    } catch (error) {
      console.error('Error fetching second field options:', error);
    }
  };
  useEffect(() => {
    loadSecondFieldOptions();
  }, []);

  const SelectInputFields1 = [
    {
      id: 2,
      type: 'select',
      label: 'Lenders *',
      name: 'lenderOrg',
      placeholder: 'Select Lender',
      selectOption: lenderOptions,
    },
    {
      id: 3,
      type: 'select',
      label: 'Products *',
      name: 'products',
      placeholder: 'Select Product',
      selectOption: productOptions,
    },
  ];

  const inputField = [
    {
      id: 4,
      type: 'string',
      label: 'Organization Limit *',
      name: 'orgLimit',
      placeholder: 'Enter Organization limit for product',
      maxLength: '30',
    },
  ];

  return (
    <>
      <Modal isOpen={isShowCreateModal}>
        <ModalHeader>
          {!isEditOpen
            ? 'Map Organization with product'
            : ` Edit "${mainRowData?.nameAsPerGST}" product`}
          <button
            type="button"
            onClick={handleCreateModalClose}
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
              <Col>
                <div className="mb-3">
                  <label className="form-label">Select an Organization</label>
                  <AsyncSelect
                    cacheOptions
                    defaultOptions
                    isDisabled={isEditOpen}
                    noOptionsMessage={({ inputValue }) => {
                      if (!inputValue) {
                        return 'Please type to search';
                      }
                      return 'No options found';
                    }}
                    loadOptions={debouncedLoadOptions}
                    value={validation.values.org}
                    onChange={newValue => {
                      validation.setFieldValue('org', newValue);
                    }}
                    onBlur={validation.handleBlur('org')}
                    styles={{
                      option: base => ({
                        ...base,
                        height: '100%',
                        'z-index': '1',
                        backgroundColor: 'white',
                        color: 'black',
                      }),
                      noOptionsMessage: base => ({
                        ...base,
                        color: 'grey',
                        backgroundColor: 'white',
                      }),
                    }}
                  />
                  {validation.touched.org && validation.errors.org ? (
                    <div className="error">{validation.errors.org}</div>
                  ) : null}
                </div>
                <div>
                  {SelectInputFields1.map(val => {
                    return val.id !== 11 ? (
                      <div className="mb-3" key={val.id}>
                        <Label className="form-label">{val.label}</Label>
                        <Input
                          className="form-control"
                          name={val.name}
                          type={val.type}
                          disabled={isEditOpen}
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
                              {Object.keys(val.selectOption).map(
                                (item, key) => (
                                  <option
                                    key={key}
                                    value={val.selectOption[item]}
                                  >
                                    {item}
                                  </option>
                                )
                              )}
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
                  {inputField.map(val => {
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
                              {Object.keys(val.selectOption).map(
                                (item, key) => (
                                  <option
                                    key={key}
                                    value={val.selectOption[item]}
                                  >
                                    {item}
                                  </option>
                                )
                              )}
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
                    );
                  })}
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="text-end">
                  <Button className="me-3" onClick={handleCreateModalClose}>
                    Close
                  </Button>
                  <Button type="submit">Save</Button>
                </div>
              </Col>
            </Row>
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
};

export default OrgLenderMappingModal;
