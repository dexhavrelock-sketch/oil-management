import React from 'react';

export enum GameState {
  Start,
  Playing,
}

export interface OilDropType {
  id: number;
  x: number; // percentage
  y: number; // percentage
  size: number; // pixels
  createdAt: number;
}

export interface SaveData {
  score: number;
  savings: number;
  ownedRigs: number[];
  ownedMiniRigs: number;
  adminMoneyGiven: number;
  adminMoneyLimit: number;
  plastic: number;
  ownedRefineries: number;
  plasticBottles: number;
  ownedBottleFactories: number;
  bottleProductionBudget: number;
  gas: number;
  ownedGasRefineries: number;
  ownedGasStations: number;
}

export interface GlobalEvent {
  name: 'moonRun' | null;
  endTime: number | null;
}