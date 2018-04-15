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