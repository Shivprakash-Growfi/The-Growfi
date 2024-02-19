/*eslint-disable react/no-unknown-property*/
import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Col, Button } from 'reactstrap';

// API'S
import { getAllCanceledChequesDataByOrgId } from 'helpers/backend_helper';

import {
  ProductName,
  ChequeLimit,
  ChequeNumber,
  DownloadChequeDoc,
} from 'components/Cheques&SignedDocsComponents/Docs&ChequesCols';

//TABLE CONTAINER
import TableContainer from 'components/Common/TableContainer';

//pop up on success and failure of api
import { Notification } from 'components/Notification/ToastNotification';

import ApiLoader from 'components/Common/Ui/ApiLoader';
import AddChequeModal from 'components/Cheques&SignedDocsComponents/Cheques/AddChequeModal';

const ChequesTable = props => {
  const selectedOrganization = useSelector(
    state => state.Login.selectedOrganization
  );

  //ALL THE TABLE DATA AND LOADER FOR DISPLAYING THE TABLE
  const [tableData, settableData] = useState([]);
  const [isloading, setisloading] = useState(true);
  const [openAddChequeModal, setOpenAddChequeModal] = useState(false);

  //get cheques data
  useEffect(() => {
    apiCallforAllChequesData();
  }, []);

  const makeChequeTableData = data => {
    if (data.length > 0) {
      settableData(
        data.map(val => {
          return {
            chequeNumber: val?.chequeDetails?.chequeNumber || '-',
            chequeLimit: val?.chequeDetails?.chequeAmount || '-',
            productName: val?.productDetails?.productIdentifier || '-',
            fileName: val?.docDetails?.fileName,
            docLink: val?.docDetails?.docLink,
          };
        })
      );
    }
  };

  const apiCallforAllChequesData = () => {
    getAllCanceledChequesDataByOrgId(selectedOrganization?.organizationId)
      .then(response => {
        if (
          response &&
          (response.statusCode === 200 || response.statusCode === 201)
        ) {
          makeChequeTableData(response?.data);
          // settableData(response?.data);
          setisloading(false);
        } else {
          Notification('Sorry, Please reload the page', 4);
        }
      })
      .catch(err => {
        setisloading(true);
        Notification('Sorry, Please reload the page', 4);
      });
  };

  /************** COLUMNS FOR THE TABLE *************/
  const columns = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'sno',
        canSort: true,
        Cell: cellProps => {
          return cellProps?.cell?.row.id
            ? Number(cellProps?.cell?.row.id) + 1
            : '';
        },
      },
      {
        Header: 'Cheque Number',
        accessor: 'chequeNumber',
        canSort: true,
        filterable: true,
        showSelect: true,
        Cell: cellProps => {
          return <ChequeNumber {...cellProps} />;
        },
      },
      {
        Header: 'Product',
        accessor: 'productName',
        canSort: true,
        filterable: true,
        showSelect: true,
        Cell: cellProps => {
          return <ProductName {...cellProps} />;
        },
      },
      {
        Header: (
          <>
            Cheque Limit (<i className="bx bx-rupee" />)
          </>
        ),
        accessor: 'chequeLimit',
        Cell: cellProps => {
          return <ChequeLimit {...cellProps} />;
        },
      },
      {
        Header: 'Document',
        Cell: ({ row }) => {
          return <DownloadChequeDoc {...row} />;
        },
      },
    ],
    []
  );

  const handleAddChequeModal = () => {
    setOpenAddChequeModal(!openAddChequeModal);
  };

  return (
    <>
      {/* If no documents are found then display this button, if there are documents then display tablecontainer button */}
      {tableData?.length <= 0 ? (
        <div className="text-md-end">
          <Button
            type="button"
            color="success"
            className="btn-rounded mb-2 me-2"
            onClick={handleAddChequeModal}
            name="addChannel"
          >
            <i className="mdi mdi-plus me-1" />
            Add New Cheque
          </Button>
        </div>
      ) : null}
      {openAddChequeModal && (
        <AddChequeModal
          handleModalClose={handleAddChequeModal}
          settableData={settableData}
        />
      )}
      {isloading ? (
        <ApiLoader loadMsg={'Loading...'} />
      ) : tableData?.length <= 0 ? (
        <Col>
          <div
            className="d-flex justify-content-center align-items-center fs-3 text-muted"
            style={{ minHeight: '100%' }}
          >
            No cheque documents found.
          </div>
        </Col>
      ) : (
        <TableContainer
          columns={columns}
          data={tableData}
          isGlobalFilter={true}
          customPageSize={10}
          isAddInvoiceBtn={true} // for add new cheque button
          addInvoiceBtnheader={'Add New Cheque'} // for add new cheque button header
          handleAddInvoiceModal={handleAddChequeModal} // for add new cheque button
          className="custom-header-css"
        />
      )}
    </>
  );
};

export default ChequesTable;
