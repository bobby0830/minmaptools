// Save and Load panel component
// 保存和加载面板组件
import React from 'react';

function SaveLoadPanel({ onSave, onLoad }) {
  const handleSave = () => {
    onSave();
  };

  const handleLoad = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          onLoad(data);
        } catch (error) {
          alert('Error loading file: Invalid format\n加载文件错误：格式无效');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="save-load-panel">
      <button className="action-button save" onClick={handleSave}>
        <span role="img" aria-label="save">💾</span> Save Mind Map | 保存思维导图
      </button>
      <label className="action-button load">
        <span role="img" aria-label="load">📂</span> Load Mind Map | 加载思维导图
        <input
          type="file"
          accept=".json"
          onChange={handleLoad}
          style={{ display: 'none' }}
        />
      </label>
    </div>
  );
}

export default SaveLoadPanel;
