const React = require('react');
const GridList = require('material-ui/GridList')['default'];
const GridTile = require('material-ui/GridList')['GridTile'];
const FlatButton = require('material-ui/FlatButton')['default'];
const Client = require('../Client');
const Event = require('../../common/Event');

class LobbyList extends React.Component {

    constructor(prop) {
        super(prop);
        this.styles = {
            root: {
                display: 'flex',
                flexWrap: 'wrap',
                margin: '10px',
            },
            gridList: {
                width: '100%',
            },
        };

        this.state = { rooms: [] };

    }

    componentDidMount() {
        Client.current.listRooms((data) => {
            console.log(data);
            this.setState({rooms: data});
        });
        Client.current.subscribe(Event.ROOMS_CHANGE, (data) => {
            this.setState({rooms: data});
        });
    }

    render() {
        return (
            <div style={this.styles.root}>
                {
                    this.state.rooms.length === 0 ?
                    <p style={{width: '100%', textAlign: 'center', marginTop: '10rem'}}>暂无可以加入的房间</p> :
                    <GridList
                        cellHeight={180}
                        padding={10}
                        style={this.styles.gridList}
                        cols={4}>
                        {this.state.rooms.map((tile) => (
                            <GridTile
                                key={tile.id}
                                title={tile.name}
                                actionIcon={<FlatButton label={'join'} style={{color: 'white', marginRight: '7px'}}/>}>
                                <img
                                    src={'http://www.material-ui.com/images/grid-list/morning-819362_640.jpg'}
                                    style={{height: '100%', width: 'auto', minHeight: '100%', minWidth: '100%'}} />
                            </GridTile>
                        ))}
                    </GridList>
                }
            </div>
        );
    }

}

module.exports = LobbyList;