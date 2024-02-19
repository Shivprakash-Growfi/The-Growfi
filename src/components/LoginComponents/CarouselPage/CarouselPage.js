import React from 'react';
import { Col } from 'reactstrap';
import backgroundImage from 'assets/images/growfiBackground.jpeg';

const CarouselPage = props => {
  return (
    <React.Fragment>
      <Col xs={12} xl={9} className="d-none d-xl-block">
        <div
          className="auth-full-bg"
          style={{
            background: `url("${backgroundImage}")`,
            //backgroundSize: `cover`,
            backgroundColor: `white`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="w-100"></div>
        </div>
      </Col>
    </React.Fragment>
  );
};
export default CarouselPage;
