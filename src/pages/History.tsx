import React, { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import BackgroundShapes from "../components/layout/BackgroundShapes";
import { motion } from "framer-motion";
import {
  Box,
  Card,
  CardContent,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuth } from "../context/AuthContext";

interface Child {
  id: string;
  name: string;
  birthDate: string;
}

interface Friend {
  id: string;
  name: string;
  parentPhone: string;
  status: 'in' | 'out';
  timestamp: any;
}

interface HistoryRecord {
  id: string;
  childName: string;
  friendName: string;
  status: 'in' | 'out';
  timestamp: any;
}

const History = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [selectedChild, setSelectedChild] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [children, setChildren] = useState<Child[]>([]);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
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

  const fetchHistory = async () => {
    if (!currentUser) return;

    try {
      const historyRecords: HistoryRecord[] = [];
      
      // Fetch history for each child
      for (const child of children) {
        const friendsRef = collection(db, 'users', currentUser.uid, 'children', child.id, 'friends');
        const friendsSnapshot = await getDocs(friendsRef);
        
        friendsSnapshot.docs.forEach(doc => {
          const friend = doc.data() as Friend;
          if (friend.timestamp) {
            historyRecords.push({
              id: doc.id,
              childName: child.name,
              friendName: friend.name,
              status: friend.status,
              timestamp: friend.timestamp
            });
          }
        });
      }

      // Sort by timestamp
      historyRecords.sort((a, b) => b.timestamp.toDate().getTime() - a.timestamp.toDate().getTime());
      setHistory(historyRecords);
    } catch (error) {
      console.error('Error fetching history:', error);
      setError(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchChildren();
    }
  }, [currentUser]);

  useEffect(() => {
    if (children.length > 0) {
      fetchHistory();
    }
  }, [children]);

  const filtered = history.filter((record) => {
    const matchChild =
      selectedChild === "all" ||
      record.childName.toLowerCase() === selectedChild.toLowerCase();
    const matchDate = !selectedDate || 
      record.timestamp.toDate().toISOString().split('T')[0] === selectedDate;
    return matchChild && matchDate;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-teal-400 text-xl">{t('common.loading')}</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#1a1a1a] text-white relative overflow-hidden">
      <BackgroundShapes zIndex="z-0" />

      {/* Hero */}
      <div className="relative z-10 text-center pt-48 pb-12 px-4">
        <motion.h1
          className="text-4xl font-bold text-teal-400 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {t("history.title")}
        </motion.h1>
        <motion.p
          className="text-gray-300 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {t("history.description")}
        </motion.p>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3, bgcolor: 'rgba(0, 0, 0, 0.3)', backdropFilter: 'blur(10px)' }}>
          <Box display="flex" alignItems="center" mb={2}>
            <FilterListIcon sx={{ color: '#2dd4bf', mr: 1 }} />
            <Typography variant="h6" sx={{ color: '#2dd4bf' }}>
              {t("history.filters")}
            </Typography>
          </Box>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormControl fullWidth>
              <InputLabel sx={{ color: 'white' }}>{t("history.filterByChild")}</InputLabel>
              <Select
                value={selectedChild}
                label={t("history.filterByChild")}
                onChange={(e: SelectChangeEvent) => setSelectedChild(e.target.value)}
                sx={{
                  color: 'white',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  },
                }}
              >
                <MenuItem value="all">{t("history.allChildren")}</MenuItem>
                {children.map(child => (
                  <MenuItem key={child.id} value={child.name.toLowerCase()}>
                    {child.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              type="date"
              label={t("history.filterByDate")}
              value={selectedDate}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSelectedDate(e.target.value)
              }
              InputLabelProps={{ shrink: true, sx: { color: 'white' } }}
              sx={{
                '& input': { color: 'white' },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                },
              }}
              fullWidth
            />
          </div>
        </Paper>

        {/* Results */}
        <div className="space-y-4">
          {filtered.map((item) => (
            <Card 
              key={item.id} 
              sx={{ 
                borderRadius: 3, 
                p: 2,
                bgcolor: 'rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                },
              }}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <PersonIcon sx={{ color: '#2dd4bf' }} />
                    <Typography variant="h6" sx={{ color: '#2dd4bf' }}>
                      {item.childName}
                    </Typography>
                  </Box>
                  <Chip
                    label={t(`history.status.${item.status === 'in' ? 'active' : 'completed'}`)}
                    color={item.status === 'in' ? "success" : "default"}
                    size="small"
                    sx={{
                      bgcolor: item.status === 'in' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                      color: item.status === 'in' ? '#22c55e' : 'white',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  />
                </Box>
                <Box display="flex" flexDirection="column" gap={1}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <PersonIcon sx={{ color: '#2dd4bf' }} />
                    <Typography variant="body2" sx={{ color: 'white' }}>
                      <strong>{t("history.friend")}:</strong> {item.friendName}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <AccessTimeIcon sx={{ color: '#2dd4bf' }} />
                    <Typography variant="body2" sx={{ color: 'white' }}>
                      <strong>{item.status === 'in' ? t("history.checkIn") : t("history.checkOut")}:</strong>{" "}
                      {item.timestamp.toDate().toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default History;

