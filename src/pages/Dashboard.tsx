import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useTranslation } from 'react-i18next';

interface Child {
  id: string;
  name: string;
  age: number;
  // Add more child properties as needed
}

interface CheckIn {
  id: string;
  childId: string;
  date: Date;
  status: string;
  // Add more check-in properties as needed
}

const Dashboard = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [children, setChildren] = useState<Child[]>([]);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return;

      try {
        // Fetch children
        const childrenQuery = query(
          collection(db, 'children'),
          where('userId', '==', currentUser.uid)
        );
        const childrenSnapshot = await getDocs(childrenQuery);
        const childrenData = childrenSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Child[];
        setChildren(childrenData);

        // Fetch check-ins
        const checkInsQuery = query(
          collection(db, 'checkIns'),
          where('userId', '==', currentUser.uid)
        );
        const checkInsSnapshot = await getDocs(checkInsQuery);
        const checkInsData = checkInsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date.toDate()
        })) as CheckIn[];
        setCheckIns(checkInsData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser]);

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
        <h1 className="text-3xl text-teal-400 font-bold mb-8">{t('dashboard.title')}</h1>
        
        {/* Children Section */}
        <section className="mb-12">
          <h2 className="text-2xl text-white mb-4">{t('dashboard.children')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {children.map(child => (
              <div key={child.id} className="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 className="text-xl text-white mb-2">{child.name}</h3>
                <p className="text-white/60">Age: {child.age}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Check-ins Section */}
        <section>
          <h2 className="text-2xl text-white mb-4">{t('dashboard.checkIns')}</h2>
          <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-white/60">Date</th>
                  <th className="text-left p-4 text-white/60">Child</th>
                  <th className="text-left p-4 text-white/60">Status</th>
                </tr>
              </thead>
              <tbody>
                {checkIns.map(checkIn => (
                  <tr key={checkIn.id} className="border-b border-white/10">
                    <td className="p-4 text-white">
                      {checkIn.date.toLocaleDateString()}
                    </td>
                    <td className="p-4 text-white">
                      {children.find(c => c.id === checkIn.childId)?.name}
                    </td>
                    <td className="p-4 text-white">
                      {checkIn.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard; 