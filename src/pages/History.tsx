import React, { useState } from "react";
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


interface CheckInRecord {
  id: number;
  childName: string;
  location: string;
  checkInTime: string;
  checkOutTime: string | null;
  status: "active" | "completed";
}

const History = () => {
  const { t } = useTranslation();
  const [selectedChild, setSelectedChild] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");

  const historyData: CheckInRecord[] = [
    {
      id: 1,
      childName: "Emma",
      location: "Annas hem",
      checkInTime: "2024-03-15 14:30",
      checkOutTime: "2024-03-15 17:00",
      status: "completed",
    },
    {
      id: 2,
      childName: "Lucas",
      location: "Skolan",
      checkInTime: "2024-03-15 08:00",
      checkOutTime: null,
      status: "active",
    },
  ];

  const filtered = historyData.filter((record) => {
    const matchChild =
      selectedChild === "all" ||
      record.childName.toLowerCase() === selectedChild;
    const matchDate = !selectedDate || record.checkInTime.startsWith(selectedDate);
    return matchChild && matchDate;
  });

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
      <Box className="relative z-10 max-w-4xl mx-auto px-4 pb-10">
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
                <MenuItem value="emma">Emma</MenuItem>
                <MenuItem value="lucas">Lucas</MenuItem>
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
        <div className="space-y-6">
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
                    label={t(`history.status.${item.status}`)}
                    color={item.status === "active" ? "success" : "default"}
                    size="small"
                    sx={{
                      bgcolor: item.status === "active" ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                      color: item.status === "active" ? '#22c55e' : 'white',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  />
                </Box>
                <Box display="flex" flexDirection="column" gap={1} mt={1}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <LocationOnIcon sx={{ color: '#2dd4bf' }} />
                    <Typography variant="body2" sx={{ color: 'white' }}>
                      <strong>{t("history.location")}:</strong> {item.location}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <AccessTimeIcon sx={{ color: '#2dd4bf' }} />
                    <Typography variant="body2" sx={{ color: 'white' }}>
                      <strong>{t("history.checkIn")}:</strong> {item.checkInTime}
                    </Typography>
                  </Box>
                  {item.checkOutTime && (
                    <Box display="flex" alignItems="center" gap={1}>
                      <AccessTimeIcon sx={{ color: '#2dd4bf' }} />
                      <Typography variant="body2" sx={{ color: 'white' }}>
                        <strong>{t("history.checkOut")}:</strong> {item.checkOutTime}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          ))}
        </div>
      </Box>
    </div>
  );
};

export default History;
