import React, { useEffect, useState } from 'react';
import { Card, CardBody, Modal, Spinner, ModalFooter } from 'reactstrap';
import { getDueAmountForDashboard } from 'helpers/backend_helper';
import { useSelector } from 'react-redux';
import InvoiceDiscountingAsset from 'components/FinanceAssetsComponents/InvoiceDiscountingComponents/InvoiceDiscountingAssetWrapper';
import PurchaseFinanceAsset from 'components/FinanceAssetsComponents/PurchaseFinanceComponents/PurchaseFinanceAssetWrapper';

const RepaymentModal = props => {
  const {
    isOpen,
    cardStatus,
    handleModalClose,
    title,
    handleDashboardRefresh,
    assetType,
  } = props;
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { selectedOrganization } = useSelector(state => ({
    selectedOrganization: state.Login.selectedOrganization,
  }));
  const conditionalAPICall = () => {
    setIsLoading(true);
    setTableData([]);
    getDueAmountForDashboard(
      selectedOrganization.organizationId,
      cardStatus,
      assetType
    )
      .then(response => {
        if (
          response &&
          (response.statusCode === 200 || response.statusCode === 201)
        ) {
          setTableData(response?.data.assets);
          setIsLoading(false);
        } else {
          handleModalClose();
        }
      })
      .catch(err => {
        console.log(err);
        handleModalClose();
      });
  };
  useEffect(() => {
    conditionalAPICall();
  }, [props]);

  const getLoader = () => {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner style={{ width: '2rem', height: '2rem' }} />
        <h3 className="ps-4">Please Wait...</h3>
      </div>
    );
  };

  const getFinanceTable = () => {
    if (assetType === 'invoiceDiscounting') {
      return (
        <InvoiceDiscountingAsset
          tableData2={tableData}
          showSetPage={false}
          isGlobalFilter={false}
        />
      );
    } else {
      return (
        <PurchaseFinanceAsset
          tableData2={tableData}
          showSetPage={false}
          isGlobalFilter={false}
        />
      );
    }
  };
  return (
    <React.Fragment>
      <Modal size="xl" scrollable={true} isOpen={isOpen}>
        <div className="modal-header">
          <h5 className="modal-title mt-0">{title}</h5>
          <button
            type="button"
            onClick={() => handleModalClose()}
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          {isLoading ? <>{getLoader()}</> : <>{getFinanceTable()}</>}
        </div>
        <ModalFooter>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => handleModalClose()}
          >
            Close
          </button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

export default RepaymentModal;
