import { useFormik } from 'formik';
import React, { useState } from 'react';
import * as Yup from 'yup';
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
import { getOrgDeatailsByPan } from 'helpers/backend_helper';
import {
  ApiNotificationLoading,
  ApiNotificationUpdate,
} from 'components/Notification/ToastNotification';
const DirectAddSalesChannel = ({
  isOpenModal,
  handleDirectAddModal,
  modalHeader,
  handleDirectAddModalUpdate,
}) => {
  const panInputs = [
    {
      id: 1,
      name: 'pan',
      type: 'text',
      placeholder: 'PAN number',
      label: 'PAN number',
      readOnly: false,
    },
  ];
  const formikPan = useFormik({
    initialValues: {
      pan: '',
    },
    validationSchema: Yup.object({
      pan: Yup.string().required('PAN is required'),
    }),
    onSubmit: (values, action) => {
      // Handle form submission
      const panFinal = values?.pan?.toUpperCase();

      const loadingId = ApiNotificationLoading();
      getOrgDeatailsByPan(panFinal)
        .then(response => {
          if (response?.statusCode === 200 || response?.statusCode === 201) {
            ApiNotificationUpdate(loadingId, `${response.message}`, 1);
            handleDirectAddModalUpdate(response?.data);
          } else {
            ApiNotificationUpdate(loadingId, `${response.message}`, 4);
            handleDirectAddModalUpdate();
          }
        })
        .catch(err => {
          ApiNotificationUpdate(
            loadingId,
            `Unable to search for this organization!`,
            4
          );
          handleDirectAddModalUpdate({});
        });
    },
  });

  return (
    <>
      <Modal isOpen={isOpenModal}>
        <ModalHeader tag="h4">
          {modalHeader}
          <button
            type="button"
            onClick={handleDirectAddModal}
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
              formikPan.handleSubmit();
            }}
          >
            <Row>
              <Col className="col-12">
                {panInputs.map(val => (
                  <div className="mb-3" key={val.id}>
                    <Label className="form-label">{val.label}</Label>
                    <Input
                      className="form-control"
                      name={val.name}
                      type={val.type}
                      maxLength={val.maxLength}
                      placeholder={val.placeholder}
                      onChange={formikPan.handleChange}
                      onBlur={formikPan.handleBlur}
                      value={formikPan.values[val.name] || ''}
                      invalid={
                        formikPan.touched[val.name] &&
                        formikPan.errors[val.name]
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
                    {formikPan.touched[val.name] &&
                    formikPan.errors[val.name] ? (
                      <FormFeedback type="invalid">
                        {formikPan.errors[val.name]}
                      </FormFeedback>
                    ) : null}
                  </div>
                ))}
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="text-end">
                  <button
                    type="button"
                    onClick={handleDirectAddModal}
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

export default DirectAddSalesChannel;
