import React from 'react';
const remote = window.require('@electron/remote');

const TitleBar = () => {
  const handleClose = () => {
    const window = remote.getCurrentWindow();
    window.close();
  };

  const handleMinimize = () => {
    const window = remote.getCurrentWindow();
    window.minimize();
  };

  const handleMaximize = () => {
    const window = remote.getCurrentWindow();
    if (window.isMaximized()) {
      window.unmaximize();
    } else {
      window.maximize();
    }
  };

  return (
    <div className="title-bar">
      <div className="window-controls">
        <button className="window-control close" onClick={handleClose}></button>
        <button className="window-control minimize" onClick={handleMinimize}></button>
        <button className="window-control maximize" onClick={handleMaximize}></button>
      </div>
      <div className="window-title">Not Defteri</div>
    </div>
  );
};

export default TitleBar; 