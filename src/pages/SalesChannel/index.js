import React, { useState } from 'react';
import SalesChannel from './salesChannel';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
//Breadcrumbs
import Breadcrumbs from '../../components/Common/Breadcrumb';
import ChannelList from './ChannelList';
import { Path } from 'routes/constant';
import { Navigate, Route, Routes } from 'react-router-dom';

const MainSalesChannel = () => {
  const [isShowCardList, setIsShowCardList] = useState(true);
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {isShowCardList ? (
            <Breadcrumbs
              title="Sales Channel"
              breadcrumbItem="Sales Channel List"
            />
          ) : (
            <Breadcrumbs
              title="Sales Channel List"
              breadcrumbItem="All Channels"
            />
          )}
          <Row>
            <Col lg="12">
              <Card>
                <Routes>
                  <Route
                    path={Path.SELECTED_SALES_CHANNEL_TEMPLATE}
                    element={<SalesChannel />}
                  ></Route>
                  <Route
                    path={Path.SELECT_SALES_CHANNEL}
                    element={<ChannelList />}
                  ></Route>
                  <Route
                    path="*"
                    element={
                      <Navigate
                        to={`${Path.SALES_CHANNEL}${Path.SELECT_SALES_CHANNEL}`}
                        replace
                      />
                    }
                  />
                </Routes>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default MainSalesChannel;
