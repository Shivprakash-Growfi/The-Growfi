import React, { useEffect, useState } from 'react';
import {
  ApiNotificationLoading,
  ApiNotificationUpdate,
} from 'components/Notification/ToastNotification';
import { useFormik } from 'formik';
import {
  addProductToLender,
  editLenderProduct,
  getAllLenders,
} from 'helpers/backend_helper';

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
import { AMOUNT_REGEX } from 'helpers/utilities';

const CreateProductModal = props => {
  const {
    isShowCreateModal,
    handleCreateModalClose,
    handleModalUpdate,
    lenderData,
    rowData,
    mainRowData,
    isEditOpen = false,
  } = props;

  const productInputFields = [
    {
      id: 1,
      type: 'select',
      label: 'Lender *',
      name: 'lenderOrg',
      placeholder: 'Select Lender',
      selectOption: lenderData,
      isDisabled: isEditOpen,
    },
    {
      id: 2,
      type: 'string',
      label: 'Product Name *',
      name: 'prodCode',
      placeholder: 'Enter Product name',
      maxLength: '30',
      isDisabled: isEditOpen,
    },
    {
      id: 3,
      type: 'string',
      label: 'Rate (%)*',
      name: 'rate',
      placeholder: 'Enter rate',
      maxLength: '7',
    },
    {
      id: 4,
      type: 'string',
      label: 'Duration days *',
      name: 'duration',
      placeholder: 'Select duration',
      maxLength: '3',
    },
    {
      id: 5,
      type: 'string',
      label: 'Amount *',
      name: 'amount',
      placeholder: 'Enter amount',
      maxLength: '30',
    },
    {
      id: 6,
      type: 'string',
      label: 'Penalty rate (%)*',
      name: 'penRate',
      placeholder: 'Enter penalty rate',
      maxLength: '7',
    },
    {
      id: 7,
      type: 'string',
      label: 'Default Days *',
      name: 'defDate',
      placeholder: 'Enter default days',
      maxLength: '3',
    },
    {
      id: 8,
      type: 'select',
      label: 'Product type *',
      name: 'prodType',
      placeholder: 'Select product type',
      selectOption: {
        'Purchase Finance': 'purchaseFinance',
        'Purchase Invoice Discounting': 'invoiceDiscounting',
      },
    },
  ];

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: isEditOpen
      ? {
          lenderOrg: mainRowData.id,
          prodCode: rowData.productIdentifier,
          rate: rowData.dailyRateOfInterest,
          duration: rowData.durationDays,
          amount: rowData.amountCommitedByLender,
          penRate: rowData.penaltyRatePerDay,
          defDate: rowData.defaultDays,
          prodType: rowData.typeOfFinance,
        }
      : {
          lenderOrg: '',
          prodCode: '',
          rate: '',
          duration: '',
          amount: '',
          penRate: '',
          defDate: '',
          prodType: '',
        },
    validationSchema: Yup.object({
      lenderOrg: Yup.string().required('Lender is required!'),
      prodCode: Yup.string().required('Product code is required!'),
      rate: Yup.string()
        .matches(/^(100|\d{0,2}(\.\d{1,3})?)$/, 'Invalid rate (correct: 0-100)')
        .required('Rate is required!'),
      duration: Yup.string()
        .matches(/^\d{1,3}$/, 'Invalid duration')
        .required('Duration is required!'),
      amount: Yup.string()
        .matches(AMOUNT_REGEX, 'Please enter valid amount')
        .max(13, 'Amount cannot exceed 13 digits')
        .required('Amount is required!'),
      penRate: Yup.string()
        .matches(/^(100|\d{0,2}(\.\d{1,3})?)$/, 'Invalid rate (correct: 0-100)')
        .required('Penalty rate is required!'),
      defDate: Yup.string()
        .matches(/^\d{1,3}$/, 'Invalid input days')
        .required('default days is required!'),
      prodType: Yup.string().required('Financial year is required!'),
    }),

    onSubmit: values => {
      if (!isEditOpen) {
        const lenderDataObj = {
          lenderId: parseInt(values.lenderOrg),
          productIdentifier: values.prodCode,
          dailyRateOfInterest: parseFloat(values.rate),
          durationDays: parseInt(values.duration),
          amountCommitedByLender: parseFloat(values.amount),
          penaltyRatePerDay: parseFloat(values.penRate),
          defaultDays: parseInt(values.defDate),
          typeOfFinance: values.prodType,
        };
        const loadingId = ApiNotificationLoading();
        addProductToLender(lenderDataObj)
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
        const editDataObj = {
          productId: parseInt(rowData.id),
          productIdentifier: values.prodCode,
          dailyRateOfInterest: parseFloat(values.rate),
          durationDays: parseInt(values.duration),
          amountCommitedByLender: parseFloat(values.amount),
          penaltyRatePerDay: parseFloat(values.penRate),
          defaultDays: parseInt(values.defDate),
          typeOfFinance: values.prodType,
        };
        const loadingId = ApiNotificationLoading();
        editLenderProduct(editDataObj)
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
      }
    },
  });

  return (
    <>
      <Modal isOpen={isShowCreateModal}>
        <ModalHeader>
          {!isEditOpen
            ? "Create lender's product"
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
          <Form>
            <Row>
              <Col>
                {productInputFields.map(val => {
                  return (
                    <div className="mb-3" key={val.id}>
                      <Label className="form-label">{val.label}</Label>
                      <Input
                        className="form-control"
                        name={val.name}
                        type={val.type}
                        maxLength={val.maxLength}
                        disabled={val.isDisabled}
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
                  );
                })}
              </Col>
            </Row>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleCreateModalClose}>Close</Button>
          <Button onClick={validation.handleSubmit}>Save</Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default CreateProductModal;
