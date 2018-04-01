require('should');
const app = require('./app');
const server = app.listen();
const request = require('supertest').agent(server);

describe('Blog', function() {
  afterAll(function() {
    server.close();
  });

  describe('GET /', function() {
    it('should see title "Posts"', function(done) {
      request
        .get('/')
        .expect(200)
        .expect('Content-Type', 'text/html; charset=utf-8')
        .expect(/<title>Posts<\/title>/, done);
    });

    it('should see 0 post', function(done) {
      request
        .get('/')
        .expect(200)
        .expect('Content-Type', 'text/html; charset=utf-8')
        .expect(/<p>You have <strong>0<\/strong> posts!<\/p>/, done);
    });
  });

  describe('POST /post/new', function() {
    it('should create post and redirect to /', function(done) {
      request
        .post('/post')
        .send({title: 'Title', body: 'Contents'})
        .expect(302)
        .expect('Content-Type', 'text/html; charset=utf-8')
        .expect('Location', '/', done);
    });
  });

  describe('GET /post/0', function() {
    it('should see post', function(done) {
      request
        .get('/post/0')
        .expect(200)
        .expect('Content-Type', 'text/html; charset=utf-8')
        .expect(/<h1>Title<\/h1>/)
        .expect(/<p>Contents<\/p>/, done);
    });
  });
});
