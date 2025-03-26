// 搜索钩子 - Search functionality hook
import { useState, useCallback } from 'react';

export function useSearch(nodes) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // 执行搜索
  // Perform search
  const search = useCallback((term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    const results = nodes.filter(node => 
      node.data.label.toLowerCase().includes(term.toLowerCase())
    );

    setSearchResults(results);
  }, [nodes]);

  // 高亮搜索结果
  // Highlight search results
  const highlightNodes = useCallback((nodeIds) => {
    // 实现节点高亮逻辑
    // Implement node highlighting logic
  }, []);

  return {
    searchTerm,
    searchResults,
    search,
    highlightNodes
  };
}
