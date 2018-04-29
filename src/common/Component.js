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
     * @param args
     */
    onReceive(...args) {

    }
}

Component.serializedComponents = {};

// decorator
Component.serializedName = function(name) {
    return function(target) {
        Component.serializedComponents[name] = target;
    }
};

Component.clientOnly = function (target) {
    target.isClientOnly = true;
};

module.exports = Component;