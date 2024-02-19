import React from 'react';
import {
  ToProperCase,
  ProperDateFormat,
  ProperMoneyFormat,
} from 'components/Common/ToProperCase';
import moment from 'moment';

const P2bAssetId = cell => {
  return cell?.value ? cell.value : '';
};
const LeafRoundId = cell => {
  return cell.value ? cell.value : '';
};
const Status = cell => {
  if (cell?.value === 'eNACHcreated') {
    return 'Enach Created';
  } else if (cell?.value === 'eNACHcompleted') {
    return 'Enach Completed';
  } else {
    return cell?.value ? ToProperCase(cell.value) : '';
  }
};
const TotalChallans = cell => {
  return cell.value ? cell.value : '';
};
const TotalAmount = cell => {
  return cell.value ? ProperMoneyFormat(parseFloat(cell.value)) : '';
};
const InvoiceId = cell => {
  return cell.value ? cell.value : '';
};
const RetailerName = cell => {
  return cell.value ? cell.value.nameAsPerGST : '';
};
const Date = cell => {
  return cell.value ? ProperDateFormat(cell.value) : '';
};
const DocLink = cell => {
  const docLink = cell?.row?.original?.docLink ? cell.row.original.docLink : '';
  return (
    <div className="d-flex justify-content-center">
      <a href={docLink}>
        <i className="fas fa-download fs-5 text-dark" />
      </a>
    </div>
  );
};
const ByOrganization = cell => {
  return cell.value ? cell.value : '';
};
const DueDate = cell => {
  return cell.value ? moment(cell.value).format('MMMM D, YYYY') : '';
};

const inputfieldsForCreateEnach = [
  {
    id: 0,
    type: 'string',
    label: 'User Name *',
    name: 'customerIdentifier',
    placeholder: 'Enter name of the user',
  },
  {
    id: 1,
    type: 'string',
    label: 'Enach Id *',
    name: 'enachId',
    placeholder: 'Enter Enach Id or Digio Id for the user',
  },
  {
    id: 2,
    type: 'select',
    label: 'One Time Payment ? *',
    name: 'oneTimePayment',
    placeholder: 'Select to pay total amount at once or in installments',
  },
  {
    id: 3,
    type: 'select',
    label: 'Installment Mode *',
    name: 'installmentMode',
    placeholder: 'Select installment mode',
  },
  {
    id: 4,
    type: 'date',
    label: 'Installment Start Date *',
    name: 'startDate',
    placeholder: 'Select Start Date',
  },
  {
    id: 5,
    type: 'date',
    label: 'Installment End Date *',
    name: 'endDate',
    placeholder: 'Select End Date',
  },
  {
    id: 6,
    type: 'string',
    label: 'Comment *',
    name: 'comment',
    placeholder: 'Enter comments to note',
  },
];
export {
  P2bAssetId,
  LeafRoundId,
  Status,
  TotalChallans,
  TotalAmount,
  InvoiceId,
  RetailerName,
  Date,
  DocLink,
  ByOrganization,
  DueDate,
  inputfieldsForCreateEnach,
};
