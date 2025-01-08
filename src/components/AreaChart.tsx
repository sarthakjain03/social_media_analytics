"use client"
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { Card, CardHeader, CardContent, Typography } from '@mui/material';

interface SeriesData {
  name: string;
  data: number[];
}

interface AreaChartProps {
  height?: number;
  yaxisTitle?: string;
  xaxisLabels: string[];
  showYaxisLabels?: boolean;
  colors?: string[];
  data: SeriesData[];
  title: string;
}

const chartOptions: ApexOptions = {
  chart: {
    toolbar: {
      show: true
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

const AreaChart: React.FC<AreaChartProps> = ({
  data = [],
  colors,
  showYaxisLabels = true,
  height = 350,
  xaxisLabels = [],
  yaxisTitle = '',
  title
}) => {
  const [series, setSeries] = useState<SeriesData[]>([]);
  const [options, setOptions] = useState<ApexOptions>(chartOptions);

  useEffect(() => {
    setSeries(data);
    setOptions((prevState) => ({
      ...prevState,
      yaxis: {
        labels: {
          show: showYaxisLabels
        },
        title: {
          text: yaxisTitle,
          style: {
            fontSize: '14px',
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 500,
            cssClass: 'apexcharts-yaxis-title'
          }
        }
      },
      xaxis: {
        categories: xaxisLabels
      },
      colors: colors || prevState.colors
    }));
  }, [data, colors, showYaxisLabels, xaxisLabels, yaxisTitle]);

  return (
    <Card sx={{ borderRadius: 12 }}>
      <CardHeader>
        <Typography variant='h5' fontWeight={500}>
          {title}
        </Typography>
      </CardHeader>
      <CardContent>
        <ReactApexChart 
          options={options} 
          series={series} 
          type="area" 
          height={height} 
        />
      </CardContent>
    </Card>
  );
};

export default AreaChart;
