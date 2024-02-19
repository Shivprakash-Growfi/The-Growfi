import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, CardBody, Col } from 'reactstrap';
import { useFormik } from 'formik';
import { Form, NavItem, NavLink, Row, TabContent, TabPane } from 'reactstrap';
import * as Yup from 'yup';
import classnames from 'classnames';

//COMPONENTS IMPORTS
import AddDirectorModal from 'components/KycApplicationComponents/AddDirectorModal';
import TableContainer from 'components/Common/TableContainer';
import DeleteModal from 'components/Common/DeleteModal';
import {
  ApiNotificationLoading,
  ApiNotificationUpdate,
  Notification,
} from 'components/Notification/ToastNotification';

// API IMPORTS
import {
  getOrganizationDirectors,
  verifyDirectorDIN,
  verifyDirectorPAN,
  deleteOrgDirector,
} from 'helpers/backend_helper';

//REDUX IMPORTS
import { useDispatch, useSelector } from 'react-redux';
import AddPartnerModal from 'components/KycApplicationComponents/AddPartnerModal';

const FounderData = props => {
  const { userTypeStatus } = props;
  const [tableData, setTableData] = useState([]);
  const [isDataAval, setIsDataAval] = useState(false);
  const [isDirectorModalOpen, setIsDirectorModalOpen] = useState(false);
  const [editDirectorModalOpen, setEditDirectorModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedDirectorData, setSelectedDirecterData] = useState('');
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const dispatch = useDispatch();

  const SelectOrganzation = useSelector(state => {
    return state.Login.selectedOrganization;
  });

  useEffect(() => {
    if (SelectOrganzation && SelectOrganzation.organizationId) {
      getAllDirectors();
    }
  }, [SelectOrganzation]);

  const dataWithSerialNumber = tableData.map((item, index) => ({
    ...item,
    sno: (userTypeStatus === '1' ? 'Director ' : 'Partner ') + (index + 1),
  }));

  const columns = useMemo(() => [
    {
      Header: 'S.No.',
      accessor: 'sno',
      canSort: true,
    },
    {
      Header: 'Name',
      accessor: 'name',
      canSort: true,
    },
    {
      Header: 'PAN',
      accessor: 'pan',
    },
    {
      Header: 'DIN',
      accessor: 'din',
    },
    {
      Header: 'Action',
      Cell: ({ row }) => {
        return (
          <div
            className="d-flex justify-content-center justify-content-sm-around"
            key={row.original.id}
          >
            <i
              className="mdi mdi-delete"
              key={row.original.id + '_botton_inactive'}
              style={{
                fontSize: '24px' /* Adjust the icon size as needed */,
                color: '#ff0000' /* Change this to your desired color */,
              }}
              onClick={() => {
                handleDeleteClick(row.original);
              }}
            ></i>
            <i
              className="mdi mdi-account-edit"
              key={row.original.id + '_botton_active'}
              style={{
                fontSize: '24px' /* Adjust the icon size as needed */,
                color: 'grey' /* Change this to your desired color */,
              }}
              onClick={() => {
                handleEditClick(row.original);
              }}
            ></i>
          </div>
        );
      },
    },
  ]);
  const columnsPartner = useMemo(() => [
    {
      Header: 'S.No.',
      accessor: 'sno',
      canSort: true,
    },
    {
      Header: 'Name',
      accessor: 'name',
      canSort: true,
    },
    {
      Header: 'PAN',
      accessor: 'pan',
    },
    {
      Header: 'Action',
      Cell: ({ row }) => {
        return (
          <div
            className="d-flex justify-content-center justify-content-sm-around"
            key={row.original.id}
          >
            <i
              className="mdi mdi-delete"
              key={row.original.id + '_botton_inactive'}
              style={{
                fontSize: '24px' /* Adjust the icon size as needed */,
                color: '#ff0000' /* Change this to your desired color */,
              }}
              onClick={() => {
                handleDeleteClick(row.original);
              }}
            ></i>
          </div>
        );
      },
    },
  ]);
  const getAllDirectors = () => {
    getOrganizationDirectors(SelectOrganzation.organizationId)
      .then(resp => {
        setTableData(resp.data);
        resp.data.length > 0 && setIsDataAval(true);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleDeleteClick = data => {
    setSelectedDirecterData(data);
    setDeleteModal(true);
  };

  const handleDeleteCancel = () => {
    setDeleteModal(false);
  };

  const handleModalCancel = () => {
    userTypeStatus === '1'
      ? setIsDirectorModalOpen(false)
      : setIsPartnerModalOpen(false);
  };

  const handleEditClick = data => {
    if (data.pan.length < 1) {
      setSelectedDirecterData(data);
      setEditDirectorModalOpen(true);
    } else {
      Notification(`All Values are already verified`, 1);
    }
  };

  const handleEditModalCancel = () => {
    setEditDirectorModalOpen(false);
    setSelectedDirecterData('');
  };

  const handleAddPan = async (DIN, panId, directorName) => {
    const orgId = SelectOrganzation.organizationId;
    const popUpID = ApiNotificationLoading('Adding Pan Details');
    verifyDirectorPAN(orgId, panId, DIN, directorName)
      .then(verifyPanResponse => {
        if (
          verifyPanResponse &&
          (verifyPanResponse.statusCode === 200 ||
            verifyPanResponse.statusCode === 201)
        ) {
          ApiNotificationUpdate(popUpID, 'Pan Added SuccessFully', 2);
          handleEditModalCancel();
          getAllDirectors();
        } else {
          throw verifyPanResponse;
        }
      })
      .catch(error => {
        ApiNotificationUpdate(popUpID, 'Pan Verification Failed', 4);
      });
  };

  const handleAddDirector = async (DIN, panId, directorName, resetForm) => {
    const orgId = SelectOrganzation.organizationId;
    const popUpID = ApiNotificationLoading('Adding Director');

    verifyDirectorDIN(orgId, DIN, directorName)
      .then(verifyDINResponse => {
        if (
          verifyDINResponse &&
          (verifyDINResponse.statusCode === 200 ||
            verifyDINResponse.statusCode === 201)
        ) {
          verifyDirectorPAN(orgId, panId, DIN, directorName)
            .then(verifyPanResponse => {
              if (
                verifyPanResponse &&
                (verifyPanResponse.statusCode === 200 ||
                  verifyPanResponse.statusCode === 201)
              ) {
                ApiNotificationUpdate(
                  popUpID,
                  'Director Added SuccessFully',
                  2
                );
                resetForm();
                handleModalCancel();
                getAllDirectors();
              } else {
                throw verifyPanResponse;
              }
            })
            .catch(error => {
              ApiNotificationUpdate(
                popUpID,
                'Director Added SuccessFully, But Pan Verification Failed',
                3
              );
              resetForm();
              handleModalCancel();
              getAllDirectors();
            });
        } else {
          throw verifyDINResponse;
        }
      })
      .catch(error => {
        ApiNotificationUpdate(
          popUpID,
          error?.response?.data?.message
            ? error?.response?.data?.message
            : 'Director Addition Failed,Please Check DIN Number',
          4
        );
      });
  };

  const handleDeleteDirector = () => {
    const orgId = SelectOrganzation.organizationId;
    const popUpID = ApiNotificationLoading(
      'Deleting Director: ' + selectedDirectorData.name
    );
    deleteOrgDirector(orgId, selectedDirectorData.pan, selectedDirectorData.din)
      .then(resp => {
        getAllDirectors();
        ApiNotificationUpdate(popUpID, 'Director Deleted Successfully', 2);
      })
      .catch(err => {
        ApiNotificationUpdate(popUpID, 'Director Deletion Failed', 4);
      });
    handleDeleteCancel();
  };

  const handleAddClick = () => {
    userTypeStatus === '1'
      ? setIsDirectorModalOpen(true)
      : setIsPartnerModalOpen(true);
  };
  const handleAddPartner = async (panId, din = '', directorName, resetForm) => {
    const orgId = SelectOrganzation.organizationId;
    const popUpID = ApiNotificationLoading('Adding Partner');

    verifyDirectorPAN(orgId, panId, din, directorName)
      .then(verifyPanResponse => {
        if (
          verifyPanResponse &&
          (verifyPanResponse.statusCode === 200 ||
            verifyPanResponse.statusCode === 201)
        ) {
          ApiNotificationUpdate(popUpID, 'Partner Added SuccessFully', 2);
          resetForm();
          handleModalCancel();
          getAllDirectors();
        } else {
          throw verifyPanResponse;
        }
      })
      .catch(error => {
        ApiNotificationUpdate(popUpID, ' Pan Verification Failed', 3);
        resetForm();
        handleModalCancel();
        getAllDirectors();
      });
  };
  return (
    <>
      <Col lg="12">
        <Card>
          <CardBody className="border-bottom">
            <div className="d-flex align-items-center justify-content-lg-between">
              <h4 className="card-title m-0">
                {userTypeStatus === '1'
                  ? 'Director Information'
                  : 'Partner Information'}
              </h4>
              <Button color="primary" onClick={handleAddClick}>
                Add
              </Button>
            </div>
          </CardBody>
          <CardBody>
            {isDataAval ? (
              <div>
                {userTypeStatus === '1' ? (
                  <TableContainer
                    columns={columns}
                    data={dataWithSerialNumber}
                    isGlobalFilter={false}
                    showFilterByCol={false}
                    customPageSize={10}
                    hideShowButton={true}
                    initialSort="sno"
                  />
                ) : (
                  <TableContainer
                    columns={columnsPartner}
                    data={dataWithSerialNumber}
                    isGlobalFilter={false}
                    showFilterByCol={false}
                    customPageSize={10}
                    hideShowButton={true}
                    initialSort="sno"
                  />
                )}
              </div>
            ) : (
              <div className="d-flex justify-content-center">
                {' '}
                <Button
                  color="primary"
                  className="text-center"
                  onClick={handleAddClick}
                >
                  {userTypeStatus === '1'
                    ? 'No Director added, Pleade Click to Add'
                    : 'No Partner added, Pleade Click to Add'}
                </Button>
              </div>
            )}
          </CardBody>
          <DeleteModal
            show={deleteModal}
            onCloseClick={handleDeleteCancel}
            onDeleteClick={handleDeleteDirector}
            deleteMsg={
              'Are you sure you want to permanently delete this director.'
            }
          />
          <AddPartnerModal
            isOpen={isPartnerModalOpen}
            handleModalCancel={handleModalCancel}
            CustomModalHeader={'New Partner'}
            handleAddPartner={handleAddPartner}
          />
          <AddDirectorModal
            isOpen={isDirectorModalOpen}
            handleModalCancel={handleModalCancel}
            CustomModalHeader={'New Director'}
            handleAddDirector={handleAddDirector}
          />
          <AddDirectorModal
            isOpen={editDirectorModalOpen}
            handleModalCancel={handleEditModalCancel}
            CustomModalHeader={'Add Pan Details'}
            handleAddPan={handleAddPan}
            userData={selectedDirectorData}
          />
        </Card>
      </Col>
    </>
  );
};

export default FounderData;
