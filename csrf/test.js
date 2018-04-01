const app = require('./app');
const server = app.listen();
const request = require('supertest').agent(server);

let token;
let cookie;

describe('csrf', async function() {
  afterAll(function() {
    server.close();
  });

  await describe('GET /token', function() {
    it('should get token', function(done) {
      request
        .get('/token')
        .expect(200)
        .expect('Content-Type', 'text/plain; charset=utf-8')
        .end(function(err, res) {
          token = res.text;
          cookie = res.headers['set-cookie'].join(';');
          done(err);
        });
    });
  });

  describe('POST /post', function() {
    it('should 403 without token', async function(done) {
      request
        .post('/post')
        .send({foo: 'bar'})
        .expect(403, done);
    });

    it('should 403 with wrong token', async function(done) {
      request
        .post('/post')
        .send({foo: 'bar'})
        .set('x-csrf-token', 'wrong token')
        .expect(403, done);
    });

    it('should 200 with token in head', async function(done) {
      request
        .post('/post')
        .set('Cookie', cookie)
        .set('x-csrf-token', token)
        .send({foo: 'bar'})
        .expect(200, done);
    });

    it('should 200 with token in body', async function(done) {
      request
        .post('/post')
        .set('Cookie', cookie)
        .send({_csrf: token})
        .expect(200, done);
    });
  });
});
