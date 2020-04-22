var { models } = require('../models');
var { localStorage } = require('./localStorage')

function ModelRepository(type) {

    function create(props) {
        let objs = ModelRepository(type).getAll();
        props.id = objs.length + 1;
        const obj = new models[type](props);
        objs.push(obj);
        localStorage.setItem(type, JSON.stringify(objs));
        return obj;
    }

    function update(objUpdated) {
        const objs = ModelRepository(type).getAll();
        let objToUpdate = objs.find(obj => obj.id === objUpdated.id);
        objs[objs.indexOf(objToUpdate)] = objUpdated;
        localStorage.setItem(type, JSON.stringify(objs));
        return objUpdated;
    }

    function get(id) {
        return ModelRepository(type).getAll().find(obj => obj.id === id);
    }

    function getAll() {
        return JSON.parse(localStorage.getItem(type)) || [];
    }

    function remove(id) {
        let objs = ModelRepository(type).getAll();
        objs = objs.filter(obj => obj.id !== id);
        localStorage.setItem(type, JSON.stringify(objs));
    }

    function clear() {
        localStorage.setItem(type, '[]');
    }

    return {create, update, get, getAll, remove, clear};

}

module.exports = ModelRepository;