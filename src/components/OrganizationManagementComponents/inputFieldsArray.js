const inputFieldsForCreateOrg = [
  {
    id: 1,
    type: 'string',
    label: 'Organization Name  * [As Per GST]',
    name: 'companyName',
    placeholder: 'Enter Organization Name',
  },
  {
    id: 2,
    type: 'string',
    label: 'Registered Name   * [As Per PAN]',
    name: 'registeredName',
    placeholder: 'Enter Your Registered Company Name As Per PAN',
  },
  {
    id: 3,
    type: 'select',
    label: 'Organization Type *',
    name: 'organizationType',
    placeholder: 'Select Organization Type',
  },
  {
    id: 4,
    type: 'select',
    label: 'Organization Operation Type *',
    name: 'organizationOperationType',
    placeholder: 'Select Organization Operation Type',
  },

  {
    id: 5,
    type: 'string',
    label: 'Admin Name *',
    name: 'adminName',
    placeholder: 'Enter Name of the Admin',
  },
  {
    id: 6,
    type: 'email',
    label: 'Admin Email ID *',
    name: 'adminEmailId',
    placeholder: 'Enter Admin Email Id',
  },
  {
    id: 7,
    type: 'string',
    label: 'Admin Mob Number *',
    name: 'adminPhoneNo',
    placeholder: 'Enter Admin Phone Number',
  },

  {
    id: 8,
    type: 'string',
    label: 'Address Line 1 *',
    name: 'addressLine1',
    placeholder: 'Enter address',
  },
  {
    id: 9,
    type: 'string',
    label: 'Address Line 2',
    name: 'addressLine2',
    placeholder: 'Enter address',
  },
  {
    id: 10,
    type: 'string',
    label: 'City *',
    name: 'city',
    placeholder: 'Select a City',
  },
  {
    id: 11,
    type: 'string',
    label: 'State *',
    name: 'state',
    placeholder: 'Select a State',
  },

  {
    id: 12,
    type: 'number',
    label: 'Pincode *',
    name: 'pinCode',
    placeholder: 'Enter Pincode',
  },

  {
    id: 13,
    type: 'string',
    label: 'PAN Number *',
    name: 'panNumber',
    placeholder: 'Enter Pan Number',
  },
  {
    id: 14,
    type: 'string',
    label: 'GST Number *',
    name: 'gstInNumber',
    placeholder: 'Enter GST Number',
  },
];

const inputFieldsForEditOrg = [
  {
    id: 1,
    type: 'string',
    label: 'Organization Name  * [As Per GST]',
    name: 'companyName',
    placeholder: 'Enter Organization Name',
  },
  {
    id: 2,
    type: 'string',
    label: 'Registered Name  * [As Per PAN] *',
    name: 'registeredName',
    placeholder: 'Enter Your Registered Company Name As Per PAN',
  },
  {
    id: 3,
    type: 'select',
    label: 'Organization Type *',
    name: 'organizationType',
    placeholder: 'Select Organization Type',
  },
  {
    id: 4,
    type: 'select',
    label: 'Organization Operation Type *',
    name: 'organizationOperationType',
    placeholder: 'Select Organization Operation Type',
  },
  /*  
    {
      id: 4,
      type: 'string',
      label: 'Admin Name *',
      name: 'adminName',
      placeholder: 'Enter Name of the Admin',
    },
    {
      id: 5,
      type: 'email',
      label: 'Admin Email ID *',
      name: 'adminEmailId',
      placeholder: 'Enter Admin Email Id',
    },
    {
      id: 6,
      type: 'string',
      label: 'Admin Mob Number *',
      name: 'adminPhoneNo',
      placeholder: 'Enter Admin Phone Number',
    },
  
    {
      id: 7,
      type: 'string',
      label: 'Address Line 1 *',
      name: 'addressLine1',
      placeholder: 'Enter address',
    },
    {
      id: 8,
      type: 'string',
      label: 'Address Line 2',
      name: 'addressLine2',
      placeholder: 'Enter address',
    },
    {
      id: 9,
      type: 'select',
      label: 'City *',
      name: 'city',
      placeholder: 'Select a City',
    },
    {
      id: 10,
      type: 'select',
      label: 'State *',
      name: 'state',
      placeholder: 'Select a State',
    },
    
    {
      id: 11,
      type: 'number',
      label: 'Pincode *',
      name: 'pinCode',
      placeholder: 'Enter Pincode',
    },
  */
  {
    id: 13,
    type: 'string',
    label: 'PAN Number *',
    name: 'panNumber',
    placeholder: 'Enter Pan Number',
  },
  {
    id: 14,
    type: 'string',
    label: 'GST Number *',
    name: 'gstInNumber',
    placeholder: 'Enter GST Number',
  },
];

export { inputFieldsForCreateOrg, inputFieldsForEditOrg };

//THINGS TO IMPROVE IN FUTURE
/*
 => createorg File
  -> City,state,admin phone number type should be corrected (in backend it is set to number and string) (check at line 384)
  -> apply validatonschema from yup (check at line 341)
  -> error messages for all api's should be corrected. (the messages from backend are invalid)
  -> no error essage form the doc upload api. (backend decTopSellingData't give any message, it only gives back the link)

 => view&edit File
  -> City,state,admin phone number type should be corrected (in backend it is set to number and string) (check at line 384)
  -> apply validatonschema from yup (check at line 341)
  -> error messages for all api's should be corrected. (the messages from backend are invalid)
  -> no error essage form the doc upload api. (backend decTopSellingData't give any message, it only gives back the link)
*/
