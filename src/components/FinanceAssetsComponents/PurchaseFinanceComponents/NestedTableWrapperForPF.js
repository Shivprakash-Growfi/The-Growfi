import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardBody, Col, Container, Row, CardTitle } from 'reactstrap';

// columns for finance page
import {
  InvoiceId,
  RetailerName,
  TotalAmount,
  Status,
  DocLink,
  DueDate,
} from 'components/FinanceAssetsComponents/CommonComponents/financeColumns';

import NestedTable from 'components/Common/NestedTable';

// api call for getting collapse table data
import { getAllInvoicesForPF } from 'helpers/backend_helper';

// api loader
import ApiLoader from 'components/Common/Ui/ApiLoader';

import { Notification } from 'components/Notification/ToastNotification';

import StatusForPF from 'components/FinanceAssetsComponents/PurchaseFinanceComponents/StatusForPF';

const NestedTableWrapperForPF = props => {
  const [pfAssetDetails, setPfAssetDetails] = useState(props?.data);

  //loader state, tabledata
  const [isloading, setIsloading] = useState(true);
  const [tableData, setTableData] = useState([]);

  //get details of the challans/invoices
  useEffect(() => {
    let y = [];
    let x = pfAssetDetails?.invoiceDetails;
    for (let i = 0; i < (x && x.length); i++) {
      y.push(x[i].id);
    }
    getAllInvoicesForPF(y)
      .then(response => {
        if (
          response &&
          (response.statusCode === 200 || response.statusCode === 201)
        ) {
          setTableData(response.data);
          setIsloading(false);
        } else {
          Notification('Sorry. Please Reload the page.', 4);
        }
      })
      .catch(err => {
        Notification('Sorry. Please Reload the page.', 4);
      });
  }, [pfAssetDetails]);

  /************** COLUMNS FOR THE TABLE *************/
  const columns = useMemo(() => {
    let col = [
      {
        Header: 'Invoice ID',
        accessor: 'invoiceId',
        filterable: true,
        canSort: true,
        Cell: cellProps => {
          return <InvoiceId {...cellProps} />;
        },
      },
      {
        Header: 'By Organization',
        accessor: 'invoiceGeneratedBy',
        filterable: true,
        canSort: true,
        Cell: cellProps => {
          return cellProps?.cell?.value ? cellProps?.cell?.value : '';
        },
      },
      {
        Header: 'Status',
        accessor: 'invoiceStatus',
        filterable: true,
        Cell: cellProps => {
          return <Status {...cellProps} />;
        },
      },
      {
        Header: 'Due Date',
        accessor: 'dueDateByDistributor',
        filterable: true,
        Cell: cellProps => {
          return <DueDate {...cellProps} />;
        },
      },
      {
        Header: 'View Challan',
        Cell: cellProps => {
          return <DocLink {...cellProps} />;
        },
      },
      {
        Header: 'Total Amount (In Rs.)',
        accessor: 'totalPrice',
        filterable: true,
        Cell: cellProps => {
          return <TotalAmount {...cellProps} />;
        },
      },
    ];

    return col;
  }, [pfAssetDetails]);

  //DISPLAYING THE TABLE
  const table = () => {
    return (
      <>
        <NestedTable
          columns={columns}
          data={tableData}
          filterByColumn={false}
          bordered={false}
          maxHeight={'300px'}
          initialSort="invoiceId"
          pclassName="custom-header-css-for-finance-page"
        />
      </>
    );
  };

  return (
    <React.Fragment>
      <Container fluid>
        <Row>
          <Col lg="12">
            <Card>
              <CardBody>
                <Row className="mb-5">
                  <Col sm={3}>
                    <CardTitle className="fs-4">Invoice Details</CardTitle>
                  </Col>
                  <Col sm={7}>
                    <StatusForPF pfAssetDetails={pfAssetDetails} />
                  </Col>
                </Row>
                {isloading ? <ApiLoader loadMsg={'Loading...'} /> : table()}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
};

export default NestedTableWrapperForPF;
