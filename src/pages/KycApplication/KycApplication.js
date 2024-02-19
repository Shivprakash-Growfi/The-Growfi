import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, CardBody, Button } from 'reactstrap';
import classnames from 'classnames';

//Dropzone

//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

//Import images
import verificationImg from '../../assets/images/verification-img.png';
import KycMainPage from './KycMainPage';

// import apiCall, { getOrgDetails } from './apiCall';
import { getCompanyDetailsFromId } from 'helpers/backend_helper';
import { Spinner } from 'reactstrap';
import { useSelector } from 'react-redux';
import { Notification } from 'components/Notification/ToastNotification';
import { useDispatch } from 'react-redux';
import ApiLoader from 'components/Common/Ui/ApiLoader';

const KycApplication = props => {
  //meta title
  document.title = 'KYC Verification | GrowFi';

  const [formData, setFormData] = useState();
  //fetching Verification Data
  const [verificationFlag, setVerificationFlag] = useState(false);
  const [apiData, setApiData] = useState(false);
  const [kycDataAvail, setKycDataAvail] = useState(false);
  const { selectedOrganization } = useSelector(state => ({
    selectedOrganization: state.Login.selectedOrganization,
  }));
  const orgId = selectedOrganization ? selectedOrganization.organizationId : '';
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAPI = async () => {
      try {
        setApiData(false);
        const jsonData = await getCompanyDetailsFromId(orgId);
        let verify = [];
        if (
          jsonData &&
          (jsonData?.statusCode === 200 || jsonData?.statusCode === 201)
        ) {
          const data = jsonData?.data;
          const altData = {
            pan: data?.pan
              ? data.pan
              : { panNumber: '', status: 0, fileName: '' },
            gst: data?.gst
              ? data.gst
              : { gstNumber: '', status: 0, fileName: '' },
            bank: data?.bank ? data.bank : { status: 0 },
          };
          setFormData(altData);
          Object.keys(altData).map(val => {
            verify.push(altData[val].status);
          });
          setApiData(true);
          Object.keys(altData).length > 0 && setKycDataAvail(true);
          !(verify.includes(2) || verify.includes(0)) &&
            setVerificationFlag(true);
        } else {
          Notification(`${jsonData.message}`, 4);
        }
      } catch (error) {
        Notification('Server Error Occured, Please try again later', 4);
      }
    };

    fetchAPI();
  }, []);

  useEffect(() => {
    if (formData) {
      // Perform actions that rely on the updated state
      setApiData(true);
    }
  }, [formData]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {!apiData ? (
            <ApiLoader />
          ) : kycDataAvail ? (
            <KycMainPage
              organizationData={formData}
              verificationFlag={verificationFlag}
            />
          ) : (
            <h3>No kyc Data Available</h3>
          )}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default KycApplication;
