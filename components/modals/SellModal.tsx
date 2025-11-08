import React, { useState, useMemo } from 'react';
import Modal from './Modal';
import { PLASTIC_SELL_PRICE, GAS_SELL_PRICE, BOTTLE_SELL_PRICE, WAR_PRICE_MULTIPLIER, OUTAGE_PRICE_MULTIPLIER, MOON_RUN_PRICE_MULTIPLIER, GAS_STATION_SELL_PRICE_MULTIPLIER } from '../../constants';
import { PlasticIcon } from '../icons/PlasticIcon';
import { BottleIcon } from '../icons/BottleIcon';
import { GasIcon } from '../icons/GasIcon';

interface SellModalProps {
  onClose: () => void;
  plasticAmount: number;
  gasAmount: number;
  bottleAmount: number;
  onSellPlastic: (amount: number, price: number) => void;
  onSellGas: (amount: number, price: number) => void;
  onSellBottles: (amount: number, price: number) => void;
  isWarActive: boolean;
  isOutageActive: boolean;
  isMoonRunActive: boolean;
  ownedGasStations: number;
}

const SellModal: React.FC<SellModalProps> = ({ 
  onClose, 
  plasticAmount,
  gasAmount,
  bottleAmount,
  onSellPlastic,
  onSellGas,
  onSellBottles,
  isOutageActive,
  isWarActive,
  isMoonRunActive,
  ownedGasStations,
}) => {
  const [plasticSellAmount, setPlasticSellAmount] = useState('');
  const [gasSellAmount, setGasSellAmount] = useState('');
  const [bottleSellAmount, setBottleSellAmount] = useState('');

  const priceMultiplier = useMemo(() => {
    let multiplier = 1;
    if (isMoonRunActive) multiplier *= MOON_RUN_PRICE_MULTIPLIER;
    else {
      if (isWarActive) multiplier *= WAR_PRICE_MULTIPLIER;
      if (isOutageActive) multiplier *= OUTAGE_PRICE_MULTIPLIER;
    }
    return multiplier;
  }, [isWarActive, isOutageActive, isMoonRunActive]);

  const currentPlasticSellPrice = PLASTIC_SELL_PRICE * priceMultiplier;
  const currentGasSellPrice = GAS_SELL_PRICE * priceMultiplier;
  const currentBottleSellPrice = BOTTLE_SELL_PRICE * priceMultiplier;
  
  const numericPlasticAmount = parseInt(plasticSellAmount, 10) || 0;
  const numericGasAmount = parseInt(gasSellAmount, 10) || 0;
  const numericBottleAmount = parseInt(bottleSellAmount, 10) || 0;

  const handleSellPlastic = () => {
    if (numericPlasticAmount > 0) {
      onSellPlastic(numericPlasticAmount, currentPlasticSellPrice);
      setPlasticSellAmount('');
    }
  };

  const handleSellGas = () => {
    if (numericGasAmount > 0) {
      onSellGas(numericGasAmount, currentGasSellPrice);
      setGasSellAmount('');
    }
  };

  const handleSellBottles = () => {
    if (numericBottleAmount > 0) {
      onSellBottles(numericBottleAmount, currentBottleSellPrice);
      setBottleSellAmount('');
    }
  };

  const formatCurrency = (value: number) => `$${(value / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const totalPlasticValue = numericPlasticAmount * currentPlasticSellPrice;
  const totalGasValue = numericGasAmount * currentGasSellPrice;
  const totalBottleValue = numericBottleAmount * currentBottleSellPrice;

  const renderSellSection = (
    title: string,
    Icon: React.FC<any>,
    iconColorClass: string,
    inventory: number,
    amount: string,
    setAmount: (val: string) => void,
    handleSell: () => void,
    price: number,
    totalValue: number,
    numericAmount: number,
    extraInfo?: React.ReactNode
  ) => (
    <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
      <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
      <div className="flex justify-between items-center mb-2">
        <div>
          <p className="text-gray-400 text-sm">In Stock</p>
          <div className="flex items-center gap-2 mt-1">
            <Icon className={`w-6 h-6 ${iconColorClass}`} />
            <p className="text-2xl font-bold text-white">{inventory.toLocaleString()}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-gray-400 text-sm">Price/Unit</p>
          <p className={`text-xl font-bold ${priceMultiplier > 1 ? 'text-green-400 animate-pulse' : 'text-white'}`}>
            {formatCurrency(price)}
          </p>
        </div>
      </div>
      {extraInfo}
      <div className="relative my-3">
        <input
          type="text"
          pattern="\d*"
          value={amount}
          onChange={(e) => /^\d*$/.test(e.target.value) && setAmount(e.target.value)}
          placeholder="0"
          className="w-full bg-gray-900 border border-gray-600 rounded-md p-3 text-white text-xl text-center focus:ring-2 focus:ring-yellow-400 focus:outline-none"
          aria-label={`Amount of ${title} to sell`}
        />
         <button 
           onClick={() => setAmount(String(inventory))}
           className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-400 hover:text-yellow-300 font-bold text-sm"
         >
           MAX
         </button>
      </div>
      <p className="text-center text-gray-300 mb-3">Total Earnings: <span className="font-bold text-white">{formatCurrency(totalValue)}</span></p>
      <button 
        onClick={handleSell}
        disabled={numericAmount <= 0 || numericAmount > inventory}
        className="w-full px-4 py-3 text-lg font-bold rounded-md transition-colors duration-200 bg-green-600 hover:bg-green-500 text-white disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
      >
        Sell {title}
      </button>
    </div>
  );

  return (
    <Modal title="Sell Resources" onClose={onClose}>
      <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-2">
        {renderSellSection("Plastic", PlasticIcon, "text-gray-300", plasticAmount, plasticSellAmount, setPlasticSellAmount, handleSellPlastic, currentPlasticSellPrice, totalPlasticValue, numericPlasticAmount)}
        {renderSellSection("Gas", GasIcon, "text-orange-400", gasAmount, gasSellAmount, setGasSellAmount, handleSellGas, currentGasSellPrice, totalGasValue, numericGasAmount, 
          ownedGasStations > 0 && (
            <div className="text-xs text-center text-green-300 bg-green-900/50 rounded p-1 mt-2">
              Your {ownedGasStations} gas station(s) are selling gas for {formatCurrency(currentGasSellPrice * GAS_STATION_SELL_PRICE_MULTIPLIER)}/unit automatically.
            </div>
          )
        )}
        {renderSellSection("Bottles", BottleIcon, "text-cyan-300", bottleAmount, bottleSellAmount, setBottleSellAmount, handleSellBottles, currentBottleSellPrice, totalBottleValue, numericBottleAmount)}
      </div>
    </Modal>
  );
};

export default SellModal;