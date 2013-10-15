var SiteGen   = require('../index'),
    assert    = require('assert'),
    path      = require('path'),
    supertest = require('supertest');

describe('sitegen', function() {

  var app = SiteGen(path.join(__dirname, 'pages', 'site.jsx'));

  describe('pages', function() {

    it('generate page for /', function(done) {
      supertest(app)
        .get('/')
        .expect('Content-Type', 'text/html')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          assert.ok(res.text.match(/>index<\/title>/));
          assert.ok(res.text.match(/<p>some content<\/p>/));
          done();
        });
    });

    it('generate page for /index.html', function(done) {
      supertest(app)
        .get('/index.html')
        .expect('Content-Type', 'text/html')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          assert.ok(res.text.match(/>index<\/title>/));
          assert.ok(res.text.match(/<p>some content<\/p>/));
          done();
        });
    });


    it('generate page for /page.html', function(done) {
      supertest(app)
        .get('/page.html')
        .expect('Content-Type', 'text/html')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          assert.ok(res.text.match(/>page<\/title>/));
          assert.ok(res.text.match(/<p>some content<\/p>/));
          done();
        });
    });

    it('generate page for /subdir/nested.html', function(done) {
      supertest(app)
        .get('/subdir/nested.html')
        .expect('Content-Type', 'text/html')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          assert.ok(res.text.match(/>nested<\/title>/));
          assert.ok(res.text.match(/<p>content<\/p>/));
          done();
        });
    });

    it('generate page for /subdir/subdir_w_data/', function(done) {
      supertest(app)
        .get('/subdir_w_data/')
        .expect('Content-Type', 'text/html')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          assert.ok(res.text.match(/>data<\/title>/));
          assert.ok(res.text.match(/<p>oops<\/p>/));
          done();
        });
    });

    it('generate page for /subdir/subdir_w_data/index.html', function(done) {
      supertest(app)
        .get('/subdir_w_data/index.html')
        .expect('Content-Type', 'text/html')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          assert.ok(res.text.match(/>data<\/title>/));
          assert.ok(res.text.match(/<p>oops<\/p>/));
          done();
        });
    });
  });

  describe('api', function() {

    it('generate page for /index.json', function(done) {
      supertest(app)
        .get('/index.json')
        .expect('Content-Type', 'application/json')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.metadata.title, 'index');
          assert.equal(res.body.content, '<p>some content</p>');
          done();
        });
    });

    it('generate page for /page.json', function(done) {
      supertest(app)
        .get('/page.json')
        .expect('Content-Type', 'application/json')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.metadata.title, 'page');
          assert.equal(res.body.content, '<p>some content</p>');
          done();
        });
    });

    it('generate page for /subdir/nested.json', function(done) {
      supertest(app)
        .get('/subdir/nested.json')
        .expect('Content-Type', 'application/json')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.metadata.title, 'nested');
          assert.equal(res.body.content, '<p>content</p>');
          done();
        });
    });

    it('generate page for /subdir/subdir_w_data/index.json', function(done) {
      supertest(app)
        .get('/subdir_w_data/index.json')
        .expect('Content-Type', 'application/json')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.body.metadata.title, 'data');
          assert.equal(res.body.content, '<p>oops</p>');
          done();
        });
    });
  });

  describe('assets', function() {

    it('generate js bundle', function(done) {
      supertest(app)
        .get('/assets/bundle.js')
        .expect('Content-Type', 'application/javascript')
        .expect(200, done);
    });

    it('generate css bundle', function(done) {
      supertest(app)
        .get('/assets/bundle.css')
        .expect('Content-Type', 'text/css')
        .expect(200, done);
    });

  });
});
