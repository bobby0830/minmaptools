// 主题钩子 - Theme management hook
import { useState, useCallback } from 'react';

// 定义主题
// Define themes
export const themes = {
  light: {
    background: '#ffffff',
    nodeBackground: '#99ff99',
    nodeBorder: '#66cc66',
    text: '#000000',
    edge: '#333333',
    selection: '#0096ff',
    grid: '#eee'
  },
  dark: {
    background: '#1a1a1a',
    nodeBackground: '#66cc66',
    nodeBorder: '#44aa44',
    text: '#ffffff',
    edge: '#cccccc',
    selection: '#0066aa',
    grid: '#333'
  }
};

export function useTheme(initialTheme = 'light') {
  const [currentTheme, setCurrentTheme] = useState(initialTheme);

  // 切换主题
  // Toggle theme
  const toggleTheme = useCallback(() => {
    setCurrentTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  // 获取当前主题
  // Get current theme
  const theme = themes[currentTheme];

  // 获取主题CSS变量
  // Get theme CSS variables
  const themeVariables = {
    '--bg-color': theme.background,
    '--node-bg': theme.nodeBackground,
    '--node-border': theme.nodeBorder,
    '--text-color': theme.text,
    '--edge-color': theme.edge,
    '--selection-color': theme.selection,
    '--grid-color': theme.grid
  };

  return { theme: currentTheme, themeVariables, toggleTheme };
}
