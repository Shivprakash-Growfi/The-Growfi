import React from 'react';
import { UncontrolledTooltip } from 'reactstrap';

export const LinkComp = ({ docLink }) => {
  return (
    <button
      type="button"
      className="btn-rounded btn btn-outline-dark"
      disabled={docLink && docLink.length > 0 ? false : true}
      onClick={e => {
        window.open(docLink, '_blank');
      }}
      id="buttonViewDocumentLink"
    >
      <i className="mdi mdi-link-variant label-icon"></i>
      <UncontrolledTooltip placement="top" target="buttonViewDocumentLink">
        Click to View Invoice
      </UncontrolledTooltip>
    </button>
  );
};

export const Status = cell => {
  return cell.value ? cell.value : '-';
};
