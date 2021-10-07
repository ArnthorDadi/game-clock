import React, { Component } from "react";
import socket from "../../socket-connection";
import { connect } from "react-redux";
import { setUsername } from "../../redux/user/actions";
import { addRooms } from "../../redux/rooms/actions";

import roomImg1 from '../../assets/img/room/coolimag.png';

import { RouteComponentProps } from "react-router";
import { ISocket } from "../../socket-connection";
import { ApplicationState } from "../../redux";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";

import './style.scss';

export interface IPropsRooms extends RouteComponentProps {
  reduxStoreState: ApplicationState;
  setUsername: (username: string) => void;
  addRooms: (rooms: DictRoom) => void;
  match: any;
}

export interface IStateRooms {
  socket: ISocket;
}

export interface Room {
  Name: string;
  Host: any;
  Users: object | {};
}
export interface DictRoom {
  [Name: string]: Room;
}

class Rooms extends Component<IPropsRooms, IStateRooms> {
  _isMounted: boolean = false;
  constructor(props: IPropsRooms) {
    super(props);
    this.state = {
      socket: socket.socket,
    };
  }

  componentDidMount() {
    const { socket } = this.state;
    this.setListeners(socket);
    this.getRooms(socket);
    console.log('ROOMS: componentDidMount');
    this._isMounted = true;
  }
  componentWillUnmount() {
    console.log('ROOMS: componentWillUnmount');
    this._isMounted = false;
  }

  getRoom(): Room {
    const { name } = this.props.match.params;
    return this.getRoomByName(name);
  }

  getRoomByName(name: string): Room {
    return { Name: "test", Host: "test host", Users: {} };
  }

  setListeners = (socket: ISocket): void => {
    const { addRooms } = this.props;
    socket.on("rooms", (serverRooms: DictRoom) => {
      addRooms(serverRooms);
    });
  };

  getRooms = (socket: ISocket) => socket.emit("room-list");

  goToRoom = (room: string) => {
    const { history } = this.props;
    history.push(`room/${room}`);
  };

  logout = () => {
    const { socket } = this.state;
    const { setUsername, history } = this.props;

    setUsername("");
    history.push("/");
    socket.disconnect();
  };

  render() {
    const { user: { Username }, rooms: { rooms } } = this.props.reduxStoreState;

    if (this._isMounted == false) {
      return (<p>Mounting Component Please Wait.</p>)
    }
    else {
      return (
        <>
          <button className="logout-button" onClick={this.logout}>Logout</button>
          <h1 className="center-text">Welcome, <label className="purple">{Username}</label></h1>
          <button className="create-room-button" onClick={() => this.props.history.push('/create-room')}>Create Room</button>
          <div className="rooms">
            {rooms != {} &&
              Object.keys(rooms).map((room) => {
                return (
                  <button
                    key={room}
                    className="room"
                    onClick={() => this.goToRoom(room)}>
                    <img src={roomImg1} alt="room image" />
                    <h1>{((rooms as any)[room] as Room).Name}</h1>
                    <p>
                      <b>{((rooms as any)[room] as Room).Host.Username}</b>
                    </p>
                    <div className="shader"></div>
                  </button>
                );
              })
            }
          </div>
        </>
      );
    }
  }
}

function mapStateToProps(reduxStoreState: ApplicationState) {
  return {
    reduxStoreState,
  };
}

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
  return {
    setUsername: (username: any) => dispatch(setUsername(username)),
    addRooms: (rooms: DictRoom) => dispatch(addRooms(rooms)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Rooms);
