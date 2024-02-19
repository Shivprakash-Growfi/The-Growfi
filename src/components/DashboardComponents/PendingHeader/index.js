import React from 'react';
import { Row, Col } from 'reactstrap';
import PendingDocument from './pendingDocument';

export default function PendingHeader() {
  return (
    <Row>
      <Col
        sm={12}
        // md={6}
        md={12}
      >
        <PendingDocument></PendingDocument>
      </Col>
      {/* <Col sm={12} md={6}>
        <PendingDocument></PendingDocument>
      </Col> */}
    </Row>
  );
}
