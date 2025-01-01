import { Box, Tab, Tabs } from "@mui/material";
import { X, Instagram, YouTube, LinkedIn } from "@mui/icons-material";
import { useRouter } from "next/navigation";

export default function DashboardTabs({ selected }: { selected: string }) {
  const router = useRouter();

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    router.replace(`/dashboard?tab=${newValue}`);
  };

  return (
    <div className="py-4">
      <Box sx={{ width: "100%" }}>
        <Tabs
          value={selected}
          onChange={handleChange}
          variant="fullWidth"
          centered
          textColor="secondary"
          indicatorColor="secondary"
        >
          <Tab label="All" value="all" />
          <Tab
            label="X (Twitter)"
            icon={<X />}
            iconPosition="start"
            value="twitter"
          />
          <Tab
            label="Instagram"
            icon={<Instagram />}
            iconPosition="start"
            value="instagram"
          />
          <Tab
            label="LinkedIn"
            icon={<LinkedIn />}
            iconPosition="start"
            value="linkedin"
          />
          <Tab
            label="YouTube"
            icon={<YouTube />}
            iconPosition="start"
            value="youtube"
          />
        </Tabs>
      </Box>
    </div>
  );
}
