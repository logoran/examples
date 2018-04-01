require('should');
const app = require('./app');
const server = app.listen();
const request = require('supertest').agent(server);

describe('Stream View', function() {
  afterAll(function() {
    server.close();
  });

  it('GET /', function(done) {
    request
      .get('/')
      .expect(200)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(/<title>Hello World<\/title>/)
      .expect(/<p>Hello World<\/p>/, done);
  });
});
