/*eslint-disable react/no-unknown-property*/
import React, { useState, useEffect, useMemo } from 'react';
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  CardText,
} from 'reactstrap';

import classnames from 'classnames';
import Breadcrumbs from 'components/Common/Breadcrumb';

import SignedDocsTable from 'components/Cheques&SignedDocsComponents/SignedDocsTable/SignedDocsTable';
import ChequesTable from 'components/Cheques&SignedDocsComponents/Cheques/ChequesTable';

const SignedDocsParent = () => {
  const [activeTab, setactiveTab] = useState('1');

  const toggle = tab => {
    if (activeTab !== tab) {
      setactiveTab(tab);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Signed Documents"
            breadcrumbItem={
              activeTab == 1 ? 'View Signed Documents' : 'View All Cheques'
            }
          />
          <Nav tabs>
            <NavItem>
              <NavLink
                style={{ cursor: 'pointer', fontSize: '18px' }}
                className={classnames({
                  active: activeTab === '1',
                })}
                onClick={() => {
                  toggle('1');
                }}
              >
                All Signed Documents
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                style={{ cursor: 'pointer', fontSize: '18px' }}
                className={classnames({
                  active: activeTab === '2',
                })}
                onClick={() => {
                  toggle('2');
                }}
              >
                All Cheques
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={activeTab} className="p-3 text-muted">
            <TabPane tabId="1" className="mt-2">
              <Row>
                <Col sm="12">{activeTab === '1' && <SignedDocsTable />}</Col>
              </Row>
            </TabPane>
            <TabPane tabId="2" className="mt-2">
              <Row>
                <Col sm="12">{activeTab === '2' && <ChequesTable />}</Col>
              </Row>
            </TabPane>
          </TabContent>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default SignedDocsParent;
