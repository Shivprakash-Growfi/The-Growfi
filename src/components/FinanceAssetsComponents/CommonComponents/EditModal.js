import React, { useState, useEffect } from 'react';
import {
  Input,
  Form,
  Label,
  FormFeedback,
  Modal,
  ModalHeader,
  ModalBody,
  Row,
  Col,
  Button,
} from 'reactstrap';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { AMOUNT_REGEX } from 'helpers/utilities';

import { inputfieldsForCreateEnach } from 'components/FinanceAssetsComponents/CommonComponents/financeColumns';
import moment from 'moment';

import { usernameRegex } from 'helpers/utilities';

const EditModal = props => {
  const {
    p2bAssetData,
    handleModalClose,
    openEditModal,
    reloadTable,
    showMultipleFields = false,
    handleEditApiCall = null,
    id,
    createEnachAssetType,
    assetId,
    optionsArr,
    handleCreateEnach,
  } = props;

  const installementModeOpt = [
    { value: 'Adhoc', label: 'Adhoc' },
    { value: 'IntraDay', label: 'Intra Day' },
    { value: 'Daily', label: 'Daily' },
    { value: 'Weekly', label: 'Weekly' },
    { value: 'Monthly', label: 'Monthly' },
    { value: 'BiMonthly', label: 'Twice a Month' },
    { value: 'Quarterly', label: 'Quarterly' },
    { value: 'Semiannually', label: 'Twice a Year' },
    { value: 'Yearly', label: 'Yearly' },
  ];

  const oneTimePaymentOpt = [
    { value: 'true', label: 'True' },
    { value: 'false', label: 'False' },
  ];

  // validation
  const validation = useFormik({
    initialValues: {
      status: '',
      leafRoundId: p2bAssetData?.leafRoundId || '',
      listedAmount: p2bAssetData?.listedAmount || '',
      approvedAmount: p2bAssetData?.approvedAmount || '',
      idAmountArrayForPaid: p2bAssetData?.idAmountArray || [
        {
          transactionId: '',
          amount: '',
        },
      ],
      idAmountArrayPaidBack: p2bAssetData?.idAmountArray || [
        {
          transferId: '',
          amount: '',
        },
      ],
    },
    customerIdentifier: p2bAssetData?.customerIdentifier || '',
    enachId: p2bAssetData?.digioId || '',
    oneTimePayment: p2bAssetData?.isRecuring || '',
    installmentMode: p2bAssetData?.frequency || '',
    startDate: p2bAssetData?.firstCollectionDate || '',
    endDate: p2bAssetData?.finalCollectionDate || '',
    comment: p2bAssetData?.comment || '',

    validationSchema: Yup.object({
      status: Yup.string().required('Please select a new status'),
      listedAmount: Yup.string()
        .matches(AMOUNT_REGEX, 'Please enter valid amount')
        .max(13, 'Amount cannot exceed 13 digits')
        .nullable(),
      leafRoundId: Yup.string()
        .max(30, 'Leaf Round Id cannot be more than 30 charachters')
        .nullable(),

      approvedAmount: Yup.string()
        .matches(AMOUNT_REGEX, 'Please enter valid amount')
        .max(13, 'Amount cannot exceed 13 digits')
        .nullable(),
      idAmountArrayForPaid: Yup.array().of(
        Yup.object({
          transactionId: Yup.string()
            .max(30, 'Transaction Id cannot be more than 30 charachters')
            .nullable(),
          amount: Yup.string()
            .matches(AMOUNT_REGEX, 'Please enter valid amount')
            .max(13, 'Amount cannot exceed 13 digits')
            // .transform((value, originalValue) => {
            //   originalValue !== '' ? Number(originalValue) : null;
            // })
            .nullable(),
        })
      ),
      idAmountArrayPaidBack: Yup.array().of(
        Yup.object({
          amount: Yup.string()
            .matches(AMOUNT_REGEX, 'Please enter valid amount')
            .max(13, 'Amount cannot exceed 13 digits')
            // .transform((value, originalValue) => {
            //   originalValue !== '' ? Number(originalValue) : null;
            // })
            .nullable(),
          transferId: Yup.string()
            .max(30, 'Transfer Id cannot be more than 30 charachters')
            .nullable(),
        })
      ),
      customerIdentifier: Yup.string()
        .matches(
          usernameRegex,
          'Invalid user name format. Must be 3-16 characters long and can only contain letters, digits, spaces, underscores, or hyphens.'
        )
        .nullable(),
      comment: Yup.string()
        .max(50, 'Enter comments in less than 50 charachters')
        .nullable(),
    }),

    onSubmit: values => {
      values = {
        ...values,
        idAmountArrayForPaid: values?.idAmountArrayForPaid?.map(item => ({
          ...item,
          amount: item?.amount !== '' ? Number(item.amount, 10) : '',
        })),
        idAmountArrayPaidBack: values?.idAmountArrayPaidBack?.map(item => ({
          ...item,
          amount: item?.amount !== '' ? Number(item.amount, 10) : '',
        })),
      };

      if (values?.status !== 'enachCreated') {
        handleEditApiCall(
          validation,
          values,
          p2bAssetData,
          handleModalClose,
          reloadTable
        );
      }

      if (values?.status === 'enachCreated') {
        const currentTimestamp = moment(new Date()).format(
          'YYYY-MM-DDTHH:mm:ss.SSSZ'
        );

        const enachDetails = {
          assetId: assetId,
          assetType: createEnachAssetType,
          digioId: values?.enachId || '',
          isRecuring: values?.oneTimePayment === 'true' ? true : false,
          frequency: values?.installmentMode,
          firstCollectionDate: moment(
            `${values?.startDate}${currentTimestamp.slice(10)}`
          ).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
          finalCollectionDate: moment(
            `${values?.endDate}${currentTimestamp.slice(10)}`
          ).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
          comment: values?.comment,
          customerIdentifier: values?.customerIdentifier,
        };

        handleCreateEnach(
          enachDetails,
          handleModalClose,
          validation,
          reloadTable
        );
      }
    },
  });

  // Function to add multiple id and amount fields
  const handleAddMultipleFields = e => {
    if (e.target.id === 'paid') {
      validation.setFieldValue('idAmountArrayForPaid', [
        ...validation.values.idAmountArrayForPaid,
        {
          transactionId: '',
          amount: '',
        },
      ]);
    }
    if (e.target.id === 'paid back') {
      validation.setFieldValue('idAmountArrayPaidBack', [
        ...validation.values.idAmountArrayPaidBack,
        {
          transferId: '',
          amount: '',
        },
      ]);
    }
  };

  // Function to remove multiple id and amount fields
  const handleRemoveMultipleFields = (e, index) => {
    if (e.target.id === 'paid' + index) {
      validation.values.idAmountArrayForPaid.splice(index, 1);
      validation.setFieldValue(
        'idAmountArrayForPaid',
        validation.values.idAmountArrayForPaid
      );
    }
    if (e.target.id === 'paid back' + index) {
      validation.values.idAmountArrayPaidBack.splice(index, 1);
      validation.setFieldValue(
        'idAmountArrayPaidBack',
        validation.values.idAmountArrayPaidBack
      );
    }
  };

  return (
    <>
      <Modal
        isOpen={openEditModal}
        size={validation?.values?.status === 'enachCreated' ? 'md' : 'lg'}
      >
        <ModalHeader tag="h4">
          Edit Status
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
              <Col xs={12}>
                {/* select the new status */}
                <div className="mb-3">
                  <Label className="form-label">New Status</Label>
                  <Input
                    type="select"
                    name="status"
                    className="form-select"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.status || ''}
                    invalid={
                      validation.touched.status && validation.errors.status
                        ? true
                        : false
                    }
                  >
                    {optionsArr()}
                  </Input>
                  {validation.touched.status && validation.errors.status ? (
                    <FormFeedback type="invalid">
                      {validation.errors.status}
                    </FormFeedback>
                  ) : null}
                </div>

                {/* if status is listed then display below input fields */}
                {validation.values.status === 'listed' && (
                  <>
                    <div className="mb-3">
                      <Label className="form-label">Lead Round ID</Label>
                      <Input
                        name="leafRoundId"
                        type="text"
                        placeholder="Enter Leaf Round ID"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.leafRoundId || ''}
                        invalid={
                          validation.touched.leafRoundId &&
                          validation.errors.leafRoundId
                            ? true
                            : false
                        }
                      />
                      {validation.touched.leafRoundId &&
                      validation.errors.leafRoundId ? (
                        <FormFeedback type="invalid">
                          {validation.errors.leafRoundId}
                        </FormFeedback>
                      ) : null}
                    </div>

                    <div className="mb-3">
                      <Label className="form-label">Amount</Label>
                      <Input
                        name="listedAmount"
                        type="string"
                        placeholder="Enter Amount"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.listedAmount || ''}
                        invalid={
                          validation.touched.listedAmount &&
                          validation.errors.listedAmount
                            ? true
                            : false
                        }
                      />
                      {validation.touched.listedAmount &&
                      validation.errors.listedAmount ? (
                        <FormFeedback type="invalid">
                          {validation.errors.listedAmount}
                        </FormFeedback>
                      ) : null}
                    </div>
                  </>
                )}

                {/* if status is approved then display below input fields */}
                {validation.values.status === 'approved' && (
                  <>
                    <div className="mb-3">
                      <Label className="form-label">Amount</Label>
                      <Input
                        name="approvedAmount"
                        type="string"
                        placeholder="Enter Amount in Rs"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.approvedAmount || ''}
                        invalid={
                          validation.touched.approvedAmount &&
                          validation.errors.approvedAmount
                            ? true
                            : false
                        }
                      />
                      {validation.touched.approvedAmount &&
                      validation.errors.approvedAmount ? (
                        <FormFeedback type="invalid">
                          {validation.errors.approvedAmount}
                        </FormFeedback>
                      ) : null}
                    </div>
                  </>
                )}

                {/* if status is enachCreated then display below input fields */}
                {validation.values.status === 'enachCreated' &&
                  inputfieldsForCreateEnach?.map(val => {
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
                          // {...validation.getFieldProps(`${val.name}`)}
                          invalid={
                            validation.touched[val.name] &&
                            validation.errors[val.name]
                              ? true
                              : false
                          }
                          disabled={
                            val.name === 'installmentMode' &&
                            validation.values.oneTimePayment === undefined
                              ? true
                              : false
                          }
                        >
                          {val.type === 'select' ? (
                            <>
                              <option disabled value="">
                                {val.placeholder}
                              </option>
                              {val.name === 'oneTimePayment' &&
                                oneTimePaymentOpt?.map((item, index) => (
                                  <option key={index} value={item?.value}>
                                    {item.label}
                                  </option>
                                ))}
                              {val.name === 'installmentMode' &&
                                validation.values.oneTimePayment === 'false' &&
                                installementModeOpt?.map((item, index) => (
                                  <option key={index} value={item?.value}>
                                    {item.label}
                                  </option>
                                ))}
                              {val.name === 'installmentMode' &&
                                validation.values.oneTimePayment === 'true' && (
                                  <option value={'Adhoc'}>Adhoc</option>
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

                {/* if status is paid then display below input fields */}
                {showMultipleFields &&
                  validation.values.status === 'paid' &&
                  validation.values.idAmountArrayForPaid.map((paid, index) => {
                    return (
                      <Row key={index} className="mb-3">
                        <Col>
                          <Label className="form-label">
                            Transaction Id {index + 1}
                          </Label>
                          <Input
                            className="form-control"
                            name={`idAmountArrayForPaid[${index}].transactionId`}
                            type="text"
                            placeholder="Enter Transaction ID"
                            // {...validation.getFieldProps(
                            //   `idAmountArrayForPaid[${index}].transactionId`
                            // )}
                            value={
                              validation.values.idAmountArrayForPaid[index]
                                ?.transactionId || ''
                            }
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            invalid={
                              validation.touched.idAmountArrayForPaid?.[index]
                                ?.transactionId &&
                              validation.errors.idAmountArrayForPaid?.[index]
                                ?.transactionId
                                ? true
                                : false
                            }
                          />
                          {validation.touched.idAmountArrayForPaid?.[index]
                            ?.transactionId &&
                          validation.errors.idAmountArrayForPaid?.[index]
                            ?.transactionId ? (
                            <FormFeedback type="invalid">
                              {
                                validation.errors.idAmountArrayForPaid[index]
                                  ?.transactionId
                              }
                            </FormFeedback>
                          ) : null}
                        </Col>
                        <Col>
                          <Label className="form-label">
                            Amount {index + 1}
                          </Label>
                          <Input
                            name={`idAmountArrayForPaid[${index}].amount`}
                            type="string"
                            placeholder="Enter Amount in Rs"
                            value={
                              validation.values.idAmountArrayForPaid[index]
                                ?.amount || ''
                            }
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            invalid={
                              validation.touched.idAmountArrayForPaid?.[index]
                                ?.amount &&
                              validation.errors.idAmountArrayForPaid?.[index]
                                ?.amount
                                ? true
                                : false
                            }
                          />
                          {validation.touched.idAmountArrayForPaid?.[index]
                            ?.amount &&
                          validation.errors.idAmountArrayForPaid?.[index]
                            ?.amount ? (
                            <FormFeedback type="invalid">
                              {
                                validation.errors.idAmountArrayForPaid[index]
                                  ?.amount
                              }
                            </FormFeedback>
                          ) : null}
                        </Col>
                        <Col md={2} lg={1} className="mt-4">
                          <i
                            id={'paid' + index}
                            onClick={e => handleRemoveMultipleFields(e, index)}
                            className="fas fa-trash-alt font-size-20 btn"
                          ></i>
                        </Col>
                      </Row>
                    );
                  })}

                {/* add new fields of transaction id and amount by clicking below */}
                {showMultipleFields && validation.values.status === 'paid' && (
                  <Row className="justify-content-start">
                    <Col lg="10">
                      <Button
                        color="success"
                        className="mb-4"
                        id="paid"
                        onClick={e => {
                          handleAddMultipleFields(e);
                        }}
                      >
                        Add Amount
                      </Button>
                    </Col>
                  </Row>
                )}

                {/* if status is paid back then display below input fields */}
                {showMultipleFields &&
                  validation.values.status === 'paid back' &&
                  validation.values.idAmountArrayPaidBack.map(
                    (paidBack, index) => {
                      return (
                        <Row key={index} className="mb-3">
                          <Col>
                            <Label className="form-label">
                              Transfer Id {index + 1}
                            </Label>
                            <Input
                              name={`idAmountArrayPaidBack[${index}].transferId`}
                              type="text"
                              placeholder="Enter Transfer ID"
                              // {...validation.getFieldProps(
                              //   `idAmountArrayPaidBack[${index}].transferId`
                              // )}
                              value={
                                validation.values.idAmountArrayPaidBack[index]
                                  ?.transferId || ''
                              }
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              invalid={
                                validation.touched.idAmountArrayPaidBack?.[
                                  index
                                ]?.transferId &&
                                validation.errors.idAmountArrayPaidBack?.[index]
                                  ?.transferId
                                  ? true
                                  : false
                              }
                            />
                            {validation.touched.idAmountArrayPaidBack?.[index]
                              ?.transferId &&
                            validation.errors.idAmountArrayPaidBack?.[index]
                              ?.transferId ? (
                              <FormFeedback type="invalid">
                                {
                                  validation.errors.idAmountArrayPaidBack[index]
                                    ?.transferId
                                }
                              </FormFeedback>
                            ) : null}
                          </Col>
                          <Col>
                            <Label className="form-label">
                              Amount {index + 1}
                            </Label>
                            <Input
                              name={`idAmountArrayPaidBack[${index}].amount`}
                              type="string"
                              placeholder="Enter Amount in Rs"
                              value={
                                validation.values.idAmountArrayPaidBack[index]
                                  ?.amount || ''
                              }
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              invalid={
                                validation.touched.idAmountArrayPaidBack?.[
                                  index
                                ]?.amount &&
                                validation.errors.idAmountArrayPaidBack?.[index]
                                  ?.amount
                                  ? true
                                  : false
                              }
                            />
                            {validation.touched.idAmountArrayPaidBack?.[index]
                              ?.amount &&
                            validation.errors.idAmountArrayPaidBack?.[index]
                              ?.amount ? (
                              <FormFeedback type="invalid">
                                {
                                  validation.errors.idAmountArrayPaidBack[index]
                                    ?.amount
                                }
                              </FormFeedback>
                            ) : null}
                          </Col>
                          <Col md={2} lg={1} className="mt-4">
                            <i
                              id={'paid back' + index}
                              onClick={e =>
                                handleRemoveMultipleFields(e, index)
                              }
                              className="fas fa-trash-alt font-size-20 btn"
                            ></i>
                          </Col>
                        </Row>
                      );
                    }
                  )}

                {/* add new fields of transfer id and amount by clicking below */}
                {showMultipleFields &&
                  validation.values.status === 'paid back' && (
                    <Row className="justify-content-start">
                      <Col lg="10">
                        <Button
                          color="success"
                          className="mb-4"
                          id="paid back"
                          onClick={e => {
                            handleAddMultipleFields(e);
                          }}
                        >
                          Add Amount
                        </Button>
                      </Col>
                    </Row>
                  )}
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="text-end">
                  <Button
                    className="btn-danger mx-2"
                    onClick={handleModalClose}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="btn btn-success save-user">
                    Save
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
};

export default EditModal;
