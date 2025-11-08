import React, { useState } from 'react';
import Modal from './Modal';

interface AdminModalProps {
  onClose: () => void;
  adminLevel: 'full' | 'limited' | null;
  adminMoneyGiven: number;
  adminMoneyLimit: number;
  onAddMoney: (amount: number) => void;
  onIncreaseAdminLimit: (amount: number) => void;
  onStartOutage: () => void;
  onStopOutage: () => void;
  isOutageActive: boolean;
  onStartWar: () => void;
  onStopWar: () => void;
  isWarActive: boolean;
  onStartMoonRun: () => void;
  onStopMoonRun: () => void;
  isMoonRunActive: boolean;
}

const AdminModal: React.FC<AdminModalProps> = ({
  onClose,
  adminLevel,
  adminMoneyGiven,
  adminMoneyLimit,
  onAddMoney,
  onIncreaseAdminLimit,
  onStartOutage,
  onStopOutage,
  isOutageActive,
  onStartWar,
  onStopWar,
  isWarActive,
  onStartMoonRun,
  onStopMoonRun,
  isMoonRunActive,
}) => {
  const [moneyAmount, setMoneyAmount] = useState('');
  const [limitIncreaseAmount, setLimitIncreaseAmount] = useState('');

  const handleAddMoney = () => {
    const amountInCents = Math.floor(parseFloat(moneyAmount) * 100);
    if (!isNaN(amountInCents) && amountInCents > 0) {
      onAddMoney(amountInCents);
      setMoneyAmount('');
    }
  };

  const handleIncreaseLimit = () => {
    const amountInCents = Math.floor(parseFloat(limitIncreaseAmount) * 100);
    if (!isNaN(amountInCents) && amountInCents > 0) {
      onIncreaseAdminLimit(amountInCents);
      setLimitIncreaseAmount('');
    }
  };

  const commonButtonStyles = "px-4 py-2 text-md font-bold rounded-md transition-colors duration-200 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed";

  const remainingLimit = adminMoneyLimit - adminMoneyGiven;
  const isMoneyLimited = adminLevel === 'limited';
  const moneyLimitReached = isMoneyLimited && remainingLimit <= 0;

  const getStatusText = () => {
    if (isMoonRunActive) {
      return <span className="font-bold text-white animate-pulse">MOON RUN ACTIVE</span>;
    }
    if (isWarActive && isOutageActive) {
      return <span className="font-bold text-purple-400">CHAOS (WAR & OUTAGE)</span>;
    }
    if (isWarActive) {
      return <span className="font-bold text-red-500">WAR ACTIVE</span>;
    }
    if (isOutageActive) {
      return <span className="font-bold text-yellow-400">Oil Outage Active</span>;
    }
    return <span className="font-bold text-green-400">Normal</span>;
  };

  return (
    <Modal title="Admin Controls" onClose={onClose}>
      <div className="flex flex-col gap-6">
        {/* Add Money Section */}
        <div>
          <h3 className="text-xl font-semibold mb-2 text-gray-200">Give Money</h3>
          {isMoneyLimited && (
            <>
              <p className="text-sm text-gray-400 mb-1">
                Total Limit: <span className="font-bold text-yellow-300">${(adminMoneyLimit / 100).toLocaleString()}</span>
              </p>
              <p className="text-sm text-gray-400 mb-3">
                Limit Remaining: <span className="font-bold text-yellow-300">${(remainingLimit / 100).toLocaleString()}</span>
              </p>
            </>
          )}
          <div className="flex items-center gap-2">
            <div className="relative flex-grow">
               <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
               <input
                type="number"
                value={moneyAmount}
                onChange={(e) => setMoneyAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-gray-900 border border-gray-600 rounded-md p-3 pl-6 text-white text-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none disabled:bg-gray-700"
                aria-label="Amount to add"
                disabled={moneyLimitReached}
                max={isMoneyLimited ? (remainingLimit/100) : undefined}
              />
            </div>
            <button
              onClick={handleAddMoney}
              className={`${commonButtonStyles} bg-green-600 hover:bg-green-500 text-white`}
              disabled={moneyLimitReached}
            >
              Add
            </button>
          </div>
          {moneyLimitReached && <p className="text-red-400 text-xs mt-1">You have reached your money-giving limit.</p>}
        </div>

        {adminLevel === 'full' && (
          <div>
            <hr className="border-gray-700 my-2" />
            <h3 className="text-xl font-semibold my-2 text-gray-200">Manage Admin Limit</h3>
            <p className="text-sm text-gray-400 mb-3">
              Increase the total money-giving limit for the limited admin on this save file.
              Current limit is <span className="font-bold text-yellow-300">${(adminMoneyLimit / 100).toLocaleString()}</span>.
            </p>
            <div className="flex items-center gap-2">
              <div className="relative flex-grow">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  value={limitIncreaseAmount}
                  onChange={(e) => setLimitIncreaseAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-gray-900 border border-gray-600 rounded-md p-3 pl-6 text-white text-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                  aria-label="Amount to increase limit by"
                />
              </div>
              <button
                onClick={handleIncreaseLimit}
                className={`${commonButtonStyles} bg-blue-600 hover:bg-blue-500 text-white`}
              >
                Increase Limit
              </button>
            </div>
          </div>
        )}

        <div>
          <hr className="border-gray-700 my-4" />
          <h3 className="text-xl font-semibold mb-2 text-gray-200">Event Control</h3>
           <p className="text-sm text-gray-400 mb-3">
            Current Status: {getStatusText()}
          </p>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={onStartOutage}
              disabled={isOutageActive || isMoonRunActive}
              className={`${commonButtonStyles} bg-yellow-600 hover:bg-yellow-500 text-white`}
            >
              Start Outage
            </button>
            <button
              onClick={onStopOutage}
              disabled={!isOutageActive}
              className={`${commonButtonStyles} bg-gray-500 hover:bg-gray-400 text-white`}
            >
              Stop Outage
            </button>
            <button
              onClick={onStartWar}
              disabled={isWarActive || isMoonRunActive}
              className={`${commonButtonStyles} bg-red-700 hover:bg-red-600 text-white`}
            >
              Start War
            </button>
            <button
              onClick={onStopWar}
              disabled={!isWarActive}
              className={`${commonButtonStyles} bg-gray-500 hover:bg-gray-400 text-white`}
            >
              Stop War
            </button>
          </div>
        </div>

        {adminLevel === 'full' && (
          <div>
            <hr className="border-gray-700 my-4" />
            <h3 className="text-xl font-semibold mb-2 text-gray-200">Global Event Control</h3>
            <p className="text-sm text-gray-400 mb-3">
              This event will be activated for all players currently in the game.
            </p>
             <div className="grid grid-cols-2 gap-4">
               <button
                onClick={onStartMoonRun}
                disabled={isMoonRunActive}
                className={`${commonButtonStyles} bg-indigo-600 hover:bg-indigo-500 text-white`}
              >
                Start Moon Run
              </button>
              <button
                onClick={onStopMoonRun}
                disabled={!isMoonRunActive}
                className={`${commonButtonStyles} bg-gray-500 hover:bg-gray-400 text-white`}
              >
                Stop Moon Run
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AdminModal;
