import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import BackgroundShapes from "../components/layout/BackgroundShapes";
import FeatureShowcase from "../components/common/FeatureShowcase";
import { motion, AnimatePresence } from "framer-motion";
import howItWorksImage from "../assets/images/howitworks.png";
import { collection, query, where, getDocs, doc, updateDoc, addDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuth } from "../context/AuthContext";

interface Child {
  id: string;
  name: string;
  birthDate: string;
  createdAt: any;
}

interface Friend {
  id: string;
  name: string;
  parentPhone: string;
  status: 'in' | 'out';
  timestamp: any;
}

const Dashboard = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(true);
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

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
      setError(t('common.error'));
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
      setError(t('common.error'));
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchChildren();
      setLoading(false);
    }
  }, [currentUser]);

  const handleCheckIn = () => {
    setIsCheckingIn(true);
    setIsModalOpen(true);
  };

  const handleCheckOut = () => {
    setIsCheckingIn(false);
    setIsModalOpen(true);
  };

  const handleChildSelect = async (child: Child) => {
    setSelectedChild(child);
    await fetchFriends(child.id);
  };

  const handleFriendSelect = async (friend: Friend) => {
    if (!currentUser || !selectedChild) return;

    try {
      const friendRef = doc(db, 'users', currentUser.uid, 'children', selectedChild.id, 'friends', friend.id);
      const newStatus = isCheckingIn ? 'in' : 'out';
      
      await updateDoc(friendRef, {
        status: newStatus,
        timestamp: new Date()
      });

      // Refresh friends list
      await fetchFriends(selectedChild.id);

      // Send notification to parent
      sendNotificationToParent(friend, newStatus);
      
      setSuccess(t('common.success'));
      setTimeout(() => {
        setIsModalOpen(false);
        setSuccess('');
        setSelectedChild(null);
      }, 2000);
    } catch (error) {
      console.error('Error updating friend status:', error);
      setError(t('common.error'));
    }
  };

  const sendNotificationToParent = (friend: Friend, newStatus: 'in' | 'out') => {
    // This is a placeholder for the notification functionality
    console.log(`Notification sent to parent ${friend.parentPhone}: Child ${friend.name} is ${newStatus}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-teal-400 text-xl">{t('common.loading')}</div>
      </div>
    );
  }

  return (
    <div className="w-full relative overflow-hidden">
      <BackgroundShapes zIndex="z-0" />

      {/* Hero Section */}
      <div className="text-center text-white relative z-10 pt-48 pb-16 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-light mb-8 md:mb-4">
            {t("home.welcome")}{" "}
            <span className="font-semibold text-teal-400">Domuus</span>
          </h1>
          <p className="text-3xl font-light opacity-90 mb-8">
            {t("home.description")}
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleCheckIn}
              className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors duration-200"
            >
              {t("common.checkIn")}
            </button>
            <button
              onClick={handleCheckOut}
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors duration-200"
            >
              {t("common.checkOut")}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Feature Cards */}
      <FeatureShowcase />

      {/* How It Works Section */}
      <div className="bg-[#121212] py-24 px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {t("howItWorks.title")}
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-8">
            {t("howItWorks.description")}
          </p>
          <div className="mb-8">
            <img
              src={howItWorksImage}
              alt="How it works"
              className="w-full rounded-xl shadow-lg border border-white/10"
            />
          </div>
          <Link
            to="/register"
            className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-lg text-lg font-medium transition-all duration-200"
          >
            {t("howItWorks.button")}
          </Link>
        </motion.div>
      </div>

      {/* History Section */}
      <div className="bg-[#121212] py-16 px-4 text-center relative z-10">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-white mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {t("home.historyTitle")}
        </motion.h2>
        <motion.p
          className="text-gray-300 text-lg leading-relaxed mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {t("home.historyDescription")}
        </motion.p>
        <Link
          to="/history"
          className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-lg text-lg font-medium transition-all duration-200"
        >
          {t("home.viewHistoryButton")}
        </Link>
      </div>

      {/* Check In/Out Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => {
              setIsModalOpen(false);
              setSelectedChild(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1a1a1a] rounded-xl border border-white/10 p-6 max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-white mb-6">
                {isCheckingIn ? t('common.checkIn') : t('common.checkOut')}
              </h2>

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

              {!selectedChild ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    {t('children.title')}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {children.map(child => (
                      <motion.div
                        key={child.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleChildSelect(child)}
                        className="p-4 rounded-lg border border-white/10 hover:border-white/20 cursor-pointer transition-colors duration-200"
                      >
                        <h4 className="text-white font-medium">{child.name}</h4>
                        <p className="text-white/60 text-sm">
                          {t('children.birthDate')}: {new Date(child.birthDate).toLocaleDateString()}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">
                      {selectedChild.name} - {t('profile.friendsList')}
                    </h3>
                    <button
                      onClick={() => setSelectedChild(null)}
                      className="text-white/60 hover:text-white transition-colors duration-200"
                    >
                      {t('common.cancel')}
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {friends.map(friend => (
                      <motion.div
                        key={friend.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleFriendSelect(friend)}
                        className={`p-4 rounded-lg border cursor-pointer transition-colors duration-200 ${
                          friend.status === 'in' 
                            ? 'border-green-500/50 hover:border-green-500' 
                            : 'border-red-500/50 hover:border-red-500'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-white font-medium">{friend.name}</h4>
                            <p className="text-white/60 text-sm">
                              {t('profile.parentPhone')}: {friend.parentPhone}
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded text-sm ${
                            friend.status === 'in' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {friend.status === 'in' ? t('common.checkedIn') : t('common.checkedOut')}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard; 