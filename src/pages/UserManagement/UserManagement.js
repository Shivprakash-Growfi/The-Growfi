import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import withRouter from 'components/Common/withRouter';
import TableContainer from 'components/Common/TableContainer';
import {
  Card,
  CardBody,
  Col,
  Container,
  Modal,
  Row,
  Alert,
  UncontrolledTooltip,
} from 'reactstrap';

import {
  Name,
  Email,
  Mobile,
  Role,
  SNo,
  AuthorizedSignatory,
} from './userManagementCol';

//Import Breadcrumb
import Breadcrumbs from 'components/Common/Breadcrumb';
import DeleteModal from 'components/Common/DeleteModal';
import UserManagementModal from './userManagementModal';

import {
  getUsers as onGetUsers,
  deleteUser as onDeleteUser,
  updateUserbyAdmin,
  resetErrorStateOrganizationUser,
  addNewUser,
  deleteUser,
} from 'store/organizationUser/actions';
import { isEmpty } from 'lodash';

//redux
import { useSelector, useDispatch } from 'react-redux';
import ApiLoader from 'components/Common/Ui/ApiLoader';

const UserManagement = props => {
  const [openModal, setOpenModal] = useState(false);
  const [rowData, setRowData] = useState('');
  //meta title
  document.title = 'Organization User List | GrowFi';

  const dispatch = useDispatch();
  const { users, selectedOrg, currentUser, error, isLoading } = useSelector(
    state => ({
      isLoading: state.organizationUser.isLoading,
      users: state.organizationUser.users,
      error: state.organizationUser.error,
      selectedOrg: state.Login.selectedOrganization,
      currentUser: state.Login.user,
    })
  );

  const columns = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'sno',
        canSort: true,
        Cell: cellProps => {
          return <SNo {...cellProps} />;
        },
      },
      {
        Header: 'Name',
        accessor: 'name',
        canSort: true,
        filterable: true,
        Cell: cellProps => {
          return <Name {...cellProps} />;
        },
      },
      {
        Header: 'Email',
        accessor: 'email',
        filterable: true,
        Cell: cellProps => {
          return <Email {...cellProps} />;
        },
      },
      {
        Header: 'Mobile Number',
        accessor: 'phoneNumber',
        filterable: true,
        Cell: cellProps => {
          return <Mobile {...cellProps} />;
        },
      },
      {
        Header: 'Role',
        accessor: 'role',
        filterable: true,
        Cell: cellProps => {
          return <Role {...cellProps} />;
        },
      },
      {
        Header: 'Authorized Signatory',
        accessor: 'authorizedSignatory',
        filterable: false,
        Cell: cellProps => {
          return <AuthorizedSignatory {...cellProps} />;
        },
      },
      {
        Header: 'Action',
        Cell: cellProps => {
          return (
            <div className="d-flex gap-3">
              <Link
                className="text-success"
                onClick={() => {
                  const userData = cellProps.row.original;
                  editUserClick(userData);
                }}
              >
                <i className="mdi mdi-pencil font-size-18" id="edittooltip" />
                <UncontrolledTooltip placement="top" target="edittooltip">
                  Edit
                </UncontrolledTooltip>
              </Link>
              <Link
                className="text-danger"
                onClick={() => {
                  const userData = cellProps.row.original;
                  onClickDelete(userData);
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
    ],
    []
  );

  useEffect(() => {
    if (error && error.message) {
      setInterval(() => {
        dispatch(resetErrorStateOrganizationUser());
      }, 6000);
    }
  }, [error]);

  useEffect(() => {
    if (users && !users.length) {
      dispatch(
        onGetUsers({
          access_token: currentUser.access_token,
          orgId: selectedOrg.organizationId,
        })
      );
    }
  }, [dispatch]);

  const toggle = () => {
    setOpenModal(!openModal);
  };

  const editUserClick = arg => {
    const user = arg;
    setRowData({
      id: user.id,
      name: user.name,
      role: user.role,
      email: user.email,
      phoneNumber: user.phoneNumber,
      authorizedSignatory: user.authorizedSignatory,
    });
    toggle();
  };
  const handleEditUserSave = user => {
    dispatch(
      updateUserbyAdmin({
        access_token: currentUser.access_token,
        user: { ...user, orgId: selectedOrg.organizationId },
      })
    );
  };
  const handleAddUserSave = user => {
    dispatch(
      addNewUser({
        access_token: currentUser.access_token,
        user: { ...user, orgId: selectedOrg.organizationId },
      })
    );
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

  //delete customer
  const [deleteModal, setDeleteModal] = useState(false);

  const onClickDelete = user => {
    setRowData(user);
    setDeleteModal(true);
  };

  const handleDeleteUser = () => {
    if (rowData && rowData.id) {
      dispatch(
        deleteUser({
          access_token: currentUser.access_token,
          user: { ...rowData, orgId: selectedOrg.organizationId },
        })
      );
    }
    onPaginationPageChange(1);
    setRowData('');
    setDeleteModal(false);
  };

  const addUserClicks = () => {
    setOpenModal(true);
  };

  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteUser}
        onCloseClick={() => {
          setDeleteModal(false);
          setRowData('');
        }}
        deleteMsg={'Are you sure you want to permanently delete the user.'}
      />
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs title="User" breadcrumbItem="User Management" />
          <Row>
            {error && error.message && (
              <Alert
                color="danger"
                style={{ border: 0, backgroundColor: '#fde1e166' }}
              >
                {error.message}
              </Alert>
            )}
          </Row>
          <Row>
            {isLoading ? (
              <ApiLoader loadMsg={'Loading'} />
            ) : (
              <Col lg="12">
                <Card>
                  <CardBody>
                    <TableContainer
                      columns={columns}
                      data={users}
                      isGlobalFilter={true}
                      isAddUserList={true}
                      handleUserClick={addUserClicks}
                      customPageSize={10}
                      initialSort={'sno'}
                      className="custom-header-css"
                    />
                    {openModal && (
                      <UserManagementModal
                        handleModalClose={() => {
                          setOpenModal(false);
                          setRowData('');
                        }}
                        handleEditUserSave={handleEditUserSave}
                        handleAddUserSave={handleAddUserSave}
                        rowData={rowData}
                      />
                    )}
                  </CardBody>
                </Card>
              </Col>
            )}
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withRouter(UserManagement);
