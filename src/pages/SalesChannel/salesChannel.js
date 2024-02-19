import React, { useState, useEffect, useMemo } from 'react';
import { CardBody } from 'reactstrap';
import TableContainer from 'components/Common/TableContainer';

import 'components/SalesChannelComponents/salesChannel.scss';
//Modal
import ModalFunction from 'components/SalesChannelComponents/salesChannelAddModal';

//api calls
import {
  deleteSalesChannel,
  getChildChannels,
  updateChannelStatue,
} from 'helpers/backend_helper';
import ApiLoader from 'components/Common/Ui/ApiLoader';
import withRouter from 'components/Common/withRouter';
import { Path } from 'routes/constant';
import { useNavigate } from 'react-router-dom';
import DirectAddSalesChannel from 'components/SalesChannelComponents/directAddSalesChannel';

//Notification imports
import { Notification } from 'components/Notification/ToastNotification';

const SalesChannel = props => {
  const [isLoadingTable, setIsLoadingTable] = useState(false);
  //Modal for Add sales channel
  const [modal, setModal] = useState(false);

  const [isOpenDirectAddModal, setIsOpenDirectAddModal] = useState(false);

  // sales channel table data
  const [tableData, setTableData] = useState([]);

  // Heading Data
  const [selectedChannelName, setSelectedChannelName] = useState('');
  const [selectedChannelMId, setSelectedChannelMID] = useState('');

  const [fetchedDataByPan, setFetchedDataByPan] = useState({});
  const [isOrgExistByPan, setIsOrgExistByPan] = useState(false);

  const channelId = props?.router?.params?.id;
  const navigate = useNavigate();
  useEffect(() => {
    channelChildData();
  }, []);

  const channelChildData = () => {
    // const channelId = props?.router?.params?.id;
    setIsLoadingTable(true);
    getChildChannels(channelId)
      .then(response => {
        if (response.statusCode === 200 || response.statusCode === 201) {
          const { parentData = {}, childData = [] } = response?.data;
          if (parentData != {}) {
            setSelectedChannelName(parentData?.channelIdentifer);
            setSelectedChannelMID(parentData?.mId);
          }
          if (childData?.length > 0) {
            setTableData(childData);
          } else {
            setTableData([]);
          }
          setIsLoadingTable(false);
        } else {
          Notification(`${response.message}`, 4);
        }
      })
      .catch(err => {
        Notification(`Unable to fetch channels`, 4);
      });
  };

  /************** Handling Add channel changes *************/

  const addChannelToggle = () => {
    setModal(!modal);
  };
  const handleDirectAddModal = () => {
    setIsOpenDirectAddModal(!isOpenDirectAddModal);
  };

  const handleDirectAddModalUpdate = (fetchedData = {}) => {
    handleDirectAddModal();
    if (Object.keys(fetchedData)?.length != 0) {
      setFetchedDataByPan(fetchedData);
      addChannelToggle();
      setIsOrgExistByPan(true);
    } else {
      setFetchedDataByPan({});
      addChannelToggle();
      setIsOrgExistByPan(false);
    }
  };

  const handleAddModalUpdate = () => {
    addChannelToggle();
    channelChildData();
  };

  const handleCustomerClick = () => {
    handleDirectAddModal();
  };

  /************** Input field arrays for organization name, type etc *************/

  // COLUMNS FOR DISPLAYING SALES CHANNEL TABLE
  const columns = useMemo(
    () => [
      {
        Header: 'Channel Id',
        accessor: 'id',
        width: '25%',
        canSort: true,
      },
      {
        Header: 'Organization name',
        showSelect: true,
        filterable: true,
        accessor: 'salesOrganization.nameAsPerGST',
        width: '35%',
        canSort: true,
      },
      {
        Header: 'Organization Operation Type',
        accessor: 'salesOrganization.organizationOperationType',
        showSelect: true,
        filterable: true,
        width: '35%',
        Cell: ({ row }) => {
          return (
            <>
              {row.original.salesOrganization?.organizationOperationType?.toUpperCase() +
                ' '}
              {row.original.retailerSubType
                ? row.original.retailerSubType.toUpperCase()
                : ''}
            </>
          );
        },
      },
      {
        Header: 'Challan Action',
        width: '40%',
        Cell: ({ row }) => {
          return (
            <div
              className="d-flex justify-content-evenly align-items-center"
              key={row.original.id}
            >
              {/* {organizationOperationType === 'distributor' &&
                row.original.salesOrganization.organizationOperationType !==
                  organizationOperationType && (
                  <i
                    onClick={() => {
                      handleCreateChallan(row.original.id);
                    }}
                    className="bx bx-receipt channel-icon"
                  ></i>
                )} */}
              <i
                onClick={() => {
                  handleCreateHistory(row.original.salesOrganization.id);
                }}
                className="mdi mdi-history channel-icon"
              ></i>
            </div>
          );
        },
      },
      {
        Header: 'Status',
        width: '40%',
        Cell: ({ row }) => {
          return (
            <div
              className="d-flex justify-content-center"
              key={row.original.id}
            >
              {row.original.isActive ? (
                <i
                  className="mdi mdi-account-outline"
                  key={row.original.id + '_botton_active'}
                  style={{
                    fontSize: '24px' /* Adjust the icon size as needed */,
                    color: 'green' /* Change this to your desired color */,
                  }}
                  onClick={() => {
                    handleActiveBtn(row.original.id, row.original.isActive);
                  }}
                ></i>
              ) : (
                <>
                  <i
                    className="mdi mdi-account-off-outline"
                    key={row.original.id + '_botton_inactive'}
                    style={{
                      fontSize: '24px' /* Adjust the icon size as needed */,
                      color: '#ff0000' /* Change this to your desired color */,
                    }}
                    onClick={() => {
                      handleActiveBtn(row.original.id, row.original.isActive);
                    }}
                  ></i>
                </>
              )}
            </div>
          );
        },
      },
    ],
    [tableData]
  );

  const handleCreateHistory = id => {
    navigate(`${Path.VIEW_INVOICES}/pending?orgID=${id}`);
  };

  const handleActiveBtn = (id, isActive) => {
    updateChannelStatue(id, !isActive)
      .then(response => {
        if (response.statusCode == 200 || response.statusCode === 201) {
          updateActiveValue(id, !isActive);
          Notification(`${response.message}`, 2);
        } else {
          Notification(`${response.message}`, 4);
        }
      })
      .catch(err => {
        Notification(`Something went wrong! Please try again.`, 4);
      });
  };
  const updateActiveValue = (itemId, newValue) => {
    const updatedItems = [...tableData];
    const index = updatedItems.findIndex(item => item.id === itemId);

    if (index >= 0) {
      updatedItems[index] = {
        ...updatedItems[index],
        isActive: newValue,
      };
      setTableData(updatedItems);
    }
  };

  //Sales channel delete func.
  // const handleDeleteClick = rowData => {
  //   console.log(rowData);
  //   deleteSalesChannel(rowData?.id)
  //     .then(response => {
  //       if (response.statusCode == 200 || response.statusCode === 201) {
  //         Notification(`${response.message}`, 2);
  //         channelChildData();
  //       } else {
  //         Notification(`${response.message}`, 4);
  //       }
  //     })
  //     .catch(err => {
  //       Notification(`Something went wrong! Please try again.`, 4);
  //     });
  // };

  //<i
  //   className="mdi mdi-delete"
  //   key={row.original.id + '_botton_delete'}
  //   style={{
  //     fontSize: '24px' /* Adjust the icon size as needed */,
  //     color: '#ff0000' /* Change this to your desired color */,
  //   }}
  //   onClick={() => {
  //     handleDeleteClick(row.original);
  //   }}
  // ></i>

  return (
    <React.Fragment>
      {isLoadingTable ? (
        <CardBody>
          <ApiLoader />
        </CardBody>
      ) : (
        <>
          <CardBody className="border-bottom">
            <h3 className="m-0">
              {selectedChannelMId?.length > 1 ? (
                <>
                  {selectedChannelMId} : {selectedChannelName}
                </>
              ) : (
                <>{selectedChannelName}</>
              )}
            </h3>
          </CardBody>
          <CardBody>
            <TableContainer
              columns={columns}
              data={tableData}
              isAddSalesChannel={true}
              handleCustomerClick={handleCustomerClick}
              isGlobalFilter={true}
              customPageSize={10}
              showFilterByCol={true}
            />
          </CardBody>
          {modal && (
            <ModalFunction
              isOpenModal={modal}
              addChannelToggle={addChannelToggle}
              modalHeader="Add Sales Channel"
              fetchedDataByPan={fetchedDataByPan}
              isOrgExistByPan={isOrgExistByPan}
              handleAddModalUpdate={handleAddModalUpdate}
              channelId={channelId}
            />
          )}
          {isOpenDirectAddModal && (
            <DirectAddSalesChannel
              isOpenModal={isOpenDirectAddModal}
              handleDirectAddModal={handleDirectAddModal}
              modalHeader="Add Sales Channel"
              handleDirectAddModalUpdate={handleDirectAddModalUpdate}
            />
          )}
        </>
      )}
    </React.Fragment>
  );
};

export default withRouter(SalesChannel);
