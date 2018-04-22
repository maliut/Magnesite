const React = require('react');

class GamePanel extends React.Component {

    /*constructor(props) {
        super(props);
    }*/

    componentDidMount() {
        this.onWindowResize();
        this.mount.appendChild(this.props.game.renderer.domElement);
        addWindowResizeListener(this.onWindowResize.bind(this));
    }

    componentWillUnmount() {
        this.mount.removeChild(this.props.game.renderer.domElement);
        removeWindowResizeListener(this.onWindowResize.bind(this));
    }

    onWindowResize() {
        const width = this.mount.clientWidth;
        const height = this.mount.clientHeight;
        this.props.game.renderer.onWindowResize(width, height);
        this.props.game.scene._camera.aspect = width / height;
        this.props.game.scene._camera.updateProjectionMatrix();
    }

    render() {
        return (
            <div
                style={{position: 'absolute', bottom: 0, top: '64px', left: 0, right: 0}}
                ref={(mount) => { this.mount = mount }}
            />
        )
    }

}

module.exports = GamePanel;