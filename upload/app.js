
/**
 * Module dependencies.
 */

const logger = require('logoran-logger');
const serve = require('koa-static');
const koaBody = require('koa-body');
const Logoran = require('logoran');
const fs = require('fs');
const os = require('os');
const path = require('path');

const app = module.exports = new Logoran();

// log requests

app.use(logger());

app.use(koaBody({ multipart: true }));

// custom 404

app.use(async function(ctx, next) {
  await next();
  if (ctx.body || !ctx.idempotent) return;
  ctx.redirect('/404.html');
});

// serve files from ./public

app.use(serve(path.join(__dirname, '/public')));

// handle uploads

app.use(async function(ctx, next) {
  // ignore non-POSTs
  if ('POST' != ctx.method) return await next();

  const file = ctx.request.body.files.file;
  const reader = fs.createReadStream(file.path);
  const stream = fs.createWriteStream(path.join(os.tmpdir(), Math.random().toString()));
  reader.pipe(stream);
  console.log('uploading %s -> %s', file.name, stream.path);

  ctx.redirect('/');
});

// listen
if (!module.parent) app.listen(3000);
