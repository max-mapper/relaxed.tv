var couchapp = require('couchapp')
  , path = require('path')
  ;

ddoc =
  { _id:'_design/relaxedtv'
  , rewrites :
    [ {from:"/", to:'index.html'}
    , {from:"/api/videos", to:'_view/videos', query: {"descending": true}}
    , {from:"/api", to:'../../'}
    , {from:"/api/*", to:'../../*'}
    , {from:"/*", to:'*'}
    ]
  }
  ;

ddoc.views = {
  /**
   * A simple map function mocking _all, but allows usage with lists etc.
   */
  all: {
    map: function(doc) {
      emit(doc._id, doc);
    }
  },
  videos: {
    map: function(doc) {
      if (doc.url && doc.title && doc.created_at) {
        emit(doc.created_at, doc);
      }
    }
  }
};

ddoc.validate_doc_update = function (newDoc, oldDoc, userCtx) {
  if (newDoc._deleted === true && userCtx.roles.indexOf('_admin') === -1) {
    throw "Only admin can delete documents on this database.";
  }
};

couchapp.loadAttachments(ddoc, path.join(__dirname, 'attachments'));

module.exports = ddoc;