import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, CardBody, Col, Row } from 'reactstrap';
import TableContainer from 'components/Common/TableContainer';
import ItrUploadModal from './ItrUploadModal';
import NestedTable from 'components/Common/NestedTable';
import { DownloadFileByName } from 'components/Common/FileSizeTypeChecker';
import { deleteOrgFinanceDocs } from 'helpers/backend_helper';

const ItrUpload = props => {
  const { toggleTab, activeTab, verificationStatus, apiData } = props;
  const [itrData, setIrtData] = useState([]);
  const [isDataAval, setIsDataAval] = useState(false);

  const [isDirectorModalOpen, setIsDirectorModalOpen] = useState(false);
  useEffect(() => {
    setIrtData(apiData);
    apiData?.length && setIsDataAval(true);
  }, []);
  const dataWithSerialNumber =
    isDataAval &&
    itrData.map((item, index) => ({
      ...item,
      sno: 'ITR ' + (index + 1),
    }));

  const handleDeleteClick = async rowData => {
    try {
      const docId = rowData?.id;
      const deleteResp = await deleteOrgFinanceDocs(docId);
      if (deleteResp?.statusCode === 200 || deleteResp?.statusCode === 201) {
        const updatedData = itrData.filter(val => val.id != docId);
        setIrtData(updatedData);
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
      Header: 'Action',
      Cell: ({ row }) => {
        return (
          <div
            className="d-flex justify-content-center justify-content-sm-around"
            key={row.original.id}
          >
            <a
              onClick={() => {
                DownloadFileByName(row.original.itr);
              }}
            >
              View ITR
            </a>
            {/* <i
              className="mdi mdi-download"
              key={row.original.id + '_botton_inactive'}
              style={{
                fontSize: '24px',
                color: 'grey',
              }}
            ></i> */}
            <a
              onClick={() => {
                DownloadFileByName(row.original.computation);
              }}
            >
              View Computation
            </a>
            <a
              style={{
                color: '#ff0000' /* Change this to your desired color */,
              }}
              onClick={() => {
                handleDeleteClick(row.original);
              }}
            >
              Delete
            </a>
          </div>
        );
      },
    },
  ]);
  const handleModalUpdate = addedData => {
    setIrtData(prevData => [...prevData, addedData[0]]);
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
              <h4 className="card-title m-0">ITR</h4>
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
                <h6>No ITR uploaded</h6>
              </div>
            )}
          </CardBody>

          <ItrUploadModal
            isOpen={isDirectorModalOpen}
            handleModalCancel={handleModalCancel}
            handleModalUpdate={handleModalUpdate}
            CustomModalHeader={'Uploading GST returns'}
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

export default ItrUpload;
