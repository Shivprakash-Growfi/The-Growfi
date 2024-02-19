import React, { useState, useEffect } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { Link } from 'react-router-dom';
import ReactApexChart from 'react-apexcharts';
import { ProperMoneyFormat } from 'components/Common/ToProperCase';
import getChartColorsArray from '../../Common/ChartsDynamicColor';
import { getDashboardFinanceStatusData } from 'helpers/backend_helper';

//redux
import { useSelector, useDispatch } from 'react-redux';

//import css
import './FinanceStatusReportCards.scss';

const FinanceGraphCircle = ({ financeStatus, handleCardClick, ...props }) => {
  const [selectedType, setSelectedType] = useState('invoiceDiscounting');
  const [dashboardData, setDashboardData] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [series, setSeries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { selectedOrg } = useSelector(state => ({
    selectedOrg: state.Login.selectedOrganization,
  }));

  const getDashboardFinanceStatusAPI = async () => {
    !isLoading && setIsLoading(true);
    try {
      const jsonData = await getDashboardFinanceStatusData(
        selectedOrg.organizationId,
        selectedType
      );
      if (
        jsonData &&
        (jsonData.statusCode === 200 || jsonData.statusCode === 201)
      ) {
        setDashboardData(jsonData.data);
        if (financeStatus && financeStatus.length > 0 && jsonData.data) {
          let totalAmountTemp = jsonData.data['sanctionedLimit'];
          const seriesTemp = financeStatus.map(data => {
            if (jsonData.data[data.id] && totalAmountTemp) {
              return ((jsonData.data[data.id] / totalAmountTemp) * 100).toFixed(
                1
              );
            }
            return 0;
          });
          setTotalAmount(totalAmountTemp);
          setSeries(seriesTemp);
        }
        setIsLoading(false);
      } else {
        throw jsonData;
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getDashboardFinanceStatusAPI();
  }, [selectedType]);

  const BalanceChartColors = getChartColorsArray(
    JSON.stringify(financeStatus.map(data => data.color))
  );

  const walletOptions = {
    plotOptions: {
      radialBar: {
        offsetY: 0,
        startAngle: 0,
        endAngle: 270,
        hollow: {
          margin: 5,
          size: '35%',
          background: 'transparent',
          image: void 0,
        },
        track: {
          show: !0,
          startAngle: void 0,
          endAngle: void 0,
          background: '#f2f2f2',
          strokeWidth: '97%',
          opacity: 1,
          margin: 12,
          dropShadow: {
            enabled: !1,
            top: 0,
            left: 0,
            blur: 3,
            opacity: 0.5,
          },
        },
        dataLabels: {
          name: {
            show: !0,
            fontSize: '18px',
            fontWeight: 600,
            offsetY: -10,
          },
          value: {
            show: !0,
            fontSize: '18px',
            offsetY: 4,
            formatter: function (e) {
              return e + '%';
            },
          },
          // total: {
          //   show: 0,
          //   label: 'Total',
          //   color: '#373d3f',
          //   fontSize: '16px',
          //   fontFamily: void 0,
          //   fontWeight: 600,
          //   formatter: function (e) {
          //     return (
          //       e.globals.seriesTotals.reduce(function (e, t) {
          //         return e + Number(t ? t : 0);
          //       }, 0) + '%'
          //     );
          //   },
          // },
        },
      },
    },
    stroke: {
      lineCap: 'round',
    },
    colors: BalanceChartColors,
    labels: financeStatus.map(data => data.title),
    legend: { show: !1 },
  };

  return (
    <React.Fragment>
      <Card>
        <CardBody>
          <div className="float-end">
            <select
              value={selectedType}
              className="form-select form-select-sm ms-2"
              onChange={e => {
                setSelectedType(e.target.value);
              }}
            >
              <option value="invoiceDiscounting">Invoice Discounting</option>
              <option value="purchaseFinance">Purchase Financing</option>
            </select>
          </div>
          <h4 className="card-title mb-3">Finance Status</h4>

          <Row>
            <Col lg="6">
              {financeStatus.map((report, key) => (
                <Row key={'_col_' + key}>
                  <Card className="mini-stats-wid cardHover ">
                    <CardBody
                      onClick={() => {
                        if (report.click) {
                          handleCardClick(
                            report.title,
                            report.status,
                            report.type,
                            selectedType
                          );
                        }
                      }}
                    >
                      <div className="d-flex justify-content-between">
                        <div className="d-flex">
                          <div className="avatar-sm rounded-circle align-self-center mini-stat-icon">
                            <span
                              className="avatar-title rounded-circle"
                              style={{
                                background: BalanceChartColors[key],
                              }}
                            >
                              <i
                                className={report.iconClass + ' font-size-15'}
                              ></i>
                            </span>
                          </div>
                          <div className="align-self-center">
                            <h5 className="text-muted ms-3 mb-0">
                              {report.title}
                            </h5>
                          </div>
                        </div>

                        <div className="align-self-center ">
                          <h5 className="mb-0">
                            Rs.{' '}
                            {dashboardData[report.id]
                              ? ProperMoneyFormat(dashboardData[report.id])
                              : 0}
                          </h5>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Row>
              ))}
            </Col>

            <Col lg="6">
              <div>
                <div id="wallet-balance-chart">
                  <ReactApexChart
                    options={walletOptions}
                    series={series}
                    type="radialBar"
                    height={475}
                    className="apex-charts"
                  />
                </div>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default FinanceGraphCircle;
