// 搜索面板组件
// Search panel component
import React from 'react';
import { Panel } from 'reactflow';

function SearchPanel({ searchTerm, onSearch, searchResults, onHighlight }) {
  return (
    <Panel position="top-left" className="search-panel">
      <div className="search-container">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="搜索节点... / Search nodes..."
          className="search-input"
        />
        {searchResults.length > 0 && (
          <div className="search-results">
            {searchResults.map((node) => (
              <div
                key={node.id}
                className="search-result-item"
                onClick={() => onHighlight([node.id])}
              >
                {node.data.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </Panel>
  );
}

export default SearchPanel;
