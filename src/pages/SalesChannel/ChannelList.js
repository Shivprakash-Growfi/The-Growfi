import React, { useState, useEffect } from 'react';

import { Button, Card, CardBody, UncontrolledTooltip } from 'reactstrap';

import 'components/SalesChannelComponents/salesChannel.scss';

import { getSalesChannelByOrgId } from 'helpers/backend_helper';

import ApiLoader from 'components/Common/Ui/ApiLoader';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Path } from 'routes/constant';

//Notification imports
import { Notification } from 'components/Notification/ToastNotification';
import { debounce } from 'lodash';

const ChannelList = props => {
  const [cardData, setCardData] = useState({});
  const [apiCardData, setApiCardData] = useState({});
  const [isShowLoader, setIsShowLoader] = useState(false);
  const { selectedOrganization } = useSelector(state => ({
    selectedOrganization: state.Login.selectedOrganization,
  }));
  const orgId = selectedOrganization ? selectedOrganization.organizationId : '';
  const orgType = selectedOrganization
    ? selectedOrganization.organizationOperationType
    : '';
  const userType = selectedOrganization ? selectedOrganization.userType : '';

  const navigate = useNavigate();

  const getApiData = () => {
    setIsShowLoader(true);
    getSalesChannelByOrgId(orgId)
      .then(response => {
        if (response.statusCode === 200 || response.statusCode === 201) {
          response.data.map(val => {
            setCardData(prevState => ({
              ...prevState,
              [val.id]: val,
            }));
            setApiCardData(prevState => ({
              ...prevState,
              [val.id]: val,
            }));
          });
          setIsShowLoader(false);
        } else {
          Notification(`${response?.message}`, 4);
        }
      })
      .catch(err => {
        Notification(`Unable to fetch sales channels`, 4);
      });
  };

  useEffect(() => {
    getApiData();
  }, []);

  const handleCardClick = channelId => {
    navigate(
      `${Path.SALES_CHANNEL}${Path.SELECTED_SALES_CHANNEL}/${channelId}`
    );
  };

  const handleChannelSearch = e => {
    const val = e.target.value;
    if (val.length > 1) {
      const updatedData = Object.keys(apiCardData)
        .filter(key => apiCardData[key]?.channelIdentifer?.search(val) != -1)
        .reduce((obj, key) => {
          obj[key] = apiCardData[key];
          return obj;
        }, {});
      setCardData(updatedData);
    } else {
      setCardData(apiCardData);
    }
  };
  const debouncedChannelSearch = debounce(handleChannelSearch, 600);

  return (
    <React.Fragment>
      <CardBody className="border-bottom">
        <div className="d-flex align-items-center justify-content-between">
          <h4 className="m-0">Sales Channels</h4>
          <div className="search-box me-xxl-2 mt-2 mt-md-0 d-inline-block">
            <div className="position-relative">
              <label htmlFor="search-bar-0" className="search-label m-0">
                <input
                  id="search-bar-0"
                  type="text"
                  className="form-control"
                  placeholder={`Search sales channel`}
                  onChange={debouncedChannelSearch}
                />
              </label>
              <i className="bx bx-search-alt search-icon"></i>
            </div>
          </div>
        </div>
      </CardBody>
      <CardBody>
        <div>
          {isShowLoader ? (
            <ApiLoader />
          ) : Object.keys(cardData).length > 0 ? (
            <div className="sc-card-list">
              {Object.keys(cardData).map((channel, key) => (
                <Card
                  className="sc-card text-center bg-light"
                  onClick={() => {
                    handleCardClick(channel);
                  }}
                  key={key + 1}
                  id={`card-${key + 1}`}
                >
                  <a
                    style={{
                      display: 'block',
                      width: '100%',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    <h5 className="font-size-15 mb-1">
                      {cardData[channel].channelIdentifer}
                    </h5>
                    <p className="text-muted  mb-0">
                      <span
                        style={{
                          fontWeight: '500',
                        }}
                      >
                        Child organizations
                      </span>{' '}
                      : {cardData[channel].childrenNumber}
                    </p>
                    <p className="text-muted  mb-0">
                      <span
                        style={{
                          fontWeight: '500',
                        }}
                      >
                        MID
                      </span>{' '}
                      : {cardData[channel].mId}
                    </p>
                    <div
                      className="d-flex justify-content-center mt-1"
                      key={cardData[channel].id}
                    >
                      {cardData[channel].isActive ? (
                        <p
                          className="badge font-size-11 bg-success mb-0"
                          key={cardData[channel].id + '_botton_inactive'}
                          style={{
                            color: 'green',
                          }}
                        >
                          Active
                        </p>
                      ) : (
                        <p
                          className="badge font-size-11 bg-danger  mb-0"
                          key={cardData[channel].id + '_botton_inactive'}
                          style={{
                            color: '#ff0000',
                          }}
                        >
                          Inactive
                        </p>
                      )}
                    </div>
                  </a>
                  <UncontrolledTooltip
                    placement="bottom"
                    target={`card-${key + 1}`}
                  >
                    {cardData[channel].channelIdentifer}
                  </UncontrolledTooltip>
                </Card>
              ))}
            </div>
          ) : (
            <div>
              <h2>No Sales channel available</h2>
            </div>
          )}
        </div>
      </CardBody>
    </React.Fragment>
  );
};
export default ChannelList;
