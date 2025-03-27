// Save and Load panel component
// 保存和加载面板组件
import React from 'react';

const SaveLoadPanel = ({ nodes, edges, setNodes, setEdges }) => {
  // 保存流程圖
  const saveFlow = () => {
    const flow = { nodes, edges };
    const json = JSON.stringify(flow);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'flowchart.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 加載流程圖
  const loadFlow = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const flow = JSON.parse(e.target.result);
          setNodes(flow.nodes || []);
          setEdges(flow.edges || []);
        } catch (error) {
          console.error('Error loading flow:', error);
          alert('無法加載文件。請確保選擇了正確的 JSON 文件。');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="save-load-panel">
      <button onClick={saveFlow} className="save-btn" title="保存流程圖">
        💾 保存
      </button>
      <label className="load-btn" title="加載流程圖">
        📂 加載
        <input
          type="file"
          accept=".json"
          onChange={loadFlow}
          style={{ display: 'none' }}
        />
      </label>
    </div>
  );
};

export default SaveLoadPanel;
