const Logoran = require('logoran');

const View = require('./view');

const app = module.exports = new Logoran();

app.use(async function(ctx) {
  ctx.type = 'html';
  ctx.body = new View(ctx);
});

if (!module.parent) app.listen(3000);
