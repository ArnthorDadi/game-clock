// Types for views and components (and some for redux)

export interface Room {
  Name: string
  Host: string
  Users: object // TODO: Should define Users
}

export interface Rooms {
  [Name: string]: Room
}

// Types for redux

export enum UserActionTypes {
  SET_USERNAME = '@@rooms/SET_USERNAME',
  FETCH_USER = '@@rooms/FETCH_USER',
}

export interface userState {
  readonly Username: string
}

export enum RoomActionTypes {
  ADD_ROOMS = '@@rooms/ADD_ROOMS',
  FETCH_ROOMS = '@@rooms/FETCH_ROOMS',
}

export interface roomsState {
  readonly rooms: Rooms
}
