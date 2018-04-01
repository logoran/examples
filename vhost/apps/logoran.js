const Logoran = require('logoran');

// logoran app

const app = new Logoran();

app.use(async function(ctx, next) {
  await next();
  ctx.set('X-Custom', 'Dub Dub Dub App');
});

app.use(async function(ctx, next) {
  await next();
  if ('/' != ctx.url) return;
  ctx.body = 'Hello from www app';
});

module.exports = app;
