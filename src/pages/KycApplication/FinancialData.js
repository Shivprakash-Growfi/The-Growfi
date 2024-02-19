import React, { useEffect, useState } from 'react';
import { Card, CardBody, Col, Spinner } from 'reactstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import FinancialDataComp from 'components/KycApplicationComponents/FinanceDataComp';
import { Form, NavItem, NavLink, Row, TabContent, TabPane } from 'reactstrap';
import classnames from 'classnames';
import BankStatement from 'components/KycApplicationComponents/BankStatement';
import GstReturnComp from 'components/KycApplicationComponents/GstReturnComp';
import { getOrganizationFinancialDetails } from 'helpers/backend_helper';
import { useSelector } from 'react-redux';
import ItrUpload from 'components/KycApplicationComponents/ItrUpload';
import CompanyInfo from 'components/KycApplicationComponents/companyInfo';
import ApiLoader from 'components/Common/Ui/ApiLoader';
const FinancialData = props => {
  const [verificationStatus, setVerificationStatus] = useState({
    balance: false,
    intro: false,
    bank: false,
    gstReturns: false,
  });
  const [apiFinanceData, setApiFinanceData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDataEmpty, setIsDataEmpty] = useState(true);
  const [activeTab, setactiveTab] = useState(1);
  const [passedSteps, setPassedSteps] = useState([1]);
  const { selectedOrganization } = useSelector(state => ({
    selectedOrganization: state.Login.selectedOrganization,
  }));
  const orgId = selectedOrganization ? selectedOrganization.organizationId : '';
  const navStep = [
    {
      id: 1,
      name: 'Balance Sheet',
    },
    {
      id: 2,
      name: 'GST return',
    },
    {
      id: 3,
      name: 'ITR',
    },
    {
      id: 4,
      name: 'Bank Statement',
    },
    {
      id: 5,
      name: 'Company Details',
    },
  ];
  useEffect(() => {
    setIsLoading(true);
    getOrganizationFinancialDetails(orgId)
      .then(resp => {
        if (
          resp?.data &&
          (resp.statusCode === 200 || resp.statusCode === 201)
        ) {
          setApiFinanceData(resp.data);
          setIsLoading(false);
          Object.keys(resp.data).length > 0 && setIsDataEmpty(false);
        } else {
          throw `${resp.message}`;
        }
      })
      .catch(err => {
        console.log(err);
      });
  }, []);
  const navStyle = {
    display: 'flex',
    alignItems: 'center',
  };
  function toggleTab(tab) {
    if (activeTab === 5 && tab !== 4) {
      // when we want to redirect to dashboard when document upload steps are finished
      props.router.navigate(Path.DASHBOARD);
    }
    if (activeTab !== tab) {
      var modifiedSteps = [...passedSteps, tab];
      if (tab >= 1 && tab <= 5) {
        setactiveTab(tab);
        setPassedSteps(modifiedSteps);
      }
    }
  }
  return (
    <>
      <Col lg="12">
        <Card>
          <CardBody>
            <h4 className="card-title mb-4">Financial Data</h4>
            {!isLoading ? (
              isDataEmpty ? (
                <h3>Unable to fetch Finance Data</h3>
              ) : (
                <div className="wizard clearfix">
                  <div className="steps clearfix">
                    <ul>
                      {navStep.map(({ id, name }) => (
                        <NavItem
                          key={id}
                          className={classnames({ current: activeTab === id })}
                        >
                          <NavLink
                            className={classnames({ active: activeTab === id })}
                            onClick={() => {
                              setactiveTab(id);
                            }}
                            style={navStyle}
                          >
                            <span className="number">{id}.</span>
                            {name}
                          </NavLink>
                        </NavItem>
                      ))}
                    </ul>
                  </div>
                  <div className="content clearfix">
                    <TabContent activeTab={activeTab} className="body">
                      <TabPane tabId={1}>
                        <FinancialDataComp
                          apiData={apiFinanceData.balanceSheet}
                          verificationStatus={verificationStatus.balance}
                          toggleTab={toggleTab}
                          activeTab={activeTab}
                        />
                      </TabPane>
                      <TabPane tabId={2}>
                        <GstReturnComp
                          apiData={apiFinanceData.gstReturns}
                          verificationStatus={verificationStatus.gstReturns}
                          toggleTab={toggleTab}
                          activeTab={activeTab}
                        />
                      </TabPane>
                      <TabPane tabId={3}>
                        <ItrUpload
                          apiData={apiFinanceData.ITR}
                          verificationStatus={verificationStatus.bank}
                          toggleTab={toggleTab}
                          activeTab={activeTab}
                        />
                      </TabPane>
                      <TabPane tabId={4}>
                        <BankStatement
                          apiData={apiFinanceData.bankStatement}
                          verificationStatus={verificationStatus.bank}
                          toggleTab={toggleTab}
                          activeTab={activeTab}
                        />
                      </TabPane>
                      <TabPane tabId={5}>
                        <CompanyInfo
                          userTypeStatus={props.userTypeStatus}
                          apiData={apiFinanceData.companyInformation}
                          verificationStatus={verificationStatus.intro}
                          toggleTab={toggleTab}
                          activeTab={activeTab}
                        />
                      </TabPane>
                    </TabContent>
                  </div>
                </div>
              )
            ) : (
              <ApiLoader loadMsg="Wait for Finance data to render" />
            )}
          </CardBody>
        </Card>
      </Col>
    </>
  );
};

export default FinancialData;
