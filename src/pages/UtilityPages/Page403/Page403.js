import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';

//Import Images
import error from 'assets/images/error-img.png';

const Page403 = () => {
  //meta title
  document.title = '403 Forbidden Access | GrowFi';

  return (
    <React.Fragment>
      <div className="account-pages my-5 pt-5">
        <Container>
          <Row>
            <Col lg="12">
              <div className="text-center mb-5">
                <h1 className="display-2 fw-medium">
                  4<i className="bx bx-buoy bx-spin text-danger display-3" />3
                </h1>
                <h4 className="text-uppercase">
                  Access to this resource on the server is denied!
                </h4>
                <div className="mt-5 text-center"></div>
              </div>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col md="8" xl="6">
              <div>
                <img src={error} alt="" className="img-fluid" />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Page403;
