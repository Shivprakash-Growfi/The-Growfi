import React, { useState, useEffect, useMemo, useRef } from 'react';
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

// api loader
import ApiLoader from 'components/Common/Ui/ApiLoader';

import { Notification } from 'components/Notification/ToastNotification';

import StatusForBnpl from 'components/FinanceAssetsComponents/BnplFinanceComponents/StatusForBnpl';
import { ToProperCase } from 'components/Common/ToProperCase';

const NestedTableWrapperForBnpl = props => {
  const [bnplAssetDetails, setBnplAssetDetails] = useState(props?.data);

  //loader state, tabledata
  const [isloading, setIsloading] = useState(true);
  const [tableData, setTableData] = useState([]);

  // converting object to array
  const convertTableData = () => {
    const convertedArray = [
      {
        invoiceNumber: bnplAssetDetails?.invoiceNumber,
        NameAsPerPAN: ToProperCase(
          bnplAssetDetails?.byOrg?.NameAsPerPAN
            ? bnplAssetDetails.byOrg.NameAsPerPAN
            : ''
        ),
        invoiceStatus: ToProperCase(
          bnplAssetDetails?.invoiceDetails?.status
            ? bnplAssetDetails.invoiceDetails.status
            : ''
        ),
        invoiceCreationDate: bnplAssetDetails?.invoiceDetails?.createdAt,
        invoiceAmount: bnplAssetDetails?.invoiceDetails?.totalPrice,
      },
    ];

    setTableData(convertedArray);
  };

  //get details of the challans/invoices
  useEffect(() => {
    if (tableData?.length > 0) {
      setIsloading(false);
    }
  }, [tableData]);

  // to set the tabledata with the modified array
  useEffect(() => {
    convertTableData();
  }, [bnplAssetDetails]);

  /************** COLUMNS FOR THE TABLE *************/
  const columns = useMemo(() => {
    let col = [
      {
        Header: 'Invoice ID',
        accessor: 'invoiceNumber',
        filterable: true,
        canSort: true,
        Cell: cellProps => {
          return <InvoiceId {...cellProps} />;
        },
      },
      {
        Header: 'By Organization',
        accessor: 'NameAsPerPAN',
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
        Header: 'Date of Creation',
        accessor: 'invoiceCreationDate',
        filterable: true,
        Cell: cellProps => {
          return <DueDate {...cellProps} />;
        },
      },
      {
        Header: 'Total Amount (In Rs.)',
        accessor: 'invoiceAmount',
        filterable: true,
        Cell: cellProps => {
          return <TotalAmount {...cellProps} />;
        },
      },
    ];

    return col;
  }, [bnplAssetDetails]);

  //DISPLAYING THE TABLE
  const table = () => {
    return (
      <>
        <NestedTable
          columns={columns}
          data={tableData}
          // data={tableData?.current || []}
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
                    <StatusForBnpl bnplAssetDetails={bnplAssetDetails} />
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

export default NestedTableWrapperForBnpl;
