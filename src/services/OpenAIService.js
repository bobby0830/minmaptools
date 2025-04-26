// OpenAI服务 - 连接OpenAI API和MCP协议
import MCPService from './MCPService';

// MCP函数定义，用于OpenAI function calling
const mcpFunctions = [
  {
    "name": "createNode",
    "description": "在思维导图中创建一个新节点",
    "parameters": {
      "type": "object",
      "properties": {
        "label": {
          "type": "string",
          "description": "节点的文本内容"
        },
        "nodeType": {
          "type": "string",
          "enum": ["task", "idea", "note", "question"],
          "description": "节点的类型"
        },
        "position": {
          "type": "object",
          "properties": {
            "x": { "type": "number" },
            "y": { "type": "number" }
          },
          "description": "节点在画布上的位置"
        }
      },
      "required": ["label"]
    }
  },
  {
    "name": "createEdge",
    "description": "创建两个节点之间的连接",
    "parameters": {
      "type": "object",
      "properties": {
        "source": {
          "type": "string",
          "description": "源节点的ID"
        },
        "target": {
          "type": "string",
          "description": "目标节点的ID"
        }
      },
      "required": ["source", "target"]
    }
  },
  {
    "name": "analyzeMap",
    "description": "分析思维导图结构并提供建议",
    "parameters": {
      "type": "object",
      "properties": {
        "nodes": {
          "type": "array",
          "description": "思维导图中的节点列表"
        },
        "edges": {
          "type": "array",
          "description": "思维导图中的连接列表"
        }
      }
    }
  }
];

class OpenAIService {
  // 初始化OpenAI配置
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.apiUrl = 'https://api.openai.com/v1/chat/completions';
  }

  // 主要函数：与OpenAI交互并执行MCP操作
  async processMindMapWithAI(prompt, mindmapData) {
    try {
      // 准备请求数据
      const messages = [
        { role: "system", content: "你是一个思维导图助手，可以分析和扩展思维导图。你可以创建节点、连接节点，以及分析思维导图结构。" },
        { role: "user", content: prompt }
      ];

      // 如果有现有的思维导图数据，添加到上下文
      if (mindmapData && mindmapData.nodes && mindmapData.nodes.length > 0) {
        messages.push({
          role: "system",
          content: `当前思维导图数据: ${JSON.stringify({
            nodes: mindmapData.nodes.map(n => ({
              id: n.id,
              type: n.data?.type || 'idea',
              label: n.data?.label || '',
              position: n.position
            })),
            edges: mindmapData.edges
          })}`
        });
      }

      console.log('Sending to OpenAI:', {
        model: "gpt-4o",
        messages: messages,
        functions: mcpFunctions,
        function_call: "auto"
      });

      // 调用OpenAI API
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: messages,
          functions: mcpFunctions,
          function_call: "auto"
        })
      });

      const data = await response.json();
      console.log('OpenAI response:', data);
      
      // 处理OpenAI的响应
      if (data.choices && data.choices[0].message) {
        const message = data.choices[0].message;
        
        // 检查是否有函数调用
        if (message.function_call) {
          const functionName = message.function_call.name;
          const functionArgs = JSON.parse(message.function_call.arguments);
          
          console.log(`Executing function: ${functionName}`, functionArgs);
          
          // 执行相应的MCP操作
          let result;
          switch (functionName) {
            case 'createNode':
              result = await MCPService.createNode(functionArgs);
              break;
            case 'createEdge':
              result = await MCPService.createEdge(functionArgs);
              break;
            case 'analyzeMap':
              result = await MCPService.analyzeMap(functionArgs);
              break;
            default:
              console.warn(`未知的函数调用: ${functionName}`);
          }
          
          return {
            aiResponse: message.content || "我已执行您请求的操作。",
            functionCall: {
              name: functionName,
              args: functionArgs
            },
            result: result
          };
        }
        
        // 如果没有函数调用，只返回AI的回复
        return {
          aiResponse: message.content
        };
      }
      
      throw new Error('无效的API响应');
    } catch (error) {
      console.error('OpenAI API调用失败:', error);
      throw error;
    }
  }
}

export default OpenAIService;
