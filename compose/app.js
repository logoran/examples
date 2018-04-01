/**
 * Each `app.use()` only accepts a single generator function.
 * If you want to combine multiple generator functions into a single one,
 * you can use `logoran-compose` to do so.
 * This allows you to use `app.use()` only once.
 * Your code will end up looking something like:
 *
 *   app.use(compose([
 *     function *(){},
 *     function *(){},
 *     function *(){}
 *   ]))
*/

const compose = require('logoran-compose');
const Logoran = require('logoran');
const app = module.exports = new Logoran();

// x-response-time

async function responseTime(ctx, next) {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  ctx.set('X-Response-Time', ms + 'ms');
}

// logger

async function logger(ctx, next) {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  if ('test' != process.env.NODE_ENV) {
    console.log('%s %s - %s', ctx.method, ctx.url, ms);
  }
}

// response

async function respond(ctx, next) {
  await next();
  if ('/' != ctx.url) return;
  ctx.body = 'Hello World';
}

// composed middleware

const all = compose([
  responseTime,
  logger,
  respond
]);

app.use(all);

if (!module.parent) app.listen(3000);
