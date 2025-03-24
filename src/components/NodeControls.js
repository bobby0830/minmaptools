import React, { useState } from 'react';
import { Panel } from 'reactflow';

const NodeControls = ({ onAddNode, onNodeStyleChange }) => {
  const [nodeStyle, setNodeStyle] = useState({
    type: 'process',
    color: '#ffffff',
    size: 'medium',
    shape: 'rectangle'
  });

  const handleAddNode = () => {
    onAddNode(nodeStyle);
  };

  const handleStyleChange = (property, value) => {
    const newStyle = { ...nodeStyle, [property]: value };
    setNodeStyle(newStyle);
    onNodeStyleChange(newStyle);
  };

  return (
    <Panel position="top-left" className="node-controls">
      <div className="control-group">
        <button onClick={handleAddNode} className="add-node-btn">
          Add Node
        </button>
        
        <select
          value={nodeStyle.type}
          onChange={(e) => handleStyleChange('type', e.target.value)}
          title="Node Type"
        >
          <option value="process">Process ⚙️</option>
          <option value="decision">Decision 🔄</option>
          <option value="start">Start ▶️</option>
          <option value="end">End ⏹️</option>
          <option value="input">Input 📥</option>
          <option value="output">Output 📤</option>
          <option value="idea">Idea 💡</option>
          <option value="note">Note 📝</option>
          <option value="question">Question ❓</option>
        </select>

        <select
          value={nodeStyle.shape}
          onChange={(e) => handleStyleChange('shape', e.target.value)}
          title="Node Shape"
        >
          <option value="rectangle">Rectangle ▭</option>
          <option value="diamond">Diamond ◇</option>
          <option value="circle">Circle ○</option>
          <option value="parallelogram">Parallelogram ▱</option>
          <option value="hexagon">Hexagon ⬡</option>
          <option value="oval">Oval ⬭</option>
        </select>

        <input
          type="color"
          value={nodeStyle.color}
          onChange={(e) => handleStyleChange('color', e.target.value)}
          title="Node Color"
        />

        <select
          value={nodeStyle.size}
          onChange={(e) => handleStyleChange('size', e.target.value)}
          title="Node Size"
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>
    </Panel>
  );
};

export default NodeControls;
