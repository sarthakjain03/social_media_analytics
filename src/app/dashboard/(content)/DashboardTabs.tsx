import { Box, Tab, Tabs } from "@mui/material";
import { X, Instagram, GitHub } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useResponsive } from "@/hooks/useResponsive";

export default function DashboardTabs({ selected }: { selected: string }) {
  const router = useRouter();
  const isSmall = useResponsive('down', 'md');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    router.replace(`/dashboard?tab=${newValue}`);
  };

  return (
    <div className="py-4">
      <Box sx={{ width: "100%", borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={selected}
          onChange={handleChange}
          variant={isSmall ? "scrollable" : "fullWidth"}
          scrollButtons="auto"
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
            label="Github"
            icon={<GitHub />}
            iconPosition="start"
            value="github"
          />
          <Tab
            label="Instagram"
            icon={<Instagram />}
            iconPosition="start"
            value="instagram"
          />
        </Tabs>
      </Box>
    </div>
  );
}
