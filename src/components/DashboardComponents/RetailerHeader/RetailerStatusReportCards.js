import React, { useEffect, useState } from 'react';
import { Row, Col, Spinner } from 'reactstrap';
import RetailAnalytics from './RetailAnalytics';
import TopRetailers from './TopRetailersChart';

//redux
import { useSelector, useDispatch } from 'react-redux';

//API Import
import { getDashboardRetailerData } from 'helpers/backend_helper';

const retailerStatus = [
  {
    id: 'activeRetailers',
    title: 'Active',
    iconClass: 'mdi mdi-account-outline',
    filter: 'active',
    color: '--bs-success',
  },
  {
    id: 'inactiveRetailers',
    title: 'Inactive Retailers',
    iconClass: 'mdi mdi-account-off',
    filter: 'inactive',
    color: '--bs-warning',
  },
  {
    id: 'dormantRetailers',
    title: 'Dormet',
    iconClass: 'mdi mdi-account-remove',
    filter: '',
    color: '--bs-danger',
  },
  {
    id: 'totalRetailers',
    title: 'Total',
    iconClass: 'mdi mdi-account-plus',
    filter: '',
    color: '--bs-primary',
  },
];

export default function RetailerStatusReportCards({ ...props }) {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState();
  const { selectedOrg } = useSelector(state => ({
    selectedOrg: state.Login.selectedOrganization,
  }));

  const getDashboardRetailerDataAPI = async () => {
    !isLoading && setIsLoading(true);
    try {
      const jsonData = await getDashboardRetailerData(
        selectedOrg.organizationId
      );
      if (
        jsonData &&
        (jsonData.statusCode === 200 || jsonData.statusCode === 201)
      ) {
        setDashboardData(jsonData.data);
        setIsLoading(false);
      } else {
        throw jsonData;
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getDashboardRetailerDataAPI();
  }, []);

  return (
    <Row>
      <>
        <Col sm="12" md="12" lg="6">
          <TopRetailers
            retailerStatus={retailerStatus}
            dashboardData={dashboardData}
            isLoading={isLoading}
          />
        </Col>
        <Col sm="12" md="12" lg="6">
          <RetailAnalytics
            retailerStatus={retailerStatus}
            dashboardData={dashboardData}
            isLoading={isLoading}
          ></RetailAnalytics>
        </Col>
      </>
    </Row>
  );
}
