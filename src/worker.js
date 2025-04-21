export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const assetPath = url.pathname === '/' ? '/index.html' : url.pathname;

    try {
      const response = await env.ASSETS.fetch(request);
      return response;
    } catch (e) {
      return new Response(e.message || e.toString(), { status: 500 });
    }
  },
};