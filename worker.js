// ========================================
// SKM Wellness App - Cloudflare Worker Backend
// Completely Serverless - Powered by Cloudflare KV
// ========================================

const DEFAULT_COACHES = [
  {
    id: '1',
    name: 'โค้ช Nithichai',
    code: 'SKM321',
    title: 'SKM.WELLNESS COACH',
    quote: 'ดูแลคุณเหมือนคนในครอบครัว เพราะเราเชื่อว่า... ทุกคนทำได้',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
    line: '@coach.nithichai',
    phone: '02-xxx-xxxx'
  },
  {
    id: '2',
    name: 'โค้ชแอน',
    code: 'SKM123',
    title: 'SKM.WELLNESS SENIOR COACH',
    quote: 'สุขภาพดีไม่มีทางลัด มีแต่วินัยและความใส่ใจในทุกวัน',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300',
    line: '@coach.ann',
    phone: '081-xxx-xxxx'
  }
];

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  });
}

function corsResponse() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    }
  });
}

async function handleApi(request, env, url) {
  if (request.method === 'OPTIONS') {
    return corsResponse();
  }

  const path = url.pathname;

  try {
    // 1. Coaches List (/api/coaches)
    if (path === '/api/coaches') {
      if (request.method === 'GET') {
        const stored = await env.SKM_KV.get('skm_coaches', 'json');
        const coaches = (stored && Array.isArray(stored) && stored.length > 0) ? stored : DEFAULT_COACHES;
        return jsonResponse({ success: true, data: coaches });
      }

      if (request.method === 'POST') {
        const body = await request.json();
        const coaches = body.coaches || body;
        if (!Array.isArray(coaches)) {
          return jsonResponse({ success: false, error: 'Expected an array of coaches' }, 400);
        }
        await env.SKM_KV.put('skm_coaches', JSON.stringify(coaches));
        return jsonResponse({ success: true, message: 'Coaches updated successfully', data: coaches });
      }
    }

    // 2. Active Coach for Homepage (/api/active-coach)
    if (path === '/api/active-coach') {
      if (request.method === 'GET') {
        const stored = await env.SKM_KV.get('selected_coach', 'json');
        const coach = stored || DEFAULT_COACHES[0];
        return jsonResponse({ success: true, data: coach });
      }

      if (request.method === 'POST') {
        const body = await request.json();
        const coach = body.coach || body;
        if (!coach || !coach.id) {
          return jsonResponse({ success: false, error: 'Invalid coach data' }, 400);
        }
        await env.SKM_KV.put('selected_coach', JSON.stringify(coach));
        return jsonResponse({ success: true, message: 'Active coach updated', data: coach });
      }
    }

    // 3. Body Shapes (/api/bodyshapes)
    if (path === '/api/bodyshapes') {
      if (request.method === 'GET') {
        const stored = await env.SKM_KV.get('body_shapes', 'json');
        return jsonResponse({ success: true, data: stored || {} });
      }

      if (request.method === 'POST') {
        const body = await request.json();
        let shapes = (await env.SKM_KV.get('body_shapes', 'json')) || {};
        if (body.shapeType) {
          if (body.data === null) {
            delete shapes[body.shapeType];
          } else {
            shapes[body.shapeType] = body.data;
          }
        } else if (body.shapes) {
          shapes = { ...shapes, ...body.shapes };
        } else {
          shapes = { ...shapes, ...body };
        }
        await env.SKM_KV.put('body_shapes', JSON.stringify(shapes));
        return jsonResponse({ success: true, message: 'Body shape saved', data: shapes });
      }
    }

    // 4. Branding (/api/branding)
    if (path === '/api/branding') {
      if (request.method === 'GET') {
        const stored = await env.SKM_KV.get('branding', 'json');
        return jsonResponse({ success: true, data: stored || {} });
      }

      if (request.method === 'POST') {
        const body = await request.json();
        let branding = (await env.SKM_KV.get('branding', 'json')) || {};
        branding = { ...branding, ...body };
        if (body.logoUrl === null || body.logoUrl === '') delete branding.logoUrl;
        if (body.bgUrl === null || body.bgUrl === '') delete branding.bgUrl;
        await env.SKM_KV.put('branding', JSON.stringify(branding));
        return jsonResponse({ success: true, message: 'Branding saved', data: branding });
      }
    }

    // 5. Contacts Submissions (/api/contacts)
    if (path === '/api/contacts') {
      if (request.method === 'GET') {
        const stored = (await env.SKM_KV.get('contacts', 'json')) || [];
        return jsonResponse({ success: true, data: stored });
      }

      if (request.method === 'POST') {
        const body = await request.json();
        const stored = (await env.SKM_KV.get('contacts', 'json')) || [];
        stored.push({
          id: Date.now().toString(),
          ...body,
          createdAt: new Date().toISOString()
        });
        // Keep last 100 contacts
        const trimmed = stored.slice(-100);
        await env.SKM_KV.put('contacts', JSON.stringify(trimmed));
        return jsonResponse({ success: true, message: 'Contact submitted successfully' });
      }

      if (request.method === 'DELETE') {
        const id = url.searchParams.get('id');
        let stored = (await env.SKM_KV.get('contacts', 'json')) || [];
        if (id) {
          stored = stored.filter(c => c.id !== id);
        } else {
          stored = [];
        }
        await env.SKM_KV.put('contacts', JSON.stringify(stored));
        return jsonResponse({ success: true, message: id ? 'Contact deleted' : 'Contacts cleared' });
      }
    }

    // 6. Weight Logs (/api/weight-logs)
    if (path === '/api/weight-logs') {
      if (request.method === 'GET') {
        const stored = (await env.SKM_KV.get('weight_logs', 'json')) || [];
        return jsonResponse({ success: true, data: stored });
      }

      if (request.method === 'POST') {
        const body = await request.json();
        const stored = (await env.SKM_KV.get('weight_logs', 'json')) || [];
        stored.push({
          id: Date.now().toString(),
          ...body,
          createdAt: new Date().toISOString()
        });
        const trimmed = stored.slice(-100);
        await env.SKM_KV.put('weight_logs', JSON.stringify(trimmed));
        return jsonResponse({ success: true, message: 'Weight log saved' });
      }
    }

    return jsonResponse({ error: 'Endpoint not found' }, 404);

  } catch (error) {
    console.error('API Error:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Route API calls to Cloudflare KV handlers
    if (url.pathname.startsWith('/api/')) {
      return handleApi(request, env, url);
    }

    // Fallback to static assets
    return env.ASSETS.fetch(request);
  }
};
