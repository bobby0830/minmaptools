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
import NodeControls from './components/NodeControls';
import SaveLoadPanel from './components/SaveLoadPanel';
import ExportPanel from './components/ExportPanel';
import Toolbar from './components/Toolbar';

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

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onApplyFramework = useCallback((frameworkType) => {
    const template = getFrameworkTemplate(frameworkType);
    if (template) {
      setNodes(template.nodes);
      setEdges(template.edges);
    }
  }, [getFrameworkTemplate, setNodes, setEdges]);

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
        
        <Panel position="top-left">
          <div className="framework-buttons">
            <select onChange={(e) => onApplyFramework(e.target.value)}>
              <option value="">選擇框架 (Select Framework)</option>
              {getAvailableFrameworks().map(framework => (
                <option key={framework.id} value={framework.id}>
                  {framework.name}
                </option>
              ))}
            </select>
          </div>
        </Panel>

        <Panel position="top-right">
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
