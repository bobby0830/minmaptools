// Save and Load panel component
// 保存和加载面板组件
import React, { useCallback } from 'react';
import { useReactFlow } from 'reactflow';

function SaveLoadPanel({ nodes, edges, setNodes, setEdges }) {
  const { setViewport } = useReactFlow();

  // Handle saving the mind map
  const handleSave = useCallback(() => {
    const flowData = {
      nodes,
      edges,
      viewport: {
        x: 0,
        y: 0,
        zoom: 1,
      },
    };
    const dataStr = JSON.stringify(flowData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataUri);
    downloadAnchorNode.setAttribute('download', 'mindmap.json');
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }, [nodes, edges]);

  // Handle loading a mind map
  const handleLoad = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const flowData = JSON.parse(e.target.result);
          
          // Ensure nodes have the correct onChange handler
          const nodesWithCallbacks = flowData.nodes.map(node => ({
            ...node,
            data: {
              ...node.data,
              onChange: (label) => {
                setNodes((nds) =>
                  nds.map((n) => {
                    if (n.id === node.id) {
                      return {
                        ...n,
                        data: { ...n.data, label },
                      };
                    }
                    return n;
                  })
                );
              },
            },
          }));

          setNodes(nodesWithCallbacks);
          setEdges(flowData.edges);
          
          if (flowData.viewport) {
            setViewport(flowData.viewport);
          }
        } catch (error) {
          console.error('Error loading file:', error);
          alert('Error loading file: Invalid format\n加载文件错误：格式无效');
        }
      };
      reader.readAsText(file);
    }
  }, [setNodes, setEdges, setViewport]);

  return (
    <div className="save-load-panel">
      <button 
        className="action-button save" 
        onClick={handleSave}
        title="Save mind map to JSON file"
      >
        <span role="img" aria-label="save">💾</span> Save
      </button>
      <label 
        className="action-button load"
        title="Load mind map from JSON file"
      >
        <span role="img" aria-label="load">📂</span> Load
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
