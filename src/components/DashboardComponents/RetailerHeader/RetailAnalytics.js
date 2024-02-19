import React from 'react';
import { Row, Col, Card, CardBody, Spinner } from 'reactstrap';
import ReactApexChart from 'react-apexcharts';
import getChartColorsArray from '../../Common/ChartsDynamicColor';
import ApiLoader from 'components/Common/Ui/ApiLoader';

const RetailAnalytics = ({
  dashboardData,
  isLoading,
  retailerStatus,
  ...props
}) => {
  const apexRetailAnalyticsChartColors = getChartColorsArray(
    JSON.stringify(retailerStatus.map(value => value.color))
  );
  const series = retailerStatus.slice(0, 3).map(value => {
    if (!isLoading && dashboardData) {
      return dashboardData[value.id];
    } else {
      return 0;
    }
  });

  const options = {
    labels: retailerStatus.slice(0, 3).map(value => value.title),
    colors: apexRetailAnalyticsChartColors,
    legend: { show: !1 },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
        },
      },
    },
  };

  return (
    <React.Fragment>
      <Card>
        <CardBody>
          <h4 className="card-title mb-4">Retailers Analytics</h4>
          {isLoading ? (
            <ApiLoader loadMsg={'Loading...'} />
          ) : (
            <div>
              <div id="donut-chart">
                <ReactApexChart
                  options={options}
                  series={series}
                  type="donut"
                  height={300}
                  className="apex-charts"
                />
              </div>
            </div>
          )}
          <div className="text-center text-muted">
            <Row>
              {retailerStatus.map((value, index) => {
                return (
                  <Col xs="3" key={index + '_retailer_analytics'}>
                    <div className="mt-4">
                      <p className="mb-2 text-truncate">
                        <i
                          className={`mdi mdi-circle me-1`}
                          style={{
                            color: apexRetailAnalyticsChartColors[index],
                          }}
                        />{' '}
                        {value.title}
                      </p>
                      <h5>
                        {!isLoading && dashboardData[value.id]
                          ? dashboardData[value.id]
                          : 0}
                      </h5>
                    </div>
                  </Col>
                );
              })}
            </Row>
          </div>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default RetailAnalytics;
