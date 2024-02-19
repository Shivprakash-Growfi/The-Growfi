import React, { useState } from 'react';
import { Row } from 'reactstrap';

// import components
import RepaymentStatusReportCards from './RepaymentStatusReportCards';
import RepaymentModal from '../__Modals/RepaymentModal';

export default function RepaymentHeader() {
  const [isShowModal, setIsShowModal] = useState(false);
  const [cardStatus, setCardStatus] = useState();
  const [modalTitle, setModalTitle] = useState();
  const [modalDataType, setModalDataType] = useState();
  const [assetType, setAssetType] = useState();

  const handleCardClick = (title, status, assetType) => {
    setIsShowModal(true);
    setCardStatus(status);
    setModalTitle(title);
    setAssetType(assetType);
  };
  const handleModalClose = () => {
    setIsShowModal(false);
  };
  return (
    <>
      <Row>
        <RepaymentStatusReportCards
          handleCardClick={handleCardClick}
          header={'Invoice Discounting Repayment'}
          assetType={'invoiceDiscounting'}
        />
        <RepaymentStatusReportCards
          type={'ert'}
          handleCardClick={handleCardClick}
          header={'Purchase Finance Repayment'}
          assetType={'purchaseFinance'}
        />
        <RepaymentModal
          isOpen={isShowModal}
          handleModalClose={handleModalClose}
          cardStatus={cardStatus}
          title={modalTitle}
          assetType={assetType}
        />
      </Row>
    </>
  );
}
