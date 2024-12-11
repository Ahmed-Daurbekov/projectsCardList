import React from 'react';
import './Loader.scss'

const Loader = () => {
  return (
    <div className="wrapp">
      <div className="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
    </div>
  );
};

export default Loader;