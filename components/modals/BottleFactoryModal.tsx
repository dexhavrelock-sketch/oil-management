import React, { useState } from 'react';
import Modal from './Modal';
import { BOTTLE_PRODUCTION_INTERVAL_MS, PLASTIC_PER_BOTTLE } from '../../constants';

interface BottleFactoryModalProps {
  onClose: () => void;
  ownedFactories: number;
  currentBudget: number;
  onSetBudget: (budget: number) => void;
}

const BottleFactoryModal: React.FC<BottleFactoryModalProps> = ({
  onClose,
  ownedFactories,
  currentBudget,
  onSetBudget,
}) => {
  const [budget, setBudget] = useState(String(currentBudget));

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setBudget(value);
    }
  };

  const numericBudget = parseInt(budget, 10) || 0;

  const handleSetBudget = () => {
    onSetBudget(numericBudget);
    onClose();
  };
  
  const totalPlasticConsumption = numericBudget * ownedFactories;
  const potentialBottleProduction = Math.floor(totalPlasticConsumption / PLASTIC_PER_BOTTLE);

  return (
    <Modal title="Bottle Factory Control" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div className="text-center bg-gray-900/50 p-3 rounded-md">
          <p className="text-gray-400 text-sm">Owned Factories</p>
          <p className="text-3xl font-bold text-white">{ownedFactories.toLocaleString()}</p>
        </div>

        {ownedFactories > 0 ? (
          <>
            <div>
              <label className="block text-gray-300 mb-2 font-semibold" htmlFor="budget-input">
                Plastic Budget per Factory
              </label>
              <p className="text-sm text-gray-400 mb-2">
                Set how much plastic each factory will try to consume every {BOTTLE_PRODUCTION_INTERVAL_MS / 1000} seconds.
              </p>
              <input
                id="budget-input"
                type="text"
                pattern="\d*"
                value={budget}
                onChange={handleBudgetChange}
                placeholder="0"
                className="w-full bg-gray-900 border border-gray-600 rounded-md p-3 text-white text-xl text-center focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                aria-label="Plastic budget per factory"
              />
            </div>

            <div className="text-center bg-gray-700/50 p-3 rounded-md">
                <p className="text-gray-300">Total consumption: <span className="font-bold text-white">{totalPlasticConsumption.toLocaleString()} plastic</span></p>
                <p className="text-cyan-300">Potential production: <span className="font-bold text-white">{potentialBottleProduction.toLocaleString()} bottles</span></p>
            </div>

            <button
              onClick={handleSetBudget}
              className="w-full px-4 py-3 text-lg font-bold rounded-md transition-colors duration-200 bg-cyan-600 hover:bg-cyan-500 text-white"
            >
              Set Budget
            </button>
          </>
        ) : (
          <p className="text-center text-gray-400 p-4">
            You don't own any bottle factories. Purchase one from the "Buy" menu to begin production.
          </p>
        )}
      </div>
    </Modal>
  );
};

export default BottleFactoryModal;
