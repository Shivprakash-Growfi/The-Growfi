import React, { Fragment, useState, useEffect } from 'react';
import { Progress, Label, UncontrolledTooltip } from 'reactstrap';
import 'assets/scss/ProgressBarForStatus.scss';
import { getBnplAssetStatus } from 'helpers/backend_helper';
import { ProperDateFormat } from 'components/Common/ToProperCase';
import { Notification } from 'components/Notification/ToastNotification';

const Checkpoint = ({ number, position, label, lastUpdated, color }) => (
  <>
    <button
      className={`start-${position} translate-middle btn btn-sm  btn-${color} rounded-pill`}
      id={'checkpoint-' + number}
      style={{ width: '25px', height: '25px', top: '15px' }}
    >
      {color === 'success' ? (
        <i className="fas fa-check mt-0" />
      ) : (
        <i className="fas fa-times mt-0" />
      )}
      <Label
        className={`truncate-text position-relative mt-1 text-${color}`}
        style={{ textWrap: 'nowrap', textAlign: 'left' }}
      >
        {label}
      </Label>
    </button>

    <UncontrolledTooltip placement="top" target={'checkpoint-' + number}>
      <Label className={`mt-1 mx-0 text-${color} `}>
        {'Status - ' + label} <br></br>
        {'Updated At - ' + lastUpdated}
      </Label>
    </UncontrolledTooltip>
  </>
);

const StatusForBnpl = props => {
  const { bnplAssetDetails } = props;
  const [statusData, setStatusData] = useState();
  const [progress, setProgress] = useState();

  const checkProgress = statusData => {
    if (statusData) {
      if (statusData['approved']) {
        setProgress(0);
      }
      if (statusData['toBeDisbursed']) {
        setProgress(33);
      }
      if (statusData['disbursed']) {
        setProgress(66);
      }
      if (statusData['paid back']) {
        setProgress(100);
      }
    }
  };

  useEffect(() => {
    getBnplAssetStatus(bnplAssetDetails?.asset_id)
      .then(response => {
        if (response) {
          setStatusData(response);
          checkProgress(response);
        } else {
          Notification('Sorry, Please reload the page', 4);
        }
      })
      .catch(error => {
        Notification('Sorry, Please reload the page', 4);
      });
  }, [bnplAssetDetails]);

  const checkpoints = [
    {
      position: 0,
      color: statusData?.approved?.updatedAt ? 'success' : 'secondary',
      label: 'Approved',
      lastUpdated:
        (statusData?.approved?.updatedAt &&
          ProperDateFormat(statusData['approved'].updatedAt)) ||
        'NA',
    },
    {
      position: 33,
      color: statusData?.approved?.updatedAt ? 'success' : 'secondary',
      label: 'To Be Disbursed',
      lastUpdated:
        (statusData?.approved?.updatedAt &&
          ProperDateFormat(statusData['toBeDisbursed'].updatedAt)) ||
        'NA',
    },
    {
      position: 66,
      color: statusData?.paid?.updatedAt ? 'success' : 'secondary',
      label: 'Disbursed',
      lastUpdated:
        (statusData?.paid?.updatedAt &&
          ProperDateFormat(statusData['disbursed'].updatedAt)) ||
        'NA',
    },
    {
      position: 100,
      color:
        statusData &&
        statusData['paid back'] &&
        statusData['paid back'].updatedAt
          ? 'success'
          : 'secondary',
      label: 'Loan Closed',
      lastUpdated:
        (statusData &&
          statusData['paid back'] &&
          ProperDateFormat(statusData['paid back'].updatedAt)) ||
        'NA',
    },
  ];

  return (
    <Fragment>
      <Progress
        value={progress}
        color="success"
        style={{
          height: '5px',
          backgroundColor: 'grey',
          marginTop: '13.5px',
          borderRadius: '0px',
        }}
      />
      {checkpoints.map((checkpoint, index) => (
        <Checkpoint
          key={index}
          number={index}
          color={checkpoint.color}
          position={checkpoint.position}
          label={checkpoint.label}
          lastUpdated={checkpoint.lastUpdated}
        />
      ))}
    </Fragment>
  );
};

export default StatusForBnpl;
