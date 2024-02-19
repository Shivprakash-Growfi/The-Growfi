import React, { useEffect, useState } from 'react';
import CollapseMainTable from './CollapseMainTable';
import TableContainer from '../../Common/TableContainer';
import { useTable } from 'react-table';
import { Table } from 'reactstrap';
import {
  deleteLenderProductById,
  getLenderProductList,
} from 'helpers/backend_helper';
import {
  ApiNotificationLoading,
  ApiNotificationUpdate,
  Notification,
} from 'components/Notification/ToastNotification';
import CreateProductModal from 'components/LenderManagementComp/CreateProductModal';
import ApiLoader from 'components/Common/Ui/ApiLoader';

const NestedTable = props => {
  const { data } = props;
  const [productList, setProductList] = useState([]);
  const [isShowEditModal, setIsShowEditModal] = useState(false);
  const [isShowLoader, setIsShowLoader] = useState(false);
  const [isTableDataAvail, setIsTableDataAvail] = useState(false);
  const [lenderData, setLenderData] = useState({});
  const [productData, setProductData] = useState();

  useEffect(() => {
    if (productList.length < 1) {
      fetchAPI();
    }
    setLenderData({
      [data.nameAsPerGST]: data.id,
    });
  }, [productList]);
  const fetchAPI = async () => {
    try {
      setIsShowLoader(true);
      const jsonData = await getLenderProductList(props.data.id);
      if (
        jsonData &&
        (jsonData.statusCode === 200 || jsonData.statusCode === 201)
      ) {
        jsonData.data.map(val => {
          setProductList(prev => [...prev, val]);
        });
        setIsShowLoader(false);
        jsonData.data?.length > 0 && setIsTableDataAvail(true);
      } else {
        Notification(`${jsonData.message}`, 4);
      }
    } catch (error) {
      Notification(`Not able to fetch permissions. Try later!`, 4);
    }
  };

  //handle table actions
  const handleDeleteProduct = productId => {
    const loadingId = ApiNotificationLoading();
    deleteLenderProductById(productId)
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
      { Header: 'Product ID', accessor: 'productIdentifier', canSort: true },
      {
        Header: 'Amount By Lender',
        accessor: 'amountCommitedByLender',
        canSort: true,
      },
      { Header: 'Rate of Interest', accessor: 'dailyRateOfInterest' },
      { Header: 'Created at', accessor: 'createdAt' },
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
                  handleDeleteProduct(row.original.id);
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
          <h3>No Product Available for this Lender</h3>
        )
      ) : (
        <ApiLoader />
      )}
      {isShowEditModal && (
        <CreateProductModal
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

export default NestedTable;
