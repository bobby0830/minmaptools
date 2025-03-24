// Toolbar component for node type selection
// 节点类型选择工具栏组件
import React from 'react';

const nodeTypes = [
  { type: 'task', label: 'Task 任务', icon: '📋' },
  { type: 'idea', label: 'Idea 想法', icon: '💡' },
  { type: 'note', label: 'Note 笔记', icon: '📝' },
  { type: 'question', label: 'Question 问题', icon: '❓' },
];

function Toolbar({ onNodeTypeSelect, selectedType }) {
  return (
    <div className="toolbar">
      <div className="toolbar-title">Node Types 节点类型</div>
      <div className="toolbar-buttons">
        {nodeTypes.map(({ type, label, icon }) => (
          <button
            key={type}
            className={`toolbar-button ${selectedType === type ? 'selected' : ''}`}
            onClick={() => onNodeTypeSelect(type)}
          >
            <span className="button-icon">{icon}</span>
            <span className="button-label">{label}</span>
          </button>
        ))}
      </div>
      <div className="toolbar-tips">
        <p>Tips 提示:</p>
        <ul>
          <li>Double click to edit node | 双击编辑节点</li>
          <li>Drag between nodes to connect | 拖动连接节点</li>
          <li>Double click canvas to add node | 双击画布添加节点</li>
        </ul>
      </div>
    </div>
  );
}

export default Toolbar;
