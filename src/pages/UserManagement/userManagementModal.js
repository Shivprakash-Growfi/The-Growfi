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

import {
  addNewUser as onAddNewUser,
  updateUser as onUpdateUser,
  updateUserbyAdmin,
} from 'store/organizationUser/actions';
import { useDispatch } from 'react-redux';
import { phoneRegex, usernameRegex } from 'helpers/utilities';

export default function UserManagementModal({
  rowData,
  handleModalClose,
  handleEditUserSave,
  handleAddUserSave,
}) {
  const dispatch = useDispatch();
  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      name: (rowData && rowData.name) || '',
      email: (rowData && rowData.email) || '',
      phoneNumber: (rowData && rowData.phoneNumber) || '',
      role: rowData?.role,
      authorizedSignatory: (rowData && rowData.authorizedSignatory) || false,
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .matches(
          /^[a-zA-Z0-9_ -]{3,25}$/,
          'Invalid username format. Must be 3-16 characters long and can only contain letters, spaces, digits, underscores, or hyphens.'
        )
        .required('Please enter Username'),
      role: Yup.string().required('Please Select a role'),
      phoneNumber: Yup.string()
        .test(
          'phone-or-email',
          'Mobile number or Email is required',
          function (value) {
            const email = this.parent.email;
            return value || email;
          }
        )
        .matches(phoneRegex, 'Please enter a valid phone number')
        .nullable(),
      email: Yup.string()
        .test(
          'phone-or-email',
          'Mobile number or Email is required',
          function (value) {
            const phoneNumber = this.parent.phoneNumber;
            return value || phoneNumber;
          }
        )
        .email('Invalid email')
        .nullable(),
    }),
    onSubmit: values => {
      if (rowData && rowData.id) {
        const updateUser = {
          userId: rowData.id,
          name: values.name,
          role: values.role,
          phoneNumber: values.phoneNumber,
          email: values.email,
          authorizedSignatory: values.authorizedSignatory,
        };
        // update user
        handleEditUserSave(updateUser);
        handleModalClose();
        validation.resetForm();
      } else {
        const newUser = {
          name: values['name'],
          userType: values['role'],
          email: values['email'],
          phone: values['phoneNumber'],
          authorizedSignatory: values.authorizedSignatory,
        };
        // save new user
        handleAddUserSave(newUser);
        handleModalClose();
        validation.resetForm();
      }
    },
  });

  return (
    <Modal isOpen={true}>
      <ModalHeader toggle={handleModalClose} tag="h4">
        {rowData && rowData.id ? 'Edit User' : 'Add User'}
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
                <Label className="form-label">Name</Label>
                <Input
                  name="name"
                  type="text"
                  placeholder="Insert Name"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.name || ''}
                  invalid={
                    validation.touched.name && validation.errors.name
                      ? true
                      : false
                  }
                />
                {validation.touched.name && validation.errors.name ? (
                  <FormFeedback type="invalid">
                    {validation.errors.name}
                  </FormFeedback>
                ) : null}
              </div>
              <div className="mb-3">
                <Label className="form-label">Email</Label>
                <Input
                  name="email"
                  label="Email"
                  placeholder="Insert Email"
                  type="text"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.email || ''}
                  invalid={
                    validation.touched.email && validation.errors.email
                      ? true
                      : false
                  }
                />
                {validation.touched.email && validation.errors.email ? (
                  <FormFeedback type="invalid">
                    {validation.errors.email}
                  </FormFeedback>
                ) : null}
              </div>
              <div className="mb-3">
                <Label className="form-label">Mobile Number</Label>
                <Input
                  name="phoneNumber"
                  label="Mobile Number"
                  type="text"
                  placeholder="Insert Number"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.phoneNumber || ''}
                  invalid={
                    validation.touched.phoneNumber &&
                    validation.errors.phoneNumber
                      ? true
                      : false
                  }
                />
                {validation.touched.phoneNumber &&
                validation.errors.phoneNumber ? (
                  <FormFeedback type="invalid">
                    {validation.errors.phoneNumber}
                  </FormFeedback>
                ) : null}
              </div>
              <div className="mb-3">
                <Label className="form-label">Role</Label>
                <Input
                  type="select"
                  name="role"
                  className="form-select"
                  multiple={false}
                  onChange={e => {
                    validation.handleChange(e);
                    validation.setFieldValue('authorizedSignatory', false);
                  }}
                  onBlur={validation.handleBlur}
                  value={validation.values.role || ''}
                  invalid={
                    validation.touched.role && validation.errors.role
                      ? true
                      : false
                  }
                >
                  <option value={''} disabled={true}>
                    Please Select User Role
                  </option>
                  <option value={'admin'}>Admin</option>
                  <option value={'l1'}>L1</option>
                  <option value={'l2'}>L2</option>
                  <option value={'l3'}>L3</option>
                  <option value={'viewOnly'}>View Only</option>
                </Input>
                {validation.touched.role && validation.errors.role ? (
                  <FormFeedback type="invalid">
                    {validation.errors.role}
                  </FormFeedback>
                ) : null}
              </div>
              {validation.values.role === 'admin' && (
                <div className="mb-3">
                  <Input
                    type="checkbox"
                    id="authorizedSignatoryCheckbox"
                    name="authorizedSignatory"
                    checked={validation.values.authorizedSignatory || ''}
                    onChange={validation.handleChange}
                  />
                  <Label
                    for="authorizedSignatoryCheckbox"
                    className="form-label ms-2"
                  >
                    Authorized Signatory
                  </Label>
                </div>
              )}
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
