import React from 'react';

export default function Preloader() {
  return (
    <div id="preloader">
      <div id="status">
        <div className="spinner-chase">
          <div className="chase-dot" />
          <div className="chase-dot" />
          <div className="chase-dot" />
        </div>
      </div>
    </div>
  );
}
