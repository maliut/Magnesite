// 临时放在这里，以后序列化 scene 实现
const THREE = require('three');
const GameObject = require('./GameObject');
const Resource = require('./Resource');
const StepTrigger = require('./components/StepTrigger');
const MachineController = require('./components/MachineController');

module.exports = function () {

    return new Promise(function (resolve) {
        // load all prefab
        Resource.loadPrefab('player').then(() => {

            // create static scene
            let ambientLight = new Promise(function (resolve) {
                let ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
                resolve(new GameObject(ambientLight));
            });

            let container = new Promise(function (resolve) {
                let container = new GameObject(new THREE.Object3D());
                container.networkId = container.name = 'TuringMachine';
                container.addComponent(new MachineController());
                Promise.all([Resource.loadOBJ('char_0'), Resource.loadOBJ('char_1'), Resource.loadOBJ('char_e')]).then(() => {
                    //console.log("resmodel", Resource.Model);
                    resolve(container);
                });

            });

            let floor = new Promise(function (resolve) {
                Resource.loadJSON('floor').then((cube) => {
                    cube.position.y = -0.1;
                    //console.log(cube);
                    resolve(new GameObject(cube));
                });
            });

            let arrow = new Promise(function (resolve) {
                Resource.loadOBJ('arrow').then((arrow) => {
                    arrow.scale.x = 0.1;
                    arrow.scale.y = 0.1;
                    arrow.scale.z = 0.1;
                    arrow.position.y = 0.1;
                    arrow.position.z = 1;
                    arrow.rotation.y -= Math.PI / 2;
                    resolve(new GameObject(arrow));
                });
            });

            let btn0 = new Promise(function (resolve) {
                Resource.loadOBJ('btn_0').then((obj) => {
                    obj.scale.x = 0.1;
                    obj.scale.y = 0.1;
                    obj.scale.z = 0.1;
                    obj.position.y = 0.1;
                    obj.position.z = 2;
                    obj.position.x = 1;
                    obj.rotation.y -= Math.PI / 2;
                    let ret = new GameObject(obj);
                    ret.name = 'btn0';
                    //ret.networkId = ret.name;
                    let trigger = new StepTrigger();
                    trigger.props.triggerType = 0;
                    ret.addComponent(trigger);
                    resolve(ret);
                });
            });

            let btn1 = new Promise(function (resolve) {
                Resource.loadOBJ('btn_1').then((obj) => {
                    obj.scale.x = 0.1;
                    obj.scale.y = 0.1;
                    obj.scale.z = 0.1;
                    obj.position.y = 0.1;
                    obj.position.z = 2;
                    obj.position.x = 2;
                    obj.rotation.y -= Math.PI / 2;
                    let ret = new GameObject(obj);
                    ret.name = 'btn1';
                    //ret.networkId = ret.name;
                    let trigger = new StepTrigger();
                    trigger.props.triggerType = 1;
                    ret.addComponent(trigger);
                    resolve(ret);
                });
            });

            let btne = new Promise(function (resolve) {
                Resource.loadOBJ('btn_e').then((obj) => {
                    obj.scale.x = 0.1;
                    obj.scale.y = 0.1;
                    obj.scale.z = 0.1;
                    obj.position.y = 0.1;
                    obj.position.z = 2;
                    obj.position.x = 0;
                    obj.rotation.y -= Math.PI / 2;

                    let ret = new GameObject(obj);
                    ret.name = 'btne';
                    //ret.networkId = ret.name;
                    let trigger = new StepTrigger();
                    trigger.props.triggerType = 4;
                    ret.addComponent(trigger);
                    resolve(ret);
                });
            });

            let moveLeft = new Promise(function (resolve) {
                Resource.loadOBJ('move').then((obj) => {
                    obj.scale.x = 0.1;
                    obj.scale.y = 0.1;
                    obj.scale.z = 0.1;
                    obj.position.y = 0.1;
                    obj.position.z = 2;

                    let left = obj;
                    left.position.x = -2;
                    left.rotation.y -= Math.PI / 2;
                    let ret = new GameObject(obj);
                    ret.name = 'moveRight';
                    //ret.networkId = ret.name;
                    let trigger = new StepTrigger();
                    trigger.props.triggerType = 3;
                    ret.addComponent(trigger);
                    resolve(ret);

                });
            });

            let moveRight = new Promise(function (resolve) {
                Resource.loadOBJ('move').then((obj) => {
                    obj.scale.x = 0.1;
                    obj.scale.y = 0.1;
                    obj.scale.z = 0.1;
                    obj.position.y = 0.1;
                    obj.position.z = 2;

                    let right = obj;
                    right.position.x = -1;
                    right.rotation.y += Math.PI / 2;
                    let ret = new GameObject(obj);
                    ret.name = 'moveLeft';
                    //ret.networkId = ret.name;
                    let trigger = new StepTrigger();
                    trigger.props.triggerType = 2;
                    ret.addComponent(trigger);
                    resolve(ret);
                });
            });

            let chatManager = new Promise(function (resolve) {
                let o = new GameObject(new THREE.Object3D());
                let ChatManager = require('./components/ChatManager');
                o.addComponent(new ChatManager());
                resolve(o);
            });

            Promise.all([ambientLight, container, floor, arrow, btn0, btn1, moveLeft, moveRight, chatManager, btne]).then((arr) => {
                resolve(arr);
            });
        });
    });

};
