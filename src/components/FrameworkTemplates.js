import React from 'react';

const frameworks = {
  pareto: {
    name: '82法則 (Pareto Principle)',
    template: [
      { id: 'main', type: 'default', position: { x: 300, y: 200 }, data: { label: '主要問題' } },
      { id: 'cause20', type: 'default', position: { x: 100, y: 400 }, data: { label: '20%原因' } },
      { id: 'effect80', type: 'default', position: { x: 500, y: 400 }, data: { label: '80%結果' } },
    ],
    edges: [
      { id: 'e1-2', source: 'main', target: 'cause20' },
      { id: 'e1-3', source: 'main', target: 'effect80' },
    ]
  },
  flowchart: {
    name: '流程圖 (Flowchart)',
    template: [
      { id: 'start', type: 'input', position: { x: 300, y: 50 }, data: { label: '開始' } },
      { id: 'process1', type: 'default', position: { x: 300, y: 150 }, data: { label: '處理步驟1' } },
      { id: 'decision', type: 'default', position: { x: 300, y: 250 }, data: { label: '決策點' } },
      { id: 'end', type: 'output', position: { x: 300, y: 350 }, data: { label: '結束' } },
    ],
    edges: [
      { id: 'e1', source: 'start', target: 'process1' },
      { id: 'e2', source: 'process1', target: 'decision' },
      { id: 'e3', source: 'decision', target: 'end' },
    ]
  },
  // Add more frameworks here
};

export const useFrameworkTemplates = () => {
  const getFrameworkTemplate = (frameworkType) => {
    const framework = frameworks[frameworkType];
    if (!framework) return null;
    
    return {
      nodes: framework.template,
      edges: framework.edges,
      name: framework.name
    };
  };

  const getAvailableFrameworks = () => {
    return Object.keys(frameworks).map(key => ({
      id: key,
      name: frameworks[key].name
    }));
  };

  return {
    getFrameworkTemplate,
    getAvailableFrameworks
  };
};
