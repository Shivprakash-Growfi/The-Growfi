import React, { useEffect } from 'react';
import { Button, Toast, ToastBody, ToastHeader } from 'reactstrap';
import { removeToastMessage } from 'store/actions';

//redux
import { useDispatch } from 'react-redux';

const UiToast = props => {
  const {
    message,
    isShowToast,
    handleToastCancel,
    type,
    zIndex = '1050',
    timeout = 3000,
    isGlobal = false,
  } = props;
  useEffect(() => {
    let timer;
    if (isShowToast && !isGlobal) {
      timer = setTimeout(() => {
        handleToastCancel && handleToastCancel();
      }, timeout);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [isShowToast, handleToastCancel, timeout]);

  useEffect(() => {
    let timer;
    if (isGlobal) {
      timer = setTimeout(() => {
        handleToastCancelGlobal();
      }, timeout);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [message, timeout]);

  const dispatch = useDispatch();
  const msgType = type === 1 ? 'bg-success' : 'bg-danger';

  const handleToastCancelGlobal = () => {
    dispatch(removeToastMessage());
  };
  return (
    <>
      <div
        className="position-fixed top-0 end-0 p-3"
        style={{ zIndex: zIndex }}
      >
        <Toast
          className={`align-items-center text-white ${msgType} border-0`}
          role="alert"
          isOpen={isShowToast}
        >
          <div className="d-flex">
            <ToastBody>{message}</ToastBody>
            <Button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              onClick={
                handleToastCancel ? handleToastCancel : handleToastCancelGlobal
              }
            ></Button>
          </div>
        </Toast>
      </div>
    </>
  );
};

export default UiToast;
