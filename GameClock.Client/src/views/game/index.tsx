import React, { Component } from "react";
import socket from "../../socket-connection";

import { Socket } from "socket.io-client";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { ApplicationState } from "../../redux";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

import './style.scss';

interface IStateGame {
    socket: Socket
    room: object
    hasUserRanOutOfTime: boolean
    isPlayerTurn: boolean
    isPlayerNext: boolean
    clockResetKey: number
    errorMessage: string
}

export interface IPropGame extends RouteComponentProps {
    reduxStoreState: ApplicationState
    match: any
    location: any
}

class Game extends Component<IPropGame, IStateGame> {
    timerContainer: any = { clientHeight: 100 };
    state = {
        socket: socket.socket,
        room: {
            Name: "",
        },
        hasUserRanOutOfTime: false,
        isPlayerTurn: false,
        isPlayerNext: false,
        clockResetKey: 0,
        errorMessage: ""
    };

    componentDidMount() {
        const { socket } = this.state;
        const { name } = this.props.match.params;
        const { Username } = this.props.reduxStoreState.user;

        const height = this.timerContainer.clientHeight;

        socket.on('i-am-next', (room: any, nextUser: any) => {
            if (room.Name.toLowerCase() == name.toLowerCase() && nextUser.Username.toLowerCase() == Username.toLowerCase()) {
                console.log('i-am-next:');
                console.log({ room, nextUser });
                this.setState({
                    isPlayerTurn: false,
                    isPlayerNext: true
                });
            }
        });

        socket.on('my-turn', (room: any, user: any) => {
            if (room.Name.toLowerCase() == name.toLowerCase() && user.Username.toLowerCase() == Username.toLowerCase()) {
                console.log('my-turn');
                console.log({ room, user });
                this.setState({
                    isPlayerTurn: true,
                    isPlayerNext: false
                });
            }
        });

    }

    componentWillUnmount() { }

    endTurn = (): void => {
        const { name } = this.props.match.params;
        const { hasUserRanOutOfTime, clockResetKey, socket, isPlayerTurn } = this.state;

        if (isPlayerTurn == false) return;

        if (hasUserRanOutOfTime) {
            this.setState({
                hasUserRanOutOfTime: false,
                clockResetKey: clockResetKey + 1
            });
        }

        this.setState({ isPlayerTurn: false });

        socket.emit('end-turn', { room: name }, (success: boolean, errorMessage: string) => {
            console.log({ success, errorMessage });
            this.setState({ errorMessage: errorMessage });
        });
    }

    render() {
        const { isPlayerTurn, isPlayerNext, clockResetKey, errorMessage } = this.state;
        const { name } = this.props.match.params;
        return (
            <div className="game-view">
                <h1>{name}</h1>

                <p className="player-order">
                    {isPlayerTurn &&
                        "Your Turn!"
                    }
                    {isPlayerNext &&
                        "You are next"
                    }
                    {isPlayerTurn == false && isPlayerNext == false &&
                        "Waiting..."
                    }
                </p>
                <button onClick={() => this.endTurn()} ref={(timerContainer) => { this.timerContainer = timerContainer }}>
                    <CountdownCircleTimer
                        size={this.timerContainer.clientHeight}
                        key={clockResetKey}
                        isPlaying={isPlayerTurn}
                        duration={20}
                        colors={[["#004777", 0.33], ["#F7B801", 0.33], ["#A30000"]] as any}
                        onComplete={() => this.setState({ hasUserRanOutOfTime: true })} >
                        {renderTime}
                    </CountdownCircleTimer>
                </button>
                {
                    errorMessage !== "" &&
                    <p>{errorMessage}</p>
                }
            </div >
        );
    }
}

const formatRemainingTime = (time: number) => {
    const minutes = String(Math.floor((time % 3600) / 60)).padStart(2, '0');
    const seconds = String(time % 60).padStart(2, '0');

    return `${minutes}:${seconds}`;
};

const renderTime = ({ remainingTime }: any) => {
    if (remainingTime === 0) {
        return <div>Times Up!</div>;
    }

    return (
        <div>{formatRemainingTime(remainingTime)}</div>
    );
};

function mapStateToProps(reduxStoreState: ApplicationState) {
    return {
        reduxStoreState,
    };
}

export default connect(mapStateToProps)(Game);
