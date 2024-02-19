import { Notification } from 'components/Notification/ToastNotification';
import {
  allDocsUpload,
  deleteOrgFinanceDocs,
  docUploadToS3Bucket,
  getPresignedDownloadUrl,
} from 'helpers/backend_helper';
export const FileUpload = (
  file,
  allowedFileTypes,
  fileTypeStr = '',
  size = 5
) => {
  //   const allowedFileTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  const maxFileSize = size * 1024 * 1024; // 5 MB
  if (file) {
    if (allowedFileTypes.includes(file.type)) {
      if (file.size <= maxFileSize) {
        return {
          status: true,
          msg: ``,
        };
      } else {
        return {
          status: false,
          msg: `File size is too large. Please upload a file less than ${size} MB`,
        };
      }
    } else {
      return {
        status: false,
        msg: `Invalid file type. Please upload a ${
          fileTypeStr.length > 0
            ? fileTypeStr
            : allowedFileTypes.map(item => {
                return ` ${item}`;
              })
        } type file`,
      };
    }
  }
};

export const allDocumentsUpload = async (
  organizationId = '',
  selectedFile,
  folderName = 'others',
  allowedFileTypes = ['image/jpeg', 'image/png', 'application/pdf'],
  fileTypeStr = '',
  size = 5
) => {
  const promise = new Promise(function (resolve, reject) {
    const type = selectedFile?.type;
    const isFileAllowed = FileUpload(
      selectedFile,
      allowedFileTypes,
      fileTypeStr,
      size
    );
    isFileAllowed?.status
      ? allDocsUpload(selectedFile?.name, `${organizationId}`, folderName)
          .then(response => {
            const imageNameToSend = response?.data?.fileName;
            const linkImage = response?.data?.uploadurl?.split('?')[0];
            //For Bad File Names
            // const imageLinkToSend = response?.data.uploadurl.split('com')[0];
            // const linkImage = `${imageLinkToSend}+com/+${imageNameToSend}`;
            selectedFile &&
              docUploadToS3Bucket(response?.data.uploadurl, selectedFile)
                .then(response => {
                  resolve({
                    data: {
                      fileName: imageNameToSend,
                      fileLink: linkImage,
                    },
                    statusCode: 200,
                    message: 'File Successfully Uploaded',
                  });
                })
                .catch(err => {
                  reject({
                    data: { fileName: '', fileLink: '' },
                    statusCode: 400,
                    message: 'Failed to upload file',
                  });
                });
          })
          .catch(err => {
            reject({
              data: { fileName: '', fileLink: '' },
              statusCode: 500,
              message: 'Failed to upload file',
            });
          })
      : reject({
          data: { fileName: '', fileLink: '' },
          statusCode: 500,
          message: `${isFileAllowed.msg}`,
        });
  });
  return promise;
};

export const DownloadFileByName = async (fileName = '') => {
  try {
    const response = await getPresignedDownloadUrl(fileName);
    if (response?.statusCode == 200 || response?.statusCode == 201) {
      const downloadLink = response.data;
      const link = document.createElement('a');
      link.href = downloadLink;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      Notification('File downloaded successfully!', 2);
    } else {
      Notification('Unable to download file!', 4);
    }
  } catch {
    Notification('Unable to download file!', 4);
  }
};

export const deleteDocById = async docId => {
  const promise = new Promise(function (resolve, reject) {
    docId?.length > 0
      ? deleteOrgFinanceDocs(docId)
          .then(response => {
            if (response?.statusCode === 200 || response?.statusCode === 201) {
              resolve({
                data: {
                  docId: response.docId,
                },
                statusCode: 200,
                message: 'File Successfully deleted',
              });
            } else {
              reject({
                data: { docId: '' },
                statusCode: 400,
                message: 'Failed to delete file',
              });
            }
          })
          .catch(err => {
            reject({
              data: { docId: '' },
              statusCode: 500,
              message: 'Failed to delete file',
            });
          })
      : reject({
          data: { docId: '' },
          statusCode: 500,
          message: `Unable to delete this file`,
        });
  });
  return promise;
};
