const ormModels = [
    require('./orm-models/user.orm-model')
];

module.exports = {
    service : require('./orm.service'),
    models  : ormModels
};
