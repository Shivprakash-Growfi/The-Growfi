import React, { useEffect, useState } from 'react';
import { Card, CardBody, Col, Row, Spinner } from 'reactstrap';
import { ProperMoneyFormat } from 'components/Common/ToProperCase';
import getChartColorsArray from '../../../Common/ChartsDynamicColor';
import { getDashboardFinanceStatusData } from 'helpers/backend_helper';

//redux
import { useSelector, useDispatch } from 'react-redux';

//loader
import ApiLoader from 'components/Common/Ui/ApiLoader';

//swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper';
import 'swiper/css';
// import 'swiper/css/navigation';
import 'swiper/css/pagination';
// import 'swiper/css/scrollbar';
import './ProductScroll.scss';

export default function ProductScroll({
  financeStatus,
  handleCardClick,
  header,
  assetType,
  ...props
}) {
  const [dashboardData, setDashboardData] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const { selectedOrg } = useSelector(state => ({
    selectedOrg: state.Login.selectedOrganization,
  }));

  const getDashboardFinanceStatusAPI = async () => {
    !isLoading && setIsLoading(true);
    try {
      const jsonData = await getDashboardFinanceStatusData(
        selectedOrg.organizationId,
        assetType
      );
      if (
        jsonData &&
        (jsonData.statusCode === 200 || jsonData.statusCode === 201)
      ) {
        setDashboardData(jsonData?.data?.limits);
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
  }, [assetType]);

  const BalanceChartColors = getChartColorsArray(
    JSON.stringify(financeStatus.map(data => data.color))
  );

  const getCardBody = () => {
    if (!isLoading && dashboardData && dashboardData.length > 0) {
      return (
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={25}
          slidesPerView={'auto'}
          navigation
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
        >
          <div className="carousel-inner ">
            {dashboardData.map((product, index) => {
              return (
                <SwiperSlide key={index}>
                  <div
                    className="carousel-item active"
                    style={{ height: 200 }}
                    data-bs-interval="3000"
                  >
                    <div className="border rounded-2 p-2 d-flex rounded">
                      <div className="flex-grow-1">
                        <h5 className="font-size-15 mb-2">
                          <span className="text-body">
                            {product.productIdentifier}
                          </span>{' '}
                          <span
                            className={`ms-1 badge ${
                              product.docStatus === 'pending'
                                ? 'badge-soft-danger'
                                : 'badge-soft-info'
                            }`}
                          >
                            {product.docStatus === 'pending'
                              ? "Document's Pending"
                              : 'Active'}
                          </span>
                        </h5>
                        <Row>
                          <Col lg="12">
                            <Card
                              className="border mb-0"
                              style={{ minWidth: 300 }}
                            >
                              <CardBody className="pb-1">
                                {financeStatus.map((report, key) => (
                                  <div
                                    key={key}
                                    className="d-flex justify-content-between mb-2 pb-1"
                                  >
                                    <div className="d-flex">
                                      <div className="avatar-xs rounded-circle align-self-center mini-stat-icon">
                                        <span
                                          className="avatar-title rounded-circle"
                                          style={{
                                            background: BalanceChartColors[key],
                                          }}
                                        >
                                          <i
                                            className={
                                              report.iconClass + ' font-size-3'
                                            }
                                          ></i>
                                        </span>
                                      </div>
                                      <div className="align-self-center">
                                        <h6 className="text-muted ms-3 mb-0">
                                          {report.title}
                                        </h6>
                                        <h6 className="ms-3 mb-0">
                                          Rs.{' '}
                                          {product[report.id]
                                            ? ProperMoneyFormat(
                                                product[report.id]
                                              )
                                            : 0}
                                        </h6>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </CardBody>
                            </Card>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </div>
        </Swiper>
      );
    } else if (isLoading) {
      return (
        <>
          <ApiLoader loadMsg={'Loading...'} />
        </>
      );
    } else {
      return <h6 className="text-center text-muted"> No Products Assigned</h6>;
    }
  };

  return (
    <div>
      {' '}
      <Card>
        <CardBody>
          <h4 className="card-title mb-3">{header}</h4>
          {getCardBody()}
        </CardBody>
      </Card>
    </div>
  );
}
