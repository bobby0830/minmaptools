// Custom node component for mind map
// 思维导图的自定义节点组件
import React, { memo } from 'react';
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
  const nodeClass = `custom-node ${data.shape || 'shape-rectangle'} ${selected ? 'selected' : ''}`;

  return (
    <div className={nodeClass}>
      <Handle type="target" position={Position.Top} />
      <div className="node-content">
        {data.label}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export default memo(CustomNode);
