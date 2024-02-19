import React from 'react';
import { Spinner } from 'reactstrap';

const ApiLoader = props => {
  const { loadMsg } = props;
  return (
    <>
      <div className="d-flex justify-content-center mt-5">
        <Spinner style={{ width: '2rem', height: '2rem' }} />
        <h3 className="ps-4">
          {loadMsg ? loadMsg : 'Wait for data to render'}
        </h3>
      </div>
    </>
  );
};

export default ApiLoader;
