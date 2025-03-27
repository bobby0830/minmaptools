// 自定義節點組件
// 用於顯示流程圖中的各種形狀節點
import React, { memo, useState } from 'react';
import { Handle, Position } from 'reactflow';

// 定義節點類型和其對應的樣式
const nodeTypes = {
  idea: { icon: '💡' },
  task: { icon: '✅' },
  note: { icon: '📝' },
};

// 定義節點大小
const nodeSizes = {
  small: { width: '120px', fontSize: '12px' },
  medium: { width: '180px', fontSize: '14px' },
  large: { width: '250px', fontSize: '16px' },
};

// 定義形狀樣式和連接點位置
const nodeShapes = {
  terminal: {
    className: 'shape-terminal',
    style: {},
    handles: {
      target: Position.Top,
      source: Position.Bottom,
    },
  },
  process: {
    className: 'shape-process',
    style: {},
    handles: {
      target: Position.Top,
      source: Position.Bottom,
    },
  },
  decision: {
    className: 'shape-decision',
    style: {},
    handles: {
      target: Position.Top,
      source: Position.Bottom,
    },
  },
  input: {
    className: 'shape-input',
    style: {},
    handles: {
      target: Position.Top,
      source: Position.Bottom,
    },
  },
  database: {
    className: 'shape-database',
    style: {},
    handles: {
      target: Position.Top,
      source: Position.Bottom,
    },
  },
  document: {
    className: 'shape-document',
    style: {},
    handles: {
      target: Position.Top,
      source: Position.Bottom,
    },
  },
  display: {
    className: 'shape-display',
    style: {},
    handles: {
      target: Position.Top,
      source: Position.Bottom,
    },
  },
  manual: {
    className: 'shape-manual',
    style: {},
    handles: {
      target: Position.Top,
      source: Position.Bottom,
    },
  },
  preparation: {
    className: 'shape-preparation',
    style: {},
    handles: {
      target: Position.Top,
      source: Position.Bottom,
    },
  },
  connector: {
    className: 'shape-connector',
    style: {},
    handles: {
      target: Position.Top,
      source: Position.Bottom,
    },
  },
  predefined: {
    className: 'shape-predefined',
    style: {},
    handles: {
      target: Position.Top,
      source: Position.Bottom,
    },
  },
  annotation: {
    className: 'shape-annotation',
    style: {},
    handles: {
      target: Position.Top,
      source: Position.Bottom,
    },
  },
};

// 自定義節點組件
function CustomNode({ data, selected }) {
  // 狀態管理：是否處於編輯模式和節點標籤
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label || '');

  // 獲取節點的樣式配置
  const nodeStyle = nodeTypes[data.type] || nodeTypes.note;
  const sizeStyle = nodeSizes[data.size || 'medium'];
  const shapeStyle = nodeShapes[data.shape || 'terminal'];

  // 雙擊事件處理：進入編輯模式
  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  // 按鍵事件處理：Enter 鍵確認編輯
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      finishEditing();
    }
  };

  // 失去焦點事件處理：完成編輯
  const handleBlur = () => {
    finishEditing();
  };

  // 完成編輯的通用處理函數
  const finishEditing = () => {
    setIsEditing(false);
    if (data.onChange) {
      data.onChange(label);
    }
  };

  // 組合節點的 CSS 類名
  const nodeClass = `custom-node ${shapeStyle.className} ${selected ? 'selected' : ''}`;

  return (
    <div 
      className={nodeClass}
      style={{
        backgroundColor: data.color || '#ffffff',
        width: sizeStyle.width,
        fontSize: sizeStyle.fontSize,
        ...shapeStyle.style
      }}
    >
      <Handle 
        type="target" 
        position={shapeStyle.handles.target}
        style={{ background: '#555' }}
      />
      <div className="node-content" onDoubleClick={handleDoubleClick}>
        <span className="node-icon">{nodeStyle.icon}</span>
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
              fontSize: 'inherit'
            }}
          />
        ) : (
          <div className="node-label">{label || '雙擊編輯'}</div>
        )}
      </div>
      <Handle 
        type="source" 
        position={shapeStyle.handles.source}
        style={{ background: '#555' }}
      />
    </div>
  );
}

// 使用 memo 優化渲染性能
export default memo(CustomNode);
