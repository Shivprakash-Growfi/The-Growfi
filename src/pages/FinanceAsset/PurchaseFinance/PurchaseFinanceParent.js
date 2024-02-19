import React, { useState, useEffect, useMemo } from 'react';
import { Container } from 'reactstrap';

import Breadcrumbs from 'components/Common/Breadcrumb';
import { getAllPFAssets } from 'helpers/backend_helper';
import { useSelector } from 'react-redux';

import PurchaseFinanceAsset from 'components/FinanceAssetsComponents/PurchaseFinanceComponents/PurchaseFinanceAssetWrapper';
import ApiLoader from 'components/Common/Ui/ApiLoader';
import {
  ApiNotificationLoading,
  ApiNotificationUpdate,
  Notification,
} from 'components/Notification/ToastNotification';

//id --> to identify from which page we are calling.
//financeMethod --> to call some api's in future

const PurchaseFinanceParent = () => {
  const [tableData, setTableData] = useState([]);
  const [isloading, setIsloading] = useState(true);

  const { selectedOrganization } = useSelector(state => ({
    selectedOrganization: state.Login.selectedOrganization,
  }));

  //get all p2bAssets api call
  const apiCallToGetAllPFAssets = () => {
    getAllPFAssets(selectedOrganization?.organizationId)
      .then(response => {
        if (
          response &&
          (response.statusCode === 200 || response.statusCode === 201)
        ) {
          let result = JSON.parse(
            JSON.stringify(response?.data?.PurchaseFinance)
          );
          setTableData(result);
          setIsloading(false);
        } else {
          Notification('Sorry. Please Reload the page', 4);
        }
      })
      .catch(err => {
        setIsloading(true);
        Notification('Sorry. Please Reload the page', 4);
      });
  };

  // useeffect to call apiCallToGetAllP2bAssets function
  useEffect(() => {
    apiCallToGetAllPFAssets();
  }, [selectedOrganization]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Finance"
            breadcrumbItem="View Purchase Finance History"
          />
          {isloading ? (
            <ApiLoader loadMsg={'Loading...'} />
          ) : (
            <PurchaseFinanceAsset
              tableData2={tableData}
              reloadTable={apiCallToGetAllPFAssets}
              // id={'PurchaseFinancePage'}
              // financeMethod={'purchaseFinance'}
              //showSetPage={}
              //isGlobalFilter={}
            />
          )}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default PurchaseFinanceParent;
