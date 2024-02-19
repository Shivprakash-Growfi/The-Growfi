import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import withRouter from 'components/Common/withRouter';

//i18n
import { withTranslation } from 'react-i18next';
import SidebarContent from './SidebarContent';

//redux
import { useSelector, useDispatch } from 'react-redux';

import { Link } from 'react-router-dom';
import growfiLogo from '../../assets/images/growfiFav.jpeg';
import logo from '../../assets/images/growfiWhite.png';

const Sidebar = props => {
  const { companyDetails } = useSelector(state => ({
    companyDetails: state.Company.companyDetails,
  }));

  return (
    <React.Fragment>
      <div className="vertical-menu">
        <div className="navbar-brand-box pt-2 pe-4">
          <Link to="/" className="logo">
            <span className="logo-sm">
              <img src={growfiLogo} alt="" height="22" />
            </span>
            <span className="logo-lg">
              <img src={logo} alt="" height="42" />
            </span>
          </Link>
        </div>
        <div data-simplebar className="h-100">
          {props.type !== 'condensed' ? <SidebarContent /> : <SidebarContent />}
        </div>
        <div className="sidebar-background"></div>
      </div>
    </React.Fragment>
  );
};

Sidebar.propTypes = {
  type: PropTypes.string,
};

const mapStatetoProps = state => {
  return {
    layout: state.Layout,
  };
};
export default connect(
  mapStatetoProps,
  {}
)(withRouter(withTranslation()(Sidebar)));
