import React from 'react';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const mainToastContainer = () => {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        rtl={false}
        closeOnClick={true}
        pauseOnHover={true}
        draggable={true}
        theme={'light'}
      />
    </>
  );
};

export const Notification = (message = '', id) => {
  switch (id) {
    case 1:
      toast.info(message);
      break;
    case 2:
      toast.success(message);
      break;
    case 3:
      toast.warn(message);
      break;
    case 4:
      toast.error(message);
      break;
    default:
      toast(message);
      break;
  }
};

export const toastType = id => {
  switch (id) {
    case 1:
      return toast.TYPE.INFO;
      break;
    case 2:
      return toast.TYPE.SUCCESS;
      break;
    case 3:
      return toast.TYPE.WARNING;
      break;
    case 4:
      return toast.TYPE.ERROR;
      break;
    default:
      return toast.TYPE.DEFAULT;
      break;
  }
};

export const ApiNotificationLoading = (message = 'Please wait...') => {
  const id = toast.loading(message);
  return id;
};
export const ApiNotificationUpdate = (id, message = '', type) => {
  const notificationStatus = toastType(type);
  toast.update(id, {
    render: message,
    type: notificationStatus,
    isLoading: false,
    autoClose: 5000,
    closeButton: true,
  });
};
