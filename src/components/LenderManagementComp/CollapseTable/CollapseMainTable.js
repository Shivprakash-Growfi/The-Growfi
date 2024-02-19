import React, { Fragment } from 'react';
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
  UncontrolledTooltip,
} from 'reactstrap';
import {
  Filter,
  DefaultColumnFilter,
  SelectColumnFilter,
} from '../../Common/filters';
import NestedTable from './NestedTable';
import MappingNestedTable from './MappingNestedTable';

// Define a default UI for filtering
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
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
    </React.Fragment>
  );
}

const CollapseMainTable = ({
  columns,
  data,
  isGlobalFilter = true,
  customPageSize,
  className,
  customPageSizeOptions = true,
  showFilterByCol = true,
  bordered = true,
  IsUserGrowfi,
  initialSort,
  showSetPage = true,
  isCreateComp,
}) => {
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
      defaultColumn: { Filter: SelectColumnFilter },
      initialState: {
        pageIndex: 0,
        pageSize: customPageSize,
        sortBy: [
          {
            id: initialSort && initialSort.length > 0 ? initialSort : undefined,
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

  // sorting indicator icon for each column
  const generateSortingIndicator = column => {
    return column.isSorted ? (
      column.isSortedDesc ? (
        ' 🔽'
      ) : (
        ' 🔼'
      )
    ) : (
      <i
        className="fas fa-sort"
        style={{ color: 'blue', fontSize: '17px', marginLeft: '4px' }}
      />
    );
  };

  const onChangeInSelect = event => {
    setPageSize(Number(event.target.value));
  };

  const onChangeInInput = event => {
    const page = event.target.value ? Number(event.target.value) - 1 : 0;
    gotoPage(page);
  };

  return (
    <Fragment>
      <Row className="mb-2">
        {showSetPage && (
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
          />
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
                {headerGroup.headers.map((column, headerIndex) => (
                  <th key={column.id}>
                    <div
                      className="mb-2 d-flex justify-content-center"
                      {...column.getSortByToggleProps()}
                    >
                      {column.render('Header')}
                      {column.Header != '' && generateSortingIndicator(column)}
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
                          key={cell.id}
                          {...cell.getCellProps()}
                          style={
                            cell.column.Header === '#'
                              ? { cursor: 'pointer', maxWidth: '150px' }
                              : { maxWidth: '150px' }
                          }
                        >
                          <div
                            className={`d-block ${
                              cell?.value?.length > 20 ? 'text-truncate' : ''
                            } justify-content-center text-center`}
                            id={
                              cell?.value?.length > 20
                                ? 'truncate-' + cellIndex + index + cell.id
                                : ''
                            }
                          >
                            <div className="d-flex justify-content-center font-size-18">
                              {cell.render('Cell')}
                              {cell?.value?.length > 20 && (
                                <UncontrolledTooltip
                                  placement="bottom"
                                  target={
                                    'truncate-' + cellIndex + index + cell.id
                                  }
                                >
                                  {cell.render('Cell')}
                                </UncontrolledTooltip>
                              )}
                            </div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                  {row.isExpanded && (
                    <tr>
                      <td colSpan={visibleColumns.length}>
                        {isCreateComp ? (
                          <>
                            <NestedTable data={row.original} />
                          </>
                        ) : (
                          <MappingNestedTable data={row.original} />
                        )}
                        {/* <NestedTable data={row.original} /> */}
                        {/* <MappingNestedTable data={row.original} /> */}
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
            onChange={onChangeInInput}
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

CollapseMainTable.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default CollapseMainTable;
