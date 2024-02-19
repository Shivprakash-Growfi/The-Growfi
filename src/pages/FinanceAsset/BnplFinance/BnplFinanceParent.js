import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';

import Breadcrumbs from 'components/Common/Breadcrumb';
import { getAllBnplAssets } from 'helpers/backend_helper';
import { useSelector } from 'react-redux';

import BnplFinanceAssetWrapper from 'components/FinanceAssetsComponents/BnplFinanceComponents/BnplFinanceAssetWrapper';
import ApiLoader from 'components/Common/Ui/ApiLoader';
import { Notification } from 'components/Notification/ToastNotification';

//id --> to identify from which page we are calling.
//financeMethod --> to call some api's in future

const BnplFinanceParent = () => {
  const [tableData, setTableData] = useState([]);
  const [isloading, setIsloading] = useState(true);

  const { selectedOrganization } = useSelector(state => ({
    selectedOrganization: state.Login.selectedOrganization,
  }));

  //get all p2bAssets api call
  const apiCallToGetAllBnplAssets = () => {
    getAllBnplAssets(selectedOrganization?.organizationId)
      .then(response => {
        if (
          response &&
          (response.statusCode === 200 || response.statusCode === 201)
        ) {
          let result = JSON.parse(JSON.stringify(response.data));
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

  // useeffect to call apiCallToGetAllBnplAssets function
  useEffect(() => {
    apiCallToGetAllBnplAssets();
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Finance"
            breadcrumbItem="View BNPL Finance History"
          />
          {isloading ? (
            <ApiLoader loadMsg={'Loading...'} />
          ) : tableData?.length > 0 ? (
            <BnplFinanceAssetWrapper
              tableData2={tableData}
              reloadTable={apiCallToGetAllBnplAssets}
              // id={'PurchaseFinancePage'}
              // financeMethod={'purchaseFinance'}
              //showSetPage={}
              isGlobalFilter={true}
            />
          ) : (
            <Row>
              <Col xs="12">
                <Card>
                  <CardBody className="d-flex justify-content-center">
                    <h4 className="text-muted">No Data Found</h4>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          )}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default BnplFinanceParent;
