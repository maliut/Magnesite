/**
 * base class for all components
 */
class Component {

    constructor() {
        /**
         * the game object where component attach
         * @type {null}
         */
        this.gameObject = null;

        /**
         * properties to be serialized
         * @type {{}}
         */
        this.props = {};
    }

    /**
     * broadcast message to all components
     * @param args
     */
    broadcast(...args) {
        if (!this.gameObject) {
            console.warn("No game object of this component!")
        }

        this.gameObject.broadcast(this, ...args);
    }

    /**
     * called when game object or component broadcast
     * @param sender component
     * @param args
     */
    onReceive(sender, ...args) {

    }
}

Component.serializedComponents = {};

// decorator
Component.serializedName = function(name) {
    return function(target) {
        //console.log("reg:" + name);
        Component.serializedComponents[name] = target;
    }
};

Component.clientOnly = function (target) {
    //console.log("clientOnly:" + target.class);
    target.isClientOnly = true;
};

module.exports = Component;