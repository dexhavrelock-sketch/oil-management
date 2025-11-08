import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { OilDropType, SaveData, GlobalEvent } from '../types';
import { 
  HIGH_SCORE_KEY, 
  GAME_SAVE_KEY,
  GLOBAL_EVENT_KEY,
  OIL_DROP_LIFESPAN_MS, 
  DROP_SPAWN_INTERVAL_MS, 
  MIN_DROP_SIZE_PX, 
  MAX_DROP_SIZE_PX, 
  OIL_RIGS,
  MINI_RIG_BASE_COST,
  MINI_RIG_COST_INCREASE,
  MINI_RIG_PRODUCTION_RATE,
  PLASTIC_REFINERY_COST,
  PLASTIC_SELL_PRICE,
  GAS_REFINERY_COST,
  GAS_SELL_PRICE,
  GAS_STATION_COST,
  GAS_STATION_SELL_RATE_S,
  GAS_STATION_SELL_PRICE_MULTIPLIER,
  BOTTLE_FACTORY_COST,
  BOTTLE_PRODUCTION_INTERVAL_MS,
  PLASTIC_PER_BOTTLE,
  OUTAGE_DURATION_S,
  OUTAGE_PRICE_MULTIPLIER,
  OUTAGE_DROP_SPAWN_INTERVAL_MS,
  OUTAGE_TRIGGER_CHANCE,
  OUTAGE_CHECK_INTERVAL_MS,
  WAR_DURATION_S,
  WAR_PRICE_MULTIPLIER,
  WAR_TRIGGER_CHANCE,
  MOON_RUN_DURATION_S,
  MOON_RUN_PRICE_MULTIPLIER,
  ADMIN_MONEY_LIMIT_CENTS
} from '../constants';
import OilDrop from './OilDrop';
import { GearIcon } from './icons/GearIcon';
import { PlasticIcon } from './icons/PlasticIcon';
import { BottleIcon } from './icons/BottleIcon';
import { GasIcon } from './icons/GasIcon';
import MenuModal from './modals/MenuModal';
import SettingsModal from './modals/SettingsModal';
import BankModal from './modals/BankModal';
import SellModal from './modals/SellModal';
import BuyModal from './modals/BuyModal';
import BottleFactoryModal from './modals/BottleFactoryModal';
import AdminLoginModal from './modals/AdminLoginModal';
import AdminModal from './modals/AdminModal';

type ModalType = 'menu' | 'settings' | 'bank' | 'sell' | 'buy' | 'bottleFactory' | 'adminLogin' | 'admin';
type AdminLevel = 'full' | 'limited' | null;

const getInitialState = (): SaveData => {
  const savedDataString = localStorage.getItem(GAME_SAVE_KEY);
  if (savedDataString) {
    try {
      const parsed: Partial<SaveData> = JSON.parse(savedDataString);
      if (
        typeof parsed.score === 'number' &&
        typeof parsed.savings === 'number' &&
        Array.isArray(parsed.ownedRigs) &&
        typeof parsed.ownedMiniRigs === 'number' &&
        parsed.ownedRigs.length === OIL_RIGS.length
      ) {
        return {
          score: parsed.score,
          savings: parsed.savings,
          ownedRigs: parsed.ownedRigs,
          ownedMiniRigs: parsed.ownedMiniRigs,
          adminMoneyGiven: parsed.adminMoneyGiven || 0,
          adminMoneyLimit: parsed.adminMoneyLimit === undefined ? ADMIN_MONEY_LIMIT_CENTS : parsed.adminMoneyLimit,
          plastic: parsed.plastic || 0,
          ownedRefineries: parsed.ownedRefineries || 0,
          plasticBottles: parsed.plasticBottles || 0,
          ownedBottleFactories: parsed.ownedBottleFactories || 0,
          bottleProductionBudget: parsed.bottleProductionBudget || 0,
          gas: parsed.gas || 0,
          ownedGasRefineries: parsed.ownedGasRefineries || 0,
          ownedGasStations: parsed.ownedGasStations || 0,
        };
      }
    } catch (e) {
      console.error("Failed to parse save data, starting fresh.", e);
      localStorage.removeItem(GAME_SAVE_KEY);
    }
  }
  return {
    score: 0,
    savings: 0,
    ownedRigs: Array(OIL_RIGS.length).fill(0),
    ownedMiniRigs: 0,
    adminMoneyGiven: 0,
    adminMoneyLimit: ADMIN_MONEY_LIMIT_CENTS,
    plastic: 0,
    ownedRefineries: 0,
    plasticBottles: 0,
    ownedBottleFactories: 0,
    bottleProductionBudget: 0,
    gas: 0,
    ownedGasRefineries: 0,
    ownedGasStations: 0,
  };
};


const GameScreen: React.FC = () => {
  const initialState = useMemo(() => getInitialState(), []);
  const [score, setScore] = useState(initialState.score);
  const [savings, setSavings] = useState(initialState.savings);
  const [ownedRigs, setOwnedRigs] = useState<number[]>(initialState.ownedRigs);
  const [ownedMiniRigs, setOwnedMiniRigs] = useState(initialState.ownedMiniRigs);
  const [adminMoneyGiven, setAdminMoneyGiven] = useState(initialState.adminMoneyGiven);
  const [adminMoneyLimit, setAdminMoneyLimit] = useState(initialState.adminMoneyLimit);
  const [plastic, setPlastic] = useState(initialState.plastic);
  const [ownedRefineries, setOwnedRefineries] = useState(initialState.ownedRefineries);
  const [gas, setGas] = useState(initialState.gas);
  const [ownedGasRefineries, setOwnedGasRefineries] = useState(initialState.ownedGasRefineries);
  const [ownedGasStations, setOwnedGasStations] = useState(initialState.ownedGasStations);
  const [plasticBottles, setPlasticBottles] = useState(initialState.plasticBottles);
  const [ownedBottleFactories, setOwnedBottleFactories] = useState(initialState.ownedBottleFactories);
  const [bottleProductionBudget, setBottleProductionBudget] = useState(initialState.bottleProductionBudget);
  
  const [timeToInterest, setTimeToInterest] = useState(60);
  const [highScore, setHighScore] = useState(0);
  const [oilDrops, setOilDrops] = useState<OilDropType[]>([]);
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);
  const [isOutageActive, setIsOutageActive] = useState(false);
  const [outageTimer, setOutageTimer] = useState(0);
  const [isWarActive, setIsWarActive] = useState(false);
  const [warTimer, setWarTimer] = useState(0);
  const [adminLevel, setAdminLevel] = useState<AdminLevel>(null);
  const [globalEvent, setGlobalEvent] = useState<GlobalEvent>({ name: null, endTime: null });

  const gameAreaRef = useRef<HTMLDivElement>(null);
  const pauseTimeRef = useRef<number | null>(null);

  const isMoonRunActive = globalEvent.name === 'moonRun' && globalEvent.endTime !== null && globalEvent.endTime > Date.now();
  const moonRunTimer = isMoonRunActive && globalEvent.endTime ? Math.max(0, Math.round((globalEvent.endTime - Date.now()) / 1000)) : 0;

  const nextMiniRigCost = useMemo(() => {
    return MINI_RIG_BASE_COST + ownedMiniRigs * MINI_RIG_COST_INCREASE;
  }, [ownedMiniRigs]);
  
  const eventMultiplier = useMemo(() => {
    let multiplier = 1;
    if (isMoonRunActive) multiplier *= MOON_RUN_PRICE_MULTIPLIER;
    else {
      if (isWarActive) multiplier *= WAR_PRICE_MULTIPLIER;
      if (isOutageActive) multiplier *= OUTAGE_PRICE_MULTIPLIER;
    }
    return multiplier;
  }, [isOutageActive, isWarActive, isMoonRunActive]);

  const passiveIncomeData = useMemo(() => {
    const baseProduction = ownedRigs.reduce((total, count, index) => {
      return total + (count * OIL_RIGS[index].productionRate);
    }, 0) + (ownedMiniRigs * MINI_RIG_PRODUCTION_RATE);
    
    const totalOwnedRigs = ownedRigs.reduce((sum, count) => sum + count, 0) + ownedMiniRigs;
    
    const activePlasticRefineries = Math.min(ownedRefineries, totalOwnedRigs);
    const rigsRemainingForGas = totalOwnedRigs - activePlasticRefineries;
    const activeGasRefineries = Math.min(ownedGasRefineries, rigsRemainingForGas);

    const refineryCashCost = (activePlasticRefineries + activeGasRefineries) * MINI_RIG_PRODUCTION_RATE;
    const finalCashProduction = Math.max(0, baseProduction - refineryCashCost);
    
    return {
      cash: finalCashProduction * eventMultiplier,
      plastic: activePlasticRefineries,
      gas: activeGasRefineries,
    };
  }, [ownedRigs, ownedMiniRigs, ownedRefineries, ownedGasRefineries, eventMultiplier]);
  
  const gasStationIncomeData = useMemo(() => {
    if (ownedGasStations === 0) return { potentialIncome: 0 };
    
    const basePrice = GAS_SELL_PRICE * GAS_STATION_SELL_PRICE_MULTIPLIER;
    const finalPrice = basePrice * eventMultiplier;
    const potentialIncome = ownedGasStations * GAS_STATION_SELL_RATE_S * finalPrice;
    
    return { potentialIncome };
  }, [ownedGasStations, eventMultiplier]);
  
  const syncGlobalEventFromStorage = useCallback(() => {
    try {
        const eventDataString = localStorage.getItem(GLOBAL_EVENT_KEY);
        if (eventDataString) {
            const eventData: GlobalEvent = JSON.parse(eventDataString);
            if (eventData.name === 'moonRun' && eventData.endTime && eventData.endTime > Date.now()) {
                setGlobalEvent(eventData);
            } else {
                // Event is expired, clear it if we're the ones to notice
                if (globalEvent.name) {
                  localStorage.removeItem(GLOBAL_EVENT_KEY);
                  setGlobalEvent({ name: null, endTime: null });
                }
            }
        } else {
            setGlobalEvent({ name: null, endTime: null });
        }
    } catch (e) {
        console.error("Failed to parse global event data", e);
        setGlobalEvent({ name: null, endTime: null });
    }
  }, [globalEvent.name]);

  useEffect(() => {
    // Initial sync
    syncGlobalEventFromStorage();

    const handleStorageChange = (event: StorageEvent) => {
        if (event.key === GLOBAL_EVENT_KEY) {
            syncGlobalEventFromStorage();
        }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
        window.removeEventListener('storage', handleStorageChange);
    };
  }, [syncGlobalEventFromStorage]);


  useEffect(() => {
    const savedHighScore = localStorage.getItem(HIGH_SCORE_KEY);
    setHighScore(savedHighScore ? parseInt(savedHighScore, 10) : 0);
  }, []);

  useEffect(() => {
    const gameState: SaveData = { score, savings, ownedRigs, ownedMiniRigs, adminMoneyGiven, adminMoneyLimit, plastic, ownedRefineries, gas, ownedGasRefineries, ownedGasStations, plasticBottles, ownedBottleFactories, bottleProductionBudget };
    localStorage.setItem(GAME_SAVE_KEY, JSON.stringify(gameState));
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem(HIGH_SCORE_KEY, score.toString());
    }
  }, [score, savings, ownedRigs, ownedMiniRigs, adminMoneyGiven, adminMoneyLimit, plastic, ownedRefineries, gas, ownedGasRefineries, ownedGasStations, plasticBottles, ownedBottleFactories, bottleProductionBudget, highScore]);

  useEffect(() => {
    const isPaused = activeModal !== null;
    if (isPaused) {
      pauseTimeRef.current = Date.now();
    } else if (pauseTimeRef.current) {
      const elapsedPausedTime = Date.now() - pauseTimeRef.current;
      setOilDrops(prevDrops =>
        prevDrops.map(drop => ({
          ...drop,
          createdAt: drop.createdAt + elapsedPausedTime,
        }))
      );
      pauseTimeRef.current = null;
    }
  }, [activeModal]);

  useEffect(() => {
    const isPaused = activeModal !== null;
    if (isPaused) return;

    const eventInterval = setInterval(() => {
      syncGlobalEventFromStorage();

      if (isMoonRunActive) {
        // Force re-render to update timer if needed
        setGlobalEvent(prev => ({...prev}));
        return; // Moon Run is exclusive
      }

      if (isOutageActive) {
        setOutageTimer(prev => {
          if (prev <= 1) {
            setIsOutageActive(false);
            return 0;
          }
          return prev - 1;
        });
      }
      if (isWarActive) {
        setWarTimer(prev => {
          if (prev <= 1) {
            setIsWarActive(false);
            return 0;
          }
          return prev - 1;
        });
      }
      
      if (!isOutageActive && !isWarActive) {
        const random = Math.random();
        if (random < WAR_TRIGGER_CHANCE) {
          setIsWarActive(true);
          setWarTimer(WAR_DURATION_S);
        } else if (random < OUTAGE_TRIGGER_CHANCE) {
          setIsOutageActive(true);
          setOutageTimer(OUTAGE_DURATION_S);
        }
      }
    }, OUTAGE_CHECK_INTERVAL_MS);

    return () => clearInterval(eventInterval);
  }, [activeModal, isOutageActive, isWarActive, isMoonRunActive, syncGlobalEventFromStorage]);

  useEffect(() => {
    const isPaused = activeModal !== null;
    if (isPaused) return;

    const gameLoop = setInterval(() => {
      setOilDrops(prevDrops => {
        const now = Date.now();
        return prevDrops.filter(drop => now - drop.createdAt <= OIL_DROP_LIFESPAN_MS);
      });
    }, 100);

    return () => clearInterval(gameLoop);
  }, [activeModal]);

  useEffect(() => {
    const isPaused = activeModal !== null;
    if (isPaused) return;

    const incomeInterval = setInterval(() => {
      // Rig & Refinery Production
      if (passiveIncomeData.cash > 0) {
        setScore(prevScore => prevScore + passiveIncomeData.cash);
      }
      if (passiveIncomeData.plastic > 0) {
        setPlastic(prevPlastic => prevPlastic + passiveIncomeData.plastic);
      }
      if (passiveIncomeData.gas > 0) {
        setGas(prevGas => prevGas + passiveIncomeData.gas);
      }

      // Gas Station Sales
      if (ownedGasStations > 0 && gas > 0) {
        const gasToSell = Math.min(gas, ownedGasStations * GAS_STATION_SELL_RATE_S);
        const pricePerUnit = GAS_SELL_PRICE * GAS_STATION_SELL_PRICE_MULTIPLIER * eventMultiplier;
        const earnings = gasToSell * pricePerUnit;
        
        setGas(prev => prev - gasToSell);
        setScore(prev => prev + earnings);
      }

    }, 1000);

    return () => clearInterval(incomeInterval);
  }, [activeModal, passiveIncomeData, ownedGasStations, gas, eventMultiplier]);

  useEffect(() => {
    const isPaused = activeModal !== null;
    if (isPaused) return;

    const timer = setInterval(() => {
      setTimeToInterest(prevTime => {
        if (prevTime <= 1) {
          setSavings(prevSavings => {
            const interest = Math.floor(prevSavings * 0.10);
            return prevSavings + interest;
          });
          return 60;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeModal]);
  
  useEffect(() => {
    const isPaused = activeModal !== null;
    if (isPaused || ownedBottleFactories === 0 || bottleProductionBudget === 0) return;

    const interval = setInterval(() => {
      setPlastic(prevPlastic => {
        const totalBudget = bottleProductionBudget * ownedBottleFactories;
        const plasticToConsume = Math.min(prevPlastic, totalBudget);
        const bottlesToProduce = Math.floor(plasticToConsume / PLASTIC_PER_BOTTLE);
        
        if (bottlesToProduce > 0) {
          const actualPlasticConsumed = bottlesToProduce * PLASTIC_PER_BOTTLE;
          setPlasticBottles(prevBottles => prevBottles + bottlesToProduce);
          return prevPlastic - actualPlasticConsumed;
        }
        return prevPlastic;
      });
    }, BOTTLE_PRODUCTION_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [activeModal, ownedBottleFactories, bottleProductionBudget]);

  useEffect(() => {
    const isPaused = activeModal !== null;
    if (isPaused) return;

    const spawnDrop = () => {
      if (!gameAreaRef.current) return;
      const newDrop: OilDropType = {
        id: Date.now() + Math.random(),
        x: Math.random() * 90,
        y: Math.random() * 90,
        size: Math.floor(Math.random() * (MAX_DROP_SIZE_PX - MIN_DROP_SIZE_PX + 1)) + MIN_DROP_SIZE_PX,
        createdAt: Date.now(),
      };
      setOilDrops(prevDrops => [...prevDrops, newDrop]);
    };

    let currentSpawnInterval = isOutageActive ? OUTAGE_DROP_SPAWN_INTERVAL_MS : DROP_SPAWN_INTERVAL_MS;
    if (isMoonRunActive) currentSpawnInterval = DROP_SPAWN_INTERVAL_MS; // Normal spawn rate for moon run
    
    const spawnInterval = setInterval(spawnDrop, currentSpawnInterval);

    return () => clearInterval(spawnInterval);
  }, [activeModal, isOutageActive, isMoonRunActive]);

  const handleCollect = useCallback((id: number, size: number) => {
    const baseValue = Math.floor(MAX_DROP_SIZE_PX / size);
    setScore(prevScore => prevScore + (baseValue * eventMultiplier));
    setOilDrops(prevDrops => prevDrops.filter(drop => drop.id !== id));
  }, [eventMultiplier]);

  const handleDeposit = useCallback((amount: number) => {
    if (amount > 0 && amount <= score) {
      setScore(prev => prev - amount);
      setSavings(prev => prev + amount);
    }
  }, [score]);

  const handleWithdraw = useCallback((amount: number) => {
    if (amount > 0 && amount <= savings) {
      setSavings(prev => prev - amount);
      setScore(prev => prev + amount);
    }
  }, [savings]);

  const handleBuyRig = useCallback((levelIndex: number) => {
    const rigToBuy = OIL_RIGS[levelIndex];
    if (score >= rigToBuy.cost) {
      setScore(prev => prev - rigToBuy.cost);
      setOwnedRigs(prevRigs => {
        const newRigs = [...prevRigs];
        newRigs[levelIndex]++;
        return newRigs;
      });
    }
  }, [score]);
  
  const handleBuyMiniRig = useCallback(() => {
    if (score >= nextMiniRigCost) {
      setScore(prev => prev - nextMiniRigCost);
      setOwnedMiniRigs(prev => prev + 1);
    }
  }, [score, nextMiniRigCost]);
  
  const handleBuyRefinery = useCallback(() => {
    if (score >= PLASTIC_REFINERY_COST) {
      setScore(prev => prev - PLASTIC_REFINERY_COST);
      setOwnedRefineries(prev => prev + 1);
    }
  }, [score]);

  const handleBuyGasRefinery = useCallback(() => {
    if (score >= GAS_REFINERY_COST) {
      setScore(prev => prev - GAS_REFINERY_COST);
      setOwnedGasRefineries(prev => prev + 1);
    }
  }, [score]);
  
  const handleBuyGasStation = useCallback(() => {
    if (score >= GAS_STATION_COST) {
      setScore(prev => prev - GAS_STATION_COST);
      setOwnedGasStations(prev => prev + 1);
    }
  }, [score]);

  const handleBuyBottleFactory = useCallback(() => {
    if (score >= BOTTLE_FACTORY_COST) {
      setScore(prev => prev - BOTTLE_FACTORY_COST);
      setOwnedBottleFactories(prev => prev + 1);
    }
  }, [score]);

  const handleSetBottleProductionBudget = useCallback((budget: number) => {
    setBottleProductionBudget(budget);
  }, []);

  const handleSellPlastic = useCallback((amount: number, price: number) => {
    if (amount > 0 && amount <= plastic) {
      const earnings = amount * price;
      setPlastic(prev => prev - amount);
      setScore(prev => prev + earnings);
    }
  }, [plastic]);
  
  const handleSellGas = useCallback((amount: number, price: number) => {
    if (amount > 0 && amount <= gas) {
      const earnings = amount * price;
      setGas(prev => prev - amount);
      setScore(prev => prev + earnings);
    }
  }, [gas]);

  const handleSellBottles = useCallback((amount: number, price: number) => {
    if (amount > 0 && amount <= plasticBottles) {
      const earnings = amount * price;
      setPlasticBottles(prev => prev - amount);
      setScore(prev => prev + earnings);
    }
  }, [plasticBottles]);

  const handleLogin = useCallback((user: string, pass: string): boolean => {
    if (user === 'declan' && pass === 'dex32b') {
      setAdminLevel('full');
      setActiveModal('admin');
      return true;
    }
    if (user === 'Brexton' && pass === '#B3e') {
      setAdminLevel('limited');
      setActiveModal('admin');
      return true;
    }
    return false;
  }, []);

  const handleAddMoney = useCallback((amount: number) => {
    if (amount <= 0 || !adminLevel) return;

    if (adminLevel === 'limited') {
      const remainingLimit = adminMoneyLimit - adminMoneyGiven;
      const amountToAdd = Math.min(amount, remainingLimit);
      
      if (amountToAdd > 0) {
        setScore(prev => prev + amountToAdd);
        setAdminMoneyGiven(prev => prev + amountToAdd);
      }
    } else if (adminLevel === 'full') {
      setScore(prev => prev + amount);
    }
  }, [adminLevel, adminMoneyGiven, adminMoneyLimit]);

  const handleIncreaseAdminLimit = useCallback((amount: number) => {
    if (adminLevel === 'full' && amount > 0) {
      setAdminMoneyLimit(prev => prev + amount);
    }
  }, [adminLevel]);

  const handleStartOutage = useCallback(() => {
    setIsOutageActive(true);
    setOutageTimer(OUTAGE_DURATION_S);
  }, []);

  const handleStopOutage = useCallback(() => {
    if (isOutageActive) {
      setIsOutageActive(false);
      setOutageTimer(0);
    }
  }, [isOutageActive]);

  const handleStartWar = useCallback(() => {
    setIsWarActive(true);
    setWarTimer(WAR_DURATION_S);
  }, []);

  const handleStopWar = useCallback(() => {
    if (isWarActive) {
      setIsWarActive(false);
      setWarTimer(0);
    }
  }, [isWarActive]);

  const handleStartMoonRun = useCallback(() => {
    const endTime = Date.now() + MOON_RUN_DURATION_S * 1000;
    const newEvent: GlobalEvent = { name: 'moonRun', endTime };
    localStorage.setItem(GLOBAL_EVENT_KEY, JSON.stringify(newEvent));
    setGlobalEvent(newEvent);
  }, []);

  const handleStopMoonRun = useCallback(() => {
      localStorage.removeItem(GLOBAL_EVENT_KEY);
      setGlobalEvent({ name: null, endTime: null });
  }, []);

  const renderModal = () => {
    if (!activeModal) return null;

    const closeModal = () => setActiveModal(null);
    const navigate = (modal: ModalType) => {
      if (modal === 'admin' && !adminLevel) {
        setActiveModal('adminLogin');
      } else {
        setActiveModal(modal);
      }
    };

    switch (activeModal) {
      case 'menu':
        return <MenuModal onClose={closeModal} onNavigate={navigate} />;
      case 'settings':
        return <SettingsModal 
                  onClose={closeModal}
                  gameState={{ score, savings, ownedRigs, ownedMiniRigs, adminMoneyGiven, adminMoneyLimit, plastic, ownedRefineries, gas, ownedGasRefineries, ownedGasStations, plasticBottles, ownedBottleFactories, bottleProductionBudget }}
                />;
      case 'bank':
        return <BankModal 
                  onClose={closeModal} 
                  currentEarnings={score}
                  currentSavings={savings}
                  timeToInterest={timeToInterest}
                  onDeposit={handleDeposit}
                  onWithdraw={handleWithdraw}
                />;
      case 'sell':
        return <SellModal 
                  onClose={closeModal}
                  plasticAmount={plastic}
                  gasAmount={gas}
                  bottleAmount={plasticBottles}
                  onSellPlastic={handleSellPlastic}
                  onSellGas={handleSellGas}
                  onSellBottles={handleSellBottles}
                  isOutageActive={isOutageActive}
                  isWarActive={isWarActive}
                  isMoonRunActive={isMoonRunActive}
                  ownedGasStations={ownedGasStations}
                />;
      case 'buy':
        return <BuyModal 
                  onClose={closeModal}
                  currentEarnings={score}
                  ownedRigs={ownedRigs}
                  onBuyRig={handleBuyRig}
                  ownedMiniRigs={ownedMiniRigs}
                  onBuyMiniRig={handleBuyMiniRig}
                  nextMiniRigCost={nextMiniRigCost}
                  ownedRefineries={ownedRefineries}
                  onBuyRefinery={handleBuyRefinery}
                  ownedGasRefineries={ownedGasRefineries}
                  onBuyGasRefinery={handleBuyGasRefinery}
                  ownedGasStations={ownedGasStations}
                  onBuyGasStation={handleBuyGasStation}
                  ownedBottleFactories={ownedBottleFactories}
                  onBuyBottleFactory={handleBuyBottleFactory}
                />;
      case 'bottleFactory':
        return <BottleFactoryModal
                  onClose={closeModal}
                  ownedFactories={ownedBottleFactories}
                  currentBudget={bottleProductionBudget}
                  onSetBudget={handleSetBottleProductionBudget}
               />;
      case 'adminLogin':
        return <AdminLoginModal onClose={closeModal} onLogin={handleLogin} />;
      case 'admin':
        return <AdminModal
                  onClose={closeModal}
                  adminLevel={adminLevel}
                  adminMoneyGiven={adminMoneyGiven}
                  adminMoneyLimit={adminMoneyLimit}
                  onAddMoney={handleAddMoney}
                  onIncreaseAdminLimit={handleIncreaseAdminLimit}
                  onStartOutage={handleStartOutage}
                  onStopOutage={handleStopOutage}
                  isOutageActive={isOutageActive}
                  onStartWar={handleStartWar}
                  onStopWar={handleStopWar}
                  isWarActive={isWarActive}
                  onStartMoonRun={handleStartMoonRun}
                  onStopMoonRun={handleStopMoonRun}
                  isMoonRunActive={isMoonRunActive}
               />;
      default:
        return null;
    }
  };

  return (
    <div className={`relative w-full h-full flex flex-col transition-all duration-1000 ${isMoonRunActive ? 'bg-gray-900 starry-bg' : 'bg-transparent'}`}>
      <header className="grid grid-cols-4 items-center p-4 bg-black/30 backdrop-blur-sm z-10 gap-4">
        <div className="flex flex-col items-start col-span-1">
          <h2 className="text-2xl font-bold">Earnings: <span className="text-yellow-400">${(score / 100).toFixed(2)}</span></h2>
          <div className="flex flex-col text-sm">
            {passiveIncomeData.cash > 0 && (
              <p className="text-green-400 animate-pulse">+${(passiveIncomeData.cash / 100).toFixed(2)}/sec (Rigs)</p>
            )}
            {gasStationIncomeData.potentialIncome > 0 && (
               <p className="text-green-400 animate-pulse">+${(gasStationIncomeData.potentialIncome / 100).toFixed(2)}/sec (Gas Stations)</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 col-span-2 text-center">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2">
                <PlasticIcon className="w-6 h-6 text-gray-300" />
                <h2 className="text-2xl font-bold">{plastic.toLocaleString()}</h2>
              </div>
              {passiveIncomeData.plastic > 0 && (
                <p className="text-sm text-blue-400 animate-pulse">+{passiveIncomeData.plastic}/sec</p>
              )}
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2">
                <GasIcon className="w-6 h-6 text-orange-400" />
                <h2 className="text-2xl font-bold">{gas.toLocaleString()}</h2>
              </div>
              {passiveIncomeData.gas > 0 && (
                <p className="text-sm text-orange-400 animate-pulse">+{passiveIncomeData.gas}/sec</p>
              )}
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2">
                <BottleIcon className="w-6 h-6 text-cyan-300" />
                <h2 className="text-2xl font-bold">{plasticBottles.toLocaleString()}</h2>
              </div>
            </div>
        </div>


        <div className="flex items-center justify-end gap-4 col-span-1">
          <div className='text-right'>
            <h2 className="text-xl font-bold">High Score</h2>
            <p className="text-yellow-400 font-semibold">${(highScore / 100).toFixed(2)}</p>
          </div>
          {adminLevel && (
            <button
              onClick={() => setActiveModal('admin')}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-sm rounded-lg shadow-lg shadow-red-500/20 transition-all duration-300 ease-in-out"
            >
              Admin Panel
            </button>
          )}
          <button onClick={() => setActiveModal('menu')} className="text-white hover:text-yellow-300 transition-colors" aria-label="Open Menu">
            <GearIcon className="w-8 h-8"/>
          </button>
        </div>
      </header>
      <div ref={gameAreaRef} className="flex-grow w-full h-full relative overflow-hidden">
        {isMoonRunActive && (
           <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center z-20 pointer-events-none p-4 bg-black/50 rounded-lg">
            <h2 className="text-5xl font-extrabold text-white animate-pulse [text-shadow:_0_0_15px_#fff]">MOON RUN!</h2>
            <p className="text-2xl text-gray-300 font-semibold mt-1">ALL INCOME x{MOON_RUN_PRICE_MULTIPLIER}!</p>
            <p className="text-4xl text-white font-bold mt-2">{moonRunTimer}s</p>
          </div>
        )}
        {isWarActive && isOutageActive && !isMoonRunActive && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center z-20 pointer-events-none p-4 bg-black/50 rounded-lg">
            <h2 className="text-5xl font-extrabold text-purple-500 animate-pulse [text-shadow:_0_0_10px_rgb(168_85_247_/_50%)]">CHAOS!</h2>
            <p className="text-2xl text-purple-300 font-semibold mt-1">WAR & OIL OUTAGE! Prices are x{WAR_PRICE_MULTIPLIER * OUTAGE_PRICE_MULTIPLIER}!</p>
            <div className="flex justify-center gap-8 mt-2">
              <p className="text-2xl text-white font-bold">War: {warTimer}s</p>
              <p className="text-2xl text-white font-bold">Outage: {outageTimer}s</p>
            </div>
          </div>
        )}
        {isWarActive && !isOutageActive && !isMoonRunActive && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center z-20 pointer-events-none p-4 bg-black/50 rounded-lg">
            <h2 className="text-5xl font-extrabold text-red-600 animate-pulse [text-shadow:_0_0_10px_rgb(220_38_38_/_50%)]">WAR DECLARED!</h2>
            <p className="text-2xl text-red-400 font-semibold mt-1">Prices are x{WAR_PRICE_MULTIPLIER}!</p>
            <p className="text-4xl text-white font-bold mt-2">{warTimer}s</p>
          </div>
        )}
        {isOutageActive && !isWarActive && !isMoonRunActive && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center z-20 pointer-events-none p-4 bg-black/50 rounded-lg">
            <h2 className="text-5xl font-extrabold text-red-500 animate-pulse [text-shadow:_0_0_10px_rgb(239_68_68_/_50%)]">OIL OUTAGE!</h2>
            <p className="text-2xl text-yellow-300 font-semibold mt-1">Prices are x{OUTAGE_PRICE_MULTIPLIER}!</p>
            <p className="text-4xl text-white font-bold mt-2">{outageTimer}s</p>
          </div>
        )}
        {oilDrops.map(drop => (
          <OilDrop key={drop.id} drop={drop} onCollect={handleCollect} isOutageActive={isOutageActive} isWarActive={isWarActive} isMoonRunActive={isMoonRunActive}/>
        ))}
      </div>
      {renderModal()}
    </div>
  );
};

export default GameScreen;