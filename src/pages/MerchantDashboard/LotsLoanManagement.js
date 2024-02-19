import TableContainer from 'components/Common/TableContainer';
import ApiLoader from 'components/Common/Ui/ApiLoader';
import { getAllBnplOrders } from 'helpers/backend_helper';
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Card, CardBody, Container } from 'reactstrap';
import AmountInputModal from './AmountInputModal';
import { debounce } from 'lodash';

const LotsLoanManagement = () => {
  const [loanData, setLoanData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [searchDataNotFound, setSearchDataNotFound] = useState('');
  const [enteredValue, setEnteredValue] = useState('');
  const [isOpenAmountModal, setIsOpenAmountModal] = useState(false);

  // Selected Org Data
  const { selectedOrganization } = useSelector(state => ({
    selectedOrganization: state.Login.selectedOrganization,
  }));
  const orgId = selectedOrganization?.organizationId
    ? selectedOrganization.organizationId
    : '';

  useEffect(() => {
    const fetchLoanData = async () => {
      setIsLoading(true);
      const loanDataApi = await getAllBnplOrders(1);
      if (loanDataApi.statusCode == 200 || loanDataApi.statusCode == 201) {
        if (loanDataApi?.data?.length > 0) {
          setLoanData(loanDataApi.data);
        }
        setIsLoading(false);
      } else {
        setLoanData([]);
        setIsLoading(false);
      }
      //   setIsLoading(false);
      console.log(loanDataApi);
    };

    fetchLoanData();
  }, []);

  const handleCheckboxChange = (rowData, orderId) => {
    console.log(rowData, typeof rowData);
    setSelectedData(prevSelectedData => {
      const updatedData = prevSelectedData.includes(rowData)
        ? prevSelectedData.filter(val => val.requestOrderId !== orderId)
        : [...prevSelectedData, rowData];
      return updatedData;
    });
  };

  const columns = useMemo(
    () => [
      {
        Header: '#',
        width: '25%',
        Cell: ({ row }) => {
          return (
            <div>
              {row.original.status == 'approved' ? (
                <input
                  type="checkbox"
                  onChange={() =>
                    handleCheckboxChange(
                      row.original,
                      row.original.requestOrderId
                    )
                  }
                  //disabled={row.original.status == 'toBeDisbursed'}
                />
              ) : (
                <>
                  <i
                    className="mdi mdi-check"
                    style={{ color: 'green', fontSize: 'larger' }}
                  ></i>
                </>
              )}
            </div>
          );
        },
      },
      {
        Header: 'Order ID',
        accessor: 'requestOrderId',
        width: '25%',
        canSort: true,
      },
      {
        Header: 'Invoice ID',
        accessor: 'invoiceId',
        width: '25%',
        canSort: true,
      },
      {
        Header: 'Date',
        accessor: 'date',
        width: '25%',
        canSort: true,
        Cell: ({ row }) => {
          const utcTimestamp = row.original.date;
          const utcDate = new Date(utcTimestamp);

          // Convert the UTC date to IST (Indian Standard Time)
          const istDate = new Date(utcDate.getTime() + 5.5 * 60 * 60 * 1000); // Add 5.5 hours for IST

          // Format the IST date as a string
          const istString = istDate.toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
          });
          return <div>{istString}</div>;
        },
      },
      {
        Header: 'Amount',
        accessor: 'amount',
        width: '25%',
        canSort: true,
      },
      {
        Header: 'Status',
        accessor: 'status',
        width: '25%',
      },
    ],
    [loanData, searchData]
  );

  const handleListSearch = e => {
    const searchArr = e.target.value.split(',').map(val => val.trim());
    let altData = [];
    let notFoundData = searchArr;
    loanData.map(val => {
      if (searchArr.includes(val.requestOrderId)) {
        altData.push(val);
        notFoundData = notFoundData.filter(id => id != val.requestOrderId);
      }
    });
    console.log(notFoundData);
    setSearchData(altData);
    setSearchDataNotFound(notFoundData.join(',', '  '));
  };

  const handleModalOpen = () => {
    console.log(selectedData);
    setIsOpenAmountModal(true);
  };

  const handleModalClose = () => {
    setIsOpenAmountModal(false);
  };

  const debouncedChannelSearch = debounce(handleListSearch, 600);

  return (
    <>
      <React.Fragment>
        <div className="page-content">
          <Container fluid>
            <Card>
              {isLoading ? (
                <CardBody>
                  <ApiLoader />
                </CardBody>
              ) : (
                <>
                  <CardBody className="border-bottom">
                    <div className="d-flex align-items-center justify-content-between">
                      <h4 className="m-0">LOTS ORDER LIST</h4>
                    </div>
                  </CardBody>
                  <CardBody className="border-bottom">
                    <div className="d-flex justify-content-between">
                      <div className="search-box me-xxl-2 mt-2 mt-md-0 d-inline-block">
                        <div className="position-relative">
                          <label
                            htmlFor="search-bar-0"
                            className="search-label m-0"
                          >
                            <input
                              id="search-bar-0"
                              type="text"
                              className="form-control"
                              placeholder={`Search sales channel`}
                              onChange={debouncedChannelSearch}
                            />
                          </label>
                          <i className="bx bx-search-alt search-icon"></i>
                        </div>
                        {searchDataNotFound.length > 0 && (
                          <div>
                            <small className="text-danger">
                              ({searchDataNotFound}) not found
                            </small>
                          </div>
                        )}
                      </div>
                      <div>
                        <Button
                          color="primary"
                          disabled={selectedData.length < 1}
                          type="button"
                          onClick={handleModalOpen}
                        >
                          Change Status
                        </Button>
                      </div>
                    </div>
                  </CardBody>
                  <CardBody>
                    {loanData.length > 0 ? (
                      <>
                        {searchData.length > 0 ? (
                          <TableContainer
                            columns={columns}
                            data={searchData}
                            isGlobalFilter={false}
                            hideShowButton={true}
                            customPageSize={10}
                            showFilterByCol={true}
                          />
                        ) : (
                          <TableContainer
                            columns={columns}
                            data={loanData}
                            isGlobalFilter={false}
                            hideShowButton={true}
                            customPageSize={10}
                            showFilterByCol={true}
                          />
                        )}
                      </>
                    ) : (
                      <>No Data found</>
                    )}
                  </CardBody>
                </>
              )}
            </Card>
            {isOpenAmountModal && (
              <AmountInputModal
                isOpenModal={isOpenAmountModal}
                handleModalClose={handleModalClose}
                modalHeader="Add Amount"
                selectedData={selectedData}
              />
            )}
          </Container>
        </div>
      </React.Fragment>
    </>
  );
};

export default LotsLoanManagement;
