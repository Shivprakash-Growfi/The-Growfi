import React, { useState, useEffect, useMemo } from 'react';
import { Container } from 'reactstrap';
import { Notification } from 'components/Notification/ToastNotification';

import Breadcrumbs from 'components/Common/Breadcrumb';
import { getAllP2BAssets } from 'helpers/backend_helper';
import { useSelector } from 'react-redux';

import InvoiceDiscountingAsset from 'components/FinanceAssetsComponents/InvoiceDiscountingComponents/InvoiceDiscountingAssetWrapper';

import ApiLoader from 'components/Common/Ui/ApiLoader';

//id --> to identify from which page we are calling.
//financeMethod --> to call some api's in future

const InvoiceDiscountingParent = () => {
  const [tableData, setTableData] = useState([]);
  const [isloading, setIsloading] = useState(true);

  // organization details from login
  const selectedOrganization = useSelector(
    state => state.Login.selectedOrganization
  );

  //get all p2bAssets api call
  const apiCallToGetAllP2bAssets = () => {
    getAllP2BAssets(selectedOrganization?.organizationId)
      .then(response => {
        if (
          response &&
          (response.statusCode === 200 || response.statusCode === 201)
        ) {
          let result = JSON.parse(JSON.stringify(response.data.P2BAssets));
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
    apiCallToGetAllP2bAssets();
  }, [selectedOrganization]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Finance"
            breadcrumbItem="View Invoice Discounting Finance History"
          />
          {isloading ? (
            <ApiLoader loadMsg={'Loading...'} />
          ) : (
            <InvoiceDiscountingAsset
              tableData2={tableData}
              reloadTable={apiCallToGetAllP2bAssets}
              // id={'InvoiceDiscountingPage'}
              // financeMethod={'invoiceDiscounting'}
              //showSetPage={}
              isGlobalFilter={true}
            />
          )}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default InvoiceDiscountingParent;
