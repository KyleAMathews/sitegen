var assert          = require('assert'),
    path            = require('path'),
    pageCollection  = require('../page-collection');

describe('page-collection', function() {

  var root = path.join(__dirname, 'pages'),
      pages = pageCollection(root);

  it('gets root page by id', function(done) {
    pages.get('/')
      .then(function(page) {
        assertPage(page, '/');
        assertHasMetadata(page, true);
        assert.equal(page.metadata.title, 'index');
        assertHasContent(page, true);
        assert.ok(page.children);
        assert.equal(page.children.length, 3);
        done();
      }).then(null, done);
  });

  it('gets typical page by id', function(done) {
    pages.get('/page')
      .then(function(page) {
        assertPage(page, '/page');
        assertHasMetadata(page, true);
        assert.equal(page.metadata.title, 'page');
        assertHasContent(page, true);
        assert.ok(!page.children);
        done();
      }).then(null, done);
  });

  it('gets a container page with no data by id', function(done) {
    pages.get('/subdir')
      .then(function(page) {
        assertPage(page, '/subdir');
        assertHasMetadata(page, false);
        assertHasContent(page, false);
        assert.ok(page.children);
        assert.equal(page.children.length, 1);
        assert.equal(page.children[0].id, '/subdir/nested');
        done();
      }).then(null, done);
  });

  it('gets a nested page by id', function(done) {
    pages.get('/subdir/nested')
      .then(function(page) {
        assertPage(page, '/subdir/nested');
        assertHasMetadata(page, true);
        assert.equal(page.metadata.title, 'nested');
        assertHasContent(page, true);
        assert.ok(!page.children);
        done();
      }).then(null, done);
  });

  it('gets a container page with data by id', function(done) {
    pages.get('/subdir_w_data')
      .then(function(page) {
        assertPage(page, '/subdir_w_data');
        assertHasMetadata(page, true);
        assert.equal(page.metadata.title, 'data');
        assertHasContent(page, true);
        assert.ok(page.children);
        assert.equal(page.children.length, 0);
        done();
      }).then(null, done);
  });

  it('returns null on non-existent page', function(done) {
    pages.get('/oops')
      .then(function(page) {
        assert.equal(page, null);
        done();
      }).then(null, done);
  });

});

function assertPage(page, id) {
  assert.ok(page, 'Page should be truthy');
  assert.equal(page.id, id);
}

function assertHasContent(page, has) {
  var msg = has ? 'Page should have content' : 'Page should have no content';
  assert.ok(has ? page.content : !page.content, msg);
}

function assertHasMetadata(page, has) {
  var msg = has ? 'Page should have metadata' : 'Page should have no metadata';
  assert.ok(has ? page.metadata : !page.metadata, msg);
}
