import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, getDocs, doc, getDoc, updateDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useTranslation } from 'react-i18next';
import ChildForm from '../components/children/ChildForm';
import GuestForm from '../components/guests/GuestForm';
import { motion, AnimatePresence } from 'framer-motion';

interface Child {
  id: string;
  name: string;
  birthDate: string;
  createdAt: any;
}

interface Guest {
  id: string;
  name: string;
  parentUserId: string;
  status: 'in' | 'out';
  timestamp: any;
}

interface Friend {
  id: string;
  name: string;
  parentPhone: string;
  createdAt: any;
}

const Profile = () => {
  const { t } = useTranslation();
  const { currentUser, userData } = useAuth();
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState(false);
  const [newFriend, setNewFriend] = useState({
    name: '',
    parentPhone: ''
  });

  const [formData, setFormData] = useState({
    firstName: userData?.firstName || '',
    lastName: userData?.lastName || '',
    email: currentUser?.email || '',
    phone: userData?.phone || '',
    notifications: userData?.notifications || true,
    language: userData?.language || 'sv'
  });

  const fetchChildren = async () => {
    if (!currentUser) return;

    try {
      const childrenRef = collection(db, 'users', currentUser.uid, 'children');
      const childrenSnapshot = await getDocs(childrenRef);
      const childrenData = childrenSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Child[];
      setChildren(childrenData);
    } catch (error) {
      console.error('Error fetching children:', error);
    }
  };

  const fetchGuests = async (childId: string) => {
    if (!currentUser) return;

    try {
      const guestsRef = collection(db, 'users', currentUser.uid, 'children', childId, 'guests');
      const guestsSnapshot = await getDocs(guestsRef);
      const guestsData = guestsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Guest[];
      setGuests(guestsData);
    } catch (error) {
      console.error('Error fetching guests:', error);
    }
  };

  const fetchFriends = async (childId: string) => {
    if (!currentUser) return;

    try {
      const friendsRef = collection(db, 'users', currentUser.uid, 'children', childId, 'friends');
      const friendsSnapshot = await getDocs(friendsRef);
      const friendsData = friendsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Friend[];
      setFriends(friendsData);
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchChildren();
      setLoading(false);
    }
  }, [currentUser]);

  const handleChildSelect = async (child: Child) => {
    setSelectedChild(child);
    await fetchGuests(child.id);
    await fetchFriends(child.id);
    setIsAddFriendModalOpen(true);
  };

  const handleChildAdded = () => {
    fetchChildren();
  };

  const handleGuestAdded = () => {
    if (selectedChild) {
      fetchGuests(selectedChild.id);
    }
  };

  const handleCheckInOut = async (guest: Guest) => {
    if (!currentUser || !selectedChild) return;

    try {
      const guestRef = doc(db, 'users', currentUser.uid, 'children', selectedChild.id, 'guests', guest.id);
      const newStatus = guest.status === 'in' ? 'out' : 'in';
      
      await updateDoc(guestRef, {
        status: newStatus,
        timestamp: new Date()
      });

      // Refresh guests list
      await fetchGuests(selectedChild.id);

      // Send notification to parent
      sendNotificationToParent(guest, newStatus);
    } catch (error) {
      console.error('Error updating guest status:', error);
    }
  };

  const sendNotificationToParent = (guest: Guest, newStatus: 'in' | 'out') => {
    // This is a placeholder for the notification functionality
    console.log(`Notification sent to parent ${guest.parentUserId}: Child ${guest.name} is ${newStatus}`);
  };

  const handleAddFriend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !selectedChild) return;

    try {
      const friendsRef = collection(db, 'users', currentUser.uid, 'children', selectedChild.id, 'friends');
      await addDoc(friendsRef, {
        name: newFriend.name,
        parentPhone: newFriend.parentPhone,
        createdAt: new Date()
      });

      await fetchFriends(selectedChild.id);
      setNewFriend({ name: '', parentPhone: '' });
      setSuccess(t('profile.friendAdded'));
    } catch (error) {
      console.error('Error adding friend:', error);
      setError(t('common.error'));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        notifications: formData.notifications,
        language: formData.language,
        updatedAt: new Date()
      });

      setSuccess(t('profile.updateSuccess'));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteChild = async (childId: string) => {
    if (!currentUser) return;
    
    if (window.confirm(t('profile.deleteChild'))) {
      try {
        const childRef = doc(db, 'users', currentUser.uid, 'children', childId);
        await deleteDoc(childRef);
        await fetchChildren();
        setSuccess(t('common.success'));
      } catch (error) {
        console.error('Error deleting child:', error);
        setError(t('common.error'));
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-teal-400 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] pt-24 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl text-teal-400 font-bold mb-8">{t('profile.title')}</h1>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-2 rounded-lg mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/50 text-green-500 px-4 py-2 rounded-lg mb-4">
            {success}
          </div>
        )}

        {/* Personal Information Form */}
        <div className="bg-white/5 p-6 rounded-xl border border-white/10 mb-8">
          <h2 className="text-xl text-white mb-6">{t('profile.personalInfo')}</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white/60 mb-2">{t('profile.firstName')}</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full p-3 rounded bg-black text-white border border-white/10"
                  required
                />
              </div>
              
              <div>
                <label className="block text-white/60 mb-2">{t('profile.lastName')}</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full p-3 rounded bg-black text-white border border-white/10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-white/60 mb-2">{t('profile.email')}</label>
              <input
                type="email"
                value={formData.email}
                className="w-full p-3 rounded bg-black/50 text-white/60 border border-white/10"
                disabled
              />
            </div>

            <div>
              <label className="block text-white/60 mb-2">{t('profile.phone')}</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 rounded bg-black text-white border border-white/10"
              />
            </div>

            {/* Preferences */}
            <div className="space-y-6">
              <h2 className="text-xl text-white mb-4">{t('profile.preferences')}</h2>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="notifications"
                    checked={formData.notifications}
                    onChange={handleChange}
                    className="h-4 w-4 text-teal-400 rounded border-white/10 bg-black"
                  />
                  <label className="ml-2 text-white">{t('profile.notifications')}</label>
                </div>

                <div>
                  <label className="block text-white/60 mb-2">{t('profile.language')}</label>
                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    className="w-full p-3 rounded bg-black text-white border border-white/10"
                  >
                    <option value="sv">Svenska</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('common.loading') : t('common.save')}
            </button>
          </form>
        </div>

        {/* Children and Guests Management */}
        <div className="bg-white/5 p-6 rounded-xl border border-white/10">
          <h2 className="text-xl text-white mb-6">{t('profile.management')}</h2>
          
          {/* Add Child Form */}
          <ChildForm onChildAdded={handleChildAdded} />

          {/* Children Section */}
          <section className="mb-12 mt-8">
            <h2 className="text-2xl text-white mb-4">{t('profile.children')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {children.map(child => (
                <motion.div
                  key={child.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-6 rounded-xl border cursor-pointer transition-colors ${
                    selectedChild?.id === child.id 
                      ? 'border-teal-400 bg-teal-400/10' 
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div onClick={() => handleChildSelect(child)}>
                    <h3 className="text-xl text-white mb-2">{child.name}</h3>
                    <p className="text-white/60">
                      {t('profile.birthDate')}: {new Date(child.birthDate).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteChild(child.id);
                    }}
                    className="mt-4 w-full px-4 py-2 text-red-400 border border-red-400/20 rounded-lg hover:bg-red-400/10"
                  >
                    {t('profile.deleteChild')}
                  </button>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Guests Section */}
          {selectedChild && (
            <section>
              <h2 className="text-2xl text-white mb-4">
                {t('profile.guests')} - {selectedChild.name}
              </h2>
              
              {/* Add Guest Form */}
              <GuestForm 
                childId={selectedChild.id} 
                onGuestAdded={handleGuestAdded} 
              />
              
              <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden mt-4">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left p-4 text-white/60">{t('profile.guestName')}</th>
                      <th className="text-left p-4 text-white/60">{t('profile.guestStatus')}</th>
                      <th className="text-left p-4 text-white/60">{t('profile.lastUpdate')}</th>
                      <th className="text-left p-4 text-white/60">{t('profile.actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {guests.map(guest => (
                      <tr key={guest.id} className="border-b border-white/10">
                        <td className="p-4 text-white">{guest.name}</td>
                        <td className="p-4 text-white">
                          <span className={`px-2 py-1 rounded ${
                            guest.status === 'in' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {guest.status}
                          </span>
                        </td>
                        <td className="p-4 text-white">
                          {guest.timestamp?.toDate().toLocaleString()}
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => handleCheckInOut(guest)}
                            className={`px-3 py-1 rounded ${
                              guest.status === 'in'
                                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                            }`}
                          >
                            {guest.status === 'in' ? t('profile.checkOut') : t('profile.checkIn')}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>

        {/* Add Friend Modal */}
        <AnimatePresence>
          {isAddFriendModalOpen && selectedChild && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-[#1a1a1a] rounded-xl border border-white/10 p-6 max-w-2xl w-full"
              >
                <h2 className="text-2xl font-bold text-white mb-6">
                  {t('profile.addFriend')} - {selectedChild.name}
                </h2>

                <form onSubmit={handleAddFriend} className="space-y-4">
                  <div>
                    <label className="block text-white/60 mb-2">
                      {t('profile.friendName')}
                    </label>
                    <input
                      type="text"
                      value={newFriend.name}
                      onChange={(e) => setNewFriend(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full p-3 rounded bg-black text-white border border-white/10"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white/60 mb-2">
                      {t('profile.parentPhone')}
                    </label>
                    <input
                      type="tel"
                      value={newFriend.parentPhone}
                      onChange={(e) => setNewFriend(prev => ({ ...prev, parentPhone: e.target.value }))}
                      className="w-full p-3 rounded bg-black text-white border border-white/10"
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-4 mt-6">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => setIsAddFriendModalOpen(false)}
                      className="px-4 py-2 rounded-lg border border-white/10 text-white hover:bg-white/5"
                    >
                      {t('common.cancel')}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg"
                    >
                      {t('common.add')}
                    </motion.button>
                  </div>
                </form>

                {/* Friends List */}
                {friends.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      {t('profile.friendsList')}
                    </h3>
                    <div className="space-y-2">
                      {friends.map(friend => (
                        <div
                          key={friend.id}
                          className="p-4 rounded-lg border border-white/10"
                        >
                          <h4 className="text-white font-medium">{friend.name}</h4>
                          <p className="text-white/60 text-sm">
                            {t('profile.parentPhone')}: {friend.parentPhone}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Profile; 