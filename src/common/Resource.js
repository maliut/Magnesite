const THREE = require('three');
const MTLLoader = require('three-mtl-loader');
require('three-obj-loader')(THREE);
const ENV_CLIENT = !(typeof window === 'undefined');
const fs = ENV_CLIENT ? undefined : require('fs');

const MODEL_PATH = 'vox/';
const PREFAB_PATH = 'pref/';

const mtlLoader = new MTLLoader();
mtlLoader.setTexturePath(MODEL_PATH);
mtlLoader.setPath(MODEL_PATH);

const objLoader = new THREE.OBJLoader();
objLoader.setPath(MODEL_PATH);

const objectLoader = new THREE.ObjectLoader();
objectLoader.setTexturePath(MODEL_PATH);

const Resource = {};
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
        if (ENV_CLIENT) {
            parseTextInner(name + ".mtl", mtlLoader, (material) => {
                material.preload();
                objLoader.setMaterials(material);
                parseTextInner(name + ".obj", objLoader, (obj) => {
                    Resource.Model[name] = obj;
                    resolve(obj.clone());
                });
            });
        } else {
            // 服务端不加载贴图
            parseTextInner(name + ".obj", objLoader, (obj) => {
                Resource.Model[name] = obj;
                resolve(obj.clone());
            });
        }
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
        parseTextInner(MODEL_PATH + name + '.json', objectLoader, (obj) => {
            Resource.Model[name] = obj;
            resolve(obj.clone());
        });
    })
};

/**
 * 解析文本到指定对象
 * @param path 浏览器路径
 * @param loader 浏览器用 load 接口，服务端用 parse 接口
 * @param callback 接收解析出的对象
 */
function parseTextInner(path, loader, callback) {
    if (ENV_CLIENT) {
        loader.load(path, callback);
    } else {
        //let fs = require('fs');
        path = process.cwd() + '/public/' + (loader === objectLoader ? '' : MODEL_PATH) + path;
        //console.log(path);
        fs.readFile(path, 'utf8', (err, data) => {
            // post process
            if (loader === objectLoader) data = JSON.parse(data);
            callback(loader.parse(data));
        });
    }
}

module.exports = Resource;