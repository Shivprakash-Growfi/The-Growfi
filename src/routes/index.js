import React from 'react';
import { Navigate } from 'react-router-dom';

import { Path } from './constant';

// Profile
import UserProfile from '../pages/Authentication/user-profile';

// Authentication related pages
import Login from 'pages/Authentication/Login';
import Logout from 'pages/Authentication/Logout';
import OrganizationSelection from 'pages/OrganizationSelection/OrganizationSelection';
import PermissionsManagement from 'pages/PermissionsManagement/PermissionsManagement';
import KycApplication from 'pages/KycApplication/KycApplication';
import UserManagement from 'pages/UserManagement/UserManagement';
import Page404 from 'pages/UtilityPages/Page404/Page404';
import Page403 from 'pages/UtilityPages/Page403/Page403';

//Finance Page
import InvoiceDiscountingParent from 'pages/FinanceAsset/InvoiceDiscounting/InvoiceDiscountingParent';
import PurchaseFinanceParent from 'pages/FinanceAsset/PurchaseFinance/PurchaseFinanceParent';
import BnplFinanceParent from 'pages/FinanceAsset/BnplFinance/BnplFinanceParent';

//View signed docs table
import SignedDocsParent from 'pages/Cheques&SignedDocs/SignedDocsParent';

//Product Info page
import ProductInfoPage from 'pages/ProductInfo/productInfoPage';

// Dashboard
import Dashboard from '../pages/Dashboard/index';

//Invoices page
import InvoiceDiscounting from 'pages/Invoices/Sales Invoices/InvoiceDiscounting';
import PurchaseFinance from 'pages/Invoices/Purchase Invoices/PurchaseFinance';
import CreateOrder from 'pages/Invoices/BNPL Invoices/CreateOrder';

//Manage Organizations
import ViewEditOrganization from '../pages/OrganizationManagement/View&EditOrganization/ViewOrgDetails';
import CreateOrganization from '../pages/OrganizationManagement/CreateOrg/CreateOrg';
import EditOrg from 'pages/OrganizationManagement/View&EditOrganization/EditOrg';

//Sales Channel
// import SalesChannel from '../pages/SalesChannel/SalesChannel';
import MainSalesChannel from 'pages/SalesChannel';
import ViewSignedDocuments from 'pages/ViewSignedDocuments/ViewSignedDocuments';

//Admin Lender Management
import CreateLenderProduct from 'pages/LenderManagement/CreateLenderProduct';
import OrgLenderProductMapping from 'pages/LenderManagement/OrgLenderProductMapping';
import LotsLoanManagement from 'pages/MerchantDashboard/LotsLoanManagement';

const authProtectedRoutes = [
  { path: Path.SELECT_ORGANIZATION, component: <OrganizationSelection /> },
  { path: Path.DASHBOARD, component: <Dashboard /> },
  { path: Path.LOTS_LOAN_MANAGEMENT, component: <LotsLoanManagement /> },
  // //profile
  { path: Path.PROFILE, component: <UserProfile /> },
  //
  { path: Path.PERMISSIONS_MANAGEMENT, component: <PermissionsManagement /> },
  { path: Path.USER_MANAGEMENT, component: <UserManagement /> },
  { path: Path.KYC_APPLICATION, component: <KycApplication /> },
  { path: Path.VIEW_INVOICES_TEMPELATE, component: <InvoiceDiscounting /> },
  { path: Path.AUTH_PAGE_NOTFOUND, component: <Page404 /> },
  { path: Path.AUTH_PAGE_FORBIDDEN, component: <Page403 /> },
  { path: Path.DISTRIBUTOR_INVOICES, component: <PurchaseFinance /> },
  { path: Path.BNPL_INVOICES, component: <CreateOrder /> },

  // manageOrgaanization
  { path: Path.VIEW_EDIT_ORGANIZATION, component: <ViewEditOrganization /> },
  { path: Path.CREATE_NEW_ORGANIZATION, component: <CreateOrganization /> },
  { path: Path.EDIT_ORGANIZATION, component: <EditOrg /> },
  //finance page
  { path: Path.FINANCE_ASSETS, component: <InvoiceDiscountingParent /> },
  { path: Path.PURCHASE_FINANCE, component: <PurchaseFinanceParent /> },
  { path: Path.BNPL_FINANCES, component: <BnplFinanceParent /> },

  //product info page
  { path: Path.PRODUCT_INFO_PAGE, component: <ProductInfoPage /> },

  // salesChannel
  { path: Path.SALES_CHANNEL + '/*', component: <MainSalesChannel /> },
  { path: Path.VIEW_SIGNED_DOCUMENT, component: <ViewSignedDocuments /> },

  //signed docs table
  { path: Path.SIGNED_DOCS_TABLE, component: <SignedDocsParent /> },

  //LM
  { path: Path.MANAGE_LENDER_PRODUCT, component: <CreateLenderProduct /> },
  {
    path: Path.MANAGE_ORG_PRODUCT_MAPPING,
    component: <OrgLenderProductMapping />,
  },

  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  {
    path: Path.LANDING,
    exact: true,
    component: <Navigate to={Path.DASHBOARD} />,
  },
];

const publicRoutes = [
  { path: Path.LOGOUT, component: <Logout /> },
  { path: Path.LOGIN, component: <Login /> },
];

export { authProtectedRoutes, publicRoutes };
