import React, { useEffect, useState } from 'react';
import { useTable } from 'react-table';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import { permissionsConstant } from 'utility/permissionsConstant';
import {
  getPermissionsForAllUserType,
  setPermissionsForSingleUserType,
} from 'helpers/backend_helper';
import { Button, Card, CardBody, Col, Row } from 'reactstrap';
import { Spinner } from 'reactstrap';
import { Table } from 'reactstrap';
import { useSelector } from 'react-redux';
import './permissions.scss';

// Notification Imports
import { Notification } from 'components/Notification/ToastNotification';
import { ApiNotificationLoading } from 'components/Notification/ToastNotification';
import { ApiNotificationUpdate } from 'components/Notification/ToastNotification';

const PermissionsManagement = () => {
  document.title = 'Permission Management | GrowFi';
  const [colData, setColData] = useState({
    l1: [],
    l2: [],
    l3: [],
    viewOnly: [],
  });
  const [editableColumn, setEditableColumn] = useState(null);
  const [editColumnData, setEditColumnData] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const selectedOrganization = useSelector(
    state => state.Login.selectedOrganization
  );

  // Fetching permission list from const file and permission data for individual levels
  useEffect(() => {
    const fetchAPI = async () => {
      try {
        const jsonData = await getPermissionsForAllUserType(
          selectedOrganization.organizationId
        );
        if (
          jsonData &&
          (jsonData.statusCode === 200 || jsonData.statusCode === 201)
        ) {
          Object.keys(jsonData.data).map(key => {
            setColData(prevState => ({
              ...prevState,
              [key]: [...colData[key], ...jsonData.data[key]],
            }));
          });
        } else {
          Notification(`${jsonData.message}`, 4);
        }
      } catch (error) {
        Notification(`Not able to fetch permissions. Try later!`, 4);
      }
    };
    fetchAPI();
    const permissionData = permissionsConstant.map(val => val.name);
    setPermissions(permissionData);
  }, [selectedOrganization]);

  useEffect(() => {
    if (permissions && colData) {
      setIsLoading(false);
    }
  }, [permissions]);

  const data = React.useMemo(
    () => permissions.map(name => ({ name })),
    [permissions]
  );

  const editButton = type => (
    <i
      className="mdi mdi-account-edit-outline"
      onClick={() => handleEditClick(type)}
      style={{ color: 'black', fontSize: 'larger' }}
    ></i>
  );

  const saveButton = (
    <i
      onClick={() => handleSaveClick()}
      className="mdi mdi-check ms-1"
      style={{ color: 'green', fontSize: 'larger' }}
    ></i>
  );
  const cancelButton = (
    <i
      onClick={() => handleEditCancelClick()}
      style={{ color: 'red', fontSize: 'larger' }}
      className="mdi mdi-close"
    ></i>
  );

  // ********************************* REACT TABLE **************************************

  // Column and cell creation
  const columns = React.useMemo(
    () => [
      {
        Header: 'Permissions',
        accessor: 'name',
        id: 'l0',
        headerClassName: 'header-name',
        cellClassName: 'cell-name',
      },
      {
        Header: 'L1',
        accessor: 'colData.l1',
        Cell: ({ row }) => (
          <input
            type="checkbox"
            checked={colData.l1.includes(row.original.name)}
            onChange={() => handleCheckboxChange(row.original.name, 'l1')}
            disabled={editableColumn !== 'l1'}
          />
        ),
        headerClassName: 'header-name',
        cellClassName: 'cell-name',
        editButton: editButton('l1'),
        saveButton: saveButton,
        cancelButton: cancelButton,
        id: 'l1',
      },
      {
        Header: 'L2',
        accessor: 'colData.l2',
        id: 'l2',
        Cell: ({ row }) => (
          <input
            type="checkbox"
            checked={colData.l2.includes(row.original.name)}
            onChange={() => handleCheckboxChange(row.original.name, 'l2')}
            disabled={editableColumn !== 'l2'}
          />
        ),
        editButton: editButton('l2'),
        headerClassName: 'header-name',
        cellClassName: 'cell-name',
        cancelButton: cancelButton,
        saveButton: saveButton,
      },
      {
        Header: 'L3',
        accessor: 'colData.l3',
        id: 'l3',
        Cell: ({ row }) => (
          <input
            type="checkbox"
            checked={colData.l3.includes(row.original.name)}
            onChange={() => handleCheckboxChange(row.original.name, 'l3')}
            disabled={editableColumn !== 'l3'}
          />
        ),
        editButton: editButton('l3'),
        headerClassName: 'header-name',
        cellClassName: 'cell-name',
        cancelButton: cancelButton,
        saveButton: saveButton,
      },
      {
        Header: 'View Only',
        accessor: 'colData.viewOnly',
        id: 'viewOnly',
        Cell: ({ row }) => (
          <input
            type="checkbox"
            checked={colData.viewOnly.includes(row.original.name)}
            onChange={() => handleCheckboxChange(row.original.name, 'viewOnly')}
            disabled={editableColumn !== 'viewOnly'}
          />
        ),
        editButton: editButton('viewOnly'),
        headerClassName: 'header-name',
        cellClassName: 'cell-name',
        cancelButton: cancelButton,
        saveButton: saveButton,
      },
      // Add more columns here...
    ],
    [colData, editableColumn]
  );

  //React Table
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  // ***************************** HANDLE FUNCTIONS ****************************
  const handleCheckboxChange = (rowName, colIndex) => {
    const updatedData = colData[colIndex].includes(rowName)
      ? colData[colIndex].filter(name => name !== rowName)
      : [...colData[colIndex], rowName];
    setColData(prevColData => ({
      ...prevColData,
      [colIndex]: updatedData,
    }));
  };

  const handleEditClick = columnIndex => {
    setEditColumnData([...colData[columnIndex]]);
    setEditableColumn(columnIndex);
  };

  const handleSaveClick = () => {
    const type = editableColumn;
    let permissions = colData[type];
    const setAPI = async () => {
      const toastId = ApiNotificationLoading();
      try {
        const jsonData = await setPermissionsForSingleUserType(
          selectedOrganization.organizationId,
          type,
          permissions
        );
        if (
          jsonData &&
          (jsonData.statusCode === 200 || jsonData.statusCode === 201)
        ) {
          ApiNotificationUpdate(toastId, `${jsonData.message}`, 2);
        } else {
          ApiNotificationUpdate(toastId, `${jsonData.message}`, 4);
        }
      } catch (error) {
        ApiNotificationUpdate(toastId, `Unable to set permissions`, 4);
      }
    };
    setAPI();
    setEditableColumn(null);
  };
  const handleEditCancelClick = () => {
    setColData(prevState => ({
      ...prevState,
      [editableColumn]: [...editColumnData],
    }));
    setEditableColumn(null);
    Notification(`No permissions applied`, 3);
  };

  return (
    <div className="page-content">
      <div className="container-fluid">
        <Breadcrumbs
          title="Permissions"
          breadcrumbItem="Permissions Management"
        />
        <Row>
          <Col lg="12">
            <Card>
              <CardBody>
                {isLoading ? (
                  <div className="d-flex justify-content-center mt-5">
                    <Spinner style={{ width: '2rem', height: '2rem' }} />
                    <h3 className="ps-4">Wait for permission data to render</h3>
                  </div>
                ) : (
                  <div className="table-responsive react-table">
                    <Table bordered {...getTableProps()} className="table mt-3">
                      <thead>
                        {headerGroups.map((headerGroup, key) => (
                          <tr key={key} {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column, key) => (
                              <th
                                className="table-secondary"
                                style={{ width: '220px' }}
                                key={key}
                              >
                                <div className="header-name text-center d-flex justify-content-center align-items-center">
                                  <div {...column.getHeaderProps()}>
                                    {column.render('Header')}
                                  </div>

                                  {column.id !== 'l0' && (
                                    <span
                                      className="ms-1"
                                      style={{ width: '3rem' }}
                                      key={column.Header}
                                    >
                                      {editableColumn === column.id ? (
                                        <>
                                          {column.cancelButton}
                                          {column.saveButton}
                                        </>
                                      ) : (
                                        <>{column.editButton}</>
                                      )}
                                    </span>
                                  )}
                                </div>
                              </th>
                            ))}
                          </tr>
                        ))}
                      </thead>
                      <tbody {...getTableBodyProps()}>
                        {rows.map((row, key) => {
                          prepareRow(row);
                          return (
                            <tr key={key} {...row.getRowProps()}>
                              {row.cells.map((cell, index) => (
                                <td
                                  className="text-center cell-name"
                                  key={index}
                                  {...cell.getCellProps()}
                                >
                                  {cell.render('Cell')}
                                </td>
                              ))}
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </div>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default PermissionsManagement;
