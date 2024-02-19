const LANDING = '/';
const LOGIN = '/login';
const LOGOUT = '/logout';
const REGISTER = '/register';
const FORGOT_PASSWORD = '/forgot-password';
const SELECT_ORGANIZATION = '/select-organization';
const CREATE_NEW_ORGANIZATION = '/create-organization';
const VIEW_EDIT_ORGANIZATION = '/view-edit-organization';
const EDIT_ORGANIZATION = '/edit-organization/:id';
const SALES_CHANNEL = '/sales-channel';
const PERMISSIONS_MANAGEMENT = '/permissions-management';
const KYC_APPLICATION = '/kyc-application';
const DASHBOARD = '/dashboard';
const SETTINGS = '/settings';
const PROFILE = '/profile';
const USER_MANAGEMENT = '/user-management';
const FINANCE_ASSETS = '/invoice-discounting-finance-assets';
const PURCHASE_FINANCE = '/purchase-finance-assets';
const SELECT_SALES_CHANNEL = `/select-sales-channel`;
const SELECTED_SALES_CHANNEL = `/selected-sales-channel`;
const SELECTED_SALES_CHANNEL_TEMPLATE = `${SELECTED_SALES_CHANNEL}/:id`;
const CATALOG = '/catalog';
const CREATE_CATALOG = CATALOG + `/create-catalog`;
const EDIT_CATALOG = CATALOG + `/edit-catalog/:id`;
const VIEW_CATALOG = CATALOG + '/view-catalog';
const INVOICES = '/invoices';
const VIEW_INVOICES = INVOICES + '/view-invoices';
const VIEW_INVOICES_TEMPELATE = VIEW_INVOICES + '/:id';
const VIEW_SIGNED_DOCUMENT = '/view-signed-document-request';
const DISTRIBUTOR_INVOICES = '/purchase-invoices';
const LENDER_MANAGEMENT = '/lender-management';
const MANAGE_LENDER_PRODUCT = '/manage-lender-product';
const MANAGE_ORG_PRODUCT_MAPPING = '/manage-org-product-mapping';
const SIGNED_DOCS_TABLE = '/view-signed-docs-table';
const PRODUCT_INFO_PAGE = '/product-info-page/:id';
const BNPL_INVOICES = '/bnpl-invoices';
const BNPL_FINANCES = '/bnpl-finances';
const LOTS_LOAN_MANAGEMENT = '/lots-loan-management';

const AUTH_PAGE_NOTFOUND = '/page-not-found';
const AUTH_PAGE_FORBIDDEN = '/page-forbidden';
// const PROFILE = '/profile';

const Path = {
  LANDING,
  LOGIN,
  FORGOT_PASSWORD,
  SELECT_ORGANIZATION,
  CREATE_NEW_ORGANIZATION,
  VIEW_EDIT_ORGANIZATION,
  EDIT_ORGANIZATION,
  PERMISSIONS_MANAGEMENT,
  KYC_APPLICATION,
  SALES_CHANNEL,
  LOGOUT,
  REGISTER,
  DASHBOARD,
  SETTINGS,
  PROFILE,
  USER_MANAGEMENT,
  AUTH_PAGE_NOTFOUND,
  FINANCE_ASSETS,
  SELECT_SALES_CHANNEL,
  SELECTED_SALES_CHANNEL,
  SELECTED_SALES_CHANNEL_TEMPLATE,
  CREATE_CATALOG,
  EDIT_CATALOG,
  VIEW_CATALOG,
  VIEW_INVOICES,
  VIEW_INVOICES_TEMPELATE,
  INVOICES,
  AUTH_PAGE_FORBIDDEN,
  DISTRIBUTOR_INVOICES,
  PURCHASE_FINANCE,
  LENDER_MANAGEMENT,
  MANAGE_LENDER_PRODUCT,
  MANAGE_ORG_PRODUCT_MAPPING,
  VIEW_SIGNED_DOCUMENT,
  SIGNED_DOCS_TABLE,
  PRODUCT_INFO_PAGE,
  BNPL_INVOICES,
  BNPL_FINANCES,
  LOTS_LOAN_MANAGEMENT,
};

export { Path };
