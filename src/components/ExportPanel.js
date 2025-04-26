import React, { useState, useCallback } from 'react';
import { Panel, useReactFlow } from 'reactflow';
import { toPng } from 'html-to-image';

function ExportPanel() {
  const [showPanel, setShowPanel] = useState(false);
  const { getNodes } = useReactFlow();
  
  // Function to export the mindmap as a PNG image
  const exportAsPng = useCallback(() => {
    try {
      // Get the React Flow viewport element
      const reactFlowContainer = document.querySelector('.react-flow');
      if (!reactFlowContainer) {
        alert('无法找到思维导图画布 / Cannot find the mindmap canvas');
        return;
      }
      
      // Temp hide controls for cleaner export
      const controls = document.querySelector('.react-flow__controls');
      const minimap = document.querySelector('.react-flow__minimap');
      const panels = document.querySelectorAll('.react-flow__panel');
      
      // Store original visibility
      const controlsStyle = controls?.style.display;
      const minimapStyle = minimap?.style.display;
      const panelStyles = Array.from(panels).map(panel => panel.style.display);
      
      // Hide UI elements
      if (controls) controls.style.display = 'none';
      if (minimap) minimap.style.display = 'none';
      panels.forEach(panel => {
        panel.style.display = 'none';
      });
      
      // Generate PNG from the container
      toPng(reactFlowContainer, {
        quality: 1,
        backgroundColor: '#ffffff',
        pixelRatio: 2
      })
        .then((dataUrl) => {
          // Create download link
          const link = document.createElement('a');
          link.download = `mindmap-${new Date().toISOString().slice(0, 10)}.png`;
          link.href = dataUrl;
          link.click();
        })
        .catch((error) => {
          console.error('Error exporting as PNG:', error);
          alert('导出失败 / Export failed: ' + error.message);
        })
        .finally(() => {
          // Restore visibility of UI elements
          if (controls) controls.style.display = controlsStyle;
          if (minimap) minimap.style.display = minimapStyle;
          panels.forEach((panel, i) => {
            panel.style.display = panelStyles[i];
          });
        });
    } catch (error) {
      console.error('Error in PNG export:', error);
      alert('导出过程出错 / Error during export: ' + error.message);
    }
  }, [getNodes]);

  return (
    <Panel position="bottom-right" className="export-panel">
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
          {showPanel ? '导出选项 ▲' : '导出选项 ▼'}
        </button>
        
        {showPanel && (
          <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={exportAsPng}
              style={{
                background: '#673ab7',
                color: 'white',
                border: 'none',
                padding: '8px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              🖼️ 导出为PNG图片 / Export as PNG
            </button>
            
            <div style={{ 
              fontSize: '12px', 
              marginTop: '8px', 
              padding: '8px', 
              background: '#f5f5f5', 
              borderRadius: '4px' 
            }}>
              <p style={{ margin: '0 0 5px 0' }}>
                <strong>使用提示 / Tips:</strong>
              </p>
              <ul style={{ paddingLeft: '15px', margin: '0' }}>
                <li>双击节点可以编辑文字 / Double-click nodes to edit text</li>
                <li>双击画布添加节点 / Double-click the canvas to add nodes</li>
                <li>拖拽连接点创建连线 / Drag between nodes to create connections</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </Panel>
  );
}

export default ExportPanel;
