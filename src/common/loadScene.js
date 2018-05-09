// 临时放在这里，以后序列化 scene 实现
const THREE = require('three');
const GameObject = require('./GameObject');
const Resource = require('./Resource');

module.exports = function () {

    return new Promise(function (resolve) {

        let tower = new Promise(function (resolve) {
            var geometry = new THREE.CylinderGeometry( 0.2, 0.2, 5 );
            var material = new THREE.MeshPhongMaterial( {color: 6684774} );
            var cylinder = new THREE.Mesh( geometry, material );
            cylinder.position.set(0, 2.5, 0);
            console.log(JSON.stringify(cylinder.toJSON()));
            resolve(new GameObject(cylinder));
        });

            /*let moveRight = new Promise(function (resolve) {
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
                    let trigger = new MachineTrigger();
                    trigger.props.triggerType = 2;
                    ret.addComponent(trigger);
                    ret.addComponent(new StepTrigger());
                    resolve(ret);
                });
            });

            let chatManager = new Promise(function (resolve) {
                let o = new GameObject(new THREE.Object3D());
                let ChatManager = require('./components/ChatManager');
                o.addComponent(new ChatManager());
                resolve(o);
            });*/

            Promise.all([tower]).then((arr) => {
                resolve(arr);
            });
    });
};
