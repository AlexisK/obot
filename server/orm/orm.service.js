const merge = require('lodash/merge');
const forOwn = require('lodash/forOwn');

const ORM = {
    model: {},
    db: {},

    declareModel(model, params) {
        params = params || {};

        this.model[model] = {
            name: model,
            sources: {}
        };

        this.db[model] = {};

        if (params.sources) {

            forOwn(params.sources, (source, key) => {
                this.declareModelSource(model, key, source);
            });
        }
    },

    declareModelSource(model, name, params) {
        this.model[model].sources[name] = merge({
            name      : name,
            canFetch  : ref => true,
            fetch     : ref => new Promise(done => done()),
            normalize : ref => {
                return {};
            }
        }, params);
    },


    _getObjectFetchables(params, obj) {
        const fetchables = [];

        forOwn(params.sources, source => {
            if ( obj.fetch[source.name] != true && source.canFetch(obj) ) {
                obj.fetch[source.name] = true;
                fetchables.push(this._getObjectFetchablesWorker(source, obj));
            }
        });

        return fetchables;
    },

    _getObjectFetchablesWorker(source, obj) {
        return new Promise(done => {
            source.fetch(obj)
            .then(newObj => {
                merge(obj, source.normalize(newObj));
                done();
            })
            .catch(() => { console.error('Failed to fetch!'); done(); });
        })
    },

    _worker(params, obj, todo, onfail) {
        const fetchables = this._getObjectFetchables(params, obj);

        if ( fetchables.length == 0 ) { todo(obj); return 0; }

        Promise
            .all(fetchables)
            .then(() => this._worker(params, obj, todo))
            .catch(onfail);

    },

    fetch(model, obj) {
        if ( !obj ) { return Promise.reject(); }
        obj = this.syncObj(model, obj);


        return obj._fetchPromise || (obj._fetchPromise = new Promise((alldone, allfail) => {
            const params = this.model[model];
            this._worker(params, obj, alldone, allfail);
        }));
    },

    syncObj(model, obj) {

        if ( obj.id ) {
            if ( !this.db[model][obj.id] ) {
                this.db[model][obj.id] = obj;
                obj.fetch = obj.fetch || {};
            }
            return this.db[model][obj.id];
        }
        return obj;
    }
};

module.exports = ORM;
