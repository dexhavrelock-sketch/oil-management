import React, { useState } from 'react';
import Modal from './Modal';

interface AdminLoginModalProps {
  onClose: () => void;
  onLogin: (user: string, pass: string) => boolean;
}

const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onClose, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onLogin(username, password);
    if (!success) {
      setError('Invalid username or password.');
    }
  };

  const commonInputStyles = "w-full bg-gray-900 border border-gray-600 rounded-md p-3 text-white text-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none";

  return (
    <Modal title="Admin Login" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-gray-400 mb-1" htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={commonInputStyles}
            autoFocus
          />
        </div>
        <div>
          <label className="block text-gray-400 mb-1" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={commonInputStyles}
          />
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full mt-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-lg rounded-md transition-colors duration-200"
        >
          Login
        </button>
      </form>
    </Modal>
  );
};

export default AdminLoginModal;