// Template selection panel component
// 模板选择面板组件
import React from 'react';

// Predefined templates
// 预定义模板
const templates = {
  pareto: {
    name: 'Pareto Analysis 帕累托分析',
    icon: '📊',
    nodes: [
      {
        id: '1',
        type: 'custom',
        data: { 
          label: 'Problem/Issue\n问题',
          type: 'question',
        },
        position: { x: 400, y: 50 },
      },
      {
        id: '2',
        type: 'custom',
        data: { 
          label: '20% Key Causes\n关键原因',
          type: 'idea',
        },
        position: { x: 200, y: 150 },
      },
      {
        id: '3',
        type: 'custom',
        data: { 
          label: '80% Effects\n主要影响',
          type: 'task',
        },
        position: { x: 600, y: 150 },
      },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e1-3', source: '1', target: '3' },
    ],
  },
  swot: {
    name: 'SWOT Analysis SWOT分析',
    icon: '🎯',
    nodes: [
      {
        id: '1',
        type: 'custom',
        data: { 
          label: 'Topic\n主题',
          type: 'idea',
        },
        position: { x: 400, y: 50 },
      },
      {
        id: '2',
        type: 'custom',
        data: { 
          label: 'Strengths\n优势',
          type: 'task',
        },
        position: { x: 200, y: 150 },
      },
      {
        id: '3',
        type: 'custom',
        data: { 
          label: 'Weaknesses\n劣势',
          type: 'note',
        },
        position: { x: 600, y: 150 },
      },
      {
        id: '4',
        type: 'custom',
        data: { 
          label: 'Opportunities\n机会',
          type: 'idea',
        },
        position: { x: 200, y: 250 },
      },
      {
        id: '5',
        type: 'custom',
        data: { 
          label: 'Threats\n威胁',
          type: 'question',
        },
        position: { x: 600, y: 250 },
      },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e1-3', source: '1', target: '3' },
      { id: 'e1-4', source: '1', target: '4' },
      { id: 'e1-5', source: '1', target: '5' },
    ],
  },
  fiveWhy: {
    name: '5 Whys Analysis 5个为什么分析',
    icon: '❓',
    nodes: [
      {
        id: '1',
        type: 'custom',
        data: { 
          label: 'Problem\n问题',
          type: 'question',
        },
        position: { x: 400, y: 50 },
      },
      {
        id: '2',
        type: 'custom',
        data: { 
          label: 'Why 1\n为什么 1',
          type: 'question',
        },
        position: { x: 400, y: 150 },
      },
      {
        id: '3',
        type: 'custom',
        data: { 
          label: 'Why 2\n为什么 2',
          type: 'question',
        },
        position: { x: 400, y: 250 },
      },
      {
        id: '4',
        type: 'custom',
        data: { 
          label: 'Why 3\n为什么 3',
          type: 'question',
        },
        position: { x: 400, y: 350 },
      },
      {
        id: '5',
        type: 'custom',
        data: { 
          label: 'Why 4\n为什么 4',
          type: 'question',
        },
        position: { x: 400, y: 450 },
      },
      {
        id: '6',
        type: 'custom',
        data: { 
          label: 'Root Cause\n根本原因',
          type: 'idea',
        },
        position: { x: 400, y: 550 },
      },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3' },
      { id: 'e3-4', source: '3', target: '4' },
      { id: 'e4-5', source: '4', target: '5' },
      { id: 'e5-6', source: '5', target: '6' },
    ],
  },
};

function TemplatePanel({ onTemplateSelect }) {
  return (
    <div className="template-panel">
      <div className="template-title">Templates 模板</div>
      <div className="template-buttons">
        {Object.entries(templates).map(([key, template]) => (
          <button
            key={key}
            className="template-button"
            onClick={() => onTemplateSelect(template)}
          >
            <span className="template-icon">{template.icon}</span>
            <span className="template-label">{template.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export { templates };
export default TemplatePanel;
