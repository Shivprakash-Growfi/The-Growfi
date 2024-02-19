import React from 'react';
import { FormFeedback, Input, Label } from 'reactstrap';
export const fileUploadInput = props => {
  const { fileInputFields = [], validation } = props;
  console.log(fileInputFields, validation);
  return (
    <>
      {fileInputFields.map(val => {
        return (
          <div className="mb-3" key={val.id}>
            <Label className="form-label">
              {val.label}
              {true && prevLink}
            </Label>
            <Input
              className="form-control"
              name={val.name}
              type={val.type}
              accept={val.accept}
              onChange={val['onChange']}
              onClick={val['onClick']}
              onBlur={validation.handleBlur}
              invalid={
                validation.touched[val.name] && validation.errors[val.name]
                  ? true
                  : false
              }
            />
            {val.file && (
              <div>
                <Label className="file-name mt-1">{val.file['name']}</Label>
                {true ? (
                  val.loading ? (
                    val.loader
                  ) : val.link ? (
                    <>
                      <Label className="text-primary mx-1">
                        File Uploaded Successfully.
                      </Label>
                      <i className="fas fa-check-circle m-2" />
                    </>
                  ) : (
                    <div className="text-danger">
                      File upload process took too long. Please try again!{' '}
                    </div>
                  )
                ) : (
                  <></>
                )}
              </div>
            )}
            {validation.touched[val.name] && validation.errors[val.name] ? (
              <FormFeedback type="invalid">
                {validation.errors[val.name]}
              </FormFeedback>
            ) : null}
          </div>
        );
      })}
    </>
  );
};
