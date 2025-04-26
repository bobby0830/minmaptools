import React, { useState } from 'react';
import { Panel } from 'reactflow';

function SaveLoadPanel({ nodes, edges, setNodes, setEdges }) {
  const [showPanel, setShowPanel] = useState(false);

  // Save current mindmap to localStorage
  const saveToLocalStorage = () => {
    try {
      const data = { nodes, edges };
      localStorage.setItem('mindmap-data', JSON.stringify(data));
      alert('思维导图已保存！ / Mindmap saved!');
    } catch (error) {
      console.error('Error saving mindmap:', error);
      alert('保存失败 / Save failed: ' + error.message);
    }
  };

  // Load mindmap from localStorage
  const loadFromLocalStorage = () => {
    try {
      const savedData = localStorage.getItem('mindmap-data');
      if (savedData) {
        const { nodes: savedNodes, edges: savedEdges } = JSON.parse(savedData);
        
        // Make sure to keep the onChange handlers for nodes
        const nodesWithHandlers = savedNodes.map(node => ({
          ...node,
          data: {
            ...node.data,
            onChange: (newLabel) => {
              setNodes(nds =>
                nds.map(n => {
                  if (n.id === node.id) {
                    return {
                      ...n,
                      data: { ...n.data, label: newLabel }
                    };
                  }
                  return n;
                })
              );
            }
          }
        }));
        
        setNodes(nodesWithHandlers);
        setEdges(savedEdges);
        alert('思维导图已加载！ / Mindmap loaded!');
      } else {
        alert('没有找到保存的数据 / No saved data found!');
      }
    } catch (error) {
      console.error('Error loading mindmap:', error);
      alert('加载失败 / Load failed: ' + error.message);
    }
  };

  // Export mindmap data as JSON file
  const exportAsJson = () => {
    try {
      const data = { nodes, edges };
      const dataStr = JSON.stringify(data, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `mindmap-export-${new Date().toISOString().slice(0, 10)}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (error) {
      console.error('Error exporting mindmap:', error);
      alert('导出失败 / Export failed: ' + error.message);
    }
  };

  // Import mindmap from JSON file
  const importFromJson = (event) => {
    try {
      const file = event.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const { nodes: importedNodes, edges: importedEdges } = JSON.parse(e.target.result);
          
          // Add onChange handlers to imported nodes
          const nodesWithHandlers = importedNodes.map(node => ({
            ...node,
            data: {
              ...node.data,
              onChange: (newLabel) => {
                setNodes(nds =>
                  nds.map(n => {
                    if (n.id === node.id) {
                      return {
                        ...n,
                        data: { ...n.data, label: newLabel }
                      };
                    }
                    return n;
                  })
                );
              }
            }
          }));
          
          setNodes(nodesWithHandlers);
          setEdges(importedEdges);
          alert('思维导图已导入！ / Mindmap imported!');
        } catch (parseError) {
          console.error('Error parsing JSON:', parseError);
          alert('无效的JSON文件 / Invalid JSON file');
        }
      };
      reader.readAsText(file);
    } catch (error) {
      console.error('Error importing mindmap:', error);
      alert('导入失败 / Import failed: ' + error.message);
    }
  };

  return (
    <Panel position="top-right" className="save-load-panel">
      <div className="panel-container" style={{
        background: 'white',
        padding: '10px',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        width: showPanel ? '250px' : 'auto',
        transition: 'width 0.3s'
      }}>
        <button
          onClick={() => setShowPanel(!showPanel)}
          style={{
            background: '#f0f0f0',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'block',
            width: '100%',
            textAlign: 'left'
          }}
        >
          {showPanel ? '保存/加载 ▲' : '保存/加载 ▼'}
        </button>
        
        {showPanel && (
          <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={saveToLocalStorage}
              style={{
                background: '#4285f4',
                color: 'white',
                border: 'none',
                padding: '8px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              💾 保存到浏览器 / Save
            </button>
            
            <button
              onClick={loadFromLocalStorage}
              style={{
                background: '#34a853',
                color: 'white',
                border: 'none',
                padding: '8px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              📂 从浏览器加载 / Load
            </button>
            
            <button
              onClick={exportAsJson}
              style={{
                background: '#fbbc05',
                color: 'white',
                border: 'none',
                padding: '8px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              📤 导出为JSON / Export
            </button>
            
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => document.getElementById('file-input').click()}
                style={{
                  background: '#ea4335',
                  color: 'white',
                  border: 'none',
                  padding: '8px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                📥 导入JSON / Import
              </button>
              <input
                id="file-input"
                type="file"
                accept=".json"
                onChange={importFromJson}
                style={{ display: 'none' }}
              />
            </div>
          </div>
        )}
      </div>
    </Panel>
  );
}

export default SaveLoadPanel;
