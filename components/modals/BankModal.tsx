import React, { useState } from 'react';
import Modal from './Modal';

interface BankModalProps {
  onClose: () => void;
  currentEarnings: number;
  currentSavings: number;
  timeToInterest: number;
  onDeposit: (amount: number) => void;
  onWithdraw: (amount: number) => void;
}

const BankModal: React.FC<BankModalProps> = ({ 
  onClose,
  currentEarnings,
  currentSavings,
  timeToInterest,
  onDeposit,
  onWithdraw
}) => {
  const [amount, setAmount] = useState('');

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and prevent leading zeros unless it's the only digit
    if (/^\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const numericAmount = parseInt(amount, 10) || 0;

  const handleDeposit = () => {
    if (numericAmount > 0) {
      onDeposit(numericAmount);
      setAmount('');
    }
  };

  const handleWithdraw = () => {
    if (numericAmount > 0) {
      onWithdraw(numericAmount);
      setAmount('');
    }
  };

  const formatCurrency = (value: number) => `$${(value / 100).toFixed(2)}`;

  const commonButtonStyles = "px-4 py-2 text-lg font-bold rounded-md transition-colors duration-200 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed";

  return (
    <Modal title="Bank" onClose={onClose}>
      <div className="flex flex-col gap-4">
        {/* Balances */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-gray-400 text-sm">Cash on Hand</p>
            <p className="text-2xl font-bold text-white">{formatCurrency(currentEarnings)}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Savings</p>
            <p className="text-2xl font-bold text-green-400">{formatCurrency(currentSavings)}</p>
          </div>
        </div>

        {/* Input */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
          <input
            type="text"
            pattern="\d*"
            value={amount}
            onChange={handleAmountChange}
            placeholder="0.00"
            className="w-full bg-gray-900 border border-gray-600 rounded-md p-3 pl-6 text-white text-xl focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            aria-label="Transaction amount"
          />
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={handleDeposit}
            disabled={numericAmount <= 0 || numericAmount > currentEarnings}
            className={`${commonButtonStyles} bg-blue-600 hover:bg-blue-500 text-white`}
          >
            Deposit
          </button>
          <button 
            onClick={handleWithdraw}
            disabled={numericAmount <= 0 || numericAmount > currentSavings}
            className={`${commonButtonStyles} bg-red-600 hover:bg-red-500 text-white`}
          >
            Withdraw
          </button>
        </div>

        {/* Interest Info */}
        <div className="text-center bg-gray-700/50 p-3 rounded-md mt-2">
          <p className="text-green-300 font-semibold">Earn 10% interest on savings!</p>
          <p className="text-gray-300">Next payment in: <span className="font-bold">{timeToInterest}s</span></p>
        </div>
      </div>
    </Modal>
  );
};

export default BankModal;