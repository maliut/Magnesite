const Synchronizer = require('../common/components/Synchronizer');
const FirstPersonController = require('../common/components/FirstPersonController');
const MouseControlRotation = require('../common/components/MouseControlRotation');
const THREE = require('three');
const GameObject = require('../common/GameObject');
const Client = require('./Client');

module.exports = {

    createSelfPlayer: function (scene) {
        let me = scene.spawn('player');
        me.networkId = Client.current.socket.id;
        me.getComponent(Synchronizer).isLocalPlayer = true;
        me.addComponent(new FirstPersonController());
        me.add(createMouseControlCamera());

        const StepTrigger = require('../common/components/StepTrigger');
        scene.getObjectByName('btn0').getComponent(StepTrigger).authPlayers.push(me);
        scene.getObjectByName('btn1').getComponent(StepTrigger).authPlayers.push(me);
        scene.getObjectByName('moveLeft').getComponent(StepTrigger).authPlayers.push(me);
        scene.getObjectByName('moveRight').getComponent(StepTrigger).authPlayers.push(me);
    },

    createOtherPlayer: function (scene, networkId, name) {
        let other = scene.spawn('player');
        other.networkId = networkId;
        other._obj3d.add(createSpriteText(name));
    }


};


function createMouseControlCamera() {
    let camera = new THREE.PerspectiveCamera(75, /*window.innerWidth / window.innerHeight - 64*/1, 0.1, 1000);
    camera.position.y = 2.5;
    camera.position.z = 8;
    let pointLight = new THREE.PointLight(0xffffff, 0.8);
    camera.add(pointLight);
    camera.name = 'camera';
    //camera.lookAt(0, 0, -4);
    let pitch = new GameObject(new THREE.Object3D());
    pitch.add(new GameObject(camera));
    let yaw = new GameObject(new THREE.Object3D());
    yaw.name = 'yaw';
    pitch.name = 'pitch';
    yaw.add(pitch);

    let mouseControlObj = yaw;
    mouseControlObj.addComponent(new MouseControlRotation());
    return mouseControlObj;
}

function createSpriteText(text) {
    //先用画布将文字画出
    let canvas = document.createElement("canvas");
    canvas.width = 256; canvas.height = 128;
    //let canvas = createHiDPICanvas(256, 128);
    let ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.font = "Bold 60px Arial";
    let textWidth = ctx.measureText(text).width;
    ctx.fillText(text, (canvas.width/2) - (textWidth / 2), canvas.height / 2);

    let texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    //使用Sprite显示文字
    let material = new THREE.SpriteMaterial({map:texture});
    let textObj = new THREE.Sprite(material);
    //textObj.scale.set(0.5 * 100, 0.25 * 100, 0.75 * 100);
    textObj.position.y = 1.4;
    //console.log(textObj);
    return textObj;
}
