import React, { useEffect, useState } from 'react';
import { Row, Col, CardBody, Card, CardTitle } from 'reactstrap';
import { Link, json } from 'react-router-dom';
import moment from 'moment';

//api import
import { getPendingSignedDocuments } from 'helpers/backend_helper';

//redux
import { useSelector, useDispatch } from 'react-redux';

export default function PendingDocument() {
  const [showMore, setShowMore] = useState(false);
  const [pendingDocumnetsData, setPendingDocumnetsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { selectedOrg, user } = useSelector(state => ({
    selectedOrg: state.Login.selectedOrganization,
    user: state.Login.user,
  }));

  useEffect(() => {
    fetchData();
  }, [selectedOrg]);

  const fetchData = async () => {
    try {
      const jsonData = await getPendingSignedDocuments(
        selectedOrg.organizationId,
        user.id
      );
      if (
        jsonData &&
        (jsonData.statusCode === 200 || jsonData.statusCode === 201)
      ) {
        if (jsonData.data && jsonData.data.length > 0) {
          const sortedData = jsonData.data.sort((a, b) => {
            const dateA = new Date(a.updatedAt);
            const dateB = new Date(b.updatedAt);
            return dateA - dateB;
          });
          setPendingDocumnetsData(sortedData);
        }

        setIsLoading(false);
      } else {
        throw jsonData;
      }
    } catch (err) {
      throw err;
    }
  };

  const formateDate = (date, format) => {
    const dateFormat = format ? format : 'DD MMM';
    const date1 = moment(new Date(date)).format(dateFormat);
    return date1;
  };
  const handleLinkClick = (e, docLink) => {
    window.open(docLink, '_blank');
  };
  return (
    <React.Fragment>
      {!isLoading && pendingDocumnetsData.length > 0 && (
        <Card>
          <CardBody>
            <CardTitle className="mb-3">Pending Documents</CardTitle>
            <ul className="verti-timeline list-unstyled">
              {pendingDocumnetsData
                .slice(0, showMore ? pendingDocumnetsData.length : 1)
                .map(document => {
                  return (
                    <li
                      key={document.id + '_idForPendingDoc'}
                      className="event-list border border-start-0 active rounded-3 p-1 pb-1 mb-2 d-flex text-center"
                    >
                      <div className="event-timeline-dot">
                        <i className=" mdi mdi-message-text-clock text-danger font-size-18" />
                      </div>
                      <div className="flex-shrink-0 d-flex text-center mt-1 ms-5">
                        <div className="me-3">
                          <div className="font-size-14">
                            {formateDate(document.updatedAt)}{' '}
                            <i className="bx bx-right-arrow-alt font-size-16  align-middle ms-2" />
                          </div>
                        </div>
                        <div className="flex-grow-1">
                          <div
                            className="text-primary font-size-14"
                            style={{ cursor: 'pointer' }}
                            title="Click to Sign"
                            onClick={e => {
                              handleLinkClick(e, document.link);
                            }}
                          >
                            {document.agreementName
                              ? document.agreementName
                              : 'Agreement Name Not Found !'}
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
            </ul>
            <div className="text-center">
              <Link
                to="#"
                onClick={() => {
                  setShowMore(!showMore);
                }}
                className="btn btn-primary waves-effect waves-light btn-sm"
              >
                {!showMore ? (
                  <>
                    View More <i className="mdi mdi-arrow-right ms-1" />
                  </>
                ) : (
                  'Close'
                )}
              </Link>
            </div>
          </CardBody>
        </Card>
      )}
    </React.Fragment>
  );
}
