// Custom node component for mind map
// 思维导图的自定义节点组件
import React, { useState, useRef, useEffect } from 'react';
import { Handle, Position } from 'reactflow';

const nodeTypes = {
  task: { icon: '📋' },
  idea: { icon: '💡' },
  note: { icon: '📝' },
  question: { icon: '❓' },
};

const nodeSizes = {
  small: { width: '150px', fontSize: '12px' },
  medium: { width: '200px', fontSize: '14px' },
  large: { width: '250px', fontSize: '16px' },
};

function CustomNode({ data }) {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label);
  const inputRef = useRef(null);
  const nodeStyle = nodeTypes[data.type] || nodeTypes.note;
  const sizeStyle = nodeSizes[data.size || 'medium'];

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      finishEditing();
    }
  };

  const finishEditing = () => {
    setIsEditing(false);
    if (data.onChange) {
      data.onChange(label);
    }
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isEditing && inputRef.current && !inputRef.current.contains(e.target)) {
        finishEditing();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isEditing]);

  return (
    <div
      className="custom-node"
      style={{
        backgroundColor: data.color || '#9999ff', // default color
        width: sizeStyle.width,
        fontSize: sizeStyle.fontSize,
      }}
    >
      <Handle type="target" position={Position.Top} />
      <div className="node-content" onDoubleClick={handleDoubleClick}>
        <span className="node-icon">{nodeStyle.icon}</span>
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onKeyDown={handleKeyDown}
            className="node-input"
            style={{ fontSize: sizeStyle.fontSize }}
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
