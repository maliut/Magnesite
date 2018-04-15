class GameObject {

    constructor(obj3d) {

        Object.defineProperty(this, "_obj3d", {
            value: obj3d
        });

        Object.defineProperty(obj3d, "_gameObject", {
            value: this
        });

        /**
         * 所有组件
         * @type {Map<Function, Array<Component>>}
         * @private
         */
        this.components = new Map();

        /**
         * 需要更新的组件列表
         * @type {Array}
         * @private
         */
        this.componentsNeedUpdate = [];

        return this.new(this);
    }

    /**
     * add component to game object
     * @param component
     */
    addComponent(component) {
        let exists = this.components.get(component.class);
        if (exists) {
            exists.push(component);
        } else {
            this.components.set(component.class, [component]);
        }
        if (typeof component.update === 'function') {
            this.componentsNeedUpdate.push(component);
        }
    }

    /**
     * remove component of game object
     * @param component
     */
    removeComponent(component) {
        let exists = this.components.get(component.class);
        if (exists) {
            exists.remove(component);
        }
        this.componentsNeedUpdate.remove(component);
    }

    /**
     * get component of certain class
     * @param klass class of component
     * @returns {Component | null}
     */
    getComponent(klass) {
        let exists = this.components.get(klass);
        return exists ? exists[0] : null;
    }

    /**
     * get all components of certain class
     * @param klass class of component
     * @returns {Array<Component> | undefined}
     */
    getComponents(klass) {
        return this.components.get(klass);
    }

    /**
     * broadcast message to all components
     * @param sender
     * @param args
     */
    broadcast(sender, ...args) {
        this.components.forEach(value => {
            for (let i of value) {
                i.onReceive(sender, ...args);
            }
        })
    }

    /**
     * fully proxy THREE.Object3D
     * @returns {Object}
     * @param origin
     * @private
     */
    new(origin) {
        const handler = {
            get: function(target, property) {
                return (property in target) ? target[property] : target._obj3d[property];
            },
            set: function(target, property, value) {
                if (property in target) {
                    target[property] = value;
                } else {
                    target._obj3d[property] = value;
                }
                return true;
            },
            has: function(target, key) {
                return key in target || key in target._obj3d;
            }
        };
        console.log(this);
        //let origin = new GameObject(...constructor_args);
        let proxy = new Proxy(origin, handler);
        proxy._origin = origin;
        proxy.class = GameObject;
        return proxy;
    }

    /**
     * on game update
     * @param deltaTime
     * @private
     */
    update(deltaTime) {
        for (let comp of this.componentsNeedUpdate) {
            comp.update(deltaTime);
        }
    }

}

module.exports = GameObject;