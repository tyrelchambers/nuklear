import React from 'react';
import './Settings.scss'

const Settings = () => {
  return (
    <div className="settings-wrapper">
      <h3>Settings</h3>

      <div className="d-f ai-c setting-item" onClick={() => window.location.reload()}>
        <i class="fas fa-redo-alt mr-"></i>
        <p>Reload messages</p>
      </div>
    </div>
  );
}

export default Settings;
