import React, { useState } from 'react';
import { Label, Button, Col, Input, Form, FormGroup } from 'reactstrap';
import { DownloadFileByName } from 'components/Common/FileSizeTypeChecker';
import classnames from 'classnames';
import './common.scss';
// import axios from "axios";

const InputFormField = props => {
  const {
    label,
    onChange,
    errorMessage,
    touched,
    id,
    disabled,
    errorMsg,
    showFileLinks,
    fileName,
    ...inputProps
  } = props;

  return (
    <React.Fragment>
      <Col lg="6">
        <FormGroup className="mb-3">
          <Label>
            {label}
            {showFileLinks && fileName && (
              <span>
                {' ('}
                {'Download recently uploaded file: '}
                <a
                  className="text-blue"
                  onClick={() => {
                    DownloadFileByName(fileName);
                  }}
                >
                  <i className="mdi mdi-download-box"></i>
                </a>
                {')'}
              </span>
            )}
          </Label>
          {
            <>
              <div className="d-flex">
                <Input
                  readOnly={props.readOnly}
                  {...inputProps}
                  onChange={onChange}
                  disabled={disabled}
                />
              </div>
              <span>
                {errorMessage && <span className="error">{errorMessage}</span>}
              </span>
            </>
          }
        </FormGroup>
      </Col>
    </React.Fragment>
  );
};

export default InputFormField;
