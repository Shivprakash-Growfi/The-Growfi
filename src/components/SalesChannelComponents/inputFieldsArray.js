import { organizationType } from './dropdownConst';
import { organizationOperationType } from './dropdownConst';
import { userTypeInOrg } from './dropdownConst';
import { dueDate } from './dropdownConst';
import { retailerType } from './dropdownConst';

const inputFields = [
  {
    id: 1,
    type: 'string',
    label: 'Registered name *',
    descp: '(Name as per PAN)',
    name: 'nameAsPerPAN',
    placeholder: 'Enter Organization Name',
    maxLength: '30',
  },
  {
    id: 2,
    type: 'select',
    label: 'Organization Type *',
    name: 'organizationType',
    placeholder: 'Enter Organization Type',
    selectOption: organizationType,
  },
  {
    id: 3,
    type: 'select',
    label: 'Organization Operation Type *',
    name: 'organizationOperationType',
    placeholder: 'Enter Organization Operation Type',
    selectOption: organizationOperationType,
  },
  {
    id: 11,
    type: 'select',
    label: 'Retailer Type',
    name: 'retailerType',
    placeholder: 'Select retailer type',
    selectOption: retailerType,
  },
  {
    id: 4,
    type: 'string',
    label: 'Organization name *',
    descp: '(Name as per GST)',
    name: 'nameAsPerGST',
    placeholder: 'Enter Name of the Sales Channel',
    maxLength: '30',
  },
  {
    id: 5,
    type: 'string',
    label: 'User Name *',
    name: 'userName',
    placeholder: 'Enter Name of the User',
    maxLength: '30',
  },
  {
    id: 6,
    type: 'email',
    label: 'Email Id *',
    name: 'userEmail',
    placeholder: 'Enter Email Id',
  },
  {
    id: 7,
    type: 'string',
    label: 'Phone Number *',
    name: 'userPhone',
    placeholder: 'Enter Phone Number',
    maxLength: '10',
  },
  {
    id: 8,
    type: 'select',
    label: 'User Type *',
    name: 'userType',
    placeholder: 'Enter User Type',
    selectOption: userTypeInOrg,
  },
  {
    id: 9,
    type: 'string',
    label: 'PAN Number *',
    name: 'panNumber',
    placeholder: 'Enter Pan Number',
  },
  {
    id: 10,
    type: 'select',
    label: 'Due time *',
    name: 'dueDate',
    placeholder: 'Select time period',
    selectOption: dueDate,
  },
  {
    id: 12,
    type: 'string',
    label: 'MID *',
    name: 'mId',
    placeholder: 'Enter MID',
    maxLength: '30',
  },
];

const inputFieldsForExistingOrg = [
  {
    id: 1,
    type: 'string',
    label: 'Registered name *',
    descp: '(Name as per PAN)',
    name: 'nameAsPerPAN',
    placeholder: 'Enter Organization Name',
    maxLength: '30',
  },
  {
    id: 2,
    type: 'select',
    label: 'Organization Type *',
    name: 'organizationType',
    placeholder: 'Enter Organization Type',
    selectOption: organizationType,
  },
  {
    id: 3,
    type: 'select',
    label: 'Organization Operation Type *',
    name: 'organizationOperationType',
    placeholder: 'Enter Organization Operation Type',
    selectOption: organizationOperationType,
  },
  {
    id: 11,
    type: 'select',
    label: 'Retailer Type',
    name: 'retailerType',
    placeholder: 'Select retailer type',
    selectOption: retailerType,
  },
  {
    id: 4,
    type: 'string',
    label: 'Organization name *',
    descp: '(Name as per GST)',
    name: 'nameAsPerGST',
    placeholder: 'Enter Name of the Sales Channel',
    maxLength: '30',
  },
  {
    id: 9,
    type: 'string',
    label: 'PAN Number *',
    name: 'panNumber',
    placeholder: 'Enter Pan Number',
  },
  {
    id: 10,
    type: 'select',
    label: 'Due time *',
    name: 'dueDate',
    placeholder: 'Select time period',
    selectOption: dueDate,
  },
  {
    id: 12,
    type: 'string',
    label: 'MID *',
    name: 'mId',
    placeholder: 'Enter MID',
    maxLength: '30',
  },
];

const challanInput = [
  {
    id: 1,
    type: 'string',
    label: 'Invoice Number *',
    name: 'invoiceNumber',
    placeholder: 'Enter invoice number',
    maxLength: '30',
  },
  {
    id: 2,
    type: 'string',
    label: 'Amount *',
    name: 'amount',
    placeholder: 'Enter total amount',
  },
];

const challanInputForDistributor = [
  {
    id: 1,
    type: 'string',
    label: 'Organization Name *',
    name: 'invoiceGeneratedBy',
    placeholder: 'Enter Organization Name',
  },
  {
    id: 2,
    type: 'string',
    label: 'Invoice Number *',
    name: 'invoiceNumber',
    placeholder: 'Enter invoice number',
    maxLength: '30',
  },
  {
    id: 3,
    type: 'string',
    label: 'Amount *',
    name: 'amount',
    placeholder: 'Enter total amount',
  },
  {
    id: 4,
    type: 'date',
    label: 'Invoice Date *',
    name: 'dueDateByDistributor',
    placeholder: 'Select due date',
  },
];

const selectRetailer = [
  {
    id: 1,
    type: 'string',
    label: 'For Organization',
    name: 'selectedRetailer',
    placeholder: 'Select a Organization',
  },
];

export {
  inputFields,
  challanInput,
  selectRetailer,
  challanInputForDistributor,
  inputFieldsForExistingOrg,
};
