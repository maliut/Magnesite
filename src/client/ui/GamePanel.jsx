const React = require('react');

class GamePanel extends React.Component {

    /*constructor(props) {
        super(props);
    }*/

    componentDidMount() {
        const width = this.mount.clientWidth;
        const height = this.mount.clientHeight;
        this.props.renderer.setSize(width, height);
        this.mount.appendChild(this.props.renderer.getDomElement());
        setWindowResizeListener(this.onWindowResize.bind(this));
    }

    componentWillUnmount() {
        this.mount.removeChild(this.props.renderer.getDomElement());
        removeWindowResizeListener(this.onWindowResize.bind(this));
    }

    onWindowResize() {
        const width = this.mount.clientWidth;
        const height = this.mount.clientHeight;
        this.props.renderer.setSize(width, height);
    }

    render() {
        return (
            <div
                style={{height: this.props.height}}
                ref={(mount) => { this.mount = mount }}
            />
        )
    }

}

module.exports = GamePanel;