/*eslint-disable react/no-unknown-property*/
import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  UncontrolledTooltip,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Spinner,
} from 'reactstrap';

// COLUMNS OF THE TABLE
import {
  CompanyName,
  CompanyType,
  OrganizationOperationType,
  AdminName,
  AdminEmailId,
  AdminPhoneNo,
  AddressLine1,
  City,
  State,
  Pincode,
  PanNo,
  GstinNo,
} from 'components/OrganizationManagementComponents/OrgColumns';

// DELETE MODAL AND BREADCRUMBS
import DeleteModal from 'components/Common/DeleteModal';
import Breadcrumbs from 'components/Common/Breadcrumb';

// API'S
import {
  getAllOrganizations,
  deleteOrganization,
} from 'helpers/backend_helper';

//TABLE CONTAINER
import TableContainer from 'components/Common/TableContainer';

//pop up on success and failure of api
import {
  ApiNotificationLoading,
  ApiNotificationUpdate,
  Notification,
} from 'components/Notification/ToastNotification';

import ApiLoader from 'components/Common/Ui/ApiLoader';

// path from constant
import { Path } from 'routes/constant';

//router to navigate
import withRouter from 'components/Common/withRouter';

//checking if user is growFi or not
import { superAdminPermissionForPage } from 'helpers/utilities';

// convert texts to proper case
import { ToProperCase } from 'components/Common/ToProperCase';

const ViewEditOrganization = props => {
  /******************** USESTATES *******************/

  // organization details from login
  const selectedOrganization = useSelector(
    state => state.Login.selectedOrganization
  );

  // navigate to page404 when user is not growfi
  const navigate = useNavigate();

  //organization VARIABLE --> USED TO STORE THE DATA FOR ONE ORGANIZATION WHEN EDIT IS CALLED
  const [organization, setOrganization] = useState(null);

  //ALL THE TABLE DATA AND LOADER FOR DISPLAYING THE TABLE
  const [tableData, settableData] = useState([]);
  const [isloading, setisloading] = useState(true);

  //DELETE MODAL
  const [deleteModal, setdeleteModal] = useState(false);

  /************** TABLE CALL AND LOADER  *************/
  //DISPLAYING THE TABLE
  const table = () => {
    return (
      <>
        <TableContainer
          columns={columns}
          data={tableData}
          isGlobalFilter={true}
          isAddCustList={false}
          customPageSize={10}
          className="custom-header-css"
        />
      </>
    );
  };

  /************** Api calls for get details of organization, get city data, get state data, edit organization, delete organization, , get organization type data, get organization operation type data *************/

  //get details of all organizations
  useEffect(() => {
    getAllOrganizations()
      .then(response => {
        if (
          response &&
          (response.statusCode === 200 || response.statusCode === 201)
        ) {
          let result = JSON.parse(JSON.stringify(response.data));
          for (let i = 0; i < result.length; i++) {
            result[i].organizationType = ToProperCase(
              result[i].organizationType
            );
            result[i].organizationOperationType = ToProperCase(
              result[i].organizationOperationType
            );
          }
          settableData(result);
          setisloading(false);
        } else {
          Notification('Sorry, Please reload the page', 4);
        }
      })
      .catch(err => {
        setisloading(true);
        Notification('Sorry, Please reload the page', 4);
      });
  }, []);

  // checking is user has permission to view this page or not
  useEffect(() => {
    if (navigate) {
      superAdminPermissionForPage(
        selectedOrganization.organizationOperationType,
        selectedOrganization.userType,
        navigate,
        Path.AUTH_PAGE_NOTFOUND
      );
    }
  }, [selectedOrganization]);

  //delete organization
  const handleDeleteOrganization = () => {
    if (organization && organization.id) {
      const id = ApiNotificationLoading();
      deleteOrganization(organization.id)
        .then(response => {
          if (
            response &&
            (response.statusCode === 200 || response.statusCode === 201)
          ) {
            settableData(current =>
              current.filter(tableData => tableData.id !== organization.id)
            );
            ApiNotificationUpdate(id, 'Organization deleted successfully', 2);

            setdeleteModal(false);
          } else {
            ApiNotificationUpdate(
              id,
              'Please try to delete again after some time',
              4
            );
          }
        })
        .catch(err => {
          ApiNotificationUpdate(
            id,
            'Please try to delete again after some time',
            4
          );
        });
    }
  };

  /************** ONCLICK FUNCTIONS --> DELETE FOR REMOVING AN ORGANIZATION, TOOGLE FOR MODAL OPEN AND CLOSE, handleEditClick for sending edited data *************/
  // DELETE FOR REMOVING AN ORGANIZATION
  const onClickDelete = organization => {
    setOrganization(organization);
    setdeleteModal(true);
  };

  //handleEditClick for sending edited data
  const handleEditClick = arg => {
    navigate(`/edit-organization/${arg.id}`);
  };

  /************** COLUMNS FOR THE TABLE *************/
  const columns = useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
        canSort: true,
        Cell: cellProps => {
          return cellProps?.cell?.value ? cellProps.cell.value : '';
        },
      },
      {
        Header: 'Organization Name',
        accessor: 'nameAsPerGST',
        canSort: true,
        filterable: true,
        Cell: cellProps => {
          return <CompanyName {...cellProps} />;
        },
      },
      {
        Header: 'Registered Name',
        accessor: 'nameAsPerPAN',
        canSort: true,
        filterable: true,
        Cell: cellProps => {
          return <CompanyName {...cellProps} />;
        },
      },
      {
        Header: 'Organization Type',
        accessor: 'organizationType',
        canSort: true,
        filterable: true,
        Cell: cellProps => {
          return <CompanyType {...cellProps} />;
        },
      },
      {
        Header: 'Organization Operation Type',
        accessor: 'organizationOperationType',
        filterable: true,
        Cell: cellProps => {
          return <OrganizationOperationType {...cellProps} />;
        },
      },
      /*
      {
        Header: 'Admin Name',
        accessor: 'adminName',
        filterable: true,
        Cell: cellProps => {
          return <AdminName {...cellProps} />;
        },
      },
      {
        Header: 'Email ID',
        accessor: 'adminEmailId',
        filterable: true,
        Cell: cellProps => {
          return <AdminEmailId {...cellProps} />;
        },
      },
      {
        Header: 'Phone No',
        accessor: 'adminPhoneNo',
        filterable: true,
        Cell: cellProps => {
          return <AdminPhoneNo {...cellProps} />;
        },
      },
      /*
      {
        Header: 'Address',
        accessor: 'addressLine1',
        maxWidth: 400,
        minWidth: 100,
        width: 350,
        filterable: true,
        Cell: cellProps => {
          return <AddressLine1 {...cellProps} />;
        },
      },
      {
        Header: 'City',
        accessor: 'city',
        filterable: true,
        Cell: cellProps => {
          return <City {...cellProps} />;
        },
      },
      {
        Header: 'State',
        accessor: 'state',
        filterable: true,
        Cell: cellProps => {
          return <State {...cellProps} />;
        },
      },
      {
        Header: 'Pincode',
        accessor: 'pinCode',
        filterable: true,
        Cell: cellProps => {
          return <Pincode {...cellProps} />;
        },
      },
      */
      {
        Header: 'PAN Number',
        accessor: 'panNumber',
        filterable: true,
        Cell: cellProps => {
          return <PanNo {...cellProps} />;
        },
      },
      {
        Header: 'GSTIN Number',
        accessor: 'gstInNumber',
        filterable: true,
        Cell: cellProps => {
          return <GstinNo {...cellProps} />;
        },
      },

      {
        Header: 'Action',
        Cell: cellProps => {
          return (
            <UncontrolledDropdown>
              <DropdownToggle tag="a" className="card-drop">
                <i className="mdi mdi-dots-horizontal font-size-18"></i>
              </DropdownToggle>

              <DropdownMenu className="dropdown-menu-end">
                <DropdownItem
                  onClick={() => {
                    const organizationData = cellProps.row.original;
                    handleEditClick(organizationData);
                  }}
                >
                  <i
                    className="mdi mdi-pencil font-size-16 text-success me-1"
                    id="edittooltip"
                  ></i>
                  Edit
                  <UncontrolledTooltip placement="top" target="edittooltip">
                    Edit
                  </UncontrolledTooltip>
                </DropdownItem>

                <DropdownItem
                  onClick={() => {
                    const organizationData = cellProps.row.original;
                    onClickDelete(organizationData);
                  }}
                >
                  <i
                    className="mdi mdi-trash-can font-size-16 text-danger me-1"
                    id="deletetooltip"
                  ></i>
                  Delete
                  <UncontrolledTooltip placement="top" target="deletetooltip">
                    Delete
                  </UncontrolledTooltip>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          );
        },
      },
    ],
    []
  );

  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteOrganization}
        onCloseClick={() => setdeleteModal(false)}
        deleteMsg={
          'Are you sure you want to permanently delete this organization.'
        }
      />
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Manage Organization"
            breadcrumbItem="View Organization Details"
          />
          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
                  {isloading ? <ApiLoader loadMsg={'Loading...'} /> : table()}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withRouter(ViewEditOrganization);
