import React, { useEffect, useRef, useState } from 'react';
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
} from 'reactstrap';

import SelectInputField from 'components/Common/SelectInputField';

import { Notification } from 'components/Notification/ToastNotification';

const CreateChallanModal = props => {
  const {
    isOpen,
    CustomModalHeader,
    bodyInputs,
    handleModalCancel,
    challanUploadFile,
    validation,
    showOrgSelectField = false,
    //orgList = null,
    callFrom = 'retailer',
    callRetailerListApi = null,
    invoiceMethod,
    inputArrFields,
  } = props;

  const [retailerList, setRetailerList] = useState([]);

  useEffect(() => {
    if (callFrom === 'InvoiceDiscountingPage') {
      apiCallForRetailerList();
    }
  }, []);

  const apiCallForRetailerList = async () => {
    try {
      const { response, orgList = null } = await callRetailerListApi();
      if (
        response &&
        (response.statusCode === 200 || response.statusCode === 201)
      ) {
        setRetailerList(orgList?.current || []);
      } else {
        Notification(
          'Unable to fetch list of retailers, please try again later.',
          4
        );
      }
    } catch (error) {
      Notification(
        'Unable to fetch list of retailers, please try again later.',
        4
      );
    }
  };

  return (
    <Modal isOpen={isOpen}>
      <ModalHeader tag="h4">
        {CustomModalHeader}
        <button
          type="button"
          onClick={handleModalCancel}
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
              {showOrgSelectField && (
                <SelectInputField
                  label={'For Organization'}
                  name={'selectedRetailer'}
                  optionsArr={retailerList}
                  validation={validation}
                />
              )}
              {inputArrFields?.map(val => {
                return (
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
              {challanUploadFile.map(val => {
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
                          // <Button
                          //   onClick={val['onUpload']}
                          //   className="m-2"
                          //   size="sm"
                          //   name={val.name}
                          // >
                          //   Upload
                          // </Button>
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
                <Button className="me-3 btn-danger" onClick={handleModalCancel}>
                  Cancel
                </Button>
                <Button type="submit" className="btn-success">
                  Save
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </ModalBody>
    </Modal>
  );
};
export default CreateChallanModal;
