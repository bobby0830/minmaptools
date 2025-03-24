// Import necessary dependencies
// 导入必要的依赖
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
// 导入自定义组件
import CustomNode from './components/CustomNode';
import NodeControls from './components/NodeControls';
import SaveLoadPanel from './components/SaveLoadPanel';
import ExportPanel from './components/ExportPanel';
import Toolbar from './components/Toolbar';
import TemplatePanel, { templates } from './components/TemplatePanel';
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
      shape: 'rectangle',
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
  const [nodeStyle, setNodeStyle] = useState({
    type: 'idea',
    color: '#99ff99',
    size: 'medium',
    shape: 'rectangle'
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
  const addNode = useCallback(
    (position) => {
      const newNode = {
        id: `node_${nodes.length + 1}`,
        type: 'custom',
        position,
        data: {
          label: `Node ${nodes.length + 1}`,
          ...nodeStyle,
          onChange: (newLabel) => {
            setNodes((nds) =>
              nds.map((node) => {
                if (node.id === newNode.id) {
                  node.data = { ...node.data, label: newLabel };
                }
                return node;
              })
            );
          },
        },
      };
      setNodes((nds) => [...nds, newNode]);
    },
    [nodes.length, nodeStyle, setNodes]
  );

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

  // Delete selected nodes when Delete key is pressed
  // 按Delete键删除选中的节点
  const onKeyDown = useCallback(
    (event) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        setNodes((nds) => nds.filter((node) => !node.selected));
        setEdges((eds) => eds.filter((edge) => !edge.selected));
      }
    },
    [setNodes, setEdges]
  );

  return (
    <div 
      style={{ width: '100vw', height: '100vh' }}
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        selectionMode={SelectionMode.Partial}
        selectionOnDrag={true}
        selectionKeyCode={null}
        multiSelectionKeyCode={null}
        deleteKeyCode={['Delete', 'Backspace']}
      >
        <Background variant="dots" gap={12} size={1} />
        <Controls />
        <MiniMap />
        <NodeControls
          onAddNode={(style) => {
            const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
            addNode(center);
          }}
          onNodeStyleChange={setNodeStyle}
        />
        <SaveLoadPanel 
          nodes={nodes} 
          edges={edges} 
          setNodes={setNodes} 
          setEdges={setEdges} 
        />
        <ExportPanel />
      </ReactFlow>
    </div>
  );
}

// Main App component
// 主应用组件
function App() {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <ReactFlowProvider>
        <Flow />
      </ReactFlowProvider>
    </div>
  );
}

export default App;
