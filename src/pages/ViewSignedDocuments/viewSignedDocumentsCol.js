import React from 'react';
import { Link } from 'react-router-dom';
import * as moment from 'moment';
import { UncontrolledTooltip } from 'reactstrap';

const formateDate = (date, format) => {
  const dateFormat = format ? format : 'DD MMM Y';
  const date1 = moment(new Date(date)).format(dateFormat);
  return date1;
};

const Id = cell => {
  return cell.value ? cell.value : '-';
};
const Name = cell => {
  return cell.value ? cell.value : '-';
};

const CreatedDate = cell => {
  return cell.value ? formateDate(cell.value) : '-';
};

export { Name, CreatedDate, Id };
