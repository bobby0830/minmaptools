// MCP Protocol service for AI integration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/mcp';

class MCPService {
  static async createNode(nodeData) {
    const response = await fetch(`${API_BASE_URL}/createNode`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nodeData),
    });
    return response.json();
  }

  static async updateNode(nodeData) {
    const response = await fetch(`${API_BASE_URL}/updateNode`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nodeData),
    });
    return response.json();
  }

  static async createEdge(edgeData) {
    const response = await fetch(`${API_BASE_URL}/createEdge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(edgeData),
    });
    return response.json();
  }

  static async analyzeMap(mapData) {
    const response = await fetch(`${API_BASE_URL}/analyzeMap`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mapData),
    });
    return response.json();
  }
}

export default MCPService;
