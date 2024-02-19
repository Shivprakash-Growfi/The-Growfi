import React from 'react';
import { Input, CustomInput } from 'reactstrap';
import { ToProperCase } from 'components/Common/ToProperCase';

export const Filter = ({ column }) => {
  return (
    <div style={{ marginTop: 5 }}>
      {column.canFilter && column.render('Filter')}
    </div>
  );
};

export const DefaultColumnFilter = ({
  column: {
    filterValue,
    setFilter,
    preFilteredRows: { length },
  },
}) => {
  return (
    <Input
      value={filterValue || ''}
      onChange={e => {
        setFilter(e.target.value || undefined);
      }}
      placeholder={`Search (${length})`}
    />
  );
};

export const SelectColumnFilter = ({
  column: { filterValue, setFilter, preFilteredRows, id },
}) => {
  const options = React.useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach(row => {
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

  const truncateText = (text, maxLength) => {
    if (typeof text === 'string' && text?.length > maxLength) {
      const formattedText = ToProperCase(text.slice(0, maxLength - 3));
      return formattedText + '...';
    }
    return typeof text === 'string' ? ToProperCase(text) : text;
  };

  return (
    <select
      id="custom-select"
      className="form-select"
      value={filterValue}
      onChange={e => {
        setFilter(e.target.value || undefined);
      }}
    >
      <option value="">All</option>
      {options.map((option, key) => (
        <option key={key} value={option} id={`selected_${key}`}>
          {truncateText(option, 30)}
        </option>
      ))}
    </select>
  );
};
