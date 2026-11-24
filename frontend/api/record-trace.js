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

    const traceId = crypto.randomUUID().replace(/-/g, '');
    const spanId = crypto.randomUUID().replace(/-/g, '').slice(0, 16);
    const nowMs = Date.now();
    const nowNs = (BigInt(nowMs) * 1000000n).toString();
    const endNs = (BigInt(nowMs) * 1000000n + 850000000n).toString();

    const otlpPayload = {
      resourceSpans: [
        {
          resource: {
            attributes: [
              { key: 'service.name', value: { stringValue: agent } },
              { key: 'morse_ai.framework', value: { stringValue: 'custom' } },
              { key: 'morse_ai.source', value: { stringValue: 'poetverse-web' } }
            ]
          },
          scopeSpans: [
            {
              scope: { name: 'morse_ai', version: '0.9.0' },
              spans: [
                {
                  traceId,
                  spanId,
                  name: agent,
                  kind: 1,
                  startTimeUnixNano: nowNs,
                  endTimeUnixNano: endNs,
                  attributes: [
                    { key: 'morse.agent', value: { stringValue: agent } },
                    { key: 'morse.span_type', value: { stringValue: 'agent' } },
                    { key: 'morse.outcome.success', value: { boolValue: Boolean(success) } },
                    { key: 'morse.outcome.label', value: { stringValue: outcome } },
                    { key: 'gen_ai.request.model', value: { stringValue: 'claude-3-5-sonnet-20241022' } },
                    { key: 'gen_ai.usage.input_tokens', value: { intValue: 420 } },
                    { key: 'gen_ai.usage.output_tokens', value: { intValue: 148 } },
                    { key: 'morse.cost_usd', value: { stringValue: String(cost) } },
                    { key: 'morse.thread_id', value: { stringValue: `pv_session_${nowMs}` } },
                    { key: 'morse.user_id', value: { stringValue: userId } },
                    { key: 'morse.metadata.genre', value: { stringValue: JSON.stringify(genre) } }
                  ],
                  status: { code: success ? 1 : 2 }
                }
              ]
            }
          ]
        }
      ]
    };

    const response = await fetch('https://api.morseai.dev/api/v1/otlp/v1/traces', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer mhq_prod_9cb3f20fdd8e262cb3329d154a05ecf899baf26e8c0e0dea586ac75e1dec5749',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(otlpPayload)
    });

    const data = await response.json();
    return res.status(200).json({ success: true, otlpResponse: data, traceId });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
