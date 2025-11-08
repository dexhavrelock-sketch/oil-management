export const HIGH_SCORE_KEY = 'oilCollectorHighScore';
export const GAME_SAVE_KEY = 'oilCollectorGameSave';
export const GLOBAL_EVENT_KEY = 'oilCollectorGlobalEvent';
export const OIL_DROP_LIFESPAN_MS = 2500;
export const DROP_SPAWN_INTERVAL_MS = 600;
export const MIN_DROP_SIZE_PX = 30;
export const MAX_DROP_SIZE_PX = 80;

export const MINI_RIG_BASE_COST = 100; // in cents
export const MINI_RIG_COST_INCREASE = 20; // in cents
export const MINI_RIG_PRODUCTION_RATE = 10; // in cents per second

export const OIL_RIGS = [
  { level: 1, cost: 5000,    productionRate: 10 },    // $0.10/s
  { level: 2, cost: 25000,   productionRate: 60 },    // $0.60/s
  { level: 3, cost: 100000,  productionRate: 250 },   // $2.50/s
  { level: 4, cost: 500000,  productionRate: 1200 },  // $12.00/s
  { level: 5, cost: 2000000, productionRate: 6000 },  // $60.00/s
];

// Plastic Refinery
export const PLASTIC_REFINERY_COST = 250000; // $2,500
export const PLASTIC_SELL_PRICE = 15000; // $150 per unit

// Gas Refinery
export const GAS_REFINERY_COST = 500000; // $5,000
export const GAS_SELL_PRICE = 25000; // $250 per unit

// Gas Station
export const GAS_STATION_COST = 2500000; // $25,000
export const GAS_STATION_SELL_RATE_S = 1; // 1 gas per second per station
export const GAS_STATION_SELL_PRICE_MULTIPLIER = 1.5; // Sells for 50% more than manual

// Bottle Factory
export const BOTTLE_FACTORY_COST = 1000000; // $10,000
export const BOTTLE_PRODUCTION_INTERVAL_MS = 10000; // 10 seconds
export const PLASTIC_PER_BOTTLE = 10; // 10 plastic units per bottle
export const BOTTLE_SELL_PRICE = 200000; // $2,000 per bottle

// Oil Outage Event Constants
export const OUTAGE_DURATION_S = 20;
export const OUTAGE_PRICE_MULTIPLIER = 10;
export const OUTAGE_DROP_SPAWN_INTERVAL_MS = 2000;
export const OUTAGE_TRIGGER_CHANCE = 0.02; // 2% chance per second
export const OUTAGE_CHECK_INTERVAL_MS = 1000;

// War Event Constants
export const WAR_DURATION_S = 15;
export const WAR_PRICE_MULTIPLIER = 15;
export const WAR_TRIGGER_CHANCE = 0.005; // 0.5% chance per second

// Moon Run Event Constants
export const MOON_RUN_DURATION_S = 180;
export const MOON_RUN_PRICE_MULTIPLIER = 100000000;

// Admin Constants
export const ADMIN_MONEY_LIMIT_CENTS = 100000000; // $1,000,000