import React from 'react';
import moment from 'moment';
import { getEsignedDocsByDigioId } from 'helpers/backend_helper';
import { ProperMoneyFormat } from 'components/Common/ToProperCase';
import { DownloadFileByName } from 'components/Common/FileSizeTypeChecker';

const SignedBy = cell => {
  return cell.value ? cell.value : '';
};
const DocumentName = cell => {
  return cell.value ? cell.value : '';
};
const Date = cell => {
  return cell.value ? moment(cell.value).format('MMMM D, YYYY') : '';
};
const DownloadDocument = row => {
  const eSignedDocLink = getEsignedDocsByDigioId(
    row?.original?.digioId ? row.original.digioId : ''
  );

  return (
    <div className="d-flex justify-content-center">
      <a
        href={eSignedDocLink !== '' ? eSignedDocLink : '#'}
        // target="_blank"
        rel="noopener noreferrer"
      >
        <i className="fas fa-download fs-4 text-dark" />
      </a>
    </div>
  );
};

const DownloadChequeDoc = row => {
  return (
    <div className="d-flex justify-content-center">
      <a
        // href={row?.original?.docLink !== '' ? row?.original?.docLink : '#'}
        // // target="_blank"
        // rel="noopener noreferrer"
        onClick={() => {
          DownloadFileByName(
            row?.original?.fileName !== '' ? row?.original?.fileName : '#'
          );
        }}
      >
        <i className="fas fa-download fs-4 text-dark" />
      </a>
    </div>
  );
};

const ProductName = cell => {
  return cell.value ? cell.value : '';
};

const ChequeLimit = cell => {
  return cell.value ? ProperMoneyFormat(cell.value) : '';
};

const ChequeNumber = cell => {
  return cell.value ? cell.value : '';
};

export {
  SignedBy,
  DocumentName,
  Date,
  DownloadDocument,
  ProductName,
  ChequeLimit,
  ChequeNumber,
  DownloadChequeDoc,
};
