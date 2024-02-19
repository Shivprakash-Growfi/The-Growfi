import React, { Fragment, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  useTable,
  useGlobalFilter,
  useAsyncDebounce,
  useSortBy,
  useFilters,
  useExpanded,
  usePagination,
} from 'react-table';
import {
  Table,
  Row,
  Col,
  Button,
  Input,
  CardBody,
  UncontrolledTooltip,
} from 'reactstrap';
import { Filter, DefaultColumnFilter, SelectColumnFilter } from './filters';
import JobListGlobalFilter from '../../components/Common/GlobalSearchFilter';
import { debounce } from 'lodash';
import { truncateText } from 'helpers/utilities';

// Define a default UI for filtering
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
  isJobListGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce(value => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <React.Fragment>
      <Col md={4}>
        <div className="search-box me-xxl-2 mt-2 mt-md-0 d-inline-block">
          <div className="position-relative">
            <label htmlFor="search-bar-0" className="search-label">
              <span id="search-bar-0-label" className="sr-only">
                Search this table
              </span>
              <input
                onChange={e => {
                  setValue(e.target.value);
                  onChange(e.target.value);
                }}
                id="search-bar-0"
                type="text"
                className="form-control"
                placeholder={`${count} records...`}
                value={value || ''}
              />
            </label>
            <i className="bx bx-search-alt search-icon"></i>
          </div>
        </div>
      </Col>
      {isJobListGlobalFilter && <JobListGlobalFilter />}
    </React.Fragment>
  );
}

const TableContainer = ({
  columns,
  data,
  initialSort,
  bordered = true,
  isGlobalFilter,
  isJobListGlobalFilter,
  isAddOptions,
  isAddUserList,
  handleOrderClicks,
  handleUserClick,
  handleCustomerClick,
  handleRedeemClick,
  isRedeemOption,
  isAddCustList,
  customPageSize,
  className,
  customPageSizeOptions = true,
  showFilterByCol = true,
  isCreateSalesChannel,
  isAddSalesChannel,
  hideShowButton = false,
  isAddInvoiceBtn,
  addInvoiceBtnheader,
  handleAddInvoiceModal,
  NestedTable = () => {
    return <></>;
  },
}) => {
  //const newtabledata = useMemo(() => tabledata, [tabledata]);

  const sortableColumns = columns.filter(column => column.canSort);
  const defaultSortColumn = sortableColumns[0]?.accessor || '';

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
    state: { pageIndex, pageSize },
    visibleColumns,
  } = useTable(
    {
      columns,
      data,
      defaultColumn: { Filter: DefaultColumnFilter },
      initialState: {
        pageIndex: 0,
        pageSize: customPageSize,
        sortBy: [
          {
            id:
              initialSort && initialSort.length > 0
                ? initialSort
                : defaultSortColumn,
            desc: false,
          },
        ],
      },
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    useExpanded,
    usePagination
  );
  useEffect(() => {
    if (pageIndex >= 0) {
      // Scroll to the top of the table when page changes
      window.scrollTo(0, 0);
    }
  }, [pageIndex]);

  const generateSortingIndicator = column => {
    return column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : '';
  };

  const onChangeInSelect = event => {
    setPageSize(Number(event.target.value));
  };
  const onChangeInInput = event => {
    const page = event.target.value ? Number(event.target.value) - 1 : 0;
    gotoPage(page);
  };
  const debouncedSendRequest = debounce(onChangeInInput, 600);

  return (
    <Fragment>
      <Row className="mb-2">
        {!hideShowButton && (
          <Col md={customPageSizeOptions ? 2 : 1}>
            <select
              className="form-select"
              value={pageSize}
              onChange={onChangeInSelect}
              style={{ width: '80%' }}
            >
              {[10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </Col>
        )}
        {isGlobalFilter && (
          <GlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            globalFilter={state.globalFilter}
            setGlobalFilter={setGlobalFilter}
            isJobListGlobalFilter={isJobListGlobalFilter}
          />
        )}
        {isAddOptions && (
          <Col sm="7">
            <div className="text-sm-end">
              <Button
                type="button"
                color="success"
                className="btn-rounded  mb-2 me-2"
                onClick={handleOrderClicks}
              >
                <i className="mdi mdi-plus me-1" />
                Add New Order
              </Button>
            </div>
          </Col>
        )}
        {isAddUserList && (
          <Col>
            <div className="text-sm-end">
              <Button
                type="button"
                color="primary"
                className="btn mb-2 me-2"
                onClick={handleUserClick}
              >
                <i className="mdi mdi-plus-circle-outline me-1" />
                Create New User
              </Button>
            </div>
          </Col>
        )}
        {isAddCustList && (
          <Col>
            <div className="text-sm-end">
              <Button
                type="button"
                color="success"
                className="btn-rounded mb-2 me-2"
                onClick={handleCustomerClick}
              >
                {/* <i className="mdi mdi-plus me-1" /> */}
                Add Organization
              </Button>
            </div>
          </Col>
        )}

        {/* {isRedeemOption && (
          <Col sm="12">
            <div className="text-sm-end">
              <Button
                type="button"
                color="success"
                className="btn-rounded mb-2 me-2"
                onClick={handleRedeemClick}
              >
                <i className="mdi mdi-plus me-1" />
                Redeem Invoices
              </Button>
            </div>
          </Col>
        )} */}
        {(isRedeemOption || isAddInvoiceBtn) && (
          <Col>
            <div className="text-md-end d-flex justify-content-end">
              {isRedeemOption && (
                <div>
                  <Button
                    type="button"
                    color="success"
                    className="btn-rounded mb-2 me-2"
                    onClick={handleRedeemClick}
                  >
                    <i className="mdi mdi-plus me-1" />
                    Redeem Invoices
                  </Button>
                </div>
              )}
              {isAddInvoiceBtn && (
                <div>
                  <Button
                    type="button"
                    color="success"
                    className="btn-rounded mb-2 me-2"
                    onClick={handleAddInvoiceModal}
                    name="addChannel"
                  >
                    <i className="mdi mdi-plus me-1" />
                    {addInvoiceBtnheader}
                  </Button>
                </div>
              )}
            </div>
          </Col>
        )}

        {isAddSalesChannel && (
          <Col>
            <div className="text-md-end">
              <Button
                type="button"
                color="success"
                className="btn-rounded mb-2 me-2"
                onClick={handleCustomerClick}
                name="addChannel"
              >
                <i className="mdi mdi-plus me-1" />
                Add Channel
              </Button>
            </div>
          </Col>
        )}
      </Row>

      <div className="table-responsive react-table">
        <Table
          bordered={bordered}
          hover
          {...getTableProps()}
          className={className}
        >
          <thead className="table-light table-nowrap">
            {headerGroups.map(headerGroup => (
              <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th
                    key={column.id}
                    style={{
                      textAlign: 'center',
                      verticalAlign: 'middle',
                    }}
                  >
                    <div {...column.getSortByToggleProps()}>
                      {column.render('Header')}
                      {generateSortingIndicator(column)}
                    </div>
                    {showFilterByCol &&
                      column.filterable &&
                      (column.showSelect ? (
                        <SelectColumnFilter column={column} />
                      ) : (
                        <DefaultColumnFilter column={column} />
                      ))}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody {...getTableBodyProps()}>
            {page.map((row, index) => {
              prepareRow(row);
              return (
                <Fragment key={row.getRowProps().key}>
                  <tr>
                    {row.cells.map((cell, cellIndex) => {
                      return (
                        <td
                          style={{
                            textAlign: 'center',
                            verticalAlign: 'middle',
                          }}
                          key={cell.id}
                          {...cell.getCellProps()}
                          id={'truncate-' + cellIndex + index + cell.id}
                        >
                          {typeof cell?.value === 'string' &&
                          cell?.value?.length > 25 ? (
                            <>
                              {truncateText(cell?.value, 25)}
                              <UncontrolledTooltip
                                placement="bottom"
                                target={
                                  'truncate-' + cellIndex + index + cell.id
                                }
                              >
                                {cell.render('Cell')}
                              </UncontrolledTooltip>
                            </>
                          ) : (
                            <>{cell.render('Cell')}</>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                  {row.isExpanded && (
                    <tr>
                      <td colSpan={visibleColumns.length}>
                        <NestedTable data={row.original} />
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </Table>
      </div>

      <Row className="justify-content-md-end justify-content-center align-items-center">
        <Col className="col-md-auto">
          <div className="d-flex gap-1">
            <Button
              color="primary"
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
            >
              {'<<'}
            </Button>
            <Button
              color="primary"
              onClick={previousPage}
              disabled={!canPreviousPage}
            >
              {'<'}
            </Button>
          </div>
        </Col>
        <Col className="col-md-auto d-none d-md-block">
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>
        </Col>
        <Col className="col-md-auto">
          <Input
            type="number"
            min={1}
            style={{ width: 70 }}
            max={pageOptions.length}
            defaultValue={pageIndex + 1}
            onChange={debouncedSendRequest}
          />
        </Col>

        <Col className="col-md-auto">
          <div className="d-flex gap-1">
            <Button color="primary" onClick={nextPage} disabled={!canNextPage}>
              {'>'}
            </Button>
            <Button
              color="primary"
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
            >
              {'>>'}
            </Button>
          </div>
        </Col>
      </Row>
    </Fragment>
  );
};

TableContainer.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default TableContainer;
