import React from 'react';
import { Spinner } from 'reactstrap';
//Common Used Utils

export const orgNameRegex = /^[a-zA-Z0-9_ -]{3,50}$/; // company or organization or registered name
export const pincodeRegex = /^[0-9]{6}$/; // PINCODE
export const phoneRegex = /^[1-9]\d{9}$/; // Assumes a 10-digit phone number
export const emailRegex = /^\S+@\S+\.\S+/; //Email Regex
export const usernameRegex = /^[a-zA-Z0-9_ -]{3,16}$/; //Username Regex
export const AMOUNT_REGEX =
  /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/; // Amount regex
export const panNumberRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/; //pan number Regex
export const gstInNumberRegex =
  /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/; //gst number Regex
export const invoiceNumberRegex = /^[a-zA-Z0-9]*$/; //invoice number or id Regex
export const otpRegex = /^[0-9]{6}$/; //otp Regex

export const parseSubdomain = url => {
  const subdomainRegex = /^(?:https?:\/\/)?([^\/]+)/i;
  const match = url.match(subdomainRegex);

  if (match && match[1]) {
    const subdomain = match[1].split('.')[0];
    return subdomain;
  }

  return null; // No subdomain found
};

export const getLocalStorageVariableName = () => {
  try {
    const currentUrl = window.location.href;
    return `${currentUrl}-authUser`;
  } catch (error) {
    console.log('Error Occured While Parsing the Name');
  }
};

export const getExpansionTableColoum = (fontsize = '16px') => {
  return {
    Header: '',
    id: 'expander',
    Cell: ({ row }) => (
      <span
        {...row.getToggleRowExpandedProps()}
        style={{ fontSize: `${fontsize}` }}
      >
        {row.isExpanded ? (
          <i className="fas fa-angle-up" />
        ) : (
          <i className="fas fa-angle-down" />
        )}
      </span>
    ),
  };
};

//LOADER TO DISPLAY BEFORE file UPLOAD
export const fileLoader = (
  loadMsg = 'Uploading...',
  style = { width: '1.2rem', height: '1.2rem' },
  className = 'd-flex justify-content-center'
) => {
  return (
    <div className={`${className}`}>
      <Spinner style={style} />
      <h5 className="mx-2">{loadMsg}</h5>
    </div>
  );
};

// Checking if user is GrowFi
export const IsUserGrowfi = (orgType, userType) => {
  try {
    if (orgType === 'admin' && userType === 'admin') {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

// checking if user has super admin permission (growfi) for the page
export const superAdminPermissionForPage = (
  oOperationType,
  userType,
  navigate,
  pathToNavigate
) => {
  IsUserGrowfi(oOperationType, userType) ? null : navigate(pathToNavigate);
};

export const truncateText = (text, maxLength) => {
  if (typeof text === 'string' && text?.length > maxLength) {
    const formattedText = text.slice(0, maxLength - 3);
    return formattedText + '...';
  }
  return text;
};

// checking if user has super admin permission (growfi) for the page
export const redirectToPage = (pathToNavigate, navigate, timeout = 1000) => {
  setTimeout(() => {
    navigate(pathToNavigate);
  }, timeout);
};
