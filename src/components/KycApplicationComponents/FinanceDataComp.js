import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, CardBody, Col, Row } from 'reactstrap';
import TableContainer from 'components/Common/TableContainer';
import UploadBalanceSheetModal from './UploadBalanceSheetModal';
import NestedTable from 'components/Common/NestedTable';
import { DownloadFileByName } from 'components/Common/FileSizeTypeChecker';
import { deleteOrgFinanceDocs } from 'helpers/backend_helper';
import { Notification } from 'components/Notification/ToastNotification';

const FinancialDataComp = props => {
  const { toggleTab, activeTab, apiData } = props;
  const [userData, setUserData] = useState([]);
  const [isDataAval, setIsDataAval] = useState(false);

  const [isDirectorModalOpen, setIsDirectorModalOpen] = useState(false);
  useEffect(() => {
    setUserData(apiData);
    apiData?.length && setIsDataAval(true);
  }, []);
  const dataWithSerialNumber =
    isDataAval &&
    userData.map((item, index) => ({
      ...item,
      sno: 'BS ' + (index + 1),
    }));

  const handleDeleteClick = async rowData => {
    try {
      const docId = rowData?.id;
      const deleteResp = await deleteOrgFinanceDocs(docId);
      if (deleteResp?.statusCode === 200 || deleteResp?.statusCode === 201) {
        const updatedData = userData.filter(val => val.id != docId);
        setUserData(updatedData);
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
      canSort: true,
    },
    {
      Header: 'Financial year',
      accessor: 'period',
    },
    {
      Header: 'Turnover',
      accessor: 'turnover',
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
                key={row.original.id + '_botton_download'}
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
    setUserData(prevData => [...prevData, addedData[0]]);
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
              <h4 className="card-title m-0">BALANCE SHEETS</h4>
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
                <h6>No Balance sheet uploaded!</h6>
              </div>
            )}
          </CardBody>

          <UploadBalanceSheetModal
            isOpen={isDirectorModalOpen}
            handleModalCancel={handleModalCancel}
            handleModalUpdate={handleModalUpdate}
            CustomModalHeader={'Uploading Balance sheet'}
          />
        </Card>
        <Row>
          <div className="d-flex flex-row-reverse">
            <Button
              color="primary"
              className="me-3"
              type="button"
              onClick={() => {
                toggleTab(activeTab + 1);
              }}
            >
              Next
            </Button>
          </div>
        </Row>
      </Col>
    </>
  );
};

export default FinancialDataComp;
