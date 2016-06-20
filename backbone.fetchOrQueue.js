define(function(require, exports, module) {

Backbone.Model.prototype.fetchOrQueue = 
Backbone.Collection.prototype.fetchOrQueue = function(callback, options) {
    var resource = this;
    if (!options) options = {};

    if (resource.loaded && ((Date.now() - resource.loaded.getTime()) < 2*60*1000)) {
        if (callback) setTimeout(function() { callback(false, resource); }, 0);
        return resource;
    }

    if (callback) {
        if (!resource.fetching) {

        options.success = function() {
            resource.loaded = new Date();
            resource.fetching = false;
            callback(false, resource);
        };

        options.error = function() {
            resource.loaded = false;
            resource.fetching = false;
            callback(true);
        };

        resource.fetch(options);
        resource.fetching = true;
        } else {
            resource.once('sync', function() {
                resource.fetchOrQueue(callback, options);
            });
        }
    }
  
    return resource;
};

});