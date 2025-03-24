const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the React build
app.use(express.static(path.join(__dirname, '../build')));

// MCP Protocol endpoints
app.post('/api/mcp/createNode', (req, res) => {
  const { label, nodeType, position } = req.body;
  // Implement node creation logic
  res.json({ success: true, id: Date.now().toString() });
});

app.post('/api/mcp/updateNode', (req, res) => {
  const { id, label, nodeType } = req.body;
  // Implement node update logic
  res.json({ success: true });
});

app.post('/api/mcp/createEdge', (req, res) => {
  const { source, target } = req.body;
  // Implement edge creation logic
  res.json({ success: true, id: `${source}-${target}` });
});

app.post('/api/mcp/analyzeMap', (req, res) => {
  // Implement AI analysis logic
  res.json({
    analysis: {
      suggestions: [],
      structure: "hierarchical",
      completeness: 0.8
    }
  });
});

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

// For Vercel serverless functions
if (process.env.VERCEL) {
  module.exports = app;
} else {
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}
