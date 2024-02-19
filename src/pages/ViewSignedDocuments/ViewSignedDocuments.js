import React, { useMemo, useEffect, useState, useCallback } from 'react';
import {
  Row,
  Container,
  Col,
  Card,
  CardBody,
  Spinner,
  Button,
} from 'reactstrap';
import AsyncSelect from 'react-select/async';
import { debounce } from 'lodash';

//import components
import Breadcrumbs from 'components/Common/Breadcrumb';
import TableContainer from 'components/Common/TableContainer';
import { Name, CreatedDate, Id } from './viewSignedDocumentsCol';
import AddDocModal from 'components/ViewSignedDocumentComponents/AddDocModal/AddDocModal';
import {
  Notification,
  ApiNotificationLoading,
  ApiNotificationUpdate,
} from 'components/Notification/ToastNotification';

//API Import
import {
  addDocumentToOrgnization,
  getAllDocumentsOfOrganization,
  getOrganizationsByPrefix,
} from 'helpers/backend_helper';
import { getExpansionTableColoum } from 'helpers/utilities';
import NestedSignedDocTable from 'components/ViewSignedDocumentComponents/NestedSignedDocTable/NestedSignedDocTable';
import { useNavigate } from 'react-router-dom';
import { superAdminPermissionForPage } from 'helpers/utilities';
import { Path } from 'routes/constant';
import { useSelector } from 'react-redux';

export default function ViewSignedDocuments() {
  const [selectedOrganization, setSelectedOrganzation] = useState('');
  const [allOrganizations, setAllOrganizations] = useState([]);
  const [documentsData, setDocumentsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [addDocModalOpen, setAddDocModalOpen] = useState(false);

  const CurrentOrg = useSelector(state => state.Login.selectedOrganization);

  // navigate to page404 when user is not GrowFi
  const navigate = useNavigate();

  // checking is user has permission to view this page or not
  useEffect(() => {
    if (navigate) {
      superAdminPermissionForPage(
        CurrentOrg.organizationOperationType,
        CurrentOrg.userType,
        navigate,
        Path.AUTH_PAGE_FORBIDDEN
      );
    }
  }, [CurrentOrg]);

  const columns = useMemo(
    () => [
      getExpansionTableColoum(),
      {
        Header: 'ID',
        accessor: 'id',
        canSort: true,
        Cell: cellProps => {
          return <Id {...cellProps} />;
        },
      },
      {
        Header: 'Organization Name',
        accessor: 'orgName',
        filterable: true,
        canSort: true,
        Cell: cellProps => {
          return <Name {...cellProps} />;
        },
      },
      {
        Header: 'Agreement Name',
        accessor: 'agreementName',
        filterable: true,
        Cell: cellProps => {
          return <Name {...cellProps} />;
        },
      },
      {
        Header: 'Created At',
        accessor: 'createdAt',
        filterable: true,
        Cell: cellProps => {
          return <CreatedDate {...cellProps} />;
        },
      },
    ],
    []
  );

  useEffect(() => {
    if (selectedOrganization && selectedOrganization.value > 0) {
      fetchData();
    }
  }, [selectedOrganization]);

  //API Calls
  const fetchData = async () => {
    try {
      setIsLoading(true);
      // Fetch options for the second field
      const jsonData = await getAllDocumentsOfOrganization(
        selectedOrganization.value
      );
      if (
        jsonData &&
        (jsonData.statusCode === 200 || jsonData.statusCode === 201)
      ) {
        setDocumentsData(jsonData.data);
      } else {
        Notification(`${jsonData.message}`, 4);
      }
    } catch (error) {
      console.log(error);
      Notification(
        error?.response?.data?.message
          ? error?.response?.data?.message
          : 'Some Error Occured, Please try later',
        4
      );
    } finally {
      setIsLoading(false);
    }
  };
  // Function to fetch options asynchronously
  const loadOrgOptions = (inputValue, callback) => {
    if (inputValue.length > 0) {
      getOrganizationsByPrefix(`${inputValue}`)
        .then(response => {
          const data = response.data;

          const options = data.map(item => ({
            value: item.id,
            label: item.nameAsPerGST,
          }));

          callback(options);
        })
        .catch(error => {
          console.error('Error loading options:', error);
        });
    }
  };
  const debouncedLoadOptions = useCallback(debounce(loadOrgOptions, 300), []);

  const handleAddDocAPI = async (orgId, agreementName, formData) => {
    const popUpId = ApiNotificationLoading(
      'Please Wait While we are adding the document'
    );
    try {
      const jsonData = await addDocumentToOrgnization(
        orgId,
        agreementName,
        formData
      );
      if (
        jsonData &&
        (jsonData.statusCode === 200 || jsonData.statusCode === 201)
      ) {
        fetchData();
        ApiNotificationUpdate(popUpId, 'Document Addded Successfully', 2);
      } else {
        ApiNotificationUpdate(popUpId, jsonData.message, 4);
      }
    } catch (error) {
      ApiNotificationUpdate(
        popUpId,
        error?.response?.data?.message
          ? error?.response?.data?.message
          : 'Some Error Occured, Please try later',
        4
      );
    }
  };

  //handleFunctions
  const handleAddNewDocument = () => {
    if (selectedOrganization && selectedOrganization?.value > 0) {
      setAddDocModalOpen(true);
    } else {
      Notification('Please Select a Valid Organization First', 3);
    }
  };

  const handleAddDocModalClose = () => {
    setAddDocModalOpen(false);
  };
  //Page Compoenent Handling Functions
  const getPageHeading = () => {
    let heading = 'Documents';
    if (selectedOrganization && selectedOrganization?.value > 0) {
      heading = `${selectedOrganization?.label} Documents`;
    }
    return heading;
  };
  const getLoader = () => {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner style={{ width: '2rem', height: '2rem' }} />
        <h3 className="ps-4">Please Wait...</h3>
      </div>
    );
  };
  const getOrganizationSelectInput = () => {
    return (
      <div style={{ minWidth: '170px', maxWidth: '200px' }}>
        <AsyncSelect
          cacheOptions
          defaultOptions
          placeholder={'Select Organization...'}
          loadOptions={debouncedLoadOptions}
          noOptionsMessage={({ inputValue }) => {
            if (!inputValue) {
              return 'Please type to search';
            }
            return 'No options found';
          }}
          value={selectedOrganization}
          onChange={newValue => {
            setSelectedOrganzation(newValue);
          }}
        />
      </div>
    );
  };

  const getOrganizationSelection = () => {
    return (
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ minHeight: 500 }}
      >
        <div>
          <h5>{'Please Select A organization first'}</h5>
        </div>

        <div>{getOrganizationSelectInput()}</div>
      </div>
    );
  };

  const getTableBody = () => {
    if (selectedOrganization && selectedOrganization?.value > 0 && !isLoading) {
      return (
        <TableContainer
          columns={columns}
          data={documentsData}
          isGlobalFilter={true}
          customPageSize={10}
          NestedTable={NestedSignedDocTable}
          className="custom-header-css"
        />
      );
    } else if (isLoading) {
      return getLoader();
    } else {
      return getOrganizationSelection();
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs
            title="View Signed Documents"
            breadcrumbItem="Organization Documents"
          />
          <Row></Row>
          <Row>
            <Col lg="12">
              <Card>
                <CardBody className="border-bottom">
                  <div className="d-sm-block d-md-flex align-items-center">
                    <div className="mb-0 card-title flex-grow-1">
                      <h5 className="d-inline">{getPageHeading()}</h5>
                    </div>

                    <div className="flex-shrink-0">
                      {getOrganizationSelectInput()}
                    </div>
                    <div className="flex-shrink-0 ms-md-1 mt-1 mt-lg-0 ">
                      <Button
                        type="button"
                        color="success"
                        className="btn"
                        onClick={handleAddNewDocument}
                      >
                        <i className="mdi mdi-plus-circle-outline me-1" />
                        New Document
                      </Button>
                    </div>
                  </div>
                </CardBody>
                <CardBody>{getTableBody()}</CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      <AddDocModal
        selectedOrganization={selectedOrganization}
        open={addDocModalOpen}
        handleAddDocSave={handleAddDocAPI}
        handleModalClose={handleAddDocModalClose}
      />
    </React.Fragment>
  );
}
