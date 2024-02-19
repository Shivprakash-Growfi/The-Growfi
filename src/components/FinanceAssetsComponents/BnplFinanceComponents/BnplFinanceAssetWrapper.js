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
import NestedTableWrapperForBnpl from 'components/FinanceAssetsComponents/BnplFinanceComponents/NestedTableWrapperForBnpl';
import { updatePFAssets } from 'helpers/backend_helper';
import { useSelector } from 'react-redux';
import EditModal from 'components/FinanceAssetsComponents/CommonComponents/EditModal';
import { IsUserGrowfi } from 'helpers/utilities';
import {
  ApiNotificationLoading,
  ApiNotificationUpdate,
  Notification,
} from 'components/Notification/ToastNotification';

const BnplFinanceAssetWrapper = props => {
  // destructuring
  const { tableData2, reloadTable, showSetPage, isGlobalFilter } = props;

  //edit modal open or close, p2bassetdata state
  const [openEditModal, setOpenEditModal] = useState(false);
  const [bnplAssetData, setBnplAssetData] = useState({});

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
  const handleEditClick = bnplAssetId => {
    setBnplAssetData(bnplAssetId);
    handleOpenEditModal();
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

  /************** COLUMNS FOR THE TABLE *************/
  const columns = useMemo(() => {
    let col = [
      getExpansionTableColoum('18px'),
      {
        Header: 'BNPL Asset ID',
        accessor: 'asset_id',
        // filterable: true,
        // showSelect: false,
        canSort: true,
        Cell: cellProps => {
          return <P2bAssetId {...cellProps} />;
        },
      },
      {
        Header: 'By Anchor',
        accessor: 'anchorName',
        filterable: true,
        showSelect: true,
        filter: 'equals',
        canSort: true,
        Cell: cellProps => {
          return <ByOrganization {...cellProps} />;
        },
      },
      {
        Header: 'Status',
        accessor: 'assetStatus',
        filterable: true,
        showSelect: true,
        filter: 'equals',
        Cell: cellProps => {
          return <Status {...cellProps} />;
        },
      },
      /* {
        Header: 'Total Challans',
        accessor: 'numberOfInvoices',
        // filterable: true,
        // showSelect: false,
        Cell: cellProps => {
          return <TotalChallans {...cellProps} />;
        },
      },*/
      {
        Header: 'Total Amount (In Rs.)',
        accessor: 'amount',
        // filterable: true,
        // showSelect: false,
        Cell: cellProps => {
          return <TotalAmount {...cellProps} />;
        },
      },
      {
        Header: 'Date of Creation',
        accessor: 'createdAt',
        // filterable: true,
        // showSelect: false,
        Cell: cellProps => {
          return <DueDate {...cellProps} />;
        },
      },
    ];
    if (userIsSoptle) {
      col.push({
        Header: 'Action',
        Cell: cellProps => {
          return (
            <div className={`d-flex justify-content-center`}>
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
            </div>
          );
        },
      });
    }

    // if (userIsSoptle) {
    //   col = [
    //     ...col.slice(0, 2),
    //     {
    //       Header: 'Organization',
    //       accessor: 'orgName',
    //       filterable: true,
    //       showSelect: true,
    //       filter: 'equals',
    //       canSort: true,
    //       Cell: cellProps => {
    //         return <ByOrganization {...cellProps} />;
    //       },
    //     },
    //     ...col.slice(2),
    //   ];
    // }

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
          // id={'PurchaseFinancePage'}
          // financeMethod={'purchaseFinance'}
          customPageSize={10}
          NestedTable={NestedTableWrapperForBnpl}
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
        <option value={'paid'}>Paid</option>
        <option value={'paid back'}>Paid Back</option>
      </>
    );
  };

  return (
    <React.Fragment>
      {openEditModal && (
        <EditModal
          p2bAssetData={bnplAssetData}
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
          assetId={bnplAssetData?.pfId}
          optionsArr={optionsArr}
        />
      )}

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

export default BnplFinanceAssetWrapper;
