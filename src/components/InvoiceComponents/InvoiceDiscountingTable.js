import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { UncontrolledTooltip } from 'reactstrap';
import {
  ApiNotificationLoading,
  ApiNotificationUpdate,
  Notification,
} from 'components/Notification/ToastNotification.js';
//components import
import DeleteModal from 'components/Common/DeleteModal';
import ReedemModal from 'components/InvoiceComponents/CommonComponents/EditModal.js';
import TableContainer from 'components/Common/TableContainer';
import { ToProperCase } from 'components/Common/ToProperCase.js';
import moment from 'moment';

//column import
import {
  OrganizationName,
  Amount,
  Status,
  Invoice_ID,
  Due_Date,
} from './CommonComponents/invoicesCol.js';

//API Imports
import {
  redeemInvoices,
  deletePendingInvoices,
  getLenderList,
  getProductList,
} from 'helpers/backend_helper.js';

//redux
import { useSelector, useDispatch } from 'react-redux';

//Utils
import { IsUserGrowfi } from 'helpers/utilities.js';

//id --> to identify from which page we are calling.
//callfrom --> to identify from which page we are calling from i.e purchase finance page or invoice discounting page
//Here I have named two identifiers as 'id' and 'callfrom'.
//The 'callfrom' identifier is used to identify the page i.e sales invoice and purchase invoice.
//The 'id' identifier is used to identify the difference in pending,accepted and rejected page.
//otpmethod --> to call otp api
//invoicemethod --> to call lender and product api.

export default function InvoiceDiscountingTable({
  data,
  id,
  refreshDataAPI,
  ...props
}) {
  const [openRedeemModal, setOpenRedeemModal] = useState(false);
  const [rowData, setRowData] = useState('');
  const [invoicesToBeRedeemed, setInvoicesToBeRedeemed] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);

  const { selectedOrg } = useSelector(state => ({
    selectedOrg: state.Login.selectedOrganization,
  }));

  // columns for table
  const columns = useMemo(() => {
    let col = [
      {
        Header: 'Invoice Id',
        accessor: 'invoiceId',
        filterable: true,
        canSort: true,
        Cell: cellProps => {
          return <Invoice_ID {...cellProps} />;
        },
      },
      {
        Header: 'For Organization',
        accessor: 'forOrganization',
        filterable: true,
        canSort: true,
        showSelect: true,
        Cell: cellProps => {
          return <OrganizationName {...cellProps} />;
        },
      },
      {
        Header: 'Status',
        accessor: 'challanStatus',

        Cell: cellProps => {
          return <Status {...cellProps} />;
        },
      },
      {
        Header: 'Amount',
        accessor: 'totalPrice',

        Cell: cellProps => {
          return <Amount {...cellProps} />;
        },
      },
      {
        Header: 'Due Date',
        accessor: 'dueDate',

        Cell: cellProps => {
          return <Due_Date {...cellProps} />;
        },
      },
      {
        Header: ' View Invoice',
        Cell: cellProps => {
          const docLink = cellProps?.row?.original?.docLink;
          return (
            <button
              type="button"
              className="btn-rounded btn btn-outline-dark"
              disabled={docLink && docLink.length > 0 ? false : true}
              onClick={e => {
                window.open(docLink, '_blank');
              }}
            >
              <i
                className="mdi mdi-link-variant label-icon"
                id="viewInvoiceTooltip"
              ></i>
              <UncontrolledTooltip placement="top" target="viewInvoiceTooltip">
                Click here to view the challan
              </UncontrolledTooltip>
            </button>
          );
        },
      },
    ];
    if (
      id === 'accepted-paid' &&
      !IsUserGrowfi(selectedOrg.organizationOperationType, selectedOrg.userType)
    ) {
      col.push({
        Header: 'Redeem',
        Cell: cellProps => {
          if (
            invoicesToBeRedeemed
              .map(invoice => invoice.id)
              .includes(cellProps.row.original.id)
          ) {
            return (
              <button
                type="button"
                className="btn-rounded btn btn-success"
                disabled={false}
                onClick={e => {
                  handleCheckboxClick('REMOVE', cellProps.row.original);
                }}
              >
                <i
                  className="mdi mdi-checkbox-marked-circle-outline label-icon"
                  id="removeInvoiceTooltip"
                ></i>
                <UncontrolledTooltip
                  placement="top"
                  target="removeInvoiceTooltip"
                >
                  Click to remove Invoice from List
                </UncontrolledTooltip>
              </button>
            );
          } else {
            return (
              <button
                type="button"
                className="btn-rounded btn btn-light"
                disabled={cellProps.row.original.lockStatus === 'locked'}
                onClick={e => {
                  handleCheckboxClick('ADD', cellProps.row.original);
                }}
              >
                <i
                  className={
                    cellProps.row.original.lockStatus === 'locked'
                      ? 'mdi mdi-lock-check label-icon'
                      : 'mdi mdi-checkbox-blank-circle-outline label-icon'
                  }
                  id="addInvoiceTooltip"
                ></i>
                <UncontrolledTooltip placement="top" target="addInvoiceTooltip">
                  Click to add Invoice to List
                </UncontrolledTooltip>
              </button>
            );
          }
        },
      });
    }
    if (id === 'pending') {
      col.push({
        Header: 'Action',
        Cell: cellProps => {
          return (
            <div className="d-flex gap-3">
              <Link
                className="text-danger"
                onClick={() => {
                  const invoiceData = cellProps.row.original;
                  onClickDelete(invoiceData);
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
      });
    }

    return col;
  }, [invoicesToBeRedeemed, selectedOrg, id, data]);

  //handle functions
  const handleCheckboxClick = (type, rowData) => {
    // If the checkbox is checked, add the rowData to the invoicesToBeRedeemed array
    if (type === 'REMOVE') {
      setInvoicesToBeRedeemed(prevState =>
        prevState.filter(item => item.id !== rowData.id)
      );
    } else {
      setInvoicesToBeRedeemed(prevState => {
        return [...prevState, rowData];
      });
    }
  };

  var node = useRef();
  const onPaginationPageChange = page => {
    if (
      node &&
      node.current &&
      node.current.props &&
      node.current.props.pagination &&
      node.current.props.pagination.options
    ) {
      node.current.props.pagination.options.onPageChange(page);
    }
  };
  const onClickDelete = invoiceData => {
    setRowData(invoiceData);
    setDeleteModal(true);
  };

  const handleDeleteModalClose = () => {
    setDeleteModal(false);
  };

  const handleModalClose = () => {
    setOpenRedeemModal(!openRedeemModal);
  };

  // reedem api for p2b
  const handleConfirmP2b = (
    challanList,
    dueDuration,
    otpValue,
    lenderId,
    productId
  ) => {
    const redeemInvoicesAPI = async () => {
      const popUpId = ApiNotificationLoading();
      try {
        const response = await redeemInvoices(
          selectedOrg?.organizationId,
          challanList,
          dueDuration,
          otpValue,
          lenderId,
          productId
        );
        if (response && response.statusCode === 200) {
          setInvoicesToBeRedeemed([]);
          handleModalClose();
          refreshDataAPI();
          ApiNotificationUpdate(popUpId, `Request Created Successfully`, 2);
        }
      } catch (error) {
        ApiNotificationUpdate(
          popUpId,
          `${
            error?.response?.data?.message ||
            'Request Failed, Please try again later'
          }`,
          4
        );
      }
    };
    redeemInvoicesAPI();
  };

  // delte api for p2b
  const handleDeleteUser = e => {
    e.preventDefault();
    const challanData = rowData;
    const challanID = rowData.id;
    const deleteUserAPI = async () => {
      const popUpId = ApiNotificationLoading();
      try {
        const response = await deletePendingInvoices(challanID);
        if (response && response.statusCode === 200) {
          const deletedInvoice = response.data;
          refreshDataAPI();
          onPaginationPageChange(1);
          handleDeleteModalClose();
          ApiNotificationUpdate(popUpId, `Invoice Deleted Successfully`, 2);
        } else {
          throw response;
        }
      } catch (error) {
        handleDeleteModalClose();
        ApiNotificationUpdate(
          popUpId,
          `Delete Failed, Please try again later`,
          4
        );
      }
    };
    deleteUserAPI();
  };

  return (
    <>
      <DeleteModal
        show={deleteModal}
        onCloseClick={handleDeleteModalClose}
        onDeleteClick={handleDeleteUser}
        deleteMsg={'Are you sure you want to permanently delete the invoice.'}
      />
      <TableContainer
        columns={columns}
        data={data}
        // isGlobalFilter={true}
        hideShowButton={true}
        isRedeemOption={
          invoicesToBeRedeemed && invoicesToBeRedeemed.length > 0 ? true : false
        }
        handleRedeemClick={() => {
          setOpenRedeemModal(true);
        }}
        customPageSize={10}
        className="custom-header-css"
      />
      {openRedeemModal && (
        <ReedemModal
          showModal={true}
          invoicesToBeRedeemed={invoicesToBeRedeemed}
          handleModalClose={handleModalClose}
          handleModalConfirm={handleConfirmP2b}
          orgId={selectedOrg?.organizationId}
          otpMethod={'INVOICE_DISCOUNTING_OTP'}
          callFrom={'InvoiceDiscointingPage'}
          invoiceMethod={'invoiceDiscounting'}
        ></ReedemModal>
      )}
    </>
  );
}
