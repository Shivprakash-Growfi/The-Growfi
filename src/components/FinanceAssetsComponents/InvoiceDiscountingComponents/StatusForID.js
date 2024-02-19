import React, { Fragment, useState, useEffect } from 'react';
import { Progress, Label, UncontrolledTooltip } from 'reactstrap';
import 'assets/scss/ProgressBarForStatus.scss';
import { getP2BAssetStatus } from 'helpers/backend_helper';
import { ProperDateFormat } from 'components/Common/ToProperCase';
import { Notification } from 'components/Notification/ToastNotification';

//Ui for status bar
const Checkpoint = ({ number, position, label, lastUpdated, color }) => (
  <>
    <button
      className={` start-${position} translate-middle btn btn-sm  btn-${color} rounded-pill`}
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
        style={{ textWrap: 'nowrap' }}
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

const StatusForID = props => {
  const { p2bAssetDetails } = props;
  const [statusData, setStatusData] = useState();
  const [progress, setProgress] = useState();

  // setting the progress level
  const checkProgress = statusData => {
    if (statusData) {
      if (statusData['underProcessing']) {
        setProgress(0);
      }
      if (statusData['listed']) {
        setProgress(17);
      }
      if (statusData['approved']) {
        setProgress(34);
      }
      if (statusData['eNACHcreated']) {
        setProgress(51);
      }
      if (statusData['eNACHcompleted']) {
        setProgress(68);
      }
      if (statusData['paid']) {
        setProgress(85);
      }
      if (statusData['paid back']) {
        setProgress(100);
      }
    }
  };

  //api call for getting status log of the asset
  useEffect(() => {
    getP2BAssetStatus(p2bAssetDetails?.p2BAssetId)
      .then(response => {
        if (response.statusCode === 200 || response.statusCode === 201) {
          setStatusData(response.data);
          checkProgress(response.data);
        } else {
          Notification('Sorry, Please reload the page', 4);
        }
      })
      .catch(error => {
        Notification('Sorry, Please reload the page', 4);
      });
  }, [p2bAssetDetails]);

  // making array of checkpoints and adding data
  const checkpoints = [
    {
      position: 0,
      color: statusData?.underProcessing?.updatedAt ? 'success' : 'secondary',
      label: 'Under Processing',
      lastUpdated:
        (statusData?.underProcessing?.updatedAt &&
          ProperDateFormat(statusData['underProcessing'].updatedAt)) ||
        'NA',
    },
    {
      position: 17,
      color: statusData?.listed?.updatedAt ? 'success' : 'secondary',
      label: 'Listed',
      lastUpdated:
        (statusData?.listed?.updatedAt &&
          ProperDateFormat(statusData['listed'].updatedAt)) ||
        'NA',
    },

    {
      position: 34,
      color: statusData?.approved?.updatedAt ? 'success' : 'secondary',
      label: 'Approved',
      lastUpdated:
        (statusData?.approved?.updatedAt &&
          ProperDateFormat(statusData['approved'].updatedAt)) ||
        'NA',
    },
    {
      position: 51,
      color: statusData?.eNACHcreated?.updatedAt ? 'success' : 'secondary',
      label: 'eNACH Created',
      lastUpdated:
        (statusData?.eNACHcreated?.updatedAt &&
          ProperDateFormat(statusData['eNACHcreated'].updatedAt)) ||
        'NA',
    },
    {
      position: 68,
      color: statusData?.eNACHcompleted?.updatedAt ? 'success' : 'secondary',
      label: 'eNACH Completed',
      lastUpdated:
        (statusData?.eNACHcompleted?.updatedAt &&
          ProperDateFormat(statusData['eNACHcompleted'].updatedAt)) ||
        'NA',
    },
    {
      position: 85,
      color: statusData?.paid?.updatedAt ? 'success' : 'secondary',
      label: 'Paid',
      lastUpdated:
        (statusData?.paid?.updatedAt &&
          ProperDateFormat(statusData['paid'].updatedAt)) ||
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
      label: 'Paid Back',
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

export default StatusForID;
