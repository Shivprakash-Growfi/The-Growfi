import { useFormik } from 'formik';
import React from 'react';
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
import * as Yup from 'yup';

const AddDirectorModal = props => {
  const {
    isOpen,
    CustomModalHeader,
    handleModalCancel,
    handleAddDirector,
    userData,
    handleAddPan,
  } = props;
  const inputFields = [
    {
      id: 1,
      type: 'string',
      label: 'Director Name *',
      name: 'dirName',
      placeholder: 'Enter director name',
      disabled: userData?.name ? true : false,
    },
    {
      id: 2,
      type: 'string',
      label: 'DIN *',
      name: 'din',
      placeholder: 'Enter DIN',
      disabled: userData?.din ? true : false,
    },
    {
      id: 3,
      type: 'string',
      label: 'PAN *',
      name: 'pan',
      placeholder: 'Enter PAN',
      disabled: false,
    },
  ];
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      dirName: userData?.name ? userData?.name : '',
      pan: '',
      din: userData?.din ? userData?.din : '',
    },

    validationSchema: Yup.object({
      dirName: Yup.string()
        .matches(
          /^[a-zA-Z0-9\s]+$/,
          'Only alphabets and numbers is allowed for Name '
        )
        .required('Director name is required!'),
      pan: Yup.string().required('Director PAN is required!'),
      din: Yup.string().required('Director DIN is required!'),
    }),

    onSubmit: (values, { resetForm }) => {
      if (userData && userData?.name) {
        handleAddPan(values.din, values.pan, values.dirName);
      } else {
        handleAddDirector(values.din, values.pan, values.dirName, resetForm);
      }
    },
  });
  const handleModalClose = () => {
    validation.resetForm();
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
                      disabled={val.disabled}
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
export default AddDirectorModal;
