// Vercel serverless function for MCP Protocol
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Log request details
  console.log('Request URL:', req.url);
  console.log('Request Method:', req.method);
  console.log('Request Headers:', req.headers);

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Parse the URL to get the endpoint
  const urlParts = req.url.split('/');
  console.log('URL Parts:', urlParts);
  const endpoint = urlParts[urlParts.length - 1];
  console.log('Endpoint:', endpoint);

  try {
    // Parse request body if it's a POST request
    if (req.method === 'POST') {
      console.log('Request Body:', req.body);

      switch (endpoint) {
        case 'createNode':
          const { label, nodeType, position } = req.body;
          console.log('Creating node:', { label, nodeType, position });
          return res.status(200).json({ success: true, id: Date.now().toString() });

        case 'updateNode':
          const { id, label: updatedLabel, nodeType: updatedType } = req.body;
          console.log('Updating node:', { id, updatedLabel, updatedType });
          return res.status(200).json({ success: true });

        case 'createEdge':
          const { source, target } = req.body;
          console.log('Creating edge:', { source, target });
          return res.status(200).json({ success: true, id: `${source}-${target}` });

        case 'analyzeMap':
          console.log('Analyzing map');
          return res.status(200).json({
            analysis: {
              suggestions: [],
              structure: "hierarchical",
              completeness: 0.8
            }
          });

        default:
          console.log('Unknown endpoint:', endpoint);
          return res.status(404).json({ error: 'Endpoint not found' });
      }
    } else {
      console.log('Method not allowed:', req.method);
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
