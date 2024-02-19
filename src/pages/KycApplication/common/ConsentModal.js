import React, { useState } from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Form,
  Row,
  Label,
  Input,
} from 'reactstrap';
import InputFormField from './InputFormField';

const ConsentModal = props => {
  const { formikBank, bankInputs, verificationStatus } = props;
  const [isConsent, setIsConsent] = useState(false);
  return (
    <div>
      <Modal isOpen={props.showModal}>
        <ModalHeader>Verify Bank Details</ModalHeader>
        <ModalBody>
          {!verificationStatus ? (
            <>
              <Form onSubmit={formikBank.handleSubmit}>
                <Row>
                  {bankInputs.map(val => (
                    <InputFormField
                      key={val.id}
                      {...val}
                      value={formikBank.values[val.name]}
                      onChange={formikBank.handleChange}
                      onBlur={formikBank.handleBlur}
                      disabled={true}
                    />
                  ))}
                </Row>
              </Form>
              <Input
                onClick={() => {
                  setIsConsent(!isConsent);
                }}
                type="checkbox"
              />{' '}
              <span> I am Allowing GrowFi to store my Bank Details.</span>
              <br />
              <span>
                {formikBank.errors.error && (
                  <span className="error">{formikBank.errors.error}</span>
                )}
              </span>
            </>
          ) : (
            <span>Holder name: {props.holderName}</span>
          )}
        </ModalBody>
        <ModalFooter>
          {!verificationStatus ? (
            <>
              <Button onClick={props.handleModalClose}>Close</Button>
              <Button disabled={!isConsent} onClick={props.handleModalSave}>
                Save
              </Button>
            </>
          ) : (
            <>
              <Button disabled={!isConsent} onClick={props.handleModalSave}>
                Ok
              </Button>
            </>
          )}
          {/* onClick={props.handleModalSave} */}
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ConsentModal;
