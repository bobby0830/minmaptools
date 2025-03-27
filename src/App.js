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
      shape: 'rectangle',
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

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const addNode = useCallback((position) => {
    const newNode = {
      id: `node_${nodes.length + 1}`,
      type: 'custom',
      position,
      data: {
        label: `Node ${nodes.length + 1}`,
        type: 'idea',
        color: '#ffffff',
        size: 'medium',
        shape: 'rectangle',
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
    addNode({ x: 100, y: 100 });
  }, [addNode]);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
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
          </div>
        </Panel>

        <Panel position="top-right" className="action-panel">
          <ExportPanel nodes={nodes} />
          <SaveLoadPanel
            onSave={() => ({ nodes, edges })}
            onLoad={(flow) => {
              setNodes(flow.nodes || []);
              setEdges(flow.edges || []);
            }}
          />
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
