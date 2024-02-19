import React from 'react';
import { Link } from 'react-router-dom';
import * as moment from 'moment';
import { size, map } from 'lodash';

const formateDate = (date, format) => {
  const dateFormat = format ? format : 'DD MMM Y';
  const date1 = moment(new Date(date)).format(dateFormat);
  return date1;
};
const toLowerCase1 = str => {
  return str === '' || str === undefined ? '' : str.toLowerCase();
};
const AuthorizedSignatory = cell => {
  return <input type="checkbox" disabled={true} checked={cell.value} />;
};
const SNo = cell => {
  return cell.row.id ? Number(cell.row.id) + 1 : '-';
};
const Name = cell => {
  return cell.value ? cell.value : '-';
};

const Email = cell => {
  return cell.value ? cell.value : '-';
};
const Mobile = cell => {
  return cell.value ? cell.value : '-';
};

const Role = cell => {
  return cell.value ? cell.value : '-';
};

export { Name, Email, Role, Mobile, SNo, AuthorizedSignatory };
