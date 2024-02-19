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

//nested table
import NestedTable from 'components/Common/NestedTable';

// api call for getting collapse table data
import { getAllChallansForP2B } from 'helpers/backend_helper';

// api loader, toast, status bar
import ApiLoader from 'components/Common/Ui/ApiLoader';
import { Notification } from 'components/Notification/ToastNotification';
import StatusForID from 'components/FinanceAssetsComponents/InvoiceDiscountingComponents/StatusForID';

const NestedTableWrapperForID = props => {
  const [p2bAssetDetails, setP2bAssetDetails] = useState(props?.data);

  //loader state, tabledata
  const [isloading, setIsloading] = useState(true);
  const [tableData, setTableData] = useState([]);

  //get details of the challans/invoices
  useEffect(() => {
    let y = [];
    let x = p2bAssetDetails?.challanDetails;
    for (let i = 0; i < (x && x.length); i++) {
      y.push(x[i].id);
    }

    getAllChallansForP2B(y)
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
  }, [p2bAssetDetails]);

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
        Header: 'For Organization',
        accessor: 'forOrganization',
        filterable: true,
        canSort: true,
        Cell: cellProps => {
          return <RetailerName {...cellProps} />;
        },
      },
      {
        Header: 'Status',
        accessor: 'challanStatus',
        filterable: true,
        Cell: cellProps => {
          return <Status {...cellProps} />;
        },
      },
      {
        Header: 'Last Updated',
        accessor: 'updatedAt',
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
  }, [p2bAssetDetails]);

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
                    <CardTitle className="fs-4">Challan Details</CardTitle>
                  </Col>
                  <Col sm={8}>
                    <StatusForID p2bAssetDetails={p2bAssetDetails} />
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

export default NestedTableWrapperForID;
