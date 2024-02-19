import React, { useEffect, useState } from 'react';
import { useTable } from 'react-table';
import { Spinner, Table } from 'reactstrap';
import {
  deleteOrgProductMapping,
  getProductMappingByOrgId,
} from 'helpers/backend_helper';
import {
  ApiNotificationLoading,
  ApiNotificationUpdate,
  Notification,
} from 'components/Notification/ToastNotification';
import OrgLenderMappingModal from 'components/LenderManagementComp/OrgLenderMappingModal';
import ApiLoader from 'components/Common/Ui/ApiLoader';

const MappingNestedTable = props => {
  const { data } = props;
  const [productList, setProductList] = useState([]);
  const [isShowEditModal, setIsShowEditModal] = useState(false);
  const [lenderData, setLenderData] = useState({});
  const [productData, setProductData] = useState();
  const [isShowLoader, setIsShowLoader] = useState(false);
  const [isTableDataAvail, setIsTableDataAvail] = useState(false);

  useEffect(() => {
    if (productList.length < 1) {
      fetchAPI();
    }
    setLenderData({
      [data.nameAsPerGST]: data.orgId,
    });
  }, [productList]);
  const fetchAPI = async () => {
    try {
      setIsShowLoader(true);
      const jsonData = await getProductMappingByOrgId(data.orgId);
      if (
        jsonData &&
        (jsonData.statusCode === 200 || jsonData.statusCode === 201)
      ) {
        jsonData.data.map(val => {
          setProductList(prev => [...prev, val]);
          setIsShowLoader(false);
        });
        jsonData.data?.length > 0 && setIsTableDataAvail(true);
      } else {
        Notification(`${jsonData.message}`, 4);
      }
    } catch (error) {
      Notification(`Not able to fetch permissions. Try later!`, 4);
    }
  };

  //handle table actions
  const handleDeleteProductMapping = mappingId => {
    const loadingId = ApiNotificationLoading();
    deleteOrgProductMapping(mappingId)
      .then(response => {
        if (response.statusCode === 200 || response.statusCode === 200) {
          ApiNotificationUpdate(loadingId, `${response.message}`, 2);
          handleEditModalUpdate();
        } else {
          ApiNotificationUpdate(loadingId, `${response.message}`, 4);
        }
      })
      .catch(err => {
        console.log(err);
        ApiNotificationUpdate(loadingId, `Unable to upload!`, 4);
      });
  };
  const handleEditModalClose = () => {
    setIsShowEditModal(false);
  };
  const handleEditModalOpen = rowData => {
    setProductData(rowData);
    setIsShowEditModal(true);
  };
  const handleEditModalUpdate = () => {
    setProductList([]);
  };

  const columns = React.useMemo(
    () => [
      { Header: 'Lender Id', accessor: 'lenderId', canSort: true },
      { Header: 'Lender name', accessor: 'lenderName', canSort: true },
      { Header: 'Amount By Lender', accessor: 'amountCommited' },
      { Header: 'Product', accessor: 'product.productIdentifier' },
      {
        Header: 'Action',
        Cell: ({ row }) => {
          return (
            <div
              className="d-flex justify-content-evenly align-items-center"
              key={row.original.id}
            >
              <i
                className="mdi mdi-account-edit"
                onClick={() => {
                  handleEditModalOpen(row.original);
                }}
              ></i>
              <i
                className="mdi mdi-delete"
                onClick={() => {
                  handleDeleteProductMapping(row.original.mappingId);
                }}
              ></i>
            </div>
          );
        },
      },
    ],
    [productList]
  );
  //   React Table
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: productList });
  return (
    <>
      {!isShowLoader ? (
        isTableDataAvail ? (
          <div style={{ height: '250px', overflowY: 'auto' }}>
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
          </div>
        ) : (
          <h3>No Mapping Available for this Organization</h3>
        )
      ) : (
        <ApiLoader />
      )}
      {isShowEditModal && (
        <OrgLenderMappingModal
          isShowCreateModal={isShowEditModal}
          handleCreateModalClose={handleEditModalClose}
          handleModalUpdate={handleEditModalUpdate}
          rowData={productData}
          mainRowData={data}
          lenderData={lenderData}
          isEditOpen={true}
        />
      )}
    </>
  );
};

export default MappingNestedTable;
