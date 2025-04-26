// MCP Protocol service for AI integration
const API_BASE_URL = '/api/mcp';

class MCPService {
  static async makeRequest(endpoint, data) {
    try {
      console.log(`Making ${endpoint} request with data:`, data);
      const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error(`${endpoint} request failed:`, {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });
        throw new Error(`${endpoint} failed: ${response.statusText}`);
      }

      const result = await response.json();
      console.log(`${endpoint} response:`, result);
      return result;
    } catch (error) {
      console.error(`${endpoint} error:`, error);
      throw error;
    }
  }

  static async createNode(nodeData) {
    return this.makeRequest('createNode', nodeData);
  }

  static async updateNode(nodeData) {
    return this.makeRequest('updateNode', nodeData);
  }

  static async createEdge(edgeData) {
    return this.makeRequest('createEdge', edgeData);
  }

  static async analyzeMap(mapData) {
    return this.makeRequest('analyzeMap', mapData);
  }
}

export default MCPService;
