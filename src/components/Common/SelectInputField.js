import React, { useRef } from 'react';
import { Label, Row, Col, Card, UncontrolledTooltip } from 'reactstrap';
import Select, { components } from 'react-select';

const { Option } = components;

const SelectInputField = props => {
  const {
    label = '',
    name = '',
    optionsArr = [],
    validation,
    fontSize = '11px',
    classnameForDiv = 'mb-3',
    classnameForLabel = 'form-label',
    classnameForLabelDivElement = '',
    classnameForSelectElement = '',
    showInfoBtn = false,
    disabled = false,
    showLabel = true,
    showvalidation = true,
    styles = {
      menu: (provided, state) => ({
        ...provided,
        backgroundColor: 'white',
      }),
    },
  } = props;

  const IconOption = props => (
    <Option {...props}>
      {showInfoBtn ? (
        <Row className="align-items-center">
          <Col>
            <div className="font-weight-bold">{props?.data?.label}</div>
          </Col>
          <Col className="text-end">
            <i
              className="fas fa-info-circle"
              id={`index${props?.data?.index}`}
              style={{ cursor: 'pointer' }}
            />
            <UncontrolledTooltip
              // placement="right"
              target={`index${props?.data?.index}`}
              style={{ maxWidth: '100%' }}
            >
              {Object.entries(props?.data?.tooltipData).map(
                ([key, value], index) => (
                  <div key={index} className="row text-nowrap fs-6">
                    <Col className="text-start">{key} : </Col>
                    <Col className="text-end">{value}</Col>
                  </div>
                )
              )}
            </UncontrolledTooltip>
          </Col>
        </Row>
      ) : (
        props?.data?.label
      )}
    </Option>
  );

  return (
    <div className={classnameForDiv}>
      {showLabel && (
        <div className={classnameForLabelDivElement}>
          <Label className={classnameForLabel}>{label}</Label>
        </div>
      )}
      <div className={classnameForSelectElement}>
        <Select
          name={name}
          // classNamePrefix="select"
          styles={styles}
          isClearable={true}
          isRtl={false}
          isSearchable={true}
          isLoading={optionsArr?.length > 0 ? false : true}
          options={optionsArr}
          components={{ Option: IconOption }}
          isDisabled={disabled}
          value={optionsArr[validation.values[name]] || ''}
          onChange={selectedOption => {
            let event = {
              target: {
                name: name,
                // value: {
                //   challanId: selectedOption['challanId'],
                //   orgName: selectedOption['value'],
                // },
                value: selectedOption?.index >= 0 ? selectedOption.index : '',
                // id: selectedOption?.retailerOrgId || '',
              },
            };
            validation.handleChange(event);
          }}
          onBlur={() => {
            validation.setFieldTouched(name);
          }}
        />
        {showvalidation &&
          (validation.touched[name] && validation.errors[name] ? (
            <span
              type="invalid"
              className="text-danger"
              style={{ fontSize: fontSize }}
            >
              {validation.errors[name]}
            </span>
          ) : null)}
      </div>
    </div>
  );
};
export default SelectInputField;
