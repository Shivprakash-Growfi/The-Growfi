import React, { Fragment } from 'react';
import {
  useTable,
  useGlobalFilter,
  useSortBy,
  useFilters,
  useExpanded,
  usePagination,
} from 'react-table';
import { Table, Row, CardTitle, Col, UncontrolledTooltip } from 'reactstrap';
import { Filter, DefaultColumnFilter } from '../Common/filters';
import { truncateText } from 'helpers/utilities';

const NestedTable = ({
  columns,
  data,
  className,
  filterByColumn = true,
  bordered = true,
  styleForTableHeadFixed = {
    position: 'sticky',
    top: '0px',
    zIndex: 1,
  },
  maxHeight = '300px',
  initialSort,
  p2bAssetDetails = {},
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
  } = useTable(
    {
      columns,
      data,
      defaultColumn: { Filter: DefaultColumnFilter },
      initialState: {
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
    return column.isSorted ? column.isSortedDesc ? ' 🔽' : ' 🔼' : <></>;
  };

  return (
    <Fragment>
      <div
        className="table-responsive react-table"
        style={{ maxHeight: maxHeight, overflowY: 'scroll' }}
      >
        <Table
          bordered={bordered}
          hover
          {...getTableProps()}
          className={className}
        >
          <thead
            className="table-dark table-nowrap"
            style={styleForTableHeadFixed}
          >
            {headerGroups.map(headerGroup => (
              <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th key={column.id}>
                    <div
                      className="d-flex justify-content-center"
                      {...column.getSortByToggleProps()}
                    >
                      {column.render('Header')}
                      {generateSortingIndicator(column)}
                    </div>
                    {filterByColumn && <Filter column={column} />}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody {...getTableBodyProps()}>
            {rows.map((row, index) => {
              prepareRow(row);
              return (
                <Fragment key={row.getRowProps().key}>
                  <tr className="table-secondary">
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
                </Fragment>
              );
            })}
          </tbody>
        </Table>
      </div>
    </Fragment>
  );
};

export default NestedTable;
