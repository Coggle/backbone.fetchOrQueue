define(function(require, exports, module) {

Backbone.Model.prototype.fetchOrQueue = 
Backbone.Collection.prototype.fetchOrQueue = function(callback, options) {
  var resource = this;

  if (resource.loaded && ((Date.now() - resource.loaded.getTime()) < 30*1000)) {
    if (callback) callback(false, resource);
    return resource;
  }

  resource.once('sync', function(){
      resource.loaded = new Date();
      resource.fetching = false;
  });
  resource.once('error', function(){
      resource.fetching = false;
      resource.loaded = false;
  });

  if (callback) {
    resource.once('sync', function() {
      callback(false, resource);
      resource.off(null, null, callback);
    }, callback);

    resource.once('error', function() {
      callback(true);
      resource.off(null, null, callback);
    }, callback);

    if (!resource.fetching) {
      resource.fetch(options);
      resource.fetching = true;
    }
  }
  
  return resource;
};

});