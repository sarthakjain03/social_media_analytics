"use client"
import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface LineChartProps {
  data?: {
    series?: {
      name: string;
      data: number[];
    };
    categories?: string[];
  };
  height?: number;
}

const lineChartOptions: ApexOptions = {
  chart: {
    height: 350,
    type: 'line',
    zoom: {
      enabled: false
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth'
  },
  tooltip: {
    style: {
      fontSize: '16px'
    }
  }
};

const LineChart: React.FC<LineChartProps> = ({ data = {}, height = 350 }) => {
  const [series, setSeries] = useState<{ name: string; data: number[] }[]>([]);
  const [options, setOptions] = useState<ApexOptions>(lineChartOptions);

  useEffect(() => {
    if (data?.series) {
      setSeries([data.series]);
    } else {
      setSeries([]);
    }
    setOptions((prevState) => ({
      ...prevState,
      xaxis: {
        categories: data?.categories || []
      }
    }));
  }, [data]);

  return (
    <Box id="chart" sx={{ bgcolor: 'transparent' }}>
      <ReactApexChart options={options} series={series} type="line" height={height} />
    </Box>
  );
};

export default LineChart;
