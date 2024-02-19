import {
  ApiNotificationLoading,
  ApiNotificationUpdate,
} from 'components/Notification/ToastNotification';
import { updateOrgNameKyc } from 'helpers/backend_helper';
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
  Col,
} from 'reactstrap';

const KycNameUpdateModal = props => {
  const {
    isShowUpdateModal,
    handleNameUpdateModalClose,
    nameData,
    orgId,
    nameType,
  } = props;
  const [isConsent, setIsConsent] = useState(false);
  const handleUpdateName = () => {
    const loadingId = ApiNotificationLoading();
    updateOrgNameKyc(orgId, nameData.originalName, nameType)
      .then(response => {
        if (response?.statusCode === 201 || response?.statusCode === 200) {
          ApiNotificationUpdate(loadingId, `${response.message}`, 2);
          handleNameUpdateModalClose();
        } else {
          ApiNotificationUpdate(loadingId, `${response.message}`, 4);
          handleNameUpdateModalClose();
        }
      })
      .catch(err => {
        ApiNotificationUpdate(loadingId, `Unable to update!`, 4);
        handleNameUpdateModalClose();
      });
  };
  return (
    <div>
      <Modal isOpen={isShowUpdateModal}>
        <ModalHeader>Update holder name</ModalHeader>
        <ModalBody>
          <>
            <Row>
              <Col>
                <Label>Input Name</Label>
                <Input
                  type="text"
                  disabled={true}
                  value={nameData?.enteredName}
                />
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <Label>Original Name</Label>
                <Input
                  type="text"
                  disabled={true}
                  value={nameData?.originalName}
                />
              </Col>
            </Row>
            <div className="mt-2 d-flex">
              <Input
                onClick={() => {
                  setIsConsent(!isConsent);
                }}
                type="checkbox"
              />{' '}
              <span className="ms-1">Are you sure, you want to update!</span>
              <br />
            </div>
          </>
        </ModalBody>
        <ModalFooter>
          <>
            <Button color="danger" onClick={handleNameUpdateModalClose}>
              Close
            </Button>
            <Button
              color="success"
              disabled={!isConsent}
              onClick={handleUpdateName}
            >
              Save
            </Button>
          </>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default KycNameUpdateModal;
