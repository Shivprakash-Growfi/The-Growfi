/*eslint-disable react/no-unknown-property*/
import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Col } from 'reactstrap';

// API'S
import { getAllSignedDocsByOrgId } from 'helpers/backend_helper';

import {
  SignedBy,
  DocumentName,
  Date,
  DownloadDocument,
} from 'components/Cheques&SignedDocsComponents/Docs&ChequesCols';

//TABLE CONTAINER
import TableContainer from 'components/Common/TableContainer';

//pop up on success and failure of api
import { Notification } from 'components/Notification/ToastNotification';

import ApiLoader from 'components/Common/Ui/ApiLoader';

const SignedDocsTable = props => {
  const selectedOrganization = useSelector(
    state => state.Login.selectedOrganization
  );

  //ALL THE TABLE DATA AND LOADER FOR DISPLAYING THE TABLE
  const [tableData, settableData] = useState([]);
  const [isloading, setisloading] = useState(true);

  //get details of all organizations
  useEffect(() => {
    getAllSignedDocsByOrgId(selectedOrganization?.organizationId)
      .then(response => {
        if (
          response &&
          (response.statusCode === 200 || response.statusCode === 201)
        ) {
          settableData(response?.data);
          setisloading(false);
        } else {
          Notification('Sorry, Please reload the page', 4);
        }
      })
      .catch(err => {
        setisloading(true);
        Notification('Sorry, Please reload the page', 4);
      });
  }, []);

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
        Header: 'Signed By',
        accessor: 'signedUser',
        canSort: true,
        filterable: true,
        showSelect: true,
        Cell: cellProps => {
          return <SignedBy {...cellProps} />;
        },
      },
      {
        Header: 'Document Name',
        accessor: 'agreementName',
        canSort: true,
        filterable: true,
        showSelect: true,
        Cell: cellProps => {
          return <DocumentName {...cellProps} />;
        },
      },
      {
        Header: 'Last Updated',
        accessor: 'updatedAt',
        Cell: cellProps => {
          return <Date {...cellProps} />;
        },
      },
      {
        Header: 'Document',
        Cell: ({ row }) => {
          return <DownloadDocument {...row} />;
        },
      },
    ],
    []
  );

  return (
    <>
      {isloading ? (
        <ApiLoader loadMsg={'Loading...'} />
      ) : tableData?.length <= 0 ? (
        <Col>
          <div
            className="d-flex justify-content-center align-items-center fs-3 text-muted"
            style={{ minHeight: '100%' }}
          >
            No signed documents found.
          </div>
        </Col>
      ) : (
        <TableContainer
          columns={columns}
          data={tableData}
          isGlobalFilter={true}
          customPageSize={10}
          className="custom-header-css"
        />
      )}
    </>
  );
};

export default SignedDocsTable;
