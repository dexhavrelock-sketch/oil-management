import React from 'react';
import Modal from './Modal';
import { OIL_RIGS, MINI_RIG_PRODUCTION_RATE, PLASTIC_REFINERY_COST, GAS_REFINERY_COST, GAS_STATION_COST, BOTTLE_FACTORY_COST, GAS_STATION_SELL_PRICE_MULTIPLIER } from '../../constants';
import { GasStationIcon } from '../icons/GasStationIcon';

interface BuyModalProps {
  onClose: () => void;
  currentEarnings: number;
  ownedRigs: number[];
  onBuyRig: (levelIndex: number) => void;
  ownedMiniRigs: number;
  onBuyMiniRig: () => void;
  nextMiniRigCost: number;
  ownedRefineries: number;
  onBuyRefinery: () => void;
  ownedGasRefineries: number;
  onBuyGasRefinery: () => void;
  ownedGasStations: number;
  onBuyGasStation: () => void;
  ownedBottleFactories: number;
  onBuyBottleFactory: () => void;
}

const formatCurrency = (value: number) => `$${(value / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const BuyModal: React.FC<BuyModalProps> = ({ 
  onClose, 
  currentEarnings, 
  ownedRigs, 
  onBuyRig,
  ownedMiniRigs,
  onBuyMiniRig,
  nextMiniRigCost,
  ownedRefineries,
  onBuyRefinery,
  ownedGasRefineries,
  onBuyGasRefinery,
  ownedGasStations,
  onBuyGasStation,
  ownedBottleFactories,
  onBuyBottleFactory,
}) => {
  return (
    <Modal title="Buy Equipment" onClose={onClose}>
      <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-2">
        {/* Gas Station */}
        <div className="bg-gray-900/50 p-4 rounded-lg border border-red-500 flex justify-between items-center gap-4">
          <div className="flex-grow">
            <h3 className="text-xl font-bold text-red-300">Gas Station</h3>
            <p className="text-sm text-gray-400">Owned: <span className="font-bold">{ownedGasStations}</span></p>
            <p className="text-red-400 font-semibold">
              Sells 1 Gas/sec for +{(GAS_STATION_SELL_PRICE_MULTIPLIER - 1) * 100}% price
            </p>
             <p className="text-xs text-gray-500 italic mt-1">Automatically sells from your gas inventory.</p>
          </div>
          <button
            onClick={onBuyGasStation}
            disabled={currentEarnings < GAS_STATION_COST}
            className="px-4 py-3 font-bold rounded-md transition-colors duration-200 bg-red-600 hover:bg-red-500 text-white disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed flex-shrink-0"
          >
            Buy for {formatCurrency(GAS_STATION_COST)}
          </button>
        </div>
        
        <hr className="border-gray-700 my-2" />

        {/* Bottle Factory */}
        <div className="bg-gray-900/50 p-4 rounded-lg border border-cyan-500 flex justify-between items-center gap-4">
          <div className="flex-grow">
            <h3 className="text-xl font-bold text-cyan-300">Bottle Factory</h3>
            <p className="text-sm text-gray-400">Owned: <span className="font-bold">{ownedBottleFactories}</span></p>
            <p className="text-cyan-400 font-semibold">
              Converts Plastic to Bottles
            </p>
             <p className="text-xs text-gray-500 italic mt-1">Set production budget in the factory menu.</p>
          </div>
          <button
            onClick={onBuyBottleFactory}
            disabled={currentEarnings < BOTTLE_FACTORY_COST}
            className="px-4 py-3 font-bold rounded-md transition-colors duration-200 bg-cyan-600 hover:bg-cyan-500 text-white disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed flex-shrink-0"
          >
            Buy for {formatCurrency(BOTTLE_FACTORY_COST)}
          </button>
        </div>
        
        <hr className="border-gray-700 my-2" />

        {/* Gas Refinery */}
        <div className="bg-gray-900/50 p-4 rounded-lg border border-orange-500 flex justify-between items-center gap-4">
          <div className="flex-grow">
            <h3 className="text-xl font-bold text-orange-300">Gas Refinery</h3>
            <p className="text-sm text-gray-400">Owned: <span className="font-bold">{ownedGasRefineries}</span></p>
            <p className="text-orange-400 font-semibold">
              Produces 1 Gas/sec
            </p>
             <p className="text-xs text-gray-500 italic mt-1">Requires 1 available Oil Rig to operate.</p>
          </div>
          <button
            onClick={onBuyGasRefinery}
            disabled={currentEarnings < GAS_REFINERY_COST}
            className="px-4 py-3 font-bold rounded-md transition-colors duration-200 bg-orange-600 hover:bg-orange-500 text-white disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed flex-shrink-0"
          >
            Buy for {formatCurrency(GAS_REFINERY_COST)}
          </button>
        </div>

        {/* Plastic Refinery */}
        <div className="bg-gray-900/50 p-4 rounded-lg border border-blue-500 flex justify-between items-center gap-4">
          <div className="flex-grow">
            <h3 className="text-xl font-bold text-blue-300">Plastic Refinery</h3>
            <p className="text-sm text-gray-400">Owned: <span className="font-bold">{ownedRefineries}</span></p>
            <p className="text-blue-400 font-semibold">
              Produces 1 Plastic/sec
            </p>
             <p className="text-xs text-gray-500 italic mt-1">Requires 1 available Oil Rig to operate.</p>
          </div>
          <button
            onClick={onBuyRefinery}
            disabled={currentEarnings < PLASTIC_REFINERY_COST}
            className="px-4 py-3 font-bold rounded-md transition-colors duration-200 bg-blue-600 hover:bg-blue-500 text-white disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed flex-shrink-0"
          >
            Buy for {formatCurrency(PLASTIC_REFINERY_COST)}
          </button>
        </div>

        <hr className="border-gray-700 my-2" />

        {/* Mini Rig */}
        <div className="bg-gray-900/50 p-4 rounded-lg border border-yellow-500 flex justify-between items-center gap-4">
          <div className="flex-grow">
            <h3 className="text-xl font-bold text-yellow-300">Mini Rig</h3>
            <p className="text-sm text-gray-400">Owned: <span className="font-bold">{ownedMiniRigs}</span></p>
            <p className="text-green-400 font-semibold">
              Produces {formatCurrency(MINI_RIG_PRODUCTION_RATE)}/sec
            </p>
          </div>
          <button
            onClick={onBuyMiniRig}
            disabled={currentEarnings < nextMiniRigCost}
            className="px-4 py-3 font-bold rounded-md transition-colors duration-200 bg-yellow-600 hover:bg-yellow-500 text-white disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed flex-shrink-0"
          >
            Buy for {formatCurrency(nextMiniRigCost)}
          </button>
        </div>

        <hr className="border-gray-700 my-2" />
        
        {/* Standard Rigs */}
        {OIL_RIGS.map((rig, index) => (
          <div key={rig.level} className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 flex justify-between items-center gap-4">
            <div className="flex-grow">
              <h3 className="text-xl font-bold text-white">Oil Rig Mk {rig.level}</h3>
              <p className="text-sm text-gray-400">Owned: <span className="font-bold">{ownedRigs[index]}</span></p>
              <p className="text-green-400 font-semibold">
                Produces {formatCurrency(rig.productionRate)}/sec
              </p>
            </div>
            <button
              onClick={() => onBuyRig(index)}
              disabled={currentEarnings < rig.cost}
              className="px-4 py-3 font-bold rounded-md transition-colors duration-200 bg-green-600 hover:bg-green-500 text-white disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed flex-shrink-0"
            >
              Buy for {formatCurrency(rig.cost)}
            </button>
          </div>
        ))}
        {OIL_RIGS.length === 0 && <p className="text-gray-400">No rigs available for purchase.</p>}
      </div>
    </Modal>
  );
};

export default BuyModal;