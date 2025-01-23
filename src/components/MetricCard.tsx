"use client"
import { TrendingDownRounded, TrendingUpRounded } from "@mui/icons-material";
import { Card, CardContent, Stack, Typography } from "@mui/material";
import { formatToDayMonthYear } from "@/utils/dateFormatters";

interface MetricCardProps {
    comparisonDate: Date;
    title: string;
    value: number;
    percentChange: number;
}

const MetricCard = ({ comparisonDate, title, value, percentChange } : MetricCardProps) => {
    const percentageColor = percentChange >= 0.00 ? percentChange === 0.00 ? "info" : "success" : "error";
    const PercentageIcon = percentChange >= 0.00 ? percentChange === 0.00 ? null : <TrendingUpRounded color="success" /> : <TrendingDownRounded color="error" />;
    const dateString = formatToDayMonthYear(comparisonDate);

    return (
        <Card sx={{ borderRadius: 5, boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', paddingX: "1.5rem", paddingY: "1rem" }}>
            <CardContent sx={{ padding: 0, "&:last-child": { paddingBottom: 0 } }}>
                <Stack spacing={2}>
                    <Typography variant="body1" fontWeight={500} color="textSecondary">{title}</Typography>
                    <Typography variant="h4" fontWeight={500}>{value}</Typography>
                    <Stack spacing={1.5} direction={"row"} alignItems={"center"}>
                        <Stack spacing={1} direction={"row"} alignItems={"center"}>
                            <Typography variant="body2" color={percentageColor}>
                                {`${percentChange}%`}
                            </Typography>
                            {PercentageIcon}
                        </Stack>
                        <Typography variant="body2" color="textDisabled">
                            {`since ${dateString}`}
                        </Typography>
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
};

export default MetricCard;