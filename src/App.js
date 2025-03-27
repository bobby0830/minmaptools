// Import necessary dependencies
import React, { useState, useCallback, useRef } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  ReactFlowProvider,
  SelectionMode,
} from 'reactflow';
import 'reactflow/dist/style.css';
import './App.css';

// Import custom components
import CustomNode from './components/CustomNode';
import { useFrameworkTemplates } from './components/FrameworkTemplates';
import SaveLoadPanel from './components/SaveLoadPanel';
import ExportPanel from './components/ExportPanel';

// Define node types mapping
const nodeTypes = {
  custom: CustomNode,
  input: CustomNode,
  output: CustomNode,
  default: CustomNode,
};

// Initial nodes for the mind map
const initialNodes = [
  {
    id: 'main',
    type: 'custom',
    data: { 
      label: 'Main Topic\n主題',
      type: 'idea',
      color: '#99ff99',
      size: 'medium',
      shape: 'terminal',
    },
    position: { x: 400, y: 100 },
  },
];

const initialEdges = [];

function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { getFrameworkTemplate, getAvailableFrameworks } = useFrameworkTemplates();
  const [selectedFramework, setSelectedFramework] = useState('');
  const [selectedShape, setSelectedShape] = useState('terminal');

  const shapes = {
    terminal: { label: '開始/結束 Start/End', style: 'shape-terminal' },
    process: { label: '處理 Process', style: 'shape-process' },
    decision: { label: '決策 Decision', style: 'shape-decision' },
    input: { label: '輸入/輸出 Input/Output', style: 'shape-input' },
    database: { label: '數據庫 Database', style: 'shape-database' },
    document: { label: '文檔 Document', style: 'shape-document' },
    display: { label: '顯示 Display', style: 'shape-display' },
    manual: { label: '人工操作 Manual', style: 'shape-manual' },
    preparation: { label: '初始化 Preparation', style: 'shape-preparation' },
    connector: { label: '連接點 Connector', style: 'shape-connector' },
    predefined: { label: '預定義流程 Predefined', style: 'shape-predefined' },
    annotation: { label: '註解 Annotation', style: 'shape-annotation' }
  };

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const addNode = useCallback((position, data = {}) => {
    const newNode = {
      id: `node_${nodes.length + 1}`,
      type: 'custom',
      position,
      data: {
        label: `Node ${nodes.length + 1}`,
        type: 'idea',
        color: '#ffffff',
        size: 'medium',
        shape: data.shape || 'terminal',
      },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [nodes.length, setNodes]);

  const onPaneClick = useCallback(
    (event) => {
      if (event.detail === 2 && event.target.classList.contains('react-flow__pane')) {
        const bounds = event.target.getBoundingClientRect();
        const position = {
          x: event.clientX - bounds.left,
          y: event.clientY - bounds.top,
        };
        addNode(position);
      }
    },
    [addNode]
  );

  const onApplyFramework = useCallback((frameworkType) => {
    if (!frameworkType) return;
    const template = getFrameworkTemplate(frameworkType);
    if (template) {
      setNodes(template.nodes);
      setEdges(template.edges);
    }
  }, [getFrameworkTemplate, setNodes, setEdges]);

  const handleFrameworkChange = useCallback((e) => {
    setSelectedFramework(e.target.value);
    onApplyFramework(e.target.value);
  }, [onApplyFramework]);

  const onAdd = useCallback(() => {
    addNode({
      x: 100,
      y: 100,
      data: { shape: selectedShape }
    });
  }, [addNode, selectedShape]);

  const handleExportPNG = useCallback(() => {
    // implement export to PNG logic here
  }, []);

  const handleExportPDF = useCallback(() => {
    // implement export to PDF logic here
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
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
        
        <Panel position="top-left" className="button-panel">
          <div className="control-group">
            <button className="add-node-button" onClick={onAdd}>
              ➕ Add Node
            </button>
            <select 
              className="framework-select" 
              value={selectedFramework} 
              onChange={handleFrameworkChange}
            >
              <option value="">選擇框架 (Select Framework)</option>
              <option value="pareto">82法則 (Pareto Principle)</option>
              <option value="flowchart">流程圖 (Flowchart)</option>
            </select>
            <select
              className="shape-select"
              value={selectedShape}
              onChange={(e) => setSelectedShape(e.target.value)}
            >
              <option value="terminal">⭕ 開始/結束 Start/End</option>
              <option value="process">📦 處理 Process</option>
              <option value="decision">💎 決策 Decision</option>
              <option value="input">📥 輸入/輸出 Input/Output</option>
              <option value="database">💾 數據庫 Database</option>
              <option value="document">📄 文檔 Document</option>
              <option value="display">🖥️ 顯示 Display</option>
              <option value="manual">👆 人工操作 Manual</option>
              <option value="preparation">🔧 初始化 Preparation</option>
              <option value="connector">🔗 連接點 Connector</option>
              <option value="predefined">📋 預定義流程 Predefined</option>
              <option value="annotation">💭 註解 Annotation</option>
            </select>
          </div>
        </Panel>

        <Panel position="top-right" className="action-panel">
          <div className="export-buttons">
            <button className="export-button png" onClick={handleExportPNG}>
              🖼️ PNG
            </button>
            <button className="export-button pdf" onClick={handleExportPDF}>
              📄 PDF
            </button>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}

function App() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}

export default App;
