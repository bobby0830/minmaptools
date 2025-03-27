import React, { useState, useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import './App.css';

import CustomNode from './components/CustomNode.js';
import SaveLoadPanel from './components/SaveLoadPanel.js';
import ExportPanel from './components/ExportPanel.js';

// 定義節點類型
const nodeTypes = {
  custom: CustomNode,
};

// 定義可用的形狀
const availableShapes = {
  terminal: { label: '開始/結束', icon: '⭕', description: '表示流程的開始或結束' },
  process: { label: '處理', icon: '📦', description: '表示一個處理步驟' },
  decision: { label: '決策', icon: '💎', description: '表示條件判斷' },
  input: { label: '輸入/輸出', icon: '📥', description: '表示數據的輸入或輸出' },
  database: { label: '數據庫', icon: '💾', description: '表示數據庫操作' },
  document: { label: '文檔', icon: '📄', description: '表示文檔處理' },
  display: { label: '顯示', icon: '🖥️', description: '表示顯示輸出' },
  manual: { label: '人工操作', icon: '👆', description: '表示人工操作步驟' },
  preparation: { label: '初始化', icon: '🔧', description: '表示準備或初始化步驟' },
  connector: { label: '連接點', icon: '🔗', description: '表示流程連接點' },
  predefined: { label: '預定義流程', icon: '📋', description: '表示預定義的處理流程' },
  annotation: { label: '註解', icon: '💭', description: '表示註釋或說明' },
};

// 主應用組件
function App() {
  // 狀態管理
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedShape, setSelectedShape] = useState('terminal');
  const [nodeCount, setNodeCount] = useState(0);

  // 處理連接
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // 添加新節點
  const addNode = useCallback(() => {
    const shape = selectedShape;
    const shapeConfig = availableShapes[shape];
    
    const newNode = {
      id: `node_${nodeCount + 1}`,
      type: 'custom',
      position: { x: 100, y: 100 + (nodeCount * 100) },
      data: {
        label: `${shapeConfig.icon} ${shapeConfig.label}`,
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

  // 渲染界面
  return (
    <div className="app">
      <div className="toolbar">
        <select
          value={selectedShape}
          onChange={(e) => setSelectedShape(e.target.value)}
          className="shape-selector"
        >
          {Object.entries(availableShapes).map(([key, { label, icon, description }]) => (
            <option key={key} value={key} title={description}>
              {icon} {label}
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
          <Panel position="top-right" className="tips-panel">
            <div className="tips">
              <h3>使用提示：</h3>
              <ul>
                <li>選擇形狀並點擊"添加節點"來創建新節點</li>
                <li>雙擊節點可以編輯文字</li>
                <li>拖動節點可以改變位置</li>
                <li>拖動節點的小圓點可以創建連接</li>
                <li>使用右上角的控制項可以縮放和平移</li>
              </ul>
            </div>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
}

export default App;
