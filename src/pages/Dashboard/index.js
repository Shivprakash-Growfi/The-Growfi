import React, { useEffect, useState } from 'react';
import { Container, Spinner } from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import FinanaceProductsAvailable from 'components/DashboardComponents/FinanceProductsAvailable/FinanaceProductsAvailable';
import RepaymentHeader from 'components/DashboardComponents/RepaymentHeader/RepaymentHeader';
import RetailerStatusReportCards from 'components/DashboardComponents/RetailerHeader/RetailerStatusReportCards';
import PendingHeader from 'components/DashboardComponents/PendingHeader';

const Dashboard = props => {
  //meta title
  document.title = 'Dashboard | GrowFi';

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs title={'Dashboards'} breadcrumbItem={'Dashboard'} />
          <>
            <PendingHeader />
            <FinanaceProductsAvailable />
            <RepaymentHeader />
            <RetailerStatusReportCards />
          </>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Dashboard;
