import React, { useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

// //Import Scrollbar
import SimpleBar from 'simplebar-react';

// MetisMenu
import MetisMenu from 'metismenujs';
import withRouter from 'components/Common/withRouter';
import { Link } from 'react-router-dom';

//i18n
import { withTranslation } from 'react-i18next';

//paths
import { Path } from 'routes/constant';

//checking if user is growfi or not
import { IsUserGrowfi } from 'helpers/utilities';

const SidebarContent = props => {
  // organization details from login
  const selectedOrganization = useSelector(
    state => state.Login.selectedOrganization
  );

  const ref = useRef();
  const activateParentDropdown = useCallback(item => {
    item.classList.add('active');
    const parent = item.parentElement;
    const parent2El = parent.childNodes[1];

    if (parent2El && parent2El.id !== 'side-menu') {
      parent2El.classList.add('mm-show');
    }

    if (parent) {
      parent.classList.add('mm-active');
      const parent2 = parent.parentElement;

      if (parent2) {
        parent2.classList.add('mm-show'); // ul tag

        const parent3 = parent2.parentElement; // li tag

        if (parent3) {
          parent3.classList.add('mm-active'); // li
          parent3.childNodes[0].classList.add('mm-active'); //a
          const parent4 = parent3.parentElement; // ul
          if (parent4) {
            parent4.classList.add('mm-show'); // ul
            const parent5 = parent4.parentElement;
            if (parent5) {
              parent5.classList.add('mm-show'); // li
              parent5.childNodes[0].classList.add('mm-active'); // a tag
            }
          }
        }
      }
      scrollElement(item);
      return false;
    }
    scrollElement(item);
    return false;
  }, []);

  const removeActivation = items => {
    for (var i = 0; i < items.length; ++i) {
      var item = items[i];
      const parent = items[i].parentElement;

      if (item && item.classList.contains('active')) {
        item.classList.remove('active');
      }
      if (parent) {
        const parent2El =
          parent.childNodes && parent.childNodes.lenght && parent.childNodes[1]
            ? parent.childNodes[1]
            : null;
        if (parent2El && parent2El.id !== 'side-menu') {
          parent2El.classList.remove('mm-show');
        }

        parent.classList.remove('mm-active');
        const parent2 = parent.parentElement;

        if (parent2) {
          parent2.classList.remove('mm-show');

          const parent3 = parent2.parentElement;
          if (parent3) {
            parent3.classList.remove('mm-active'); // li
            parent3.childNodes[0].classList.remove('mm-active');

            const parent4 = parent3.parentElement; // ul
            if (parent4) {
              parent4.classList.remove('mm-show'); // ul
              const parent5 = parent4.parentElement;
              if (parent5) {
                parent5.classList.remove('mm-show'); // li
                parent5.childNodes[0].classList.remove('mm-active'); // a tag
              }
            }
          }
        }
      }
    }
  };

  const path = useLocation();
  const activeMenu = useCallback(() => {
    const pathName = path.pathname;
    let matchingMenuItem = null;
    const ul = document.getElementById('side-menu');
    const items = ul.getElementsByTagName('a');
    removeActivation(items);

    for (let i = 0; i < items.length; ++i) {
      if (pathName === items[i].pathname) {
        matchingMenuItem = items[i];
        break;
      }
    }
    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem);
    }
  }, [path.pathname, activateParentDropdown]);

  useEffect(() => {
    ref.current.recalculate();
  }, []);

  useEffect(() => {
    new MetisMenu('#side-menu');
    activeMenu();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    activeMenu();
  }, [activeMenu]);

  function scrollElement(item) {
    if (item) {
      const currentPosition = item.offsetTop;
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300;
      }
    }
  }

  return (
    <React.Fragment>
      <SimpleBar className="h-100" ref={ref}>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            <li className="menu-title">{props.t('Menu')} </li>

            <li>
              <Link to={Path.DASHBOARD}>
                <i className="bx bxs-dashboard"></i>
                <span>{props.t('Dashboard')}</span>
              </Link>
            </li>
            <li>
              <Link to={Path.LOTS_LOAN_MANAGEMENT}>
                <i className="bx bxs-dashboard"></i>
                <span>{props.t('Lots Loans Management')}</span>
              </Link>
            </li>
            <li>
              <Link to={Path.KYC_APPLICATION}>
                <i className="bx bx-fingerprint"></i>
                <span>{props.t('KYC Verification')}</span>
              </Link>
            </li>

            {IsUserGrowfi(
              selectedOrganization.organizationOperationType,
              selectedOrganization.userType
            ) && (
              <li>
                <Link to="/#" className="has-arrow">
                  <i className="bx bx-store"></i>
                  <span>{props.t('Manage Organization')}</span>
                </Link>
                <ul className="sub-menu">
                  <li>
                    <Link to={Path.CREATE_NEW_ORGANIZATION}>
                      {props.t('Create New ')}
                    </Link>
                  </li>
                  <li>
                    <Link to={Path.VIEW_EDIT_ORGANIZATION}>
                      {props.t('View Details')}
                    </Link>
                  </li>
                  <li>
                    <Link to={Path.VIEW_SIGNED_DOCUMENT}>
                      {props.t('Add Documents')}
                    </Link>
                  </li>
                </ul>
              </li>
            )}
            <li>
              <Link to="/#" className="has-arrow">
                <i className="bx bx-store"></i>
                <span>{props.t('Finance')}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to={Path.FINANCE_ASSETS}>
                    {props.t('Invoice Discounting')}
                  </Link>
                </li>
                <li>
                  <Link to={Path.PURCHASE_FINANCE}>
                    {props.t('Purchase Finance')}
                  </Link>
                </li>
                <li>
                  <Link to={Path.BNPL_FINANCES}>{props.t('BNPL Finance')}</Link>
                </li>
              </ul>
            </li>
            {/* <li>
              <Link to={Path.FINANCE_ASSETS}>
                <i className="bx bx-history"></i>
                <span>{props.t('Finance Asset')}</span>
              </Link>
            </li> */}
            <li>
              <Link to={Path.INVOICES} className="has-arrow ">
                <i className="bx bx bx-rupee"></i>
                <span>{props.t('Invoices')}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to={Path.VIEW_INVOICES + '/pending'}>
                    {props.t('Sales Invoices')}
                  </Link>
                </li>
                {/* <li>
                  <Link to={Path.VIEW_INVOICES + '/accepted-paid'}>
                    {props.t('Accepted-Paid Invoices')}
                  </Link>
                </li>
                <li>
                  <Link to={Path.VIEW_INVOICES + '/rejected'}>
                    {props.t('Rejected Invoices')}
                  </Link>
                </li> */}
                <li>
                  <Link to={Path.DISTRIBUTOR_INVOICES}>
                    {props.t('Purchase Invoices')}
                  </Link>
                </li>
                <li>
                  <Link to={Path.BNPL_INVOICES}>
                    {props.t('BNPL Invoices')}
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to={Path.SALES_CHANNEL}>
                <i className="bx bxs-megaphone"></i>
                <span>{props.t('Sales Channels')}</span>
              </Link>
            </li>
            {IsUserGrowfi(
              selectedOrganization.organizationOperationType,
              selectedOrganization.userType
            ) && (
              <li>
                <Link to="/#" className="has-arrow">
                  <i className="mdi mdi-sitemap"></i>
                  <span>{props.t('Lender Management')}</span>
                </Link>
                <ul className="sub-menu">
                  <li>
                    <Link to={Path.MANAGE_LENDER_PRODUCT}>
                      {props.t('Lender Product List')}
                    </Link>
                  </li>
                  <li>
                    <Link to={Path.MANAGE_ORG_PRODUCT_MAPPING}>
                      {props.t('Product Activation')}
                    </Link>
                  </li>
                </ul>
              </li>
            )}
            <li>
              <Link to={Path.SIGNED_DOCS_TABLE}>
                <i className="bx bxs-file-doc"></i>
                <span>{props.t('Signed Documents')}</span>
              </Link>
            </li>
            <li>
              <Link to={Path.PERMISSIONS_MANAGEMENT}>
                <i className="bx bx-list-plus"></i>
                <span>{props.t('Permissions')}</span>
              </Link>
            </li>
            <li>
              <Link to={Path.USER_MANAGEMENT}>
                <i className="bx bx-user-pin"></i>
                <span>{props.t('User')}</span>
              </Link>
            </li>
          </ul>
        </div>
      </SimpleBar>
    </React.Fragment>
  );
};

SidebarContent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};

export default withRouter(withTranslation()(SidebarContent));
