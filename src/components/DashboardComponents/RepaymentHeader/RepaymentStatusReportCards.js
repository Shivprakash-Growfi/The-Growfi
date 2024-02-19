import React, { useEffect, useState } from 'react';
import { Row, Col, CardBody, Card, Spinner } from 'reactstrap';
import { ProperMoneyFormat } from 'components/Common/ToProperCase';

//api import
import { getDashboardFinanceRepaymentData } from 'helpers/backend_helper';

//redux
import { useSelector, useDispatch } from 'react-redux';

//loader
import ApiLoader from 'components/Common/Ui/ApiLoader';

const repaymentFinanceStatus = [
  {
    id: 'overDueAMount',
    title: 'Due Amount',
    iconClass: 'mdi mdi-calendar-today',
    duePeriod: 'overDue',
  },
  {
    id: 'thisWeekDueAmount',
    title: 'This Week',
    iconClass: 'mdi mdi-calendar-week-begin',
    duePeriod: 'oneWeek',
  },
  {
    id: 'nextWeekDueAmount',
    title: 'Next Week',
    iconClass: 'mdi mdi-calendar-weekend',
    duePeriod: 'twoWeek',
  },
  {
    id: 'totalDueAmount',
    title: 'Total Amount',
    iconClass: 'mdi mdi-calendar-plus',
    duePeriod: 'all',
  },
];
export default function RepaymentStatusReportCards({
  type,
  header,
  handleCardClick,
  assetType,
  ...props
}) {
  const [dashboardData, setDashboardData] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const { selectedOrg } = useSelector(state => ({
    selectedOrg: state.Login.selectedOrganization,
  }));

  const getDashboardFinanceRepaymentDataAPI = async () => {
    !isLoading && setIsLoading(true);
    try {
      const jsonData = await getDashboardFinanceRepaymentData(
        selectedOrg.organizationId,
        assetType
      );
      if (
        jsonData &&
        (jsonData.statusCode === 200 || jsonData.statusCode === 201)
      ) {
        setDashboardData(jsonData.data);
        setIsLoading(false);
      } else {
        throw jsonData;
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getDashboardFinanceRepaymentDataAPI();
  }, []);

  return (
    <Col sm="6">
      <Card>
        <CardBody>
          <div className="float-end"></div>
          <h4 className="card-title mb-3">{header}</h4>
          {/* Reports Render */}
          {isLoading ? (
            <ApiLoader loadMsg={'Loading...'} />
          ) : (
            <>
              {repaymentFinanceStatus.map((report, key) => (
                <Row key={'_row_' + key}>
                  <Col lg="12">
                    <Card className="mini-stats-wid shadow">
                      <CardBody
                        onClick={() => {
                          handleCardClick(
                            report.title,
                            report.duePeriod,
                            assetType
                          );
                        }}
                      >
                        <div className="d-flex">
                          <div className="flex-grow-1">
                            <p className="text-muted fw-medium">
                              {report.title}
                            </p>
                            <h4 className="mb-0">
                              {'Rs. ' +
                                ProperMoneyFormat(
                                  dashboardData[report.id]
                                    ? dashboardData[report.id]
                                    : 0
                                )}
                            </h4>
                          </div>
                          <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                            <span className="avatar-title rounded-circle bg-primary">
                              <i
                                className={report.iconClass + ' font-size-24'}
                              ></i>
                            </span>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              ))}
            </>
          )}
        </CardBody>
      </Card>
    </Col>
  );
}
