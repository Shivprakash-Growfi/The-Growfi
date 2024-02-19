import React, { useMemo } from 'react';
import NestedTable from 'components/Common/NestedTable';
import { LinkComp, Status } from './NestedSignedDocTableCol';

export default function NestedSignedDocTable({ data }) {
  const linksAndStatusDataForTable = data.linksAndStatus.map((row, index) => {
    return { index: index + 1, ...row };
  });
  const columns = useMemo(
    () => [
      {
        Header: 'S No.',
        accessor: 'index',
        canSort: true,

        Cell: cellProps => {
          console.log(cellProps);
          return <div>{cellProps.cell.value}</div>;
        },
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: cellProps => {
          return <Status {...cellProps} />;
        },
      },
      {
        Header: 'Link',
        Cell: cellProps => {
          const docLink = cellProps?.row?.original?.link;
          return <LinkComp docLink={docLink}></LinkComp>;
        },
      },
    ],
    []
  );
  return (
    <React.Fragment>
      <NestedTable
        columns={columns}
        data={linksAndStatusDataForTable}
        filterByColumn={false}
        bordered={true}
        maxHeight={'300px'}
        initialSort={'index'}
        pclassName="custom-header-css-for-finance-page"
      />{' '}
    </React.Fragment>
  );
}
