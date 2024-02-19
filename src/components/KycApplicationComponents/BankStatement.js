import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, CardBody, Col, Row } from 'reactstrap';
import TableContainer from 'components/Common/TableContainer';
import NestedTable from 'components/Common/NestedTable';
import { Notification } from 'components/Notification/ToastNotification';
import { DownloadFileByName } from 'components/Common/FileSizeTypeChecker';
import { deleteOrgFinanceDocs } from 'helpers/backend_helper';
import BankStatementModal from './BankStatementModal';

const BankStatement = props => {
  const { toggleTab, activeTab, verificationStatus, apiData } = props;
  const [bankData, setBankData] = useState([]);
  const [isDataAval, setIsDataAval] = useState(false);

  const [isDirectorModalOpen, setIsDirectorModalOpen] = useState(false);
  useEffect(() => {
    setBankData(apiData);
    apiData?.length && setIsDataAval(true);
  }, []);
  const dataWithSerialNumber =
    isDataAval &&
    bankData.map((item, index) => ({
      ...item,
      sno: 'Statement ' + (index + 1),
    }));

  const handleDeleteClick = async rowData => {
    try {
      const docId = rowData?.id;
      const deleteResp = await deleteOrgFinanceDocs(docId);
      if (deleteResp?.statusCode === 200 || deleteResp?.statusCode === 201) {
        const updatedData = bankData.filter(val => val.id != docId);
        setBankData(updatedData);
        Notification(`${deleteResp.message}`, 1);
      } else {
        Notification(`${deleteResp.message}`, 1);
      }
    } catch {
      Notification('Unable to delete file!', 4);
    }
  };

  const columns = useMemo(() => [
    {
      Header: 'S.No.',
      accessor: 'sno',
    },
    {
      Header: 'Start date',
      accessor: 'startDate',
    },
    {
      Header: 'End date',
      accessor: 'endDate',
    },
    {
      Header: 'Action',
      Cell: ({ row }) => {
        return (
          <div
            className="d-flex justify-content-center justify-content-sm-around"
            key={row.original.id}
          >
            <a
              onClick={() => {
                DownloadFileByName(row.original.fileName);
              }}
            >
              <i
                className="mdi mdi-download"
                key={row.original.id + '_botton_inactive'}
                style={{
                  fontSize: '24px' /* Adjust the icon size as needed */,
                  color: 'grey' /* Change this to your desired color */,
                }}
              ></i>
            </a>
            <a>
              <i
                className="mdi mdi-delete"
                key={row.original.id + '_botton_inactive'}
                style={{
                  fontSize: '24px' /* Adjust the icon size as needed */,
                  color: '#ff0000' /* Change this to your desired color */,
                }}
                onClick={() => {
                  handleDeleteClick(row.original);
                }}
              ></i>
            </a>
          </div>
        );
      },
    },
  ]);
  const handleModalUpdate = addedData => {
    setBankData(prevData => [...prevData, addedData[0]]);
    setIsDataAval(true);
  };

  const handleModalCancel = () => {
    setIsDirectorModalOpen(false);
  };
  return (
    <>
      <Col lg="12">
        <Card>
          <CardBody className="border-bottom">
            <div className="d-flex align-items-center justify-content-lg-between">
              <h4 className="card-title m-0">Bank Statements</h4>
              <Button
                color="primary"
                onClick={() => {
                  setIsDirectorModalOpen(true);
                }}
              >
                Add
              </Button>
            </div>
          </CardBody>
          <CardBody>
            {isDataAval ? (
              <div>
                {/* <TableContainer
                  columns={columns}
                  data={dataWithSerialNumber}
                  isGlobalFilter={false}
                  showFilterByCol={false}
                  customPageSize={10}
                  hideShowButton={true}
                  initialSort="sno"
                /> */}
                <NestedTable
                  columns={columns}
                  data={dataWithSerialNumber}
                  filterByColumn={false}
                  bordered={false}
                  maxHeight={'250px'}
                  initialSort={'sno'}
                  className=""
                />
              </div>
            ) : (
              <div className="text-center">
                <h6>No bank statement uploaded</h6>
              </div>
            )}
          </CardBody>

          <BankStatementModal
            isOpen={isDirectorModalOpen}
            handleModalCancel={handleModalCancel}
            handleModalUpdate={handleModalUpdate}
            CustomModalHeader={'Uploading bank statement returns'}
          />
        </Card>
        <Row>
          <div className="d-flex flex-row-reverse">
            <Button
              color="primary"
              type="button"
              onClick={() => {
                props.toggleTab(activeTab + 1);
              }}
            >
              Next
            </Button>
            <Button
              color="primary"
              className="me-3"
              onClick={() => {
                props.toggleTab(activeTab - 1);
              }}
              type="button"
            >
              Back
            </Button>
          </div>
        </Row>
      </Col>
    </>
  );
};

export default BankStatement;
