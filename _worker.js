export default {
  async fetch(request, env) {
    const { default: handler } = await import('./.output/server/index.mjs');
    return handler.fetch(request, env);
  }
};
