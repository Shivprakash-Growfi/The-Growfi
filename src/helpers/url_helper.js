//MANAGE ORGANIZATIONS
export const GET_ALL_ORGANIZATIONS = '/api/organization';
export const CREATE_ORGANIZATION = '/api/organization/create';
export const DELETE_ORGANIZATION = 'api/organization/delete/';
export const UPDATE_ORGANIZATION = '/api/organization/update/';
export const GET_ORGANIZATION_BY_ID = '/api/organization/';

//otp api
export const SEND_OTP_TO_ADMINS = '/api/util/sendOtpToAllAdmins';

//BNPL api's
export const CREATE_BNPL_INVOICE = 'api/bnpl/createInvoice';
export const VERIFY_OTP_FOR_BNPL = 'api/bnpl/verifyOtpForBnpl';

//BNPL FINANCE API's
export const GET_ALL_BNPL_ASSETS = 'api/bnpl/getBnplAssets';
export const DELETE_BNPL_ASSET = '/api/purchaseFinance/cancelPF';
export const UPDATE_BNPL_ASSET = '/api/purchaseFinance/updatePFAsset';
export const GET_BNPL_ASSET_STATUS = '/api/bnpl/getbnplStatusLog?bnplId=';

//CITY AND STATE API
export const GET_CITY = '/api/util/allCities';
export const GET_STATE = '/api/util/allStates';

//DOCUMENT UPLOAD API
export const ALL_DOCS_UPLOAD = '/api/util/presignedurl/alldocs';
export const DOC_UPLOAD = '/api/util/presignedurl';

//ORGANIZATION TYPES
export const ORGANIZATION_TYPE = '/api/util/organizationOwnershipType';
export const ORGANIZATION_OPERATION_TYPE =
  '/api/util/organizationOperationType';

//COMPANY DETAILS
export const GET_COMPANY_ATTRIBUTES = '/getLoginScreenDetails';
export const GET_COMPANY_DETAILS_ID = '/api/organization/getKycDetails';

//LOGIN
export const GET_LOGIN = '/api/user/login';
export const GET_LOGIN_VERIFY = '/api/user/verifyOTP';
export const GET_REVERIFY_USER = '/api/user';
export const SOCIAL_LOGIN = '/social-login';

//P2B ASSETS
export const GET_ALL_P2B_ASSETS = '/api/P2BAssets/getAllP2BAssets';
export const DELETE_P2B_ASSET = '/api/P2BAssets/cancelAssets';
export const UPDATE_P2B_ASSET = '/api/P2BAssets/updateAssets';
export const GET_P2B_ASSET_STATUS = '/api/P2BAssets/getP2BAssetStatusLog';

//Get all P2B ASSET CHALLANS
export const GET_ALL_CHALLANS_DATA_P2B = '/api/challan/getAllChallansdata';

//Get all signed docs by org id
export const SIGNED_DOCS_TABLE = '/api/kyc/getAllSignedDocumentsofOrganization';

//Get all PF ASSET INVOICES
export const GET_ALL_INVOICES_DATA_PF = '/api/invoice/getAllInvoicesdata';

//PROFILE
export const POST_EDIT_JWT_PROFILE = '/post-jwt-profile';
export const POST_EDIT_PROFILE = '/post-fake-profile';

//ORGANIZATION USER
export const GET_ALL_ORG_USERS = '/api/organization/getAllUsersOfOrganization';
export const ADD_NEW__ORG_USER = '/api/user/addUserToOrganization';
export const UPDATE_ORG_USER_BY_ADMIN = '/api/user/updateUserByAdmin';
export const DELETE_ORG_USER = '/api/user';

//KYC
export const VERIFY_PAN = '/api/kyc/pan';
export const VERIFY_DIN = '/api/kyc/din';
export const VERIFY_GST = '/api/kyc/gst';
export const VERIFY_AADHAR = '/api/kyc/udyog_aadhar';
export const VERIFY_BANK_DETAILS = '/api/kyc/bankAccount';
export const VERIFY_DIRECTOR_PAN = '/api/kyc/directorsPAN';
export const UPDATE_ORG_NAME = '/api/organization/updateOrgName';
export const DELETE_ORG_FINANCE_DOCS =
  '/api/organization/deleteOrgFinancialDetails';
export const SAVE_PAN_GST_FILE = 'api/kyc/saveDocImage';

//PERMISSIONS

export const GET_PERMISSIONS_ALL_USERS_TYPE =
  '/api/permission/getOrgPermissions';
export const SET_PERMISSIONS_SINGLE_USER_TYPE =
  '/api/permission/setOrgPermission';

//INVOICES
export const GET_ALL_INVOICES = '/api/challan/getChallan';
export const DELETE_PENDING_INVOICES = '/api/challan/deletePendingChallan';
export const REDEEM_INVOICES = '/api/P2BAssets/getPayment';
export const GET_ALL_RETAILER_LIST =
  '/api/organization/getAllRetailersofDistributor';

//Distributor INVOICES
export const GET_ALL_DISTRIBUTOR_INVOICES =
  '/api/invoice/getChallanForDistributorForPFAssetDTO';
export const ADD_DISTRIBUTOR_INVOICES =
  '/api/invoice/createInvoiceForDistributor';
export const DELETE_DISTRIBUTOR_INVOICES = '/api/invoice/deleteInvoice';
export const REDEEM_DISTRIBUTOR_INVOICES = '/api/purchaseFinance/getLoanForPF';

//Cheque Api's
export const GET_ALL_PRODUCT_BY_ORGID =
  '/api/lender/getAllProductMappingOfAnOrganization';
export const GET_ALL_CHEQUE_BY_ORGID = '/api/kyc/getAllCheque';
export const ADD_CHEQUE_BY_ORGID = '/api/kyc/uploadCheque';

//PURCHASE FINANCE API's
export const GET_ALL_PF_ASSETS = '/api/purchaseFinance/getAllPF';
export const DELETE_PF_ASSET = '/api/purchaseFinance/cancelPF';
export const UPDATE_PF_ASSET = '/api/purchaseFinance/updatePFAsset';
export const GET_PF_ASSET_STATUS = '/api/purchaseFinance/getPFStatusLog';

//get product data by product id
export const GET_PRODUCT_DATA_BY_PRODUCT_ID = '/api/lender/getProduct';

//LENDER LIST AND PRODUCT LIST
export const GET_LENDER_LIST_BY_ORG_ID =
  '/api/lender/getAllLenderOfAnOrganization';
export const GET_PRODUCT_LIST_BY_ORGID_LENDER_ID_ASSETTYPE =
  '/api/lender/getAllProductOfLenderOfferedToAnOrg';

//create enach
export const CREATE_ENACH = '/api/kyc/createENACH';

//DASHBOARD
export const GET_DASHBOARD_DATA = '/api/P2BAssets/getDashboardData';
export const GET_DASHBOARD_FINANCE_STATUS_DATA =
  '/api/P2BAssets/getDashboardFinanceStatusData';
export const GET_DASHBOARD_RETAILER_DATA =
  '/api/P2BAssets/getDashboardRetailersData';

export const GET_DASHBOARD_FINANCE_REPAYMENT_DATA =
  '/api/P2BAssets/getDashboardFinanceRepaymentData';
//used for overdue,oneweek,twoweek,alltimedue ------Repayment Status
export const GET_DASHBOARD_DUE_AMOUNT = '/api/P2BAssets/dueAmount';
//used for limit available -- finance status
export const GET_DASHBOARD_LIMIT_AVAILABLE = '/api/P2BAssets/limitAvailable';

//used for under processing or paid -- finance status
export const GET_DASHBOARD_FINANCE_ASSETS = '/api/P2BAssets/financeAssets';

//-----------Retailer status
//Used for active inactive retailers
export const GET_DASHBOARD_FILTER_RETAILER = '/api/P2BAssets/filterRetailer';
//user for getting all retailers
export const GET_DASHBOARD_ALL_RETAILERS =
  '/api/P2BAssets/getAllRetailerstoDashboard';
//user for getting dormant retailers
export const GET_DASHBOARD_DORMANT_RETAILERS =
  '/api/P2BAssets/getDormantRetailers';

export const GET_DASHBOARD_PENDING_SIGNED_DOCUMENTS =
  '/api/kyc/getDocumentsofOrganizationforAnUser';
//Blog
export const GET_VISITOR_DATA = '/visitor-data';

//dashboard charts data
export const GET_WEEKLY_DATA = '/weekly-data';
export const GET_YEARLY_DATA = '/yearly-data';
export const GET_MONTHLY_DATA = '/monthly-data';

export const TOP_SELLING_DATA = '/top-selling-data';

//dashboard crypto
export const GET_WALLET_DATA = '/wallet-balance-data';

//dashboard jobs
export const GET_STATISTICS_DATA = '/Statistics-data';

export const GET_EARNING_DATA = '/earning-charts-data';

//SALES CHANNEL
export const CREATE_SALES_CHANNEL = '/api/saleschannel/createSaleChannel';
export const ADD_SALES_CHANNEL = '/api/saleschannel/addSaleschannel';
export const GET_SALES_CHANNEL_BY_ORG_ID =
  '/api/saleschannel/getSalesChannelByOrgId';
export const GET_CHILD_SALES_CHANNEL = '/api/saleschannel/getChildrenById';
export const GET_ORG_DETAILS_BY_PAN = '/api/organization/getOrgDetailsByPan';
export const ADD_ORG_TO_SALES_CHANNEL =
  '/api/saleschannel/addOrgToSaleschannel';
export const DELETE_SALES_CHANNEL =
  '/api/saleschannel/deleteSaleschannelByAdmin';

//CREATE CHALLAN
export const CREATE_CHALLAN = '/api/challan/createChallan';

//DOCUMENT UPLOAD API
export const UPDATE_CHANNEL_STATUS = '/api/saleschannel/updateisactive';

// Get Director information
export const GET_ORG_DIRECTORS = '/api/organization/getOrgDirectorDetails';

export const GET_ORG_FINANCIAL_DETAILS =
  '/api/organization/getOrgFinancialDetails';

export const ADD_ORG_FINANCIAL_DETAILS =
  '/api/organization/saveOrgFinancialDetails';
export const DELETE_ORG_DIRECTORS = '/api/kyc/deleteDirector';

// to get operation type options for a user
export const GET_ORG_OPERATION_TYPE = '/api/util/organizationOperationType';

// Lender Management Api

export const GET_ALL_LENDERS = '/api/lender/getAllLendersList';

export const ADD_LENDER_PRODUCT = '/api/lender/addProduct';

export const GET_LENDER_PRODUCTLIST = '/api/lender/getAllProductOfLender';

export const DELETE_LENDER_PRODUCT_BY_ID = '/api/lender/deleteProduct';

export const EDIT_LENDER_PRODUCT = '/api/lender/editProduct';

export const GET_ORG_WITH_PRODUCT_MAPPING =
  '/api/lender/getAllOrganizationHavingProductMapping';

export const GET_ORG_BY_PREFIX = '/api/organization/getByPrefixName';

export const CREATE_ORG_PRODUCT_MAPPING =
  '/api/lender/createProductMappingToOrganization';

export const GET_ALL_PRODUCT_MAPPING_BY_ORGID =
  '/api/lender/getAllProductMappingOfAnOrganization';

export const EDIT_PRODUCT_MAPPING =
  '/api/lender/editProductMappingToOrganization';

export const DELETE_ORG_PRODUCT_MAPPING =
  '/api/lender/deleteProductMappingToOrganization';
export const GET_ALL_DOCUMENTS_OF_ORGANIZATION =
  '/api/kyc/getDocumentsofOrganization';

export const Add_DOCUMENT_TO_ORGANIZATION = '/api/kyc/eSignDocumentUpload';

export const VIEW_SIGNED_DOCUMENT_URL = '/api/kyc/viewSignedDocument';

export const GET_PRESIGNED_DOWNLOAD_URL = '/api/util/presignedDownloadurl';

//bnpl

export const GET_ALL_BNPL_ORDERS = '/api/bnpl/getBnplOrders';

export const CHANGE_INVOICE_STATUS = '/api/bnpl/toBeDisbursedBnpl';
