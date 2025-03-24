// Custom node component for mind map
// 思维导图的自定义节点组件
import React, { useState, useRef, useEffect } from 'react';
import { Handle, Position } from 'reactflow';

const nodeTypes = {
  task: { icon: '📋' },
  idea: { icon: '💡' },
  note: { icon: '📝' },
  question: { icon: '❓' },
  decision: { icon: '🔄' },
  process: { icon: '⚙️' },
  start: { icon: '▶️' },
  end: { icon: '⏹️' },
  input: { icon: '📥' },
  output: { icon: '📤' },
};

const nodeShapes = {
  rectangle: {
    style: {},
    className: 'shape-rectangle',
    handles: {
      target: Position.Top,
      source: Position.Bottom
    }
  },
  diamond: {
    style: {},
    className: 'shape-diamond',
    handles: {
      target: Position.Top,
      source: Position.Bottom
    }
  },
  circle: {
    style: {},
    className: 'shape-circle',
    handles: {
      target: Position.Top,
      source: Position.Bottom
    }
  },
  parallelogram: {
    style: {},
    className: 'shape-parallelogram',
    handles: {
      target: Position.Top,
      source: Position.Bottom
    }
  },
  hexagon: {
    style: {},
    className: 'shape-hexagon',
    handles: {
      target: Position.Top,
      source: Position.Bottom
    }
  },
  oval: {
    style: {},
    className: 'shape-oval',
    handles: {
      target: Position.Top,
      source: Position.Bottom
    }
  }
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
  const shapeStyle = nodeShapes[data.shape || 'rectangle'];

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
      className={`custom-node ${shapeStyle.className}`}
      style={{
        backgroundColor: data.color || '#ffffff',
        width: data.shape === 'diamond' ? 'auto' : sizeStyle.width,
        fontSize: sizeStyle.fontSize,
        ...shapeStyle.style
      }}
    >
      <Handle type="target" position={shapeStyle.handles.target} />
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
      <Handle type="source" position={shapeStyle.handles.source} />
    </div>
  );
}

export default CustomNode;
