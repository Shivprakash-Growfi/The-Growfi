import React, { useEffect, useState } from 'react';

import { Button, Card, CardBody, CardHeader } from 'reactstrap';

//User comp
import CollapseMainTable from 'components/LenderManagementComp/CollapseTable/CollapseMainTable';
import OrgLenderMappingModal from 'components/LenderManagementComp/OrgLenderMappingModal';
import { getAllOrgWithProductMapping } from 'helpers/backend_helper';
import { Notification } from 'components/Notification/ToastNotification';
import ApiLoader from 'components/Common/Ui/ApiLoader';

const OrgLenderProductMapping = () => {
  const [isShowCreateModal, setIsShowCreateModal] = useState(false);
  const [isShowLoader, setIsShowLoader] = useState(false);
  const [isTableDataAvail, setIsTableDataAvail] = useState(false);
  const [organizationTableData, setOrganizationTableData] = useState([]);

  //Table Data
  useEffect(() => {
    if (organizationTableData.length < 1) {
      fetchAPI();
    }
  }, [organizationTableData]);
  const fetchAPI = async () => {
    try {
      setIsShowLoader(true);
      const jsonData = await getAllOrgWithProductMapping();
      if (
        jsonData &&
        (jsonData.statusCode === 200 || jsonData.statusCode === 201)
      ) {
        jsonData.data.map(val => {
          setOrganizationTableData(prev => [...prev, val]);
        });
        setIsShowLoader(false);
        jsonData.data?.length > 0 && setIsTableDataAvail(true);
      } else {
        Notification(`${jsonData.message}`, 4);
      }
    } catch (error) {
      Notification(`Not able to fetch permissions. Try later!`, 4);
    }
  };

  const orgColumns = React.useMemo(() => [
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
    { Header: 'ID', accessor: 'orgId', canSort: true },
    { Header: 'Name', accessor: 'nameAsPerGST', canSort: true },
  ]);

  //handle Function

  const handleCreateBtn = () => {
    setIsShowCreateModal(true);
  };
  const handleCreateModalClose = () => {
    setIsShowCreateModal(false);
  };
  const handleModalUpdate = () => {
    setOrganizationTableData([]);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Card>
          <CardBody className="border-bottom d-flex align-items-center justify-content-between">
            <h3 className="m-0">Product Activation</h3>
            <Button onClick={handleCreateBtn}>Create +</Button>
          </CardBody>
          <CardBody>
            {!isShowLoader ? (
              isTableDataAvail ? (
                <CollapseMainTable
                  columns={orgColumns}
                  data={organizationTableData}
                  isGlobalFilter={true}
                  customPageSize={10}
                  showFilterByCol={true}
                  isCreateComp={false}
                />
              ) : (
                <div>No Organizations added yet.</div>
              )
            ) : (
              <ApiLoader />
            )}
          </CardBody>
          {isShowCreateModal && (
            <OrgLenderMappingModal
              isShowCreateModal={isShowCreateModal}
              handleCreateModalClose={handleCreateModalClose}
              handleModalUpdate={handleModalUpdate}
            />
          )}
        </Card>
      </div>
    </React.Fragment>
  );
};

export default OrgLenderProductMapping;
