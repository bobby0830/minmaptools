// 自动布局钩子 - Auto layout hook
import { useCallback } from 'react';
import dagre from 'dagre';

export function useAutoLayout() {
  // 使用dagre库进行自动布局
  // Use dagre library for automatic layout
  const getLayoutedElements = useCallback((nodes, edges, direction = 'TB') => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({ rankdir: direction });

    // 添加节点
    // Add nodes
    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: 150, height: 50 });
    });

    // 添加边
    // Add edges
    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    // 计算布局
    // Calculate layout
    dagre.layout(dagreGraph);

    // 获取新的节点位置
    // Get new node positions
    const layoutedNodes = nodes.map((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      return {
        ...node,
        position: {
          x: nodeWithPosition.x - 75,
          y: nodeWithPosition.y - 25,
        },
      };
    });

    return { nodes: layoutedNodes, edges };
  }, []);

  return { getLayoutedElements };
}
