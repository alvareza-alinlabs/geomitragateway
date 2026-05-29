const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function handleOptions(request) {
  if (
    request.headers.get('Origin') !== null &&
    request.headers.get('Access-Control-Request-Method') !== null &&
    request.headers.get('Access-Control-Request-Headers') !== null
  ) {
    return new Response(null, {
      headers: corsHeaders,
    });
  } else {
    return new Response(null, {
      headers: {
        Allow: 'GET, POST, PUT, DELETE, OPTIONS',
      },
    });
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return handleOptions(request);
    }

    try {
      const db = env.D1 || env.d1_server;
      
      if (!db) {
        return new Response('D1 binding not found', { status: 500, headers: corsHeaders });
      }

      if (url.pathname.startsWith('/api/query')) {
        if (request.method !== 'POST') {
           return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
        }

        const { query, params } = await request.json();
        const stmt = db.prepare(query);
        const result = params ? await stmt.bind(...params).all() : await stmt.all();

        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Default route
      return new Response('GMG Verifikasi D1 API', {
        headers: { ...corsHeaders, 'Content-Type': 'text/plain' },
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  },
};
