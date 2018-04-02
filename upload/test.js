const app = require('./app');
const server = app.listen();
const request = require('supertest').agent(server);

// https://github.com/mscdex/busboy/blob/master/test/test-types-multipart.js
const ct = 'multipart/form-data; boundary=---------------------------paZqsnEHRufoShdX6fh0lUhXBP4k';
const body = [
  '-----------------------------paZqsnEHRufoShdX6fh0lUhXBP4k',
  'Content-Disposition: form-data; name="file"; filename="ab.dat"',
  '',
  'super alpha file',
  '-----------------------------paZqsnEHRufoShdX6fh0lUhXBP4k--'
].join('\r\n');

describe('upload', function() {
  afterAll(function() {
    server.close();
  });

  describe('when GET /', function() {
    it('should return the upload page', function(done) {
      request
        .get('/')
        .expect(200)
        .expect(/<h1>File Upload<\/h1>/)
        .expect(/<p>Try uploading multiple files at a time.<\/p>/, done);
    });
  });

  describe('when GET /404.html', function() {
    it('should return the upload page', function(done) {
      request
        .get('/404.html')
        .expect(200)
        .expect(/<h1>Sorry! Can't find that.<\/h1>/)
        .expect(/<p>The page you requested cannot be found.<\/p>/, done);
    });
  });

  describe('when GET /not-exist', function() {
    it('should return the 404 page', function(done) {
      request
        .get('/not-exist')
        .expect(302)
        .expect('Content-Type', 'text/html; charset=utf-8')
        .expect('Location', '/404.html', done);
    });
  });

  describe('when POST /', function() {
    it('should store the file', function(done) {
      request
        .post('/')
        .set('Content-Type', ct)
        .send(body)
        .expect(302)
        .expect('Content-Type', 'text/html; charset=utf-8')
        .expect('Location', '/', done);
    });
  });

});
