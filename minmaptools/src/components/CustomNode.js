// Custom node component for mind map
// 思维导图的自定义节点组件
import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';

const nodeTypes = {
  task: { backgroundColor: '#ff9999', icon: '📋' },
  idea: { backgroundColor: '#99ff99', icon: '💡' },
  note: { backgroundColor: '#9999ff', icon: '📝' },
  question: { backgroundColor: '#ffff99', icon: '❓' },
};

function CustomNode({ data, type }) {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label);
  const nodeStyle = nodeTypes[data.type] || nodeTypes.note;

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      data.onChange(label);
    }
  };

  return (
    <div
      className="custom-node"
      style={{ backgroundColor: nodeStyle.backgroundColor }}
    >
      <Handle type="target" position={Position.Top} />
      <div className="node-content" onDoubleClick={handleDoubleClick}>
        <span className="node-icon">{nodeStyle.icon}</span>
        {isEditing ? (
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        ) : (
          <div className="node-label">{label}</div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export default CustomNode;
