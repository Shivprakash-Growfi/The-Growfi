import React from 'react';
import { Col, Container, Row, Alert, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import withRouter from 'components/Common/withRouter';

// import images
import logo from '../../assets/images/growfi3x.png';

//redux
import { useSelector, useDispatch } from 'react-redux';
import { selectOrganisation } from 'store/actions';

import { Path } from 'routes/constant';
import { Notification } from 'components/Notification/ToastNotification';

const OrganizationSelection = props => {
  document.title = 'Select Organization | GrowFi';
  const dispatch = useDispatch();
  const { from } = props.router.location.state || {};

  const { organizations, companyDetails } = useSelector(state => ({
    organizations: state.Login.user.organizations,
    companyDetails: state.Company.companyDetails,
  }));

  const handleOrganizationSelection = selectedOrganization => {
    if (selectedOrganization.organizationOperationType === 'retailer') {
      Notification(
        'For Retailer Organization, Please Login to Mobile Application',
        4
      );
    } else {
      dispatch(selectOrganisation(selectedOrganization));
      sessionStorage.setItem(
        'selectedOrganization',
        JSON.stringify({ organizationId: selectedOrganization.organizationId })
      );
      setTimeout(() => {
        props.router.navigate(from ? from : Path.DASHBOARD);
      }, 100);
    }
  };

  // To show only non-admin organization to users.
  const checkUserOrg = org => {
    return org.organizationOperationType != 'admin';
  };

  const getOrganizationsStructure = () => {
    const nonAdminOrg = organizations?.filter(checkUserOrg);
    if (nonAdminOrg && nonAdminOrg.length > 0) {
      return (
        <div
          className="card"
          style={{ maxHeight: '400px', overflowY: 'scroll' }}
        >
          <div className="card-body">
            {nonAdminOrg.map((org, key) => {
              return (
                <div
                  key={key}
                  onClick={() => {
                    handleOrganizationSelection(org);
                  }}
                  className="btn px-3 py-2 rounded bg-light bg-opacity-50 d-block mb-2 "
                >
                  {`${org.nameAsPerPAN}: ${org.nameAsPerGST}`}
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return (
      <div className="">
        <Alert
          color="danger"
          style={{ border: 0, backgroundColor: '#fde1e166' }}
        >
          <p className="mb-1">
            No Organization found, Please reach out to our support team
            forfurther support.
          </p>
          <p className="text-muted mb-0">Support: Care@theGrowfi.com</p>
        </Alert>
        <Link to={Path.LOGOUT}>Logout!</Link>
      </div>
    );
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row className="justify-content-center text-center">
            <Col xl={4}>
              <div className="mb-4">
                <img src={logo} alt="" height="50" />
              </div>
            </Col>
          </Row>
          <Row className="justify-content-center text-center">
            <Col xl={4}>
              <div className="mb-4">
                <h4>Organization Selection</h4>
                <p className="text-muted">
                  Please Select a Organization in which you want to login..
                </p>
              </div>
            </Col>
          </Row>

          <Row className="justify-content-center text-center">
            <Col xl={5}>{getOrganizationsStructure()}</Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withRouter(OrganizationSelection);
