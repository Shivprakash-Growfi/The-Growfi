import { del, get, post, put, postWithFormData } from './api_helper';
import * as url from './url_helper';
import axios from 'axios';
import { API_URL } from './api_helper';

// Gets the logged in user data from local session
const getLoggedInUser = () => {
  const user = localStorage.getItem('authUser');
  if (user) return JSON.parse(user);
  return null;
};

//is user is logged in
const isUserAuthenticated = () => {
  return getLoggedInUser() !== null;
};

const getAuthoritzationObject = access_token => {
  return {
    headers: { Authorization: `Bearer ${access_token}` },
  };
};

// Login Method
const getLoginUser = user => {
  let loginURL = `${url.GET_LOGIN}?email=${user.username}`;
  if (user.isPhoneNumber) {
    loginURL = `${url.GET_LOGIN}?phoneNumber=${user.username}`;
  }
  return get(loginURL, {});
};

const getLoginVerifyUser = data => {
  let loginVerifyURL = `${url.GET_LOGIN_VERIFY}`;
  return post(
    loginVerifyURL,
    { otp: data.otp },
    {
      headers: { Authorization: `Bearer ${data.access_token}` },
    }
  );
};

const reVerifyUser = data => {
  let reVerifyUserURL = `${url.GET_REVERIFY_USER}`;
  return get(reVerifyUserURL, getAuthoritzationObject(data.access_token));
};

// get Manufacturer Comapny Details/ Attributes
const getCompanyDetails = () => get(`${url.GET_COMPANY_ATTRIBUTES}`, {});

// get All users of a organization
export const getOrgUsers = data => {
  return get(
    `${url.GET_ALL_ORG_USERS}/${data.orgId}`,
    getAuthoritzationObject(data.access_token)
  );
};

// add user to a organization
export const addNewOrgUser = data =>
  post(
    url.ADD_NEW__ORG_USER,
    data.user,
    getAuthoritzationObject(data.access_token)
  );

// update organization user
export const updateOrgUserByAdmin = data =>
  post(
    url.UPDATE_ORG_USER_BY_ADMIN,
    data.user,
    getAuthoritzationObject(data.access_token)
  );

// delete user from organization
export const deleteOrgUser = data => {
  const user = getLoggedInUser();
  return post(
    `${url.DELETE_ORG_USER}/${data.user.id}/removeUser/${data.user.orgId}`,
    {},
    getAuthoritzationObject(user?.access_token)
  );
};

//get Compeny Info
export const getCompanyDetailsFromId = id => {
  const user = getLoggedInUser();

  return post(
    `${url.GET_COMPANY_DETAILS_ID}?orgId=${id}`,
    {},
    {
      headers: { Authorization: `Bearer ${user?.access_token}` },
    }
  );
};

// UPDATE ORGANIZATION
export const updateOrganization = (orgdata, id) => {
  const user = getLoggedInUser();

  return post(`${url.UPDATE_ORGANIZATION}${id}`, orgdata, {
    headers: { Authorization: `Bearer ${user?.access_token}` },
  });
};

// DELETE ORGANIZATION
export const deleteOrganization = id => {
  const user = getLoggedInUser();

  return post(
    `${url.DELETE_ORGANIZATION}${id}`,
    {},
    {
      headers: { Authorization: `Bearer ${user?.access_token}` },
    }
  );
};

// GET ALL SIGNED DOCS BY ORG ID
export const getAllSignedDocsByOrgId = orgId => {
  const user = getLoggedInUser();

  return post(
    `${url.SIGNED_DOCS_TABLE}`,
    {
      orgId: orgId,
    },
    {
      headers: { Authorization: `Bearer ${user?.access_token}` },
    }
  );
};

// GET ALL ORGANIZATIONS
export const getAllOrganizations = () => {
  const user = getLoggedInUser();

  return get(`${url.GET_ALL_ORGANIZATIONS}`, {
    headers: { Authorization: `Bearer ${user?.access_token}` },
  });
};

// GET ORGANIZATION BY ID
export const getOrganizationById = id => {
  const user = getLoggedInUser();

  return get(`${url.GET_ORGANIZATION_BY_ID}${id}`, {
    headers: { Authorization: `Bearer ${user?.access_token}` },
  });
};

// CREATE ORGANIZATION
export const createOrganization = orgdata => {
  const user = getLoggedInUser();

  return post(`${url.CREATE_ORGANIZATION}`, orgdata, {
    headers: { Authorization: `Bearer ${user?.access_token}` },
  });
};

// GET CITY DATA
export const getCityData = () => {
  const user = getLoggedInUser();

  return get(`${url.GET_CITY}`, {
    headers: { Authorization: `Bearer ${user?.access_token}` },
  });
};

// GET STATE DATA
export const getStateData = () => {
  const user = getLoggedInUser();

  return get(`${url.GET_STATE}`, {
    headers: { Authorization: `Bearer ${user?.access_token}` },
  });
};

// ALL DOCUMENTS UPLOAD
export const allDocsUpload = (
  filename,
  orgId = null,
  uploadType = 'others'
) => {
  const user = getLoggedInUser();
  const str = orgId ? `&orgId=${orgId}` : ``;
  return get(
    `${url.ALL_DOCS_UPLOAD}?filename=${filename}${str}&uploadType=${uploadType}`,
    {
      headers: { Authorization: `Bearer ${user?.access_token}` },
    }
  );
};

// DOCUMENT UPLOAD
export const docUpload = filename => {
  const user = getLoggedInUser();

  return get(`${url.DOC_UPLOAD}?filename=${filename}`, {
    headers: { Authorization: `Bearer ${user?.access_token}` },
  });
};

// DOCUMENT UPLOAD TO S3 BUCKET
export const docUploadToS3Bucket = async (urlToUpload, file) => {
  try {
    const result = await axios.put(
      urlToUpload,
      file /*{
      headers: {
        Authorization: `Bearer ${user?.access_token}`,
        ContentType: 'image/jpeg',
      },
    }*/
    );
    return result;
  } catch (error) {
    throw error;
  }
};

export const getPresignedDownloadUrl = filename => {
  const user = getLoggedInUser();
  let fileField = '';
  if (filename.length > 1) {
    fileField = `?filename=${filename}`;
  }

  return get(`${url.GET_PRESIGNED_DOWNLOAD_URL}${fileField}`, {
    headers: { Authorization: `Bearer ${user?.access_token}` },
  });
};

//ORGANIZATION TYPE
export const organizationType = () => {
  const user = getLoggedInUser();

  return get(`${url.ORGANIZATION_TYPE}`, {
    headers: { Authorization: `Bearer ${user?.access_token}` },
  });
};

//ORGANIZATION OPERATION TYPE
export const organizationOperationType = (type = '0') => {
  const user = getLoggedInUser();

  return get(`${url.ORGANIZATION_OPERATION_TYPE}/${type}`, {
    headers: { Authorization: `Bearer ${user?.access_token}` },
  });
};

// CREATE SALES CHANNEL
export const createSalesChannel = (channelName, id) => {
  const user = getLoggedInUser();

  return post(
    `${url.CREATE_SALES_CHANNEL}?orgId=${id}&channelidentifer=${channelName}`,
    {},
    {
      headers: { Authorization: `Bearer ${user?.access_token}` },
    }
  );
};

// ADD SALES CHANNEL
export const addSalesChannel = channelData => {
  const user = getLoggedInUser();

  return post(`${url.ADD_SALES_CHANNEL}`, channelData, {
    headers: { Authorization: `Bearer ${user?.access_token}` },
  });
};

export const getOrgDeatailsByPan = pan => {
  const user = getLoggedInUser();

  return post(
    `${url.GET_ORG_DETAILS_BY_PAN}?panId=${pan}`,
    {},
    {
      headers: { Authorization: `Bearer ${user?.access_token}` },
    }
  );
};

export const addOrgToSalesChannel = (channelData = {}) => {
  const user = getLoggedInUser();

  return post(`${url.ADD_ORG_TO_SALES_CHANNEL}`, channelData, {
    headers: { Authorization: `Bearer ${user?.access_token}` },
  });
};

export const deleteSalesChannel = (channelId = 0) => {
  const user = getLoggedInUser();

  const channelUrl = channelId >= 0 ? `/${channelId}` : ``;
  return post(
    `${url.DELETE_SALES_CHANNEL}${channelUrl}`,
    {},
    {
      headers: { Authorization: `Bearer ${user?.access_token}` },
    }
  );
};

// GET SALES BY ORG ID AND MANUFACTURER ID
export const getSalesChannelByOrgId = orgId => {
  const user = getLoggedInUser();

  return post(
    `${url.GET_SALES_CHANNEL_BY_ORG_ID}?orgId=${orgId}`,
    {},
    {
      headers: { Authorization: `Bearer ${user?.access_token}` },
    }
  );
};
// GET CHILD CHANNELS
export const getChildChannels = id => {
  const user = getLoggedInUser();

  return post(
    `${url.GET_CHILD_SALES_CHANNEL}/${id}`,
    {},
    {
      headers: { Authorization: `Bearer ${user?.access_token}` },
    }
  );
};

// CREATE CHALLAN
export const createChallan = (
  childSaleschannelId,
  currentOrgId,
  totalPrice,
  invoiceNumber,
  docLink,
  fileName
) => {
  const user = getLoggedInUser();

  return post(
    `${url.CREATE_CHALLAN}`,
    {
      childSaleschannelId: childSaleschannelId,
      currentOrgId: currentOrgId,
      totalPrice: totalPrice,
      invoiceNumber: invoiceNumber,
      docLink: docLink,
      fileName: fileName,
    },
    {
      headers: { Authorization: `Bearer ${user?.access_token}` },
    }
  );
};

// UPDATE CHANNEL STATUS

export const updateChannelStatue = (channelId, status) => {
  const user = getLoggedInUser();

  return post(
    `${url.UPDATE_CHANNEL_STATUS}?salesChannelId=${channelId}&flag=${status}`,
    {},
    {
      headers: { Authorization: `Bearer ${user?.access_token}` },
    }
  );
};

//SEND OTP TO ALL ADMINS
export const sendOtpToAllAdmins = (orgId, method) => {
  const user = getLoggedInUser();

  return post(
    `${url.SEND_OTP_TO_ADMINS}`,
    {
      orgId: orgId,
      method: method,
    },
    {
      headers: { Authorization: `Bearer ${user?.access_token}` },
    }
  );
};

// Kyc verification
//https://api.thegrowfi.com/api/kyc/pan?orgId=1&Id_no=0650146
export const verifyPan = (id, num) => {
  const user = getLoggedInUser();

  return post(
    `${url.VERIFY_PAN}?orgId=${id}&Id_no=${num}`,
    {},
    {
      headers: { Authorization: `Bearer ${user?.access_token}` },
    }
  );
};
export const verifyGst = (id, num) => {
  const user = getLoggedInUser();

  return post(
    `${url.VERIFY_GST}?orgId=${id}&Id_no=${num}`,
    {},
    {
      headers: { Authorization: `Bearer ${user?.access_token}` },
    }
  );
};
export const verifyAadhar = (id, num) => {
  const user = getLoggedInUser();

  return post(
    `${url.VERIFY_AADHAR}?orgId=${id}&Id_no=${num}`,
    {},
    {
      headers: { Authorization: `Bearer ${user?.access_token}` },
    }
  );
};

export const updateOrgNameKyc = (orgId, name = '', type = '') => {
  const user = getLoggedInUser();

  return post(
    `${url.UPDATE_ORG_NAME}`,
    {
      name: name,
      orgId: orgId,
      type: type,
    },
    {
      headers: { Authorization: `Bearer ${user?.access_token}` },
    }
  );
};

export const deleteOrgFinanceDocs = docId => {
  const user = getLoggedInUser();

  return post(
    `${url.DELETE_ORG_FINANCE_DOCS}`,
    {
      docId: docId,
    },
    {
      headers: { Authorization: `Bearer ${user?.access_token}` },
    }
  );
};

//Bank Verification
//https://api.thegrowfi.com/api/kyc/bankAccount?orgId=1&acc_no=2341312&ifsc=12312312

export const verifyBankDetails = (id, acc, ifsc) => {
  const user = getLoggedInUser();

  return post(
    `${url.VERIFY_BANK_DETAILS}?orgId=${id}&acc_no=${acc}&ifsc=${ifsc}`,
    {},
    {
      headers: { Authorization: `Bearer ${user?.access_token}` },
    }
  );
};

//save pan/gst files
// GET PF ASSETS STATUS
export const savePanGstDetails = (orgId, docType, filename, fileLink) => {
  const user = getLoggedInUser();
  return post(
    `${url.SAVE_PAN_GST_FILE}`,
    {
      orgId: orgId,
      docType: docType,
      filename: filename,
      docLink: fileLink,
    },
    {
      headers: { Authorization: `Bearer ${user?.access_token}` },
    }
  );
};

// get Permissions for all type of users

export const getPermissionsForAllUserType = id => {
  const user = getLoggedInUser();
  return get(`${url.GET_PERMISSIONS_ALL_USERS_TYPE}/${id}`, {
    headers: { Authorization: `Bearer ${user?.access_token}` },
  });
};

// set Permissions for single type of users
export const setPermissionsForSingleUserType = (id, type, permissions = []) => {
  const user = getLoggedInUser();
  return post(
    `${url.SET_PERMISSIONS_SINGLE_USER_TYPE}`,
    {
      orgId: id,
      userType: type,
      permission: permissions,
    },
    {
      headers: { Authorization: `Bearer ${user?.access_token}` },
    }
  );
};

//GET ALL P2B ASSETS
export const getAllP2BAssets = id => {
  const user = getLoggedInUser();
  return post(
    `${url.GET_ALL_P2B_ASSETS}`,
    { orgId: id },
    {
      headers: { Authorization: `Bearer ${user?.access_token}` },
    }
  );
};

// DELETE P2B ASSETS
export const deleteAssets = id => {
  const user = getLoggedInUser();
  return post(
    `${url.DELETE_P2B_ASSET}`,
    { p2bAssetsId: id },
    {
      headers: { Authorization: `Bearer ${user?.access_token}` },
    }
  );
};

// UPDATE P2B ASSETS
export const updateAssets = (
  p2BAssetId,
  newStatus,
  leafRoundId,
  listedAmount,
  approvedAmount,
  idAmountArrayForPaid,
  idAmountArrayPaidBack
) => {
  const user = getLoggedInUser();
  const requestBody = {
    P2BAssetsId: p2BAssetId,
    newStatus: newStatus,
    listed:
      (leafRoundId &&
        listedAmount && {
          leafRoundId: leafRoundId,
          amount: listedAmount,
        }) ||
      {},
    approved: approvedAmount !== '' ? { amount: approvedAmount } : {},
    paid: idAmountArrayForPaid || [],
    paidBack: idAmountArrayPaidBack || [],
  };
  return post(`${url.UPDATE_P2B_ASSET}`, requestBody, {
    headers: { Authorization: `Bearer ${user?.access_token}` },
  });
};

// GET P2B ASSETS STATUS
export const getP2BAssetStatus = p2BAssetId => {
  const user = getLoggedInUser();
  return get(`${url.GET_P2B_ASSET_STATUS}/${p2BAssetId}`, {
    headers: { Authorization: `Bearer ${user?.access_token}` },
  });
};

//GET ALL P2B ASSET CHALLANS
export const getAllChallansForP2B = ids => {
  const user = getLoggedInUser();
  return post(
    `${url.GET_ALL_CHALLANS_DATA_P2B}`,
    { challanId: ids },
    {
      headers: { Authorization: `Bearer ${user?.access_token}` },
    }
  );
};

//GET ALL PF ASSET INVOICES
export const getAllInvoicesForPF = ids => {
  const user = getLoggedInUser();
  return post(
    `${url.GET_ALL_INVOICES_DATA_PF}`,
    { invoiceId: ids },
    {
      headers: { Authorization: `Bearer ${user?.access_token}` },
    }
  );
};

//GET ALL PF ASSETS
export const getAllPFAssets = id => {
  const user = getLoggedInUser();
  return post(
    `${url.GET_ALL_PF_ASSETS}`,
    { orgId: id },
    {
      headers: { Authorization: `Bearer ${user?.access_token}` },
    }
  );
};

// DELETE PF ASSETS
export const deletePFAssets = id => {
  const user = getLoggedInUser();
  return post(
    `${url.DELETE_PF_ASSET}`,
    { pfId: id },
    {
      headers: { Authorization: `Bearer ${user?.access_token}` },
    }
  );
};

// UPDATE PF ASSETS
export const updatePFAssets = (pfId, newStatus, amount, paid, paidBack) => {
  const user = getLoggedInUser();
  const requestBody = {
    PFAssetId: pfId,
    newStatus: newStatus,
    approved: amount !== '' ? { amount: amount } : {},
    paid: paid,
    paidBack: paidBack,
  };
  return post(`${url.UPDATE_PF_ASSET}`, requestBody, {
    headers: { Authorization: `Bearer ${user?.access_token}` },
  });
};

// GET PF ASSETS STATUS
export const getPFAssetStatus = pfId => {
  const user = getLoggedInUser();
  return get(`${url.GET_PF_ASSET_STATUS}/${pfId}`, {
    headers: { Authorization: `Bearer ${user?.access_token}` },
  });
};

// Get all challan from organization according to
export const getAllChallans = (orgId, statusArray, retailerOrgId) => {
  const user = getLoggedInUser();
  return post(
    `${url.GET_ALL_INVOICES}`,
    {
      orgId: orgId,
      status: statusArray,
      retailerOrgId: retailerOrgId ? retailerOrgId : undefined,
    },
    getAuthoritzationObject(user?.access_token)
  );
};
// Redeem Invoices and P2B Assest create
export const redeemInvoices = (
  orgId,
  challanList,
  dueDuration,
  otp,
  lenderId,
  productId
) => {
  const user = getLoggedInUser();
  return post(
    `${url.REDEEM_INVOICES}`,
    {
      orgId: orgId,
      challanList: challanList,
      dueDuration: dueDuration,
      otp: otp,
      lenderId: lenderId,
      productId: productId,
    },
    getAuthoritzationObject(user?.access_token)
  );
};

//Delete Pending Challan/Invoices
export const deletePendingInvoices = challanId => {
  const user = getLoggedInUser();
  return post(
    `${url.DELETE_PENDING_INVOICES}`,
    { challanId: challanId },
    getAuthoritzationObject(user?.access_token)
  );
};

// GET Retailer list for the org id
export const getRetailerList = orgId => {
  const user = getLoggedInUser();

  return post(
    `${url.GET_ALL_RETAILER_LIST}`,
    { orgId: orgId },
    {
      headers: { Authorization: `Bearer ${user?.access_token}` },
    }
  );
};

// GET Lender list
export const getLenderList = (orgId, method) => {
  const user = getLoggedInUser();

  return post(
    `${url.GET_LENDER_LIST_BY_ORG_ID}`,
    {
      orgId: orgId,
      method: method,
    },
    {
      headers: { Authorization: `Bearer ${user?.access_token}` },
    }
  );
};

// GET product list
export const getProductList = (orgId, lenderId, method) => {
  const user = getLoggedInUser();

  return post(
    `${url.GET_PRODUCT_LIST_BY_ORGID_LENDER_ID_ASSETTYPE}`,
    {
      orgId: orgId,
      lenderId: lenderId,
      method: method,
    },
    {
      headers: { Authorization: `Bearer ${user?.access_token}` },
    }
  );
};

// Redeem Invoices and P2B Assest create
export const createEnach = (
  assetId,
  assetType,
  digioId,
  isRecuring,
  frequency,
  firstCollectionDate,
  finalCollectionDate,
  comment,
  customerIdentifier
) => {
  const user = getLoggedInUser();
  return post(
    `${url.CREATE_ENACH}`,
    {
      assetId: assetId,
      assetType: assetType,
      comment: comment,
      digioId: digioId,
      firstCollectionDate: firstCollectionDate,
      finalCollectionDate: finalCollectionDate,
      isRecuring: isRecuring,
      frequency: frequency,
      customerIdentifier: customerIdentifier,
    },
    getAuthoritzationObject(user?.access_token)
  );
};

//Get Upper level dashboard data
export const getDashboardData = orgID => {
  const user = getLoggedInUser();
  return post(
    `${url.GET_DASHBOARD_DATA}`,
    { orgId: orgID },
    getAuthoritzationObject(user?.access_token)
  );
};

export const getDashboardFinanceStatusData = (orgID, assetType) => {
  const user = getLoggedInUser();
  return post(
    `${url.GET_DASHBOARD_FINANCE_STATUS_DATA}`,
    { orgId: orgID, assetType: assetType },
    getAuthoritzationObject(user?.access_token)
  );
};

export const getDashboardFinanceRepaymentData = (orgID, assetType) => {
  const user = getLoggedInUser();
  return post(
    `${url.GET_DASHBOARD_FINANCE_REPAYMENT_DATA}`,
    { orgId: orgID, assetType: assetType },
    getAuthoritzationObject(user?.access_token)
  );
};

export const getDashboardRetailerData = orgID => {
  const user = getLoggedInUser();
  return post(
    `${url.GET_DASHBOARD_RETAILER_DATA}`,
    { orgId: orgID },
    getAuthoritzationObject(user?.access_token)
  );
};

export const getP2BAssetsForDashboard = (id, status, assetType) => {
  const user = getLoggedInUser();
  return post(
    `${url.GET_DASHBOARD_FINANCE_ASSETS}`,
    {
      orgId: id,
      assetStatus: [status],
      assetType: assetType,
    },
    getAuthoritzationObject(user?.access_token)
  );
};
export const getDueAmountForDashboard = (id, status, assetType) => {
  const user = getLoggedInUser();
  return post(
    `${url.GET_DASHBOARD_DUE_AMOUNT}`,
    {
      orgId: id,
      duePeriod: [status],
      assetType: assetType,
    },
    getAuthoritzationObject(user?.access_token)
  );
};

export const getLimitAvailableForDashboard = (id, assetType) => {
  const user = getLoggedInUser();
  return post(
    `${url.GET_DASHBOARD_LIMIT_AVAILABLE}`,
    {
      orgId: id,
      assetType: assetType,
    },
    getAuthoritzationObject(user?.access_token)
  );
};

export const getPendingSignedDocuments = (id, userId) => {
  const user = getLoggedInUser();
  return post(
    `${url.GET_DASHBOARD_PENDING_SIGNED_DOCUMENTS}`,
    {
      orgId: id,
      userId: userId,
    },
    getAuthoritzationObject(user?.access_token)
  );
};

export const getOrganizationDirectors = id => {
  const user = getLoggedInUser();
  return post(
    `${url.GET_ORG_DIRECTORS}`,
    {
      orgId: id,
    },
    getAuthoritzationObject(user?.access_token)
  );
};

export const verifyDirectorDIN = (orgId, DIN, directorName) => {
  const user = getLoggedInUser();
  return post(
    `${url.VERIFY_DIN}?orgId=${orgId}&Id_no=${DIN}&name=${directorName}`,
    {},
    getAuthoritzationObject(user?.access_token)
  );
};

export const verifyDirectorPAN = (orgId, panId, dinId, directorName) => {
  const dinAvail = dinId.length > 1 ? `&DIN=${dinId}` : '';
  const user = getLoggedInUser();
  return post(
    `${url.VERIFY_DIRECTOR_PAN}?orgId=${orgId}&id_no=${panId}${dinAvail}&name=${directorName}`,
    {},
    getAuthoritzationObject(user?.access_token)
  );
};

export const deleteOrgDirector = (orgId, pan, dinId = '') => {
  const user = getLoggedInUser();
  return post(
    `${url.DELETE_ORG_DIRECTORS}`,
    {
      orgId: orgId,
      din: `${dinId}`,
      pan: `${pan}`,
    },
    getAuthoritzationObject(user?.access_token)
  );
};

export const getOrganizationFinancialDetails = id => {
  const user = getLoggedInUser();
  return post(
    `${url.GET_ORG_FINANCIAL_DETAILS}`,
    {
      orgId: id,
    },
    getAuthoritzationObject(user?.access_token)
  );
};

export const saveOrganizationFinancialDetails = (
  id,
  balanceSheet = [],
  gstReturn = [],
  bankStatement = '',
  companyInformation = {},
  itr = {}
) => {
  const user = getLoggedInUser();
  return post(
    `${url.ADD_ORG_FINANCIAL_DETAILS}`,
    {
      orgId: id,
      balanceSheet: balanceSheet,
      gstReturn: gstReturn,
      bankStatement: bankStatement,
      companyInformation: companyInformation,
      ITR: itr,
    },
    getAuthoritzationObject(user?.access_token)
  );
};

// Lender management Calls

export const getAllLenders = () => {
  const user = getLoggedInUser();
  return post(
    `${url.GET_ALL_LENDERS}`,
    {},
    getAuthoritzationObject(user?.access_token)
  );
};

export const addProductToLender = (prodData = {}) => {
  const user = getLoggedInUser();
  return post(
    `${url.ADD_LENDER_PRODUCT}`,
    prodData,
    getAuthoritzationObject(user?.access_token)
  );
};

export const getLenderProductList = lenderId => {
  const user = getLoggedInUser();
  return post(
    `${url.GET_LENDER_PRODUCTLIST}`,
    {
      lenderId: lenderId,
    },
    getAuthoritzationObject(user?.access_token)
  );
};

export const deleteLenderProductById = productId => {
  const user = getLoggedInUser();
  return post(
    `${url.DELETE_LENDER_PRODUCT_BY_ID}`,
    {
      productId: productId,
    },
    getAuthoritzationObject(user?.access_token)
  );
};

export const editLenderProduct = (prodData = {}) => {
  const user = getLoggedInUser();
  return post(
    `${url.EDIT_LENDER_PRODUCT}`,
    prodData,
    getAuthoritzationObject(user?.access_token)
  );
};

export const getAllOrgWithProductMapping = () => {
  const user = getLoggedInUser();
  return post(
    `${url.GET_ORG_WITH_PRODUCT_MAPPING}`,
    {},
    getAuthoritzationObject(user?.access_token)
  );
};

export const getOrganizationsByPrefix = (prefix = '') => {
  const user = getLoggedInUser();
  return post(
    `${url.GET_ORG_BY_PREFIX}/${prefix}`,
    {},
    getAuthoritzationObject(user?.access_token)
  );
};

export const createOrganizationAndProductMapping = (mappingData = {}) => {
  const user = getLoggedInUser();
  return post(
    `${url.CREATE_ORG_PRODUCT_MAPPING}`,
    mappingData,
    getAuthoritzationObject(user?.access_token)
  );
};

export const getProductMappingByOrgId = orgId => {
  const user = getLoggedInUser();
  return post(
    `${url.GET_ALL_PRODUCT_MAPPING_BY_ORGID}`,
    {
      orgId: orgId,
    },
    getAuthoritzationObject(user?.access_token)
  );
};
export const editProductMapping = (mappingId = 0, amountCommited = 0) => {
  const user = getLoggedInUser();
  return post(
    `${url.EDIT_PRODUCT_MAPPING}`,
    {
      mappingId: mappingId,
      amountCommited: amountCommited,
    },
    getAuthoritzationObject(user?.access_token)
  );
};

export const deleteOrgProductMapping = (mappingId = 0) => {
  const user = getLoggedInUser();
  return post(
    `${url.DELETE_ORG_PRODUCT_MAPPING}`,
    {
      mappingId: mappingId,
    },
    getAuthoritzationObject(user?.access_token)
  );
};

export const getAllDistInvoices = id => {
  const user = getLoggedInUser();
  return post(
    `${url.GET_ALL_DISTRIBUTOR_INVOICES}`,
    {
      orgId: id,
    },
    getAuthoritzationObject(user?.access_token)
  );
};

export const addDistInvoices = requestBody => {
  const user = getLoggedInUser();
  return post(
    `${url.ADD_DISTRIBUTOR_INVOICES}`,
    requestBody,
    getAuthoritzationObject(user?.access_token)
  );
};

export const redeemDistInvoices = (
  orgId,
  challanList,
  dueDuration,
  otp,
  lenderId,
  productId
) => {
  const user = getLoggedInUser();
  return post(
    `${url.REDEEM_DISTRIBUTOR_INVOICES}`,
    {
      orgId: orgId,
      invoicesList: challanList,
      dueDuration: dueDuration,
      otp: otp,
      productId: productId,
      lenderId: lenderId,
    },
    getAuthoritzationObject(user?.access_token)
  );
};

export const deleteDistInvoices = id => {
  const user = getLoggedInUser();
  return post(
    `${url.DELETE_DISTRIBUTOR_INVOICES}?id=${id}`,
    {
      invoiceId: id,
    },
    getAuthoritzationObject(user?.access_token)
  );
};

//CREATE BNPL INVOICES
export const createBnplInvoice = (byOrgId, mid, amount, invoiceId) => {
  const user = getLoggedInUser();
  return post(
    `${url.CREATE_BNPL_INVOICE}`,
    {
      byOrganizationId: byOrgId,
      mid: mid,
      amount: amount,
      invoiceId: invoiceId,
    },
    getAuthoritzationObject(user?.access_token)
  );
};

// otp verification for bnpl
export const verifyOtpForBnpl = data => {
  const user = getLoggedInUser();
  return post(
    `${url.VERIFY_OTP_FOR_BNPL}`,
    data,
    getAuthoritzationObject(user?.access_token)
  );
};

export const getAllDocumentsOfOrganization = orgId => {
  const user = getLoggedInUser();
  return post(
    `${url.GET_ALL_DOCUMENTS_OF_ORGANIZATION}`,
    {
      orgId: orgId,
    },
    getAuthoritzationObject(user?.access_token)
  );
};

export const addDocumentToOrgnization = (orgId, agreementName, formData) => {
  const user = getLoggedInUser();
  console.log('Console before thi', orgId, agreementName, formData);
  return postWithFormData(
    `${url.Add_DOCUMENT_TO_ORGANIZATION}?orgId=${orgId}&agreementName=${agreementName}`,
    formData,
    getAuthoritzationObject(user?.access_token)
  );
};

export const getProductDataByProductId = productId => {
  const user = getLoggedInUser();
  return post(
    `${url.GET_PRODUCT_DATA_BY_PRODUCT_ID}/${productId}`,
    {},
    getAuthoritzationObject(user?.access_token)
  );
};

// get all canceled cheques
export const getAllCanceledChequesDataByOrgId = orgId => {
  const user = getLoggedInUser();
  return post(
    `${url.GET_ALL_CHEQUE_BY_ORGID}/${orgId}`,
    {},
    {
      headers: { Authorization: `Bearer ${user?.access_token}` },
    }
  );
};

// get all products offered to an org
export const getAllProductsDataByOrgId = orgId => {
  const user = getLoggedInUser();
  return post(
    `${url.GET_ALL_PRODUCT_BY_ORGID}`,
    { orgId: orgId },
    {
      headers: { Authorization: `Bearer ${user?.access_token}` },
    }
  );
};

// add canceled cheque
export const addCanceledCheque = (
  orgId,
  productId,
  chequeAmount,
  chequeNumber,
  fileName,
  fileLink
) => {
  const user = getLoggedInUser();
  return post(
    `${url.ADD_CHEQUE_BY_ORGID}`,
    {
      orgId: orgId,
      productId: productId,
      chequeAmount: chequeAmount,
      chequeNumber: chequeNumber,
      chequefileName: fileName,
      chequeDocLink: fileLink,
    },
    {
      headers: { Authorization: `Bearer ${user?.access_token}` },
    }
  );
};

//GET E SIGNED DOCS BY DIGIO ID
export const getEsignedDocsByDigioId = digioId => {
  const eSignedDocLink = `${API_URL}${url.VIEW_SIGNED_DOCUMENT_URL}?digioId=${digioId}`;
  return eSignedDocLink;
};

//GET ALL BNPL assets and their invoice data
export const getAllBnplAssets = id => {
  const user = getLoggedInUser();
  return post(
    `${url.GET_ALL_BNPL_ASSETS}`,
    { orgId: id },
    {
      headers: { Authorization: `Bearer ${user?.access_token}` },
    }
  );
};
// UPDATE Bnpl ASSETS
export const updateBnplAssets = (pfId, newStatus, amount, paid, paidBack) => {
  const user = getLoggedInUser();
  const requestBody = {
    PFAssetId: pfId,
    newStatus: newStatus,
    approved: amount !== '' ? { amount: amount } : {},
    paid: paid,
    paidBack: paidBack,
  };
  return post(`${url.UPDATE_BNPL_ASSET}`, requestBody, {
    headers: { Authorization: `Bearer ${user?.access_token}` },
  });
};
// GET Bnpl ASSETS STATUS
export const getBnplAssetStatus = bnplId => {
  const user = getLoggedInUser();
  return post(
    `${url.GET_BNPL_ASSET_STATUS}${bnplId}`,
    {},
    {
      headers: { Authorization: `Bearer ${user?.access_token}` },
    }
  );
};

//BNPL
export const getAllBnplOrders = orgId => {
  const user = getLoggedInUser();
  return post(
    `${url.GET_ALL_BNPL_ORDERS}`,
    { orgId: orgId },
    {
      headers: { Authorization: `Bearer ${user?.access_token}` },
    }
  );
};

export const changeBnplInvoiceStatus = invoiceData => {
  const user = getLoggedInUser();
  return post(
    `${url.CHANGE_INVOICE_STATUS}`,
    { invoiceData },
    {
      headers: { Authorization: `Bearer ${user?.access_token}` },
    }
  );
};

//--------------------------------------OLD TO BE DELETED--------------------------------------

const postFakeProfile = data => post(url.POST_EDIT_PROFILE, data);

export const getUserProfile = () => get(url.GET_ALL_ORG_USERS);

// get dashboard charts data
export const getWeeklyData = () => get(url.GET_WEEKLY_DATA);
export const getYearlyData = () => get(url.GET_YEARLY_DATA);
export const getMonthlyData = () => get(url.GET_MONTHLY_DATA);

export const walletBalanceData = month =>
  get(`${url.GET_WALLET_DATA}/${month}`, { params: { month } });

export const getStatisticData = duration =>
  get(`${url.GET_STATISTICS_DATA}/${duration}`, { params: { duration } });

export const visitorData = duration =>
  get(`${url.GET_VISITOR_DATA}/${duration}`, { params: { duration } });

export const topSellingData = month =>
  get(`${url.TOP_SELLING_DATA}/${month}`, { params: { month } });

export const getEarningChartsData = month =>
  get(`${url.GET_EARNING_DATA}/${month}`, { params: { month } });

export {
  getLoggedInUser,
  getCompanyDetails,
  reVerifyUser,
  isUserAuthenticated,
  getLoginUser,
  getLoginVerifyUser,
  postFakeProfile,
};
