import React, { Component } from "react";
import socket from "../../socket-connection";
import { addRooms } from "../../redux/rooms/actions";

import { ISocket } from "../../socket-connection";
import { RouteComponentProps } from "react-router";
import { connect } from "react-redux";
import { ApplicationState } from "../../redux";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";

import './style.scss';

export interface User {
  Username: string
}

export interface IRoom {
  Name: string;
  Host: User;
  Users: object;
}

export interface IPropsRoom extends RouteComponentProps {
  reduxStoreState: ApplicationState;
  addRooms: (rooms: object) => void;
  match: any;
}

export interface IStateRoom {
  socket: ISocket;
  room: IRoom;
  errorMessage: string;
  isPlayerHost: boolean;
}

class Room extends Component<IPropsRoom, IStateRoom> {
  _isMounted: boolean = false;
  constructor(props: IPropsRoom) {
    super(props);
    this.state = {
      socket: socket.socket,
      room: {
        Name: "",
        Host: { Username: "" },
        Users: {}
      },
      isPlayerHost: false,
      errorMessage: "",
    };
  }

  componentDidMount() {
    this.setState({ room: this.getRoom(), isPlayerHost: this.isPlayerHost() });
    this.setListeners();
    this.joinRoom();
    this._isMounted = true;
  }
  componentWillUnmount = () => (this._isMounted = false);

  getRoom(): IRoom {
    const { name } = this.props.match.params;
    console.log("Name: " + name);
    return this.getRoomByName(name);
  }

  getRoomByName(name: string): IRoom {
    const {
      rooms: { rooms },
    } = this.props.reduxStoreState;
    console.log(rooms);
    return (rooms as any)[name] as IRoom;
  }

  setListeners() {
    const { socket } = this.state;
    const { name } = this.props.match.params;
    const { addRooms, reduxStoreState: { rooms: { rooms }, user: { Username } }, history } = this.props;

    socket.on("update-users", (room: IRoom) => {
      const roomNameLower = room.Name.toLowerCase();
      const users: Object = room.Users;
      const host = room.Host;

      const isMessageToThisRoom: boolean = name.toLowerCase() === roomNameLower.toLowerCase();

      if (isMessageToThisRoom) {
        let updateRooms = rooms;
        ((updateRooms as any)["rooms"] as IRoom) = {
          ...(updateRooms as any)[roomNameLower],
          Users: users,
        };
        addRooms(updateRooms);
        this.setState({
          room: {
            Name: name,
            Host: host,
            Users: users,
          },
        });
      }
    });

    socket.on("started-game", (roomName) => {
      const isMessageToThisRoom: boolean = name.toLowerCase() === roomName.toLowerCase();
      if (isMessageToThisRoom) {
        history.push({
          pathname: `/game/${roomName.toLocaleLowerCase()}`
        });
      }
    });

    socket.on("host-left-room", (roomName: string, username: string) => {
      const isMessageToThisRoom: boolean = name.toLowerCase() === roomName.toLowerCase();
      const isMessageToThisUser: boolean = username.toLowerCase() === Username.toLowerCase();
      if (isMessageToThisRoom && isMessageToThisUser) {
        history.goBack();
      }
    });
  }

  joinRoom() {
    const { socket } = this.state;
    const { name } = this.props.match.params;
    socket.emit("join-room", { room: name }, (success: boolean, error: string) => {
      if (success) {
        console.info(`Successfully joined: ${name}`);
      } else {
        console.info(`Failed joining: ${name}`);
        console.error(error);
      }
    });
  }

  leaveRoom = () => {
    const { history } = this.props;
    const { socket, room: { Name } } = this.state;
    socket.emit("leave-room", { room: Name }, (success: string, errorMessage: string) => {
      if (success)
        history.goBack();
      if (this._isMounted)
        this.setState({ errorMessage: errorMessage });
    }
    );
  };

  isPlayerHost = (): boolean => {
    const { user: { Username } } = this.props.reduxStoreState;
    const { room: { Host } } = this.state;

    return Host.Username.toLowerCase() == Username.toLowerCase() || Username.toLowerCase() === "some";
  }

  startGame = () => {
    const { socket, room: { Name } } = this.state;
    const { history } = this.props;

    socket.emit("start-game", { room: Name }, (success: boolean, errorMessage: string) => {
      if (success) {
        history.push({
          pathname: `/game/${Name.toLocaleLowerCase()}`,
          state: {
            isPlayerHost: this.isPlayerHost()
          }
        });
      }
      if (this._isMounted)
        this.setState({ errorMessage: errorMessage });
    });
  };

  render() {
    if (this._isMounted == false) {
      return (<p>Loading...</p>)
    } else {
      const { errorMessage, room: { Name, Host, Users }, isPlayerHost } = this.state;
      const { user: { Username }, } = this.props.reduxStoreState;
      return (
        <div className="room-view">
          <button className="leave-room" onClick={() => this.leaveRoom()}>Leave Room</button>
          <h1>{Name}</h1>

          <div className="time">
            <div>
              <p><b>Time</b></p>
              <p>10:00</p>
            </div>
            <div>
              <p><b>Repeated Time</b></p>
              <p>5:00</p>
            </div>
          </div>

          <ol className="users-list">
            <b><li className={this.isPlayerHost() ? "host glow" : "host"}>{Host.Username}</li></b>
            {Object.keys(Users).map((user) => (
              (Users as any)[user].Username !== Host.Username &&
              <li className={(Users as any)[user].Username === Username ? "user glow" : "user"} key={user}>{(Users as any)[user].Username}</li>
            ))}
          </ol>
          <p>{errorMessage}</p>
          {this.isPlayerHost() &&
            <button className="start-game" onClick={() => this.startGame()}>Start Game</button>
          }
        </div>
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
    addRooms: (rooms: any) => dispatch(addRooms(rooms)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Room);
