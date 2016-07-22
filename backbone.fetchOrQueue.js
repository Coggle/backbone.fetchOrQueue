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

        if (!resource._pending_callbacks)
            resource._pending_callbacks = [];
        resource._pending_callbacks.push(callback);

        if (!resource.fetching) {

            options.success = function() {
                resource.loaded = new Date();
                resource.fetching = false;
                resource._pending_callbacks.map(function(callback){
                    callback(false, resource);  
                });
                delete resource._pending_callbacks;
            };

            options.error = function() {
                resource.loaded = false;
                resource.fetching = false;
                resource._pending_callbacks.map(function(callback){
                    callback(true);
                });
                delete resource._pending_callbacks;
            };

            resource.fetch(options);
            resource.fetching = true;
        }
    }
      
    return resource;
};

});