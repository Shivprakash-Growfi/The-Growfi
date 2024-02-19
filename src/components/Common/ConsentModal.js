import React from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const ConsentModal = props => {
  return (
    <div>
      <Modal isOpen={props.showModal}>
        <ModalHeader>{props.heading}</ModalHeader>
        <ModalBody>{props.modalBody}</ModalBody>
        <ModalFooter>
          <>
            <Button
              className={'btn btn-danger'}
              onClick={props.handleModalClose}
            >
              Cancel
            </Button>
            <Button
              className={'btn btn-success'}
              onClick={props.handleModalConfirm}
            >
              Confirm
            </Button>
          </>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ConsentModal;
