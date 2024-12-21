"use client";
import { Dispatch, SetStateAction } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import { X, Instagram, YouTube, LinkedIn } from "@mui/icons-material";
import { motion } from "motion/react";

type TabProps = {
  selected: string;
  setSelected: Dispatch<SetStateAction<string>>;
};

export default function DashboardTabs({ selected, setSelected }: TabProps) {
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelected(newValue);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="px-20 py-4"
    >
      <Box sx={{ width: "100%" }}>
        <Tabs
          value={selected}
          onChange={handleChange}
          variant="fullWidth"
          centered
          textColor="secondary"
          indicatorColor="secondary"
        >
          <Tab
            label="Instagram"
            icon={<Instagram />}
            iconPosition="start"
            value="Instagram"
          />
          <Tab
            label="X (Twitter)"
            icon={<X />}
            iconPosition="start"
            value="X (Twitter)"
          />
          <Tab
            label="LinkedIn"
            icon={<LinkedIn />}
            iconPosition="start"
            value="LinkedIn"
          />
          <Tab
            label="YouTube"
            icon={<YouTube />}
            iconPosition="start"
            value="YouTube"
          />
        </Tabs>
      </Box>
    </motion.div>
  );
}
