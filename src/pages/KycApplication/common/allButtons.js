import React from 'react';
import { Button } from 'reactstrap';

const AllButtons = props => {
  return (
    <div className="d-flex flex-row-reverse">
      {props.verificationStatus ? (
        <Button
          color="primary"
          type="button"
          onClick={() => {
            props.toggleTab(props.activeTab + 1);
          }}
        >
          Proceed
        </Button>
      ) : (
        <>
          <Button color="primary" className="px-3 ms-4" type="submit">
            {props.save ? 'Save' : 'Verify'}
          </Button>
          {props.activeTab !== 3 ? (
            <Button
              color="primary"
              onClick={() => {
                props.toggleTab(props.activeTab + 1);
              }}
              type="button"
            >
              Skip
            </Button>
          ) : (
            <Button
              color="primary"
              onClick={() => {
                props.toggleTab(props.activeTab - 1);
              }}
              type="button"
            >
              Back
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default AllButtons;
