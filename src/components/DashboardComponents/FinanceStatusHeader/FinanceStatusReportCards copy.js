import React from 'react';
import { Row, Col } from 'reactstrap';
import FinanceGraphCircle from './FinanceGraphCircle';

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
  {
    id: 'underprocessingamount',
    title: 'Under Processing',
    iconClass: 'mdi mdi-message-processing',
    status: 'underProcessing',
    type: 'finance',
    color: '--bs-warning',
    click: true,
  },
  {
    id: 'paidAmount',
    title: 'Paid',
    iconClass: 'mdi mdi-handshake',
    status: 'paid',
    type: 'finance',
    color: '--bs-info',
    click: true,
  },
];
export default function FinanceStatusReportCards({ ...props }) {
  const { handleCardClick } = props;
  return (
    <Row>
      <Col sm="12">
        <FinanceGraphCircle
          financeStatus={financeStatus}
          handleCardClick={handleCardClick}
        />
      </Col>
    </Row>
  );
}
