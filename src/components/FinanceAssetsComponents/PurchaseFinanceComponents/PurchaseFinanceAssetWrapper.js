import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardBody, Col, Row, UncontrolledTooltip } from 'reactstrap';
import { Link } from 'react-router-dom';

// columns for finance table
import {
  P2bAssetId,
  Status,
  TotalChallans,
  TotalAmount,
  ByOrganization,
  DueDate,
} from 'components/FinanceAssetsComponents/CommonComponents/financeColumns';

//expansion column for table container
import { getExpansionTableColoum } from 'helpers/utilities';

// displaying the main table and using nested table wrapper
import TableContainer from 'components/Common/TableContainer';
import NestedTableWrapperForPF from 'components/FinanceAssetsComponents/PurchaseFinanceComponents/NestedTableWrapperForPF';

import {
  deletePFAssets,
  updatePFAssets,
  createEnach,
} from 'helpers/backend_helper';
import { useSelector } from 'react-redux';
import EditModal from 'components/FinanceAssetsComponents/CommonComponents/EditModal';
import DeleteModal from 'components/Common/DeleteModal';
import { IsUserGrowfi } from 'helpers/utilities';
import {
  ApiNotificationLoading,
  ApiNotificationUpdate,
  Notification,
} from 'components/Notification/ToastNotification';

const PurchaseFinanceAsset = props => {
  // destructuring
  const { tableData2, reloadTable, showSetPage, isGlobalFilter } = props;

  //edit modal open or close, Delete Modal open or close, p2bassetdata state
  const [openEditModal, setOpenEditModal] = useState(false);
  const [pfAssetData, setPFAssetData] = useState({});
  const [opendDeleteModal, setOpenDeleteModal] = useState(false);

  //user is soptle or not
  const [userIsSoptle, setUserIsSoptle] = useState(null);

  // organization details from login
  const selectedOrganization = useSelector(
    state => state.Login.selectedOrganization
  );

  // useeffect to find the whether the user is soptle or not
  useEffect(() => {
    setUserIsSoptle(
      IsUserGrowfi(
        selectedOrganization.organizationOperationType,
        selectedOrganization.userType
      )
    );
  }, []);

  // handle open/close edit modal function
  const handleOpenEditModal = () => {
    setOpenEditModal(!openEditModal);
  };

  // handle edit button function
  const handleEditClick = pfAssetId => {
    setPFAssetData(pfAssetId);
    handleOpenEditModal();
  };

  // handle open/close delete modal function
  const handleOpenDeleteModal = () => {
    setOpenDeleteModal(!opendDeleteModal);
  };

  // handle delete button function
  const handleDeleteClick = pfAssetId => {
    setPFAssetData(pfAssetId);
    handleOpenDeleteModal();
  };

  // delete p2basset api call
  const handleDeletePF = () => {
    if (pfAssetData?.status !== 'underProcessing') {
      Notification(
        "Sorry, only the asset id with status 'Under Processing' can be deleted.",
        1
      );
    } else {
      const id = ApiNotificationLoading();
      deletePFAssets(pfAssetData?.pfId)
        .then(response => {
          if (
            response &&
            (response.statusCode === 200 || response.statusCode === 201)
          ) {
            ApiNotificationUpdate(id, 'Asset Id Sucessfully deleted.', 2);
            reloadTable && reloadTable();
          } else {
            ApiNotificationUpdate(
              id,
              'Sorry, Please try to delete after some time.',
              4
            );
          }
        })
        .catch(error => {
          ApiNotificationUpdate(
            id,
            'Sorry, Please try to delete after some time.',
            4
          );
        });
    }
    handleOpenDeleteModal();
  };

  // edit pfAsset api call
  const handleEditPF = (
    validation,
    values,
    pfAssetData,
    handleModalClose,
    reloadTable
  ) => {
    const apiCallForPFEdit = async () => {
      const id = ApiNotificationLoading();
      try {
        const response = await updatePFAssets(
          pfAssetData?.pfId,
          values?.status,
          values?.approvedAmount !== '' ? Number(values?.approvedAmount) : '',
          values?.idAmountArrayForPaid || [],
          values?.idAmountArrayPaidBack || []
        );
        if (
          response &&
          (response.statusCode === 200 || response.statusCode === 201)
        ) {
          ApiNotificationUpdate(id, 'Status successfully updated.', 2);
          handleModalClose();
          validation.resetForm();
          reloadTable && reloadTable();
        } else {
          ApiNotificationUpdate(
            id,
            'Sorry. Please try to update again by entering correct details',
            4
          );
        }
      } catch (error) {
        ApiNotificationUpdate(
          id,
          'Sorry. Please try to update again by entering correct details',
          4
        );
      }
    };
    apiCallForPFEdit();
  };

  // create enach api call
  const handleCreateEnach = (
    enachDetails,
    handleModalClose,
    validation,
    reloadTable
  ) => {
    const apiCallForCreateEnach = async () => {
      const id = ApiNotificationLoading();
      try {
        const response = await createEnach(
          enachDetails?.assetId,
          enachDetails?.assetType,
          enachDetails?.digioId,
          enachDetails?.isRecuring,
          enachDetails?.frequency,
          enachDetails?.firstCollectionDate,
          enachDetails?.finalCollectionDate,
          enachDetails?.comment,
          enachDetails?.customerIdentifier
        );
        if (
          response &&
          (response.statusCode === 200 || response.statusCode === 201)
        ) {
          ApiNotificationUpdate(id, 'Status successfully updated.', 2);
          handleModalClose();
          validation.resetForm();
          reloadTable && reloadTable();
        } else {
          ApiNotificationUpdate(
            id,
            'Sorry. Please try to update again by entering correct details',
            4
          );
        }
      } catch (error) {
        ApiNotificationUpdate(
          id,
          'Sorry. Please try to update again by entering correct details',
          4
        );
      }
    };

    apiCallForCreateEnach();
  };

  /************** COLUMNS FOR THE TABLE *************/
  const columns = useMemo(() => {
    let col = [
      getExpansionTableColoum('18px'),
      {
        Header: 'PF Asset ID',
        accessor: 'pfId',
        // filterable: true,
        // showSelect: false,
        canSort: true,
        Cell: cellProps => {
          return <P2bAssetId {...cellProps} />;
        },
      },
      {
        Header: 'Status',
        accessor: 'status',
        filterable: true,
        showSelect: true,
        filter: 'equals',
        Cell: cellProps => {
          return <Status {...cellProps} />;
        },
      },
      {
        Header: 'Total Challans',
        accessor: 'numberOfInvoices',
        // filterable: true,
        // showSelect: false,
        Cell: cellProps => {
          return <TotalChallans {...cellProps} />;
        },
      },
      {
        Header: 'Total Amount (In Rs.)',
        accessor: 'totalPrice',
        // filterable: true,
        // showSelect: false,
        Cell: cellProps => {
          return <TotalAmount {...cellProps} />;
        },
      },
      {
        Header: 'Due Date',
        accessor: 'dueDate',
        // filterable: true,
        // showSelect: false,
        Cell: cellProps => {
          return <DueDate {...cellProps} />;
        },
      },
      {
        Header: 'Action',
        Cell: cellProps => {
          return (
            <div
              className={`d-flex justify-content-center ${
                userIsSoptle ? 'gap-2' : ''
              }`}
            >
              {userIsSoptle && (
                <Link
                  className="text-success"
                  onClick={() => {
                    handleEditClick(cellProps.row.original);
                  }}
                >
                  <i className="mdi mdi-pencil font-size-18" id="edittooltip" />
                  <UncontrolledTooltip placement="top" target="edittooltip">
                    Edit
                  </UncontrolledTooltip>
                </Link>
              )}
              <Link
                className="text-danger"
                onClick={() => {
                  handleDeleteClick(cellProps.row.original);
                }}
              >
                <i className="mdi mdi-delete font-size-18" id="deletetooltip" />
                <UncontrolledTooltip placement="top" target="deletetooltip">
                  Delete
                </UncontrolledTooltip>
              </Link>
            </div>
          );
        },
      },
    ];

    if (userIsSoptle) {
      col = [
        ...col.slice(0, 2),
        {
          Header: 'Organization',
          accessor: 'orgName',
          filterable: true,
          showSelect: true,
          filter: 'equals',
          canSort: true,
          Cell: cellProps => {
            return <ByOrganization {...cellProps} />;
          },
        },
        ...col.slice(2),
      ];
    }

    return col;
  }, [selectedOrganization, tableData2, userIsSoptle]);

  //DISPLAYING THE TABLE
  const table = () => {
    return (
      <>
        <TableContainer
          columns={columns}
          data={tableData2}
          isGlobalFilter={isGlobalFilter}
          bordered={false}
          filterByColumn={false}
          // IsUserGrowfi={userIsSoptle}
          initialSort={'pfId'}
          // id={'PurchaseFinancePage'}
          // financeMethod={'purchaseFinance'}
          customPageSize={10}
          NestedTable={NestedTableWrapperForPF}
          className="custom-header-css"
        />
      </>
    );
  };

  const optionsArr = () => {
    return (
      <>
        <option disabled value="">
          Please Select a New Status
        </option>
        <option value={'approved'}>Approved</option>
        <option value={'enachCreated'}>Create Enach</option>
        <option value={'paid'}>Paid</option>
        <option value={'paid back'}>Paid Back</option>
      </>
    );
  };

  return (
    <React.Fragment>
      {openEditModal && (
        <EditModal
          p2bAssetData={pfAssetData}
          openEditModal={openEditModal}
          showMultipleFields={true}
          reloadTable={reloadTable}
          handleModalClose={() => {
            setOpenEditModal(false);
          }}
          handleEditApiCall={handleEditPF}
          id={'PurchaseFinancePage'}
          financeMethod={'purchaseFinance'}
          createEnachAssetType={'purchaseFinance'}
          assetId={pfAssetData?.pfId}
          optionsArr={optionsArr}
          handleCreateEnach={handleCreateEnach}
        />
      )}
      <DeleteModal
        show={opendDeleteModal}
        onDeleteClick={handleDeletePF}
        onCloseClick={handleOpenDeleteModal}
        deleteMsg={'Are you sure you want to permanently delete this Asset.'}
      />
      <Row>
        <Col xs="12">
          <Card>
            <CardBody>{table()}</CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default PurchaseFinanceAsset;
