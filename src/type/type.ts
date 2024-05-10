export interface IDataCar {
  color: string;
  id: number;
  name: string;
}

export interface IDataWinner extends IDataCar {
  id: number;
  time: number;
  wins: number;
}

export interface IObjectWinners<T> {
  [index: number]: T;
}

export interface ISendBodyData {
  name?: string;
  color?: string;
}
