import React, { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';

// 自定义节点组件
function CustomNode({ data, id, selected }) {
  const [label, setLabel] = useState(data.label || '');
  const [isEditing, setIsEditing] = useState(false);

  // 当data.label变更时更新状态
  useEffect(() => {
    setLabel(data.label || '');
  }, [data.label]);

  // 处理标签编辑
  const handleLabelChange = (evt) => {
    setLabel(evt.target.value);
  };

  // 处理标签更新完成
  const handleLabelBlur = () => {
    setIsEditing(false);
    if (data.onChange) {
      data.onChange(label);
    }
  };

  // 根据节点类型和属性确定样式
  const getNodeStyle = () => {
    const type = data.type || 'idea';
    const color = data.color || '#99ff99';
    const size = data.size || 'medium';
    const shape = data.shape || 'rectangle';
    
    let sizeStyle = { width: '150px', minHeight: '40px' };
    if (size === 'small') sizeStyle = { width: '120px', minHeight: '35px' };
    if (size === 'large') sizeStyle = { width: '180px', minHeight: '50px' };
    
    let borderRadius = '5px';
    if (shape === 'rounded') borderRadius = '15px';
    if (shape === 'oval') borderRadius = '50px';
    
    return {
      backgroundColor: color,
      borderRadius,
      padding: '10px',
      ...sizeStyle,
      border: selected ? '2px solid #1a192b' : '1px solid #ddd',
      boxShadow: selected ? '0 0 8px 2px rgba(0, 0, 0, 0.15)' : 'none',
      transition: 'all 0.2s'
    };
  };

  // 获取图标根据节点类型
  const getTypeIcon = () => {
    switch (data.type) {
      case 'task':
        return '📋';
      case 'idea':
        return '💡';
      case 'note':
        return '📝';
      case 'question':
        return '❓';
      default:
        return '💭';
    }
  };

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#555' }}
      />
      <div
        style={getNodeStyle()}
        onDoubleClick={() => setIsEditing(true)}
        className="custom-node"
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
          <span style={{ marginRight: '5px' }}>{getTypeIcon()}</span>
        </div>
        {isEditing ? (
          <textarea
            value={label}
            onChange={handleLabelChange}
            onBlur={handleLabelBlur}
            autoFocus
            style={{
              width: '100%',
              border: 'none',
              backgroundColor: 'transparent',
              resize: 'vertical',
              outline: 'none',
              minHeight: '30px'
            }}
          />
        ) : (
          <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {label}
          </div>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: '#555' }}
      />
    </>
  );
}

export default CustomNode;
