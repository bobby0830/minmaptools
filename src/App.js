// Import necessary dependencies
// 导入必要的依赖
import React, { useCallback, useState, useEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  ReactFlowProvider,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import './App.css';

// Import custom components
// 导入自定义组件
import CustomNode from './components/CustomNode';
import Toolbar from './components/Toolbar';
import SaveLoadPanel from './components/SaveLoadPanel';
import TemplatePanel, { templates } from './components/TemplatePanel';
import ExportPanel from './components/ExportPanel';
import NodeControls from './components/NodeControls';
import AIService from './services/AIService';

// Define node types mapping
// 定义节点类型映射
const nodeTypes = {
  custom: CustomNode,
};

// Initial nodes for the mind map
// 思维导图的初始节点
const initialNodes = [
  {
    id: '1',
    type: 'custom',
    data: { 
      label: 'Main Topic\n主题',
      type: 'idea',
      color: '#99ff99',
      size: 'medium',
      onChange: (label) => console.log('label changed:', label) 
    },
    position: { x: 400, y: 100 },
  },
];

// Initial edges (connections) for the mind map
// 思维导图的初始连接
const initialEdges = [];

// Flow component that contains the actual mind map
// 包含实际思维导图的Flow组件
function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { project } = useReactFlow();
  const [nodeStyle, setNodeStyle] = useState({
    type: 'idea',
    color: '#99ff99',
    size: 'medium'
  });

  // Handle node label changes
  // 处理节点标签变化
  const handleNodeLabelChange = useCallback((nodeId, newLabel) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: { ...node.data, label: newLabel },
          };
        }
        return node;
      })
    );
  }, [setNodes]);

  // Add new node at a specific position
  // 在特定位置添加新节点
  const addNode = useCallback((position) => {
    const newNode = {
      id: Date.now().toString(),
      type: 'custom',
      data: { 
        label: 'New Node\n新节点',
        ...nodeStyle,
        onChange: (label) => handleNodeLabelChange(newNode.id, label)
      },
      position,
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes, nodeStyle, handleNodeLabelChange]);

  // Handle new connections between nodes
  // 处理节点之间的新连接
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Handle click on the canvas to add new node
  // 点击画布添加新节点
  const onPaneClick = useCallback(
    (event) => {
      if (event.detail === 2) { // Check for double-click
        const reactFlowBounds = document.querySelector('.react-flow').getBoundingClientRect();
        const position = project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });
        addNode(position);
      }
    },
    [project, addNode]
  );

  // Delete selected nodes when Delete key is pressed
  // 按Delete键删除选中的节点
  const onKeyDown = useCallback(
    (event) => {
      if (event.key === 'Delete') {
        setNodes((nds) => nds.filter((node) => !node.selected));
        setEdges((eds) => eds.filter((edge) => !edge.selected));
      }
    },
    [setNodes, setEdges]
  );

  return (
    <div className="flow-container" tabIndex={0} onKeyDown={onKeyDown}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
        <NodeControls
          onAddNode={(style) => {
            const center = project({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
            addNode(center);
          }}
          onNodeStyleChange={setNodeStyle}
        />
        <SaveLoadPanel nodes={nodes} edges={edges} setNodes={setNodes} setEdges={setEdges} />
        <ExportPanel />
      </ReactFlow>
    </div>
  );
}

// Main App component
// 主应用组件
function App() {
  return (
    <div className="app">
      <ReactFlowProvider>
        <Flow />
      </ReactFlowProvider>
    </div>
  );
}

export default App;
