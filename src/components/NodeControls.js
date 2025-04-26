import React, { useState } from 'react';
import { Panel } from 'reactflow';

const nodeTypes = ['idea', 'task', 'note', 'question'];
const nodeColors = {
  idea: '#99ff99',
  task: '#ff9999',
  note: '#9999ff',
  question: '#ffff99'
};
const nodeSizes = ['small', 'medium', 'large'];
const nodeShapes = ['rectangle', 'rounded', 'oval'];

function NodeControls({ onAddNode, onNodeStyleChange }) {
  const [selectedType, setSelectedType] = useState('idea');
  const [selectedColor, setSelectedColor] = useState(nodeColors.idea);
  const [selectedSize, setSelectedSize] = useState('medium');
  const [selectedShape, setSelectedShape] = useState('rectangle');
  const [showControls, setShowControls] = useState(false);

  const handleTypeChange = (type) => {
    setSelectedType(type);
    setSelectedColor(nodeColors[type]);
    updateNodeStyle(type, nodeColors[type], selectedSize, selectedShape);
  };

  const handleColorChange = (e) => {
    setSelectedColor(e.target.value);
    updateNodeStyle(selectedType, e.target.value, selectedSize, selectedShape);
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
    updateNodeStyle(selectedType, selectedColor, size, selectedShape);
  };

  const handleShapeChange = (shape) => {
    setSelectedShape(shape);
    updateNodeStyle(selectedType, selectedColor, selectedSize, shape);
  };

  const updateNodeStyle = (type, color, size, shape) => {
    onNodeStyleChange({
      type,
      color,
      size,
      shape
    });
  };

  return (
    <Panel position="top-left" className="controls-panel">
      <div className="controls-container" style={{
        background: 'white',
        padding: '10px',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        maxWidth: showControls ? '300px' : 'auto'
      }}>
        <button
          onClick={() => setShowControls(!showControls)}
          style={{
            background: '#f0f0f0',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'block',
            width: '100%',
            textAlign: 'left'
          }}
        >
          {showControls ? '收起选项 ▲' : '节点选项 ▼'}
        </button>
        
        {showControls && (
          <div style={{ marginTop: '10px' }}>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>类型/Type:</label>
              <div style={{ display: 'flex', gap: '5px' }}>
                {nodeTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => handleTypeChange(type)}
                    style={{
                      background: selectedType === type ? nodeColors[type] : '#f0f0f0',
                      border: 'none',
                      padding: '5px 10px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      flex: 1
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>颜色/Color:</label>
              <input
                type="color"
                value={selectedColor}
                onChange={handleColorChange}
                style={{ width: '100%', height: '30px' }}
              />
            </div>
            
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>大小/Size:</label>
              <div style={{ display: 'flex', gap: '5px' }}>
                {nodeSizes.map(size => (
                  <button
                    key={size}
                    onClick={() => handleSizeChange(size)}
                    style={{
                      background: selectedSize === size ? '#e0e0e0' : '#f0f0f0',
                      border: 'none',
                      padding: '5px 10px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      flex: 1
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>形状/Shape:</label>
              <div style={{ display: 'flex', gap: '5px' }}>
                {nodeShapes.map(shape => (
                  <button
                    key={shape}
                    onClick={() => handleShapeChange(shape)}
                    style={{
                      background: selectedShape === shape ? '#e0e0e0' : '#f0f0f0',
                      border: 'none',
                      padding: '5px 10px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      flex: 1
                    }}
                  >
                    {shape}
                  </button>
                ))}
              </div>
            </div>
            
            <button
              onClick={() => onAddNode({ type: selectedType, color: selectedColor, size: selectedSize, shape: selectedShape })}
              style={{
                background: '#4caf50',
                color: 'white',
                border: 'none',
                padding: '8px 15px',
                borderRadius: '4px',
                cursor: 'pointer',
                width: '100%',
                marginTop: '5px'
              }}
            >
              添加节点 / Add Node
            </button>
          </div>
        )}
      </div>
    </Panel>
  );
}

export default NodeControls;
