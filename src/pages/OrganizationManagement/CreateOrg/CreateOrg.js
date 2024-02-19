import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

//checking if user is growfi or not
import { superAdminPermissionForPage } from 'helpers/utilities';

// path to re-render
import { Path } from 'routes/constant';

// create page
import CreateEditPage from 'components/OrganizationManagementComponents/OrgCreate&EditComponent';

const CreateOrg = () => {
  // organization details from login
  const selectedOrganization = useSelector(
    state => state.Login.selectedOrganization
  );

  // navigate to page404 when user is not growfi
  const navigate = useNavigate();

  // checking is user has permission to view this page or not
  useEffect(() => {
    if (navigate) {
      superAdminPermissionForPage(
        selectedOrganization.organizationOperationType,
        selectedOrganization.userType,
        navigate,
        Path.AUTH_PAGE_NOTFOUND
      );
    }
  }, [selectedOrganization]);
  return (
    <>
      <CreateEditPage
        pageTitle="Add Organizations"
        breadcrumbTitle="Manage Organization"
        breadcrumbItem="Create Organization"
        saveButton="Create Organization"
        showMultipleAddress={false}
        showbreadcrumb={true}
        isEdit={false}
      />
    </>
  );
};
export default CreateOrg;
