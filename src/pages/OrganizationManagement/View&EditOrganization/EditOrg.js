import React, { useState, useEffect } from 'react';
import { Spinner } from 'reactstrap';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

//router to navigate
import withRouter from 'components/Common/withRouter';

// to display the main edit content
import CreateEditPage from 'components/OrganizationManagementComponents/OrgCreate&EditComponent';

// api call for org data by sending org id
import { getOrganizationById } from 'helpers/backend_helper';

// to show toast msg
import { Notification } from 'components/Notification/ToastNotification';

// to route to desired path
import { Path } from 'routes/constant';

//checking if user is growfi or not
import { superAdminPermissionForPage } from 'helpers/utilities';
import ApiLoader from 'components/Common/Ui/ApiLoader';

const EditOrg = props => {
  // organization details from login
  const selectedOrganization = useSelector(
    state => state.Login.selectedOrganization
  );

  // navigate to page404 when user is not growfi
  const navigate = useNavigate();

  const { id } = useParams();
  const [organizationData, setOrganizationData] = useState(null);

  /************** Useeffect for fetching organization details *************/
  useEffect(() => {
    if (id > 0) {
      getOrganizationById(id)
        .then(response => {
          if (
            response &&
            (response.statusCode === 200 || response.statusCode === 201)
          ) {
            setOrganizationData(response.data);
          } else {
            Notification('Sorry. Please try to edit again after some time.', 4);
            setTimeout(() => {
              props.router.navigate(Path.VIEW_EDIT_ORGANIZATION);
            }, 1000);
          }
        })
        .catch(err => {
          Notification('Sorry. Please try to edit again after some time.', 4);
          setTimeout(() => {
            props.router.navigate(Path.VIEW_EDIT_ORGANIZATION);
          }, 1000);
        });
    }
  }, []);

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
      {organizationData === null ? (
        <ApiLoader loadMsg={'Please Wait...'} />
      ) : (
        <CreateEditPage
          pageTitle="Edit Organization"
          breadcrumbTitle="Manage Organization"
          breadcrumbItem="Edit Organization"
          saveButton="Save Changes"
          showMultipleAddress={false}
          showbreadcrumb={true}
          isEdit={true}
          organizationId={id}
          organizationData={organizationData}
          setOrganizationData={setOrganizationData}
          forcreate={false}
        />
      )}
    </>
  );
};

export default EditOrg;
