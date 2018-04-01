const Logoran = require('logoran');
const app = module.exports = new Logoran();

app.use(async function(ctx) {
  ctx.body = 'Hello World';
});

if (!module.parent) app.listen(3000);
