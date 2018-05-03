const THREE = require('three');
const MTLLoader = require('three-mtl-loader');
const GameObject = require('./GameObject');
const Component = require('./Component');
require('three-obj-loader')(THREE);
const ENV_CLIENT = !(typeof window === 'undefined');
const fs = ENV_CLIENT ? undefined : require('fs');

const MODEL_PATH = 'vox/';
const PREFAB_PATH = 'pref/';

// mtl 加载器
const mtlLoader = new MTLLoader();
mtlLoader.setTexturePath(MODEL_PATH);
mtlLoader.setPath(MODEL_PATH);

// obj 加载器
const objLoader = new THREE.OBJLoader();
objLoader.setPath(MODEL_PATH);

// json 模型加载器
const objectLoader = new THREE.ObjectLoader();
objectLoader.setTexturePath(MODEL_PATH);

// prefab 数据加载器
const prefLoader = new THREE.FileLoader();
prefLoader.oldLoad = prefLoader.load;
prefLoader.parse = (data) => JSON.parse(data);
prefLoader.load = function (path, callback) {
    prefLoader.oldLoad(path, (data) => {
        callback(prefLoader.parse(data));
    });
};
prefLoader.setPath(PREFAB_PATH);

const Resource = {};
Resource.Model = {};
Resource.Prefab = {};

/**
 * 加载 obj 格式模型
 * @param name
 * @returns {Promise}
 */
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

/**
 * 加载 JSON 格式模型
 * @param name
 * @returns {Promise<any>}
 */
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
    });
};

/**
 * 加载 prefab
 * @param name
 * @returns {Promise<any>}
 */
Resource.loadPrefab = function(name) {
    return new Promise(function(resolve) {
        // cache
        if (Resource.Prefab[name]) {
            resolve(Resource.Prefab[name].clone());
            return;
        }
        // load from pref
        parseTextInner(name + '.json', prefLoader, (data) => {
            console.log(typeof data);
            Resource['load' + data.objType.toUpperCase()](data.objName).then((obj) => {
                obj.name = data.name;
                let ret = new GameObject(obj);
                //console.log(Component.serializedComponents);
                data.components.forEach((comp) => {
                    let component = new Component.serializedComponents[comp.name]();
                    component.props = comp.props || {};
                    ret.addComponent(component);
                });
                postProcess(name, obj);
                Resource.Prefab[name] = ret;
                console.log("load player success!");
                resolve(ret.clone());
            });
        });
    });
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
        let pathPrefix = MODEL_PATH;
        if (loader === objectLoader) pathPrefix = '';
        if (loader === prefLoader) pathPrefix = PREFAB_PATH;
        path = process.cwd() + '/public/' + pathPrefix + path;
        fs.readFile(path, 'utf8', (err, data) => {
            // post process
            if (loader === objectLoader) data = JSON.parse(data);
            callback(loader.parse(data));
        });
    }
}

/**
 * 对于一些特殊情况进行后处理
 * 这部分优雅的解决方案是修改扩充 threejs 源码
 * @param name
 * @param obj
 */
function postProcess(name, obj) {
    if (name === 'player') {
        // 设定 player 头和身体的相对位置
        obj.children[1].position.y = 0.8;
        obj.position.y = 0.5;
        obj.position.z = 3;
    }
}

module.exports = Resource;