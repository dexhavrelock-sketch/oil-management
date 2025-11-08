import React from 'react';
import Modal from './Modal';

type NavigableModal = 'settings' | 'bank' | 'sell' | 'buy' | 'bottleFactory' | 'admin';


interface MenuModalProps {
  onNavigate: (modalName: NavigableModal) => void;
  onClose: () => void;
}

const MenuModal: React.FC<MenuModalProps> = ({ onNavigate, onClose }) => {
  const commonButtonStyles = "w-full text-left px-6 py-4 bg-gray-700/50 hover:bg-yellow-400/20 text-lg font-semibold rounded-md transition-colors duration-200";

  return (
    <Modal title="Menu" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <button onClick={() => onNavigate('settings')} className={commonButtonStyles}>
          Settings
        </button>
        <button onClick={() => onNavigate('bank')} className={commonButtonStyles}>
          Bank
        </button>
        <button onClick={() => onNavigate('sell')} className={commonButtonStyles}>
          Sell
        </button>
        <button onClick={() => onNavigate('buy')} className={commonButtonStyles}>
          Buy
        </button>
        <button onClick={() => onNavigate('bottleFactory')} className={commonButtonStyles}>
          Bottle Factory
        </button>
        <button onClick={() => onNavigate('admin')} className={`${commonButtonStyles} text-red-400 hover:bg-red-500/20`}>
          Admin Panel
        </button>
      </div>
    </Modal>
  );
};

export default MenuModal;
