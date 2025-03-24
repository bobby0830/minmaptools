import React, { useState } from 'react';
import { Panel } from 'reactflow';

const NodeControls = ({ onAddNode, onNodeStyleChange }) => {
  const [nodeStyle, setNodeStyle] = useState({
    type: 'idea',
    color: '#99ff99',
    size: 'medium'
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
        >
          <option value="idea">Idea 💡</option>
          <option value="task">Task 📋</option>
          <option value="note">Note 📝</option>
          <option value="question">Question ❓</option>
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
