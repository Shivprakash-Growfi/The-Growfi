import React, { useEffect, useState } from 'react';
import { Button, Col, Input, Label } from 'reactstrap';
import { Form, Row } from 'reactstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { saveOrganizationFinancialDetails } from 'helpers/backend_helper';
import { useSelector } from 'react-redux';
import {
  ApiNotificationLoading,
  ApiNotificationUpdate,
} from 'components/Notification/ToastNotification';
import {
  DownloadFileByName,
  allDocumentsUpload,
} from 'components/Common/FileSizeTypeChecker';

const CompanyInfo = props => {
  const { apiData, userTypeStatus } = props;
  const { toggleTab, activeTab, verificationStatus } = props;
  const { selectedOrganization } = useSelector(state => ({
    selectedOrganization: state.Login.selectedOrganization,
  }));

  const [fileInputs, setFileInputs] = useState({
    companyIntro: null,
    aoa: null,
    moa: null,
    boardResolution: null,
    partnersDeed: null,
  });
  const [fileLinks, setFileLinks] = useState({
    companyIntro: null,
    aoa: null,
    moa: null,
    boardResolution: null,
    partnersDeed: null,
  });

  const handleFileChange1 = (event, inputName) => {
    const selectedFile = event.target.files[0];
    handleFileUpload(selectedFile, inputName);
  };

  useEffect(() => {
    apiData &&
      Object.keys(apiData).map(val => {
        if (apiData[val]?.length > 1) {
          setFileLinks(prevLinks => ({
            ...prevLinks,
            [val]: apiData[val],
          }));
        }
      });
  }, []);

  const handleFileClick = e => {
    const { target = {} } = e || {};
    target.value = '';
    // setFileLinks(prevLinks => ({
    //   ...prevLinks,
    //   [e.target.name]: '',
    // }));
    // pitchFormik.setFieldValue(e.target.name, '');
  };

  const handleFileUpload = (selectedFile, inputName) => {
    async function fetchFileData() {
      const loadingId = ApiNotificationLoading();
      try {
        const uploadedData = await allDocumentsUpload(
          selectedOrganization?.organizationId,
          selectedFile,
          inputName
        );
        if (uploadedData && uploadedData.statusCode == 200) {
          setFileInputs(prevInputs => ({
            ...prevInputs,
            [inputName]: selectedFile.name,
          }));
          pitchFormik.setFieldValue(inputName, uploadedData.data.fileName);
          ApiNotificationUpdate(loadingId, `File uploaded successfully`, 2);
        } else {
          ApiNotificationUpdate(loadingId, `File not uploaded`, 4);
        }
      } catch (error) {
        ApiNotificationUpdate(loadingId, `${error?.message}`, 4);
        console.error('Error fetching data:', error);
      }
    }
    fetchFileData();
  };
  const fileInputFields = [
    {
      id: 1,
      type: 'file',
      label: 'Company Introduction',
      name: 'companyIntro',
      placeholder: '',
      accept: 'image/png, image/jpeg, application/pdf',
      onChange: handleFileChange1,
      onClick: handleFileClick,
      onUpload: handleFileUpload,
      file: fileInputs.companyIntro,
      link: fileLinks.companyIntro,
    },
    {
      id: 2,
      type: 'file',
      label: 'AOA',
      name: 'aoa',
      placeholder: '',
      accept: 'image/png, image/jpeg, application/pdf',
      onChange: handleFileChange1,
      onClick: handleFileClick,
      onUpload: handleFileUpload,
      file: fileInputs.aoa,
      link: fileLinks.aoa,
    },
    {
      id: 3,
      type: 'file',
      label: 'MOA',
      name: 'moa',
      placeholder: '',
      accept: 'image/png, image/jpeg, application/pdf',
      onChange: handleFileChange1,
      onClick: handleFileClick,
      onUpload: handleFileUpload,
      file: fileInputs.moa,
      link: fileLinks.moa,
    },
    {
      id: 4,
      type: 'file',
      label: 'Board Resolution',
      name: 'boardResolution',
      placeholder: '',
      accept: 'image/png, image/jpeg, application/pdf',
      onChange: handleFileChange1,
      onClick: handleFileClick,
      onUpload: handleFileUpload,
      file: fileInputs.boardResolution,
      link: fileLinks.boardResolution,
    },
  ];
  const fileInputFieldsPartners = [
    {
      id: 1,
      type: 'file',
      label: 'Company Introduction',
      name: 'companyIntro',
      placeholder: '',
      accept: 'image/png, image/jpeg, application/pdf',
      onChange: handleFileChange1,
      onClick: handleFileClick,
      onUpload: handleFileUpload,
      file: fileInputs.companyIntro,
      link: fileLinks.companyIntro,
    },
    {
      id: 2,
      type: 'file',
      label: 'Partners deed',
      name: 'partnersDeed',
      placeholder: '',
      accept: 'image/png, image/jpeg, application/pdf',
      onChange: handleFileChange1,
      onClick: handleFileClick,
      onUpload: handleFileUpload,
      file: fileInputs.partnersDeed,
      link: fileLinks.partnersDeed,
    },
  ];

  const pitchFormik = useFormik({
    initialValues: {
      description: apiData?.description,
      companyIntro: apiData?.companyIntro,
      aoa: apiData?.aoa,
      moa: apiData?.moa,
      boardResolution: apiData?.boardResolution,
      partnersDeed: apiData?.partnersDeed,
    },
    onSubmit: (values, action) => {
      const loadingId = ApiNotificationLoading();
      const companyInfo = {
        moa: values.moa,
        aoa: values.aoa,
        boardResolution: values.boardResolution,
        companyIntro: values?.companyIntro ? values.companyIntro : '',
        partnersDeed: values.partnersDeed,
        description: values.description,
      };
      saveOrganizationFinancialDetails(
        selectedOrganization.organizationId,
        [],
        [],
        '',
        companyInfo,
        {}
      )
        .then(response => {
          if (response?.statusCode === 200 || response?.statusCode === 201) {
            const respData = response.data?.companyInformation;
            ApiNotificationUpdate(loadingId, `${response.message}`, 2);
            pitchFormik.resetForm();
            respData &&
              Object.keys(respData).map(val => {
                if (respData[val]?.length > 1) {
                  if (val == 'description') {
                    console.log(respData[val], 'des');
                    pitchFormik.setFieldValue('description', respData[val]);
                  } else {
                    setFileLinks(prevLinks => ({
                      ...prevLinks,
                      [val]: respData[val],
                    }));
                    setFileInputs(prevInputs => ({
                      ...prevInputs,
                      [val]: '',
                    }));
                  }
                }
              });
          } else {
            ApiNotificationUpdate(loadingId, `${response.message}`, 4);
          }
        })
        .catch(err => {
          ApiNotificationUpdate(loadingId, `Unable to upload!`, 4);
        });
    },
  });
  return (
    <>
      <>
        <Form onSubmit={pitchFormik.handleSubmit}>
          <Row>
            <Label>Introduction :</Label>
            <Input
              type="textarea"
              name="description"
              value={pitchFormik.values.description}
              onChange={pitchFormik.handleChange}
              maxLength="225"
              rows="3"
              placeholder="This description has a limit of 225 chars."
            />
          </Row>
          {userTypeStatus === '1' ? (
            <Row className="d-flex flex-wrap">
              {fileInputFields.map(val => {
                return (
                  <Col lg="6" key={val.id} className="mb-4 mt-3">
                    <div>
                      <Label className="form-label">
                        {val.label}:{' '}
                        {val.link && (
                          <span>
                            {' ('}
                            {'Download recently uploaded file: '}
                            <a
                              className="text-blue"
                              onClick={() => {
                                DownloadFileByName(fileLinks[val.name]);
                              }}
                            >
                              <i className="mdi mdi-download-box"></i>
                            </a>
                            {')'}
                          </span>
                        )}
                      </Label>

                      <Input
                        className="form-control"
                        name={val.name}
                        id={val.name}
                        type={val.type}
                        accept={val.accept}
                        onChange={e => handleFileChange1(e, val.name)}
                        onClick={val['onClick']}
                        onBlur={pitchFormik.handleBlur}
                        invalid={
                          pitchFormik.touched[val.name] &&
                          pitchFormik.errors[val.name]
                            ? true
                            : false
                        }
                      />
                      {fileInputs[val.name] && (
                        <div>
                          {val.label}: {fileInputs[val.name]}
                        </div>
                      )}
                    </div>
                  </Col>
                );
              })}
            </Row>
          ) : (
            <Row className="d-flex flex-wrap">
              {fileInputFieldsPartners.map(val => {
                return (
                  <Col lg="6" key={val.id} className="mb-4 mt-3">
                    <div>
                      <Label>
                        {val.label}:{' '}
                        {val.link && (
                          <span>
                            {' ('}
                            {'Download recently uploaded file: '}
                            <a
                              className="text-blue"
                              onClick={() => {
                                DownloadFileByName(fileLinks[val.name]);
                              }}
                            >
                              <i className="mdi mdi-download-box"></i>
                            </a>
                            {')'}
                          </span>
                        )}
                      </Label>
                      <Input
                        className="form-control"
                        name={val.name}
                        type={val.type}
                        accept={val.accept}
                        onChange={e => handleFileChange1(e, val.name)}
                        onClick={val['onClick']}
                        onBlur={pitchFormik.handleBlur}
                        invalid={
                          pitchFormik.touched[val.name] &&
                          pitchFormik.errors[val.name]
                            ? true
                            : false
                        }
                      />
                      {fileInputs[val.name] && (
                        <div>
                          {val.label}: {fileInputs[val.name]}
                        </div>
                      )}
                    </div>
                  </Col>
                );
              })}
            </Row>
          )}
          <Row>
            <div className="d-flex flex-row-reverse">
              <Button color="primary" type="submit">
                Save
              </Button>
              <Button
                color="primary"
                className="me-3"
                onClick={() => {
                  props.toggleTab(activeTab - 1);
                }}
                type="button"
              >
                Back
              </Button>
            </div>
          </Row>
        </Form>
      </>
    </>
  );
};

export default CompanyInfo;
