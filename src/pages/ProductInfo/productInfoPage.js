import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Card, CardBody, Col } from 'reactstrap';
import Breadcrumbs from 'components/Common/Breadcrumb';
import withRouter from 'components/Common/withRouter';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import moment from 'moment';
import defaultBanner from '../../assets/images/ProductDetailsDefaultImage.png';
import {
  ProperMoneyFormat,
  ToProperCase,
} from 'components/Common/ToProperCase';
import { getProductDataByProductId } from 'helpers/backend_helper';
import ApiLoader from 'components/Common/Ui/ApiLoader';
import { Notification } from 'components/Notification/ToastNotification';
import { Path } from 'routes/constant';
import { redirectToPage } from 'helpers/utilities';
import { useNavigate } from 'react-router-dom';

const ProductInfoPage = props => {
  const selectedOrg = useSelector(state => state.Login.selectedOrganization);

  const [modifiedProductData, setModifiedProductData] = useState();
  const [actualProductData, setActualProductData] = useState();
  const [isLoading, setIsloading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  const convertProductdata = data => {
    if (data) {
      const temp = {
        'Product Name': data.productIdentifier || '-',
        'Lender Name': data.lenderNameAsPerGST || '-',
        'Amount Commited by Lender': data.amountCommitedByLender ? (
          <>
            <i className="bx bx-rupee" />
            {ProperMoneyFormat(data.amountCommitedByLender)}
          </>
        ) : (
          '-'
        ),
        'Daily Rate of Interest': `${data.dailyRateOfInterest}%` || '-',
        'Finance Duration Date': `${data.durationDays} days` || '-',
        'Default Date': `${data.defaultDays} days` || '-',
        'Penalty Rate Per Day': `${data.penaltyRatePerDay}%` || '-',
        'Product Type':
          `${data.typeOfFinance && ToProperCase(data.typeOfFinance)}` || '-',

        'Last Updated': moment(data.updatedAt).format('MMMM D, YYYY') || '-',
      };
      setModifiedProductData(temp);
      setActualProductData(data);
    }
  };

  useEffect(() => {
    callProductApi(id);
  }, []);

  const callProductApi = productId => {
    getProductDataByProductId(productId)
      .then(response => {
        if (
          response &&
          (response.statusCode === 200 || response.statusCode === 201)
        ) {
          convertProductdata(response.data);
          // settableData(response.data);
          setIsloading(false);
        } else {
          Notification('Sorry, product details not found', 4);
          redirectToPage(Path.DASHBOARD, navigate, 1000);
        }
      })
      .catch(err => {
        setIsloading(true);
        Notification('Sorry, product details not found', 4);
        redirectToPage(Path.DASHBOARD, navigate, 1000);
      });
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {isLoading ? (
            <ApiLoader loadMsg={'Loading'} />
          ) : (
            <>
              <Breadcrumbs
                title={'Product Details'}
                // breadcrumbItem="Prodcut Details"
                breadcrumbItem={`${
                  actualProductData?.productIdentifier || 'Product Name'
                }`}
              />

              <Row>
                <Col>
                  <Card>
                    <img
                      style={{ maxHeight: '250px' }}
                      src={
                        actualProductData?.webBannerLink &&
                        actualProductData.webBannerLink[0] !== null
                          ? actualProductData.webBannerLink[0]
                          : defaultBanner
                      }
                      alt={'Product Image'}
                    />
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col lg={4}>
                  <Card>
                    <CardBody>
                      <h5 className="fw-semibold">Product Overview</h5>

                      <div className="table-responsive">
                        <table className="table">
                          <tbody>
                            {Object.entries(modifiedProductData).map(
                              ([key, value]) => (
                                <tr key={key}>
                                  <th scope="row">{key}</th>
                                  <td>{value}</td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                <Col lg={8}>
                  <Card>
                    <CardBody className="border-bottom">
                      <div className="d-flex">
                        <div className="flex-grow-1 ms-3">
                          <h5 className="fw-semibold">
                            {actualProductData?.productIdentifier ||
                              'Product Name'}
                          </h5>
                          <ul className="list-unstyled hstack gap-2 mb-0">
                            <li>
                              <i className="bx bxs-bank"></i>{' '}
                              <span className="text-muted">
                                {actualProductData?.lenderNameAsPerGST ||
                                  'Lender Name'}
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </CardBody>
                    <CardBody>
                      <h5 className="fw-semibold mb-3">Description</h5>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: actualProductData?.description,
                        }}
                      />
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </>
          )}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withRouter(ProductInfoPage);
