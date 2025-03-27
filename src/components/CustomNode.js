// Custom node component for mind map
// 思维导图的自定义节点组件
import React, { memo, useState } from 'react';
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

function CustomNode({ data, selected }) {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label || '');

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      if (data.onChange) {
        data.onChange(label);
      }
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (data.onChange) {
      data.onChange(label);
    }
  };

  const nodeClass = `custom-node ${data.shape || 'shape-terminal'} ${selected ? 'selected' : ''}`;

  return (
    <div className={nodeClass}>
      <Handle 
        type="target" 
        position={Position.Top} 
        style={{ background: '#555' }}
      />
      <div className="node-content" onDoubleClick={handleDoubleClick}>
        {isEditing ? (
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            autoFocus
            style={{
              width: '100%',
              border: 'none',
              background: 'transparent',
              textAlign: 'center',
              outline: 'none',
              fontSize: '14px'
            }}
          />
        ) : (
          <div>{data.label || '雙擊編輯'}</div>
        )}
      </div>
      <Handle 
        type="source" 
        position={Position.Bottom} 
        style={{ background: '#555' }}
      />
    </div>
  );
}

export default memo(CustomNode);
