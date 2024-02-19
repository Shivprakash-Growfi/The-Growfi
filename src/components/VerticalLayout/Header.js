import PropTypes from 'prop-types';
import React, { useState } from 'react';

import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';

// Reactstrap
import { Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';

// Import menuDropdown
import LanguageDropdown from '../CommonForBoth/TopbarDropdown/LanguageDropdown';
import NotificationDropdown from '../CommonForBoth/TopbarDropdown/NotificationDropdown';
import ProfileMenu from '../CommonForBoth/TopbarDropdown/ProfileMenu';
import megamenuImg from '../../assets/images/megamenu-img.png';

import logo from '../../assets/images/growfi3x.png';
import logoLightSvg from '../../assets/images/logo-light.svg';

//i18n
import { withTranslation } from 'react-i18next';

// Redux Store
import {
  showRightSidebarAction,
  toggleLeftmenu,
  changeSidebarType,
} from '../../store/actions';

const Header = props => {
  function toggleFullscreen() {
    if (
      !document.fullscreenElement &&
      /* alternative standard method */ !document.mozFullScreenElement &&
      !document.webkitFullscreenElement
    ) {
      // current working methods
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(
          Element.ALLOW_KEYBOARD_INPUT
        );
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    }
  }

  function tToggle() {
    var body = document.body;
    if (window.screen.width <= 998) {
      body.classList.toggle('sidebar-enable');
    } else {
      body.classList.toggle('vertical-collpsed');
      body.classList.toggle('sidebar-enable');
    }
  }

  return (
    <React.Fragment>
      <header id="page-topbar">
        <div className="navbar-header">
          <div className="d-flex">
            <div className="navbar-brand-box d-lg-none d-md-block">
              <Link to="/" className="logo ">
                <span className="logo-sm">
                  <img src={logo} alt="" height="22" />
                </span>
              </Link>
            </div>

            <button
              type="button"
              onClick={() => {
                tToggle();
              }}
              className="btn btn-sm px-3 font-size-16 header-item "
              id="vertical-menu-btn"
            >
              <i className="fa fa-fw fa-bars" />
            </button>
            <div className="d-none d-lg-flex flex-column justify-content-center">
              <h5
                className="mb-0 text-truncate"
                style={{ maxWidth: '400px', fontWeight: '800' }}
              >
                {`${props.selectedOrganization.nameAsPerPAN}: ${props.selectedOrganization.nameAsPerGST}`}
              </h5>
            </div>
          </div>
          <div className="d-flex">
            {/* <LanguageDropdown /> */}

            <div className="dropdown d-none d-lg-inline-block ms-1">
              <button
                type="button"
                onClick={() => {
                  toggleFullscreen();
                }}
                className="btn header-item noti-icon "
                data-toggle="fullscreen"
              >
                <i className="bx bx-fullscreen" />
              </button>
            </div>

            {/* <NotificationDropdown /> */}
            <ProfileMenu username={props.name} />

            {/* <div
              onClick={() => {
                props.showRightSidebarAction(!props.showRightSidebar);
              }}
              className="dropdown d-inline-block"
            >
              <button
                type="button"
                className="btn header-item noti-icon right-bar-toggle "
              >
                <i className="bx bx-cog bx-spin" />
              </button>
            </div> */}
          </div>
        </div>
      </header>
    </React.Fragment>
  );
};

Header.propTypes = {
  changeSidebarType: PropTypes.func,
  leftMenu: PropTypes.any,
  leftSideBarType: PropTypes.any,
  showRightSidebar: PropTypes.any,
  showRightSidebarAction: PropTypes.func,
  t: PropTypes.any,
  toggleLeftmenu: PropTypes.func,
};

const mapStatetoProps = state => {
  const { layoutType, showRightSidebar, leftMenu, leftSideBarType } =
    state.Layout;
  const {
    selectedOrganization,
    user: { name },
  } = state.Login;
  const { companyDetails } = state.Company;
  return {
    layoutType,
    showRightSidebar,
    leftMenu,
    leftSideBarType,
    selectedOrganization,
    companyDetails,
    name,
  };
};

export default connect(mapStatetoProps, {
  showRightSidebarAction,
  toggleLeftmenu,
  changeSidebarType,
})(withTranslation()(Header));
