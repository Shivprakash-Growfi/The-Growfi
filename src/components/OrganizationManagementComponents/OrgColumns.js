import React from 'react';
import { Link } from 'react-router-dom';

const CustId = cell => {
  return (
    <Link to="#" className="text-body fw-bold">
      {cell.value ? cell.value : ''}
    </Link>
  );
};

const CompanyName = cell => {
  return cell.value ? cell.value : '';
};

const CompanyType = cell => {
  return cell.value ? cell.value : '';
};

const OrganizationOperationType = cell => {
  return cell.value ? cell.value : '';
};

const AdminName = cell => {
  return cell.value ? cell.value : '';
};

const AdminEmailId = cell => {
  return cell.value ? cell.value : '';
};

const AdminPhoneNo = cell => {
  return cell.value ? cell.value : '';
};

const AddressLine1 = cell => {
  return cell.value ? cell.value : '';
};

const AddressLine2 = cell => {
  return cell.value ? cell.value : '';
};

const City = cell => {
  return cell.value ? cell.value : '';
};

const State = cell => {
  return cell.value ? cell.value : '';
};

const Pincode = cell => {
  return cell.value ? cell.value : '';
};

const PanNo = cell => {
  return cell.value ? cell.value : '';
};

const GstinNo = cell => {
  return cell.value ? cell.value : '';
};

export {
  CustId,
  CompanyName,
  CompanyType,
  OrganizationOperationType,
  AdminName,
  AdminEmailId,
  AdminPhoneNo,
  AddressLine1,
  AddressLine2,
  City,
  State,
  Pincode,
  PanNo,
  GstinNo,
};
