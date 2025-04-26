import React, { useState } from 'react';
import { useReactFlow, Panel } from 'reactflow';
import OpenAIService from '../services/OpenAIService.js';

function AIAssistant() {
  const [prompt, setPrompt] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showPanel, setShowPanel] = useState(false);
  
  const { getNodes, getEdges, setNodes, setEdges } = useReactFlow();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!apiKey) {
      alert('请输入您的OpenAI API密钥 / Please enter your OpenAI API key');
      return;
    }
    
    if (!prompt) {
      alert('请输入指令 / Please enter a prompt');
      return;
    }
    
    try {
      setLoading(true);
      
      // 获取当前思维导图数据
      const mindmapData = {
        nodes: getNodes(),
        edges: getEdges()
      };
      
      // 创建OpenAI服务实例
      const openaiService = new OpenAIService(apiKey);
      
      // 处理请求
      const response = await openaiService.processMindMapWithAI(prompt, mindmapData);
      setResult(response);
      
      // 如果AI生成了新的节点或连接，更新思维导图
      if (response.result && response.functionCall) {
        // 处理不同类型的函数调用
        if (response.functionCall.name === 'createNode' && response.result.id) {
          // 添加新节点
          const nodePosition = response.functionCall.args.position || { 
            x: 300 + Math.random() * 200, 
            y: 300 + Math.random() * 200 
          };
          
          const newNode = {
            id: response.result.id,
            type: 'custom',
            position: nodePosition,
            data: {
              label: response.functionCall.args.label,
              type: response.functionCall.args.nodeType || 'idea',
              color: '#99ff99',
              size: 'medium',
              shape: 'rectangle',
              onChange: (label) => {
                // 处理标签更改
                setNodes(nds =>
                  nds.map(node => {
                    if (node.id === response.result.id) {
                      return { ...node, data: { ...node.data, label } };
                    }
                    return node;
                  })
                );
              }
            }
          };
          
          setNodes(nds => [...nds, newNode]);
        }
        
        if (response.functionCall.name === 'createEdge' && response.result.id) {
          // 添加新连接
          const newEdge = {
            id: response.result.id,
            source: response.functionCall.args.source,
            target: response.functionCall.args.target
          };
          
          setEdges(eds => [...eds, newEdge]);
        }
      }
    } catch (error) {
      console.error('AI处理失败:', error);
      alert(`处理失败 / Processing failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Panel position="bottom-left" className="ai-assistant-panel">
      <div style={{
        background: 'white',
        padding: '10px',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        maxWidth: showPanel ? '350px' : 'auto',
        transition: 'all 0.3s ease'
      }}>
        <button
          onClick={() => setShowPanel(!showPanel)}
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
          {showPanel ? 'AI助手 ▲' : 'AI助手 ▼'}
        </button>
        
        {showPanel && (
          <div style={{ marginTop: '10px' }}>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>OpenAI API密钥 / API Key:</label>
              <input
                type="password"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                style={{ width: '100%', padding: '5px', boxSizing: 'border-box' }}
                placeholder="sk-..."
              />
              <small style={{ color: '#666', fontSize: '11px' }}>
                您的API密钥仅在浏览器中使用，不会被存储
                <br />
                Your API key is only used in the browser and will not be stored
              </small>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>输入指令 / Enter prompt:</label>
                <textarea
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  style={{ 
                    width: '100%', 
                    height: '80px', 
                    padding: '5px',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                  placeholder="例如：为我创建一个关于人工智能的思维导图 / e.g.: Create a mindmap about AI"
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                style={{
                  background: '#4285f4',
                  color: 'white',
                  border: 'none',
                  padding: '8px 15px',
                  borderRadius: '4px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  width: '100%'
                }}
              >
                {loading ? '处理中... / Processing...' : '提交到AI / Submit to AI'}
              </button>
            </form>
            
            {result && (
              <div style={{ 
                marginTop: '15px', 
                padding: '10px', 
                background: '#f5f5f5', 
                borderRadius: '4px',
                maxHeight: '200px',
                overflow: 'auto' 
              }}>
                <h4 style={{ margin: '0 0 8px 0' }}>AI回复 / AI Response:</h4>
                <p style={{ margin: '0 0 10px 0' }}>{result.aiResponse || '无回复 / No response'}</p>
                
                {result.functionCall && (
                  <div>
                    <h4 style={{ margin: '10px 0 5px 0', fontSize: '13px' }}>执行操作 / Action:</h4>
                    <div style={{ 
                      fontSize: '12px',
                      background: '#eee',
                      padding: '5px',
                      overflow: 'auto',
                      borderRadius: '4px'
                    }}>
                      <strong>{result.functionCall.name}</strong>
                      <pre style={{ margin: '5px 0 0 0', overflow: 'auto' }}>
                        {JSON.stringify(result.functionCall.args, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div style={{ 
              marginTop: '15px',
              padding: '10px',
              background: '#f0f7ff',
              borderRadius: '4px',
              fontSize: '12px'
            }}>
              <h4 style={{ margin: '0 0 5px 0', fontSize: '13px' }}>使用提示 / Usage Tips:</h4>
              <ul style={{ margin: '0', paddingLeft: '20px' }}>
                <li>您可以要求AI创建节点或连接节点 / Ask AI to create nodes or connect them</li>
                <li>尝试让AI分析您的思维导图并提出建议 / Ask AI to analyze your mindmap</li>
                <li>指定位置: "在左上角创建节点" / You can specify positions</li>
                <li>简单命令效果更好 / Simple commands work best</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </Panel>
  );
}

export default AIAssistant;
