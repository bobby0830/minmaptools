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
  const { project, getNodes, getEdges } = useReactFlow();
  const [selectedNodeType, setSelectedNodeType] = useState('idea');
  const [showTemplates, setShowTemplates] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);

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

  // Handle template selection
  // 处理模板选择
  const handleTemplateSelect = useCallback((template) => {
    const nodesWithCallbacks = template.nodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        onChange: (label) => handleNodeLabelChange(node.id, label),
      },
    }));
    setNodes(nodesWithCallbacks);
    setEdges(template.edges);
    setShowTemplates(false);
  }, [setNodes, setEdges, handleNodeLabelChange]);

  // Handle new connections between nodes
  // 处理节点之间的新连接
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Add new node when double clicking on the canvas
  // 双击画布时添加新节点
  const onDoubleClick = useCallback(
    (event) => {
      const reactFlowBounds = event.target.getBoundingClientRect();
      const position = project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode = {
        id: Date.now().toString(),
        type: 'custom',
        data: { 
          label: 'New Node\n新节点',
          type: selectedNodeType,
          onChange: (label) => handleNodeLabelChange(newNode.id, label)
        },
        position,
      };
      setNodes((nds) => [...nds, newNode]);
    },
    [project, setNodes, selectedNodeType, handleNodeLabelChange]
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

  // Save mind map to JSON file
  // 保存思维导图到JSON文件
  const handleSave = useCallback(() => {
    const flowData = {
      nodes: getNodes(),
      edges: getEdges(),
    };
    const dataStr = JSON.stringify(flowData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataUri);
    downloadAnchorNode.setAttribute('download', 'mindmap.json');
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }, [getNodes, getEdges]);

  // Load mind map from JSON file
  // 从JSON文件加载思维导图
  const handleLoad = useCallback((flowData) => {
    const nodes = flowData.nodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        onChange: (label) => handleNodeLabelChange(node.id, label),
      },
    }));
    setNodes(nodes);
    setEdges(flowData.edges);
  }, [setNodes, setEdges, handleNodeLabelChange]);

  // Clear current mind map
  // 清除当前思维导图
  const handleClear = useCallback(() => {
    setNodes([]);
    setEdges([]);
  }, [setNodes, setEdges]);

  // AI Analysis effect
  useEffect(() => {
    const analyzeMap = async () => {
      try {
        const analysis = await AIService.analyzeMap(nodes, edges);
        setAiSuggestions(analysis.suggestions);
      } catch (error) {
        console.error('Error analyzing map:', error);
      }
    };

    // Analyze map when nodes or edges change
    if (nodes.length > 0) {
      analyzeMap();
    }
  }, [nodes, edges]);

  // Handle AI suggestions
  const handleAISuggestion = useCallback((suggestion) => {
    if (suggestion.type === 'expansion') {
      const parentNode = nodes.find(node => node.id === suggestion.nodeId);
      if (parentNode) {
        const position = {
          x: parentNode.position.x + 200,
          y: parentNode.position.y
        };

        const newNode = {
          id: Date.now().toString(),
          type: 'custom',
          data: { 
            label: suggestion.suggestions[0],
            type: selectedNodeType,
            onChange: (label) => handleNodeLabelChange(newNode.id, label)
          },
          position,
        };

        setNodes((nds) => [...nds, newNode]);
        setEdges((eds) => [...eds, {
          id: `e${parentNode.id}-${newNode.id}`,
          source: parentNode.id,
          target: newNode.id
        }]);
      }
    }
  }, [nodes, selectedNodeType, setNodes, setEdges]);

  return (
    <div className="flow-wrapper" tabIndex={0} onKeyDown={onKeyDown}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDoubleClick={onDoubleClick}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
        <Panel position="top-left">
          <Toolbar 
            onNodeTypeSelect={setSelectedNodeType}
            selectedType={selectedNodeType}
          />
        </Panel>
        <Panel position="top-right">
          <div className="action-panels">
            <SaveLoadPanel 
              onSave={handleSave}
              onLoad={handleLoad}
            />
            <ExportPanel reactFlowInstance={useReactFlow()} />
            {aiSuggestions.length > 0 && (
              <div className="ai-suggestions">
                <h4>AI Suggestions</h4>
                {aiSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className="suggestion-button"
                    onClick={() => handleAISuggestion(suggestion)}
                  >
                    {suggestion.suggestions[0]}
                  </button>
                ))}
              </div>
            )}
            <div className="template-actions">
              <button 
                className="action-button template" 
                onClick={() => setShowTemplates(!showTemplates)}
              >
                <span role="img" aria-label="template">📋</span> 
                Templates | 模板
              </button>
              <button 
                className="action-button clear" 
                onClick={handleClear}
              >
                <span role="img" aria-label="clear">🗑️</span> 
                Clear | 清除
              </button>
            </div>
            {showTemplates && (
              <TemplatePanel onTemplateSelect={handleTemplateSelect} />
            )}
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}

// Main App component
// 主应用组件
function App() {
  return (
    <div className="app-container">
      <div className="title-bar">
        <h1>MindMap Tools 思维导图工具</h1>
        <p>Double click to add new nodes | 双击添加新节点</p>
      </div>
      <div className="flow-container">
        <ReactFlowProvider>
          <Flow />
        </ReactFlowProvider>
      </div>
    </div>
  );
}

export default App;
