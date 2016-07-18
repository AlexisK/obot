
global.ORM = new (function() {
    var self = this;
    
    self.init = function() {
        self.model = {};
        self.db = {};
    }
    
    self.declareModel = function(model, params) {
        params = params || {};
        self.model[model] = {
            name: model,
            sources: {}
        }
        self.db[model] = {};
        
        if ( params.sources ) {
            for ( var k in params.sources ) {
                self.declareModelSource(model, k, params.sources[k]);
            }
        }
    }
    
    self.declareModelSource = function(model, name, params) {
        self.model[model].sources[name] = mergeObjects({
            name: name,
            canFetch: ref => true,
            fetch: ref => new Promise(done => done()),
            normalize: ref => { return {}; }
        }, params);
    }
    
    self._getObjectFetchables = function(params, obj) {
        var fetchables = [];
        for ( var k in params.sources ) {
            var source = params.sources[k];
            
            if ( obj.fetch[source.name] != true && source.canFetch(obj) ) {
                obj.fetch[source.name] = true;
                fetchables.push(self._getObjectFetchablesWorker(source, obj));
            }
        }
        return fetchables;
    }
    
    self._getObjectFetchablesWorker = function(source, obj) {
        return new Promise(done => {
            source.fetch(obj)
            .then(newObj => {
                mergeObjects(obj, source.normalize(newObj));
                done();
            })
            .catch(() => { console.error('Failed to fetch!'); done(); })
            
        })
    }
    
    self._worker = function(params, obj, todo) {
        var fetchables = self._getObjectFetchables(params, obj);
        
        if ( fetchables.length == 0 ) { todo(); return 0; }
        
        Promise.all(fetchables).then(()=> {
            self._worker(params, obj, todo);
        });
        
    }
    
    self.fetch = function(model, obj) {
        if ( !obj ) { return Promise.reject(); }
        obj = self.syncObj(model, obj);
        
        
        return obj._fetchPromise || (obj._fetchPromise = new Promise((alldone, allfail) => {
            var promises = [];
            var params = self.model[model];
            self._worker(params, obj, alldone);
        }));
        
    }
    
    self.syncObj = function(model, obj) {
        
        if ( obj.id ) {
            if ( !self.db[model][obj.id] ) {
                self.db[model][obj.id] = obj;
                obj.fetch = obj.fetch || {};
            }
            return self.db[model][obj.id];
        }
        return obj;
    }
    
    self.init()
})();
