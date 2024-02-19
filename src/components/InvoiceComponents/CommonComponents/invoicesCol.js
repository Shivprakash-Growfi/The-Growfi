import React from 'react';
import { Link } from 'react-router-dom';
import { ProperMoneyFormat } from 'components/Common/ToProperCase';
import moment from 'moment';

const formateDate = (date, format) => {
  const dateFormat = format ? format : 'DD MMM Y';
  const date1 = moment(new Date(date)).format(dateFormat);
  return date1;
};
const toLowerCase1 = str => {
  return str === '' || str === undefined ? '' : str.toLowerCase();
};

const toUpperCase1 = str => {
  return str === '' || str === undefined ? '' : str.toLocaleUpperCase();
};

const OrganizationName = cell => {
  return cell.value ? cell.value : '-';
};

const Amount = cell => {
  return cell.value ? ProperMoneyFormat(cell.value) : '-';
};
const Status = cell => {
  return cell.value ? toUpperCase1(cell.value) : '-';
};

const Invoice_ID = cell => {
  return cell.value ? cell.value : '-';
};

const Due_Date = cell => {
  return cell.value ? moment(cell.value).format('D MMMM YYYY') : '-';
};

export { OrganizationName, Amount, Status, Invoice_ID, Due_Date };
