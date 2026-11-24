export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { 
      agent = 'PoetVerse-AI-CoAuthor', 
      success = true, 
      outcome = 'Stanza accepted & merged in Sanctuary Studio', 
      genre = 'Sonnets',
      tokens = 568,
      cost = 0.00348,
      userId = 'vatsal_poet'
    } = body;

    const trace_id = crypto.randomUUID();
    const span_id = crypto.randomUUID();
    const now = new Date().toISOString();

    const payload = {
      traces: [{
        trace: {
          trace_id,
          agent,
          status: 'completed',
          started_at: now,
          ended_at: now,
          success,
          outcome,
          duration_ms: 820
        },
        spans: [{
          span_id,
          trace_id,
          type: 'agent',
          name: agent,
          started_at: now,
          ended_at: now,
          status: 'completed',
          duration_ms: 820,
          model: 'claude-3-5-sonnet-20241022',
          input_tokens: 420,
          output_tokens: 148,
          total_tokens: tokens,
          cost_usd: cost,
          metadata: {
            genre,
            customer_id: `cust_${userId}`,
            thread_id: `pv_session_${Date.now()}`,
            source: 'poetverse-live-web'
          }
        }]
      }]
    };

    const response = await fetch('https://api.morseai.dev/api/v1/traces/batch', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer mhq_prod_9cb3f20fdd8e262cb3329d154a05ecf899baf26e8c0e0dea586ac75e1dec5749',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    return res.status(200).json({ success: true, morseResponse: data, traceId: trace_id });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
