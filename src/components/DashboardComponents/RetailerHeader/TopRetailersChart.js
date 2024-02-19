import React from 'react';
import { Card, CardBody, Table } from 'reactstrap';
import { ProperMoneyFormat } from 'components/Common/ToProperCase';
const TopRetailers = ({ dashboardData, isLoading, ...props }) => {
  return (
    <React.Fragment>
      <Card style={{ minHeight: 440 }}>
        <CardBody>
          <div className="clearfix">
            <div className="float-end">
              <div className="input-group input-group-sm"></div>
            </div>
            <h4 className="card-title mb-4">Top Retailers</h4>
          </div>

          <div className="text-muted text-center">
            {!isLoading &&
              dashboardData?.topFourRetailers &&
              dashboardData?.topFourRetailers[0] && (
                <>
                  <h4>{dashboardData.topFourRetailers[0].org.nameAsPerGST}</h4>
                  <p className="mb-2">Top Retailer</p>
                </>
              )}
          </div>

          <div
            className="table-responsive mt-4"
            style={{
              minHeight: '285px',
              maxHeight: '285px',
              overflowY: 'scroll',
            }}
          >
            {!isLoading &&
            dashboardData.topFourRetailers &&
            dashboardData.topFourRetailers.length > 0 ? (
              <Table className="table align-middle mb-0">
                <tbody>
                  {dashboardData.topFourRetailers.map((data, key) => {
                    return (
                      <tr key={key}>
                        <td>
                          <p className="text-muted mb-0">Organization Name</p>
                          <h5 className="font-size-14 mb-1">
                            {data.org.nameAsPerGST}
                          </h5>
                        </td>
                        <td>
                          <p className="text-muted mb-1">Amount</p>
                          <h5 className="mb-0">
                            Rs.
                            {data.amount ? ProperMoneyFormat(data.amount) : 0}
                          </h5>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            ) : (
              <div className=" text-muted d-flex justify-content-center pt-5">
                {'No Data found'}
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default TopRetailers;
