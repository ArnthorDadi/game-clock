import React, { Component } from 'react';
import socket from "../../socket-connection";

import { RouteComponentProps } from 'react-router-dom';
import { User } from '../room';
import { ApplicationState } from '../../redux';
import { Socket } from 'socket.io-client';

import './style.scss';
import { addRooms } from '../../redux/rooms/actions';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { connect } from 'react-redux';

export interface ICreateRoom {
    Name: string
    Minutes: number
    RepetedMinutes: number
}

interface IStateCreateRoom {
    socket: Socket,
    roomToBeCreated: ICreateRoom
    errorMessage: string
}

export interface IPropCreateRoom extends RouteComponentProps {
    reduxStoreState: ApplicationState
    match: any
    location: any
}

class CreateRoom extends Component<IPropCreateRoom, IStateCreateRoom> {
    constructor(props: IPropCreateRoom) {
        super(props);
        this.state = {
            socket: socket.socket,
            roomToBeCreated: {
                Name: "",
                Minutes: -1,
                RepetedMinutes: -1
            },
            errorMessage: ""
        };
    }

    componentDidMount() {
        const { socket } = this.state;
        const { Name } = this.state.roomToBeCreated;

        socket.on('room-created', (roomName: string, rooms: any) => {
            console.log("ROOM - CREATED");
            console.log({ rooms });
            console.log('RoomName: ' + Name.toString());
            addRooms(rooms);
            console.log('mjes');
            this.props.history.push(`/room/${roomName.toLowerCase()}`);
        });
    }

    createRoom = () => {
        const { socket } = this.state;
        const { Name, Minutes, RepetedMinutes } = this.state.roomToBeCreated;

        var newRoom = {
            Name: Name,
            Minutes: Minutes,
            RepetedMinutes: RepetedMinutes
        };

        socket.emit("add-room", newRoom, (success: boolean, errorMessage: string) => {
            this.setState({ errorMessage: errorMessage });
        });
    }

    submitNewRoom = (event: any) => {
        this.createRoom();
        event.preventDefault();
    }

    changeName = (event: any) => {
        this.setState(prevState => {
            let roomToBeCreated = Object.assign({}, prevState.roomToBeCreated);
            roomToBeCreated.Name = event.target.value.toString();
            return { roomToBeCreated };
        });
    }

    changeTime = (event: any) => {
        this.setState(prevState => {
            let roomToBeCreated = Object.assign({}, prevState.roomToBeCreated);
            roomToBeCreated.Minutes = parseInt(event.target.value.toString())
            return { roomToBeCreated };
        });

    }

    changeRepetedTime = (event: any) => {
        this.setState(prevState => {
            let roomToBeCreated = Object.assign({}, prevState.roomToBeCreated);
            roomToBeCreated.RepetedMinutes = parseInt(event.target.value.toString())
            return { roomToBeCreated };
        });
    }

    render() {
        const { errorMessage } = this.state;
        return (
            <div className="create-room">
                <h1>Create Room!</h1>
                <form onSubmit={this.submitNewRoom}>
                    <input placeholder="Room Name..." type="text" onChange={this.changeName} /><br />
                    <input placeholder="Time..." type="number" onChange={this.changeTime} /><br />
                    <input placeholder="Repeated Time..." type="number" onChange={this.changeRepetedTime} />
                    <p>Time is in minutes</p>
                    {errorMessage !== "" && <p>{errorMessage}</p>}
                    <div className="buttons">
                        <button onClick={() => this.props.history.push('/rooms')}>Cancel</button>
                        <input type="submit" value="Create room!" />
                    </div>
                </form>
            </div >
        );
    }
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
    return {
        addRooms: (rooms: any) => dispatch(addRooms(rooms)),
    };
};

export default connect(mapDispatchToProps)(CreateRoom);
