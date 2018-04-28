const THREE = require('three');
const Resource = {};

Resource.MODEL_PATH = 'vox/';
Resource.PREFAB_PATH = 'pref/';

Resource.MTLLoader = new THREE.MTLLoader();
Resource.MTLLoader.setTexturePath(Resource.MODEL_PATH);
Resource.MTLLoader.setPath(Resource.MODEL_PATH);

Resource.OBJLoader = new THREE.OBJLoader();
Resource.OBJLoader.setPath(Resource.MODEL_PATH);

Resource.ObjectLoader = new THREE.ObjectLoader();

Resource.Model = {};
Resource.Prefab = {};

Resource.loadOBJ = function(name) {
    return new Promise(function(resolve, reject) {
        // cache
        if (Resource.Model[name]) {
            resolve(Resource.Model[name].clone());
            return;
        }
        // load from model
        Resource.MTLLoader.load(name + ".mtl", (material) =>{
            material.preload();
            Resource.OBJLoader.setMaterials(material);
            Resource.OBJLoader.load(name + ".obj", (obj) => {
                Resource.Model[name] = obj;
                resolve(obj.clone());
            }, undefined, reject);
        });
    });
};

Resource.loadJSON = function(name) {
    return new Promise(function(resolve, reject) {
        // cache
        if (Resource.Model[name]) {
            resolve(Resource.Model[name].clone());
            return;
        }
        // load from model
        Resource.ObjectLoader.load(Resource.MODEL_PATH + name + '.json', (obj) => {
            Resource.Model[name] = obj;
            resolve(obj.clone());
        }, undefined, reject);
    })
};

module.exports = Resource;