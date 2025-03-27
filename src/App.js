// Import necessary dependencies
import React, { useState, useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import './App.css';

import CustomNode from './components/CustomNode';
import SaveLoadPanel from './components/SaveLoadPanel';
import ExportPanel from './components/ExportPanel';

// Define node types mapping
const nodeTypes = {
  custom: CustomNode,
};

// Define available shapes
const availableShapes = {
  terminal: { label: '⭕ 開始/結束', description: '表示流程的開始或結束' },
  process: { label: '📦 處理', description: '表示一個處理步驟' },
  decision: { label: '💎 決策', description: '表示條件判斷' },
  input: { label: '📥 輸入/輸出', description: '表示數據的輸入或輸出' },
  database: { label: '💾 數據庫', description: '表示數據庫操作' },
  document: { label: '📄 文檔', description: '表示文檔處理' },
  display: { label: '🖥️ 顯示', description: '表示顯示輸出' },
  manual: { label: '👆 人工操作', description: '表示人工操作步驟' },
  preparation: { label: '🔧 初始化', description: '表示準備或初始化步驟' },
  connector: { label: '🔗 連接點', description: '表示流程連接點' },
  predefined: { label: '📋 預定義流程', description: '表示預定義的處理流程' },
  annotation: { label: '💭 註解', description: '表示註釋或說明' },
};

// Main application component
function App() {
  // State management
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedShape, setSelectedShape] = useState('terminal');
  const [nodeCount, setNodeCount] = useState(0);

  // Handle connection
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Add new node
  const addNode = useCallback(() => {
    const shape = selectedShape;
    const shapeConfig = availableShapes[shape];
    
    const newNode = {
      id: `node_${nodeCount + 1}`,
      type: 'custom',
      position: { x: 100, y: 100 + (nodeCount * 100) },
      data: {
        label: `${shapeConfig.label}`,
        shape: shape,
        onChange: (newLabel) => {
          setNodes((nds) =>
            nds.map((node) => {
              if (node.id === `node_${nodeCount + 1}`) {
                node.data = {
                  ...node.data,
                  label: newLabel,
                };
              }
              return node;
            })
          );
        },
      },
    };

    setNodes((nds) => [...nds, newNode]);
    setNodeCount((count) => count + 1);
  }, [nodeCount, selectedShape, setNodes]);

  // Render interface
  return (
    <div className="app">
      <div className="toolbar">
        <select
          value={selectedShape}
          onChange={(e) => setSelectedShape(e.target.value)}
          className="shape-selector"
        >
          {Object.entries(availableShapes).map(([key, { label, description }]) => (
            <option key={key} value={key} title={description}>
              {label}
            </option>
          ))}
        </select>
        <button onClick={addNode} className="add-node-btn">
          添加節點
        </button>
        <SaveLoadPanel nodes={nodes} edges={edges} setNodes={setNodes} setEdges={setEdges} />
        <ExportPanel nodes={nodes} edges={edges} />
      </div>
      
      <div className="flow-container">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
}

export default App;
