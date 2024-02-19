import React from 'react';
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
} from 'reactstrap';
import * as Yup from 'yup';
import { useFormik } from 'formik';

export default function AddDocModal({
  open,
  handleModalClose,
  handleAddDocSave,
  selectedOrganization,
}) {
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      agreementName: '',
      file: '',
    },
    validationSchema: Yup.object({
      agreementName: Yup.string()
        .required('Please Provide Valid Agreement Name')
        .min(5, 'Please provide longer Agreement Name'),
      file: Yup.mixed().required('Please Provide Valid File'),
    }),
    onSubmit: values => {
      let formData = new FormData();
      formData.append('file', values.file);
      handleAddDocSave(
        selectedOrganization.value,
        values.agreementName,
        formData
      );
      validation.resetForm();
      handleModalClose();
    },
  });
  return (
    <Modal isOpen={open}>
      <ModalHeader
        toggle={() => {
          handleModalClose();
          validation.resetForm();
        }}
        tag="h4"
      >
        Add Document
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
              <div className="mb-3">
                <Label className="form-label">Organization Name</Label>
                <Input
                  name="organizationName"
                  type="text"
                  value={selectedOrganization?.label}
                  disabled={true}
                />
              </div>
              <div className="mb-3">
                <Label className="form-label">Agreement Name</Label>
                <Input
                  name="agreementName"
                  type="text"
                  placeholder="Insert Name"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.agreementName || ''}
                  invalid={
                    validation.touched.agreementName &&
                    validation.errors.agreementName
                      ? true
                      : false
                  }
                />
                {validation.touched.agreementName &&
                validation.errors.agreementName ? (
                  <FormFeedback type="invalid">
                    {validation.errors.agreementName}
                  </FormFeedback>
                ) : null}
              </div>
              <div className="mb-3">
                <Label className="form-label">Document</Label>
                <Input
                  className="form-control"
                  name={'file'}
                  type="file"
                  onChange={e => {
                    if (e.target.files && e.target.files.length > 0)
                      validation.setFieldValue('file', e.target.files[0]);
                  }}
                  onBlur={validation.handleBlur}
                  invalid={
                    validation.touched.file && validation.errors.file
                      ? true
                      : false
                  }
                />
                {validation.touched.file && validation.errors.file ? (
                  <FormFeedback type="invalid">
                    {validation.errors.file}
                  </FormFeedback>
                ) : null}
                {validation.values.file && (
                  <div>
                    <Label className="file-name mt-1">
                      {validation.values.file['name']}
                    </Label>
                  </div>
                )}
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="text-end">
                <button type="submit" className="btn btn-success save-user">
                  Save
                </button>
              </div>
            </Col>
          </Row>
        </Form>
      </ModalBody>
    </Modal>
  );
}
