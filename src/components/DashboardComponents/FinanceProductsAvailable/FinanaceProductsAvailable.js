import React from 'react';
import { Row, Col } from 'reactstrap';
import FinanceStatuScroll from './ProductScroll/ProductScroll';

const financeStatus = [
  {
    id: 'sanctionedLimit',
    title: 'Sanctioned Limit',
    iconClass: 'mdi mdi-handshake',
    status: 'sanctionedLimit',
    type: '',
    color: '--bs-info',
    click: false,
  },
  {
    id: 'limitAvailable',
    title: 'Limit Available',
    iconClass: 'bx bx-rupee',
    status: '',
    type: 'invoice',
    color: '--bs-primary',
    click: true,
  },
];
export default function FinanaceProductsAvailable({ ...props }) {
  return (
    <>
      <Row>
        <Col sm="12">
          <FinanceStatuScroll
            financeStatus={financeStatus}
            header={'Invoice Discounting Products'}
            assetType={'invoiceDiscounting'}
          />
        </Col>
      </Row>
      <Row>
        <Col sm="12">
          <FinanceStatuScroll
            financeStatus={financeStatus}
            header={'Purchase Finance Products'}
            assetType={'purchaseFinance'}
          />
        </Col>
      </Row>
    </>
  );
}
