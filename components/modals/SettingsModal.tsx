import React, { useState } from 'react';
import Modal from './Modal';
import { SaveData } from '../../types';
import { GAME_SAVE_KEY, HIGH_SCORE_KEY, OIL_RIGS, ADMIN_MONEY_LIMIT_CENTS } from '../../constants';

interface SettingsModalProps {
  onClose: () => void;
  gameState: SaveData;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, gameState }) => {
  const [exportString, setExportString] = useState('');
  const [importString, setImportString] = useState('');
  const [copySuccess, setCopySuccess] = useState('');
  const [importError, setImportError] = useState('');

  const handleExport = () => {
    try {
      const jsonString = JSON.stringify(gameState);
      const base64String = btoa(jsonString);
      setExportString(base64String);
      setCopySuccess('');
    } catch (error) {
      console.error('Export failed:', error);
      setExportString('Error generating export data.');
    }
  };

  const handleCopyToClipboard = () => {
    if (!exportString || copySuccess) return;
    navigator.clipboard.writeText(exportString).then(() => {
      setCopySuccess('Copied to clipboard!');
      setTimeout(() => setCopySuccess(''), 2000);
    }, () => {
      setCopySuccess('Failed to copy.');
    });
  };

  const handleImport = () => {
    setImportError('');
    if (!importString.trim()) {
      setImportError('Paste your save data first.');
      return;
    }

    try {
      const jsonString = atob(importString.trim());
      const parsedData: Partial<SaveData> = JSON.parse(jsonString);

      // Validation
      if (
        typeof parsedData.score !== 'number' ||
        typeof parsedData.savings !== 'number' ||
        !Array.isArray(parsedData.ownedRigs) ||
        typeof parsedData.ownedMiniRigs !== 'number' ||
        parsedData.ownedRigs.length !== OIL_RIGS.length
      ) {
        throw new Error('Invalid or outdated save data structure.');
      }

      const completeSaveData: SaveData = {
        score: parsedData.score,
        savings: parsedData.savings,
        ownedRigs: parsedData.ownedRigs,
        ownedMiniRigs: parsedData.ownedMiniRigs,
        adminMoneyGiven: parsedData.adminMoneyGiven || 0,
        adminMoneyLimit: parsedData.adminMoneyLimit === undefined ? ADMIN_MONEY_LIMIT_CENTS : parsedData.adminMoneyLimit,
        plastic: parsedData.plastic || 0,
        ownedRefineries: parsedData.ownedRefineries || 0,
        plasticBottles: parsedData.plasticBottles || 0,
        ownedBottleFactories: parsedData.ownedBottleFactories || 0,
        bottleProductionBudget: parsedData.bottleProductionBudget || 0,
        gas: parsedData.gas || 0,
        ownedGasRefineries: parsedData.ownedGasRefineries || 0,
        ownedGasStations: parsedData.ownedGasStations || 0,
      };

      localStorage.setItem(GAME_SAVE_KEY, JSON.stringify(completeSaveData));
      
      const currentHighScore = parseInt(localStorage.getItem(HIGH_SCORE_KEY) || '0', 10);
      if (parsedData.score > currentHighScore) {
        localStorage.setItem(HIGH_SCORE_KEY, parsedData.score.toString());
      }

      alert('Import successful! The game will now reload to apply changes.');
      window.location.reload();

    } catch (error) {
      console.error('Import failed:', error);
      setImportError('Invalid or corrupted save data. Please check the code.');
    }
  };

  return (
    <Modal title="Settings" onClose={onClose}>
      <div className="flex flex-col gap-6">
        {/* Export Section */}
        <div>
          <h3 className="text-xl font-semibold mb-2 text-gray-200">Export Save</h3>
          <p className="text-sm text-gray-400 mb-3">
            Click the button to generate your save code. Copy it and save it somewhere safe.
          </p>
          <button
            onClick={handleExport}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-md transition-colors"
          >
            Generate Save Code
          </button>
          {exportString && (
            <div className="mt-3 relative">
              <textarea
                readOnly
                value={exportString}
                className="w-full h-24 p-2 bg-gray-900 border border-gray-600 rounded-md text-gray-300 text-sm resize-none"
                aria-label="Your save code"
              />
              <button
                onClick={handleCopyToClipboard}
                className="absolute bottom-2 right-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-sm font-semibold rounded-md transition-colors"
              >
                {copySuccess ? copySuccess : 'Copy'}
              </button>
            </div>
          )}
        </div>

        {/* Import Section */}
        <div>
          <h3 className="text-xl font-semibold mb-2 text-gray-200">Import Save</h3>
          <p className="text-sm text-gray-400 mb-3">
            Paste your save code below and click import. The page will reload.
          </p>
          <textarea
            value={importString}
            onChange={(e) => setImportString(e.target.value)}
            className="w-full h-24 p-2 bg-gray-900 border border-gray-600 rounded-md text-gray-300 text-sm resize-none focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            placeholder="Paste your save code here..."
            aria-label="Paste save code here"
          />
          {importError && <p className="text-red-400 text-sm mt-1">{importError}</p>}
          <button
            onClick={handleImport}
            className="w-full mt-3 px-4 py-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded-md transition-colors"
          >
            Import and Reload
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SettingsModal;