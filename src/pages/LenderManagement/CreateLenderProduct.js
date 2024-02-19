import CollapseMainTable from 'components/LenderManagementComp/CollapseTable/CollapseMainTable';
import CreateProductModal from 'components/LenderManagementComp/CreateProductModal';
import { getAllLenders } from 'helpers/backend_helper';
import React, { useEffect, useState } from 'react';
import { Button, Card, CardBody, CardHeader } from 'reactstrap';
import ApiLoader from 'components/Common/Ui/ApiLoader';

const CreateLenderProduct = () => {
  const [isShowCreateModal, setIsShowCreateModal] = useState(false);
  const [isTableDataAvail, setIsTableDataAvail] = useState(false);
  const [isShowLoader, setIsShowLoader] = useState(false);
  const [lenderTableData, setLenderTableData] = useState([]);
  const [lenderData, setLenderData] = useState({});

  useEffect(() => {
    if (lenderTableData.length < 1) {
      fetchAPI();
    }
  }, [lenderTableData]);
  const fetchAPI = async () => {
    try {
      setIsShowLoader(true);
      const jsonData = await getAllLenders();
      if (
        jsonData &&
        (jsonData.statusCode === 200 || jsonData.statusCode === 201)
      ) {
        jsonData.data.map(val => {
          setLenderTableData(prev => [...prev, val]);
          setLenderData(prev => ({
            ...prev,
            [val.nameAsPerGST]: val.id,
          }));
        });
        setIsShowLoader(false);
        jsonData?.data?.length > 0 && setIsTableDataAvail(true);
      } else {
        Notification(`${jsonData.message}`, 4);
      }
    } catch (error) {
      Notification(`Not able to fetch permissions. Try later!`, 4);
    }
  };

  const lenderColumns = React.useMemo(() => [
    {
      Header: '',
      id: 'expander',
      Cell: ({ row }) => (
        <span {...row.getToggleRowExpandedProps()} style={{ fontSize: '18px' }}>
          {row.isExpanded ? (
            <i className="fas fa-angle-up" />
          ) : (
            <i className="fas fa-angle-down" />
          )}
        </span>
      ),
    },
    { Header: 'ID', accessor: 'id', canSort: true },
    { Header: 'Name', accessor: 'nameAsPerGST', canSort: true },
    { Header: 'Organization Type', accessor: 'organizationType' },
    {
      Header: 'Status',
      Cell: ({ row }) => {
        return (
          <div className="d-flex justify-content-center" key={row.original.id}>
            <i
              className={
                row.original.isActive
                  ? 'mdi mdi-account-outline'
                  : 'mdi mdi-account-off-outline'
              }
              key={row.original.id + '_botton_inactive'}
              style={{
                fontSize: '22px' /* Adjust the icon size as needed */,
                color: row.original.isActive
                  ? 'green'
                  : '#ff0000' /* Change this to your desired color */,
              }}
            ></i>
          </div>
        );
      },
    },
    // { Header: 'Age', accessor: 'age' },
  ]);

  //handle Function

  const handleCreateBtn = () => {
    setIsShowCreateModal(true);
  };
  const handleCreateModalClose = () => {
    setIsShowCreateModal(false);
  };
  const handleModalUpdate = () => {
    setLenderTableData([]);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Card>
          <CardBody className="border-bottom d-flex align-items-center justify-content-between">
            <h3 className="m-0">Lender Products</h3>
            <Button onClick={handleCreateBtn}>Create +</Button>
          </CardBody>
          <CardBody>
            {!isShowLoader ? (
              isTableDataAvail ? (
                <CollapseMainTable
                  columns={lenderColumns}
                  data={lenderTableData}
                  isGlobalFilter={true}
                  customPageSize={10}
                  showFilterByCol={true}
                  isCreateComp={true}
                />
              ) : (
                <h3>No Data limitAvailable</h3>
              )
            ) : (
              <ApiLoader loadMsg={'Waiting for data to render!'} />
            )}
          </CardBody>
          {isShowCreateModal && (
            <CreateProductModal
              isShowCreateModal={isShowCreateModal}
              handleCreateModalClose={handleCreateModalClose}
              lenderData={lenderData}
              handleModalUpdate={handleModalUpdate}
            />
          )}
        </Card>
      </div>
    </React.Fragment>
  );
};

export default CreateLenderProduct;
