// Model Context Protocol for AI integration
export const MCPSchema = {
  version: "1.0",
  actions: {
    // Node operations
    createNode: {
      type: "mutation",
      params: {
        label: "string",
        nodeType: ["task", "idea", "note", "question"],
        position: { x: "number", y: "number" }
      }
    },
    updateNode: {
      type: "mutation",
      params: {
        id: "string",
        label: "string",
        nodeType: ["task", "idea", "note", "question"]
      }
    },
    deleteNode: {
      type: "mutation",
      params: {
        id: "string"
      }
    },
    // Edge operations
    createEdge: {
      type: "mutation",
      params: {
        source: "string",
        target: "string"
      }
    },
    // Map operations
    exportMap: {
      type: "query",
      params: {
        format: ["json", "pdf", "png"]
      }
    },
    importMap: {
      type: "mutation",
      params: {
        data: "object"
      }
    },
    // AI specific operations
    analyzeMap: {
      type: "query",
      description: "Analyze the mind map structure and content",
      returns: {
        topics: "array",
        connections: "array",
        suggestions: "array"
      }
    },
    generateSuggestions: {
      type: "query",
      params: {
        context: "string",
        nodeId: "string"
      },
      returns: {
        suggestions: "array"
      }
    }
  }
};
