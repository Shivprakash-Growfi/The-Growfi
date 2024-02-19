import React from 'react';
import CreateLenderProduct from './CreateLenderProduct';
import OrgLenderProductMapping from './OrgLenderProductMapping';

function LenderManagement() {
  return (
    <React.Fragment>
      <div className="page-content">
        {true ? (
          <CreateLenderProduct isShowCreate={true} />
        ) : (
          <OrgLenderProductMapping isShowCreate={false} />
        )}
      </div>
    </React.Fragment>
  );
}

export default LenderManagement;
