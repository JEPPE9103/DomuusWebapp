import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useTranslation } from 'react-i18next';

interface GuestFormProps {
  childId: string;
  onGuestAdded: () => void;
}

const GuestForm: React.FC<GuestFormProps> = ({ childId, onGuestAdded }) => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    parentUserId: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!currentUser) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    try {
      const guestsRef = collection(db, 'users', currentUser.uid, 'children', childId, 'guests');
      await addDoc(guestsRef, {
        name: formData.name,
        parentUserId: formData.parentUserId,
        status: 'out',
        timestamp: serverTimestamp()
      });

      // Reset form
      setFormData({
        name: '',
        parentUserId: ''
      });

      // Notify parent component
      onGuestAdded();
    } catch (err) {
      console.error('Error adding guest:', err);
      setError('Failed to add guest');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/5 p-6 rounded-xl border border-white/10 mb-6">
      <h3 className="text-xl text-white mb-4">{t('guests.addNew')}</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-white/60 mb-2">
            {t('guests.name')}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="parentUserId" className="block text-white/60 mb-2">
            {t('guests.parentUserId')}
          </label>
          <input
            type="text"
            id="parentUserId"
            name="parentUserId"
            value={formData.parentUserId}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
          />
        </div>
        {error && (
          <div className="text-red-400 mb-4">{error}</div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="bg-teal-400 text-black px-4 py-2 rounded hover:bg-teal-300 transition-colors disabled:opacity-50"
        >
          {loading ? t('common.loading') : t('guests.add')}
        </button>
      </form>
    </div>
  );
};

export default GuestForm; 