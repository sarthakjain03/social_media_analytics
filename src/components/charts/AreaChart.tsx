"use client"
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { Card, CardHeader, CardContent, Divider } from '@mui/material';

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
  showLegendForSingleSeries?: boolean;
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

const headerSX = {
  paddingY: 1.5,
  paddingX: 2.5,
  '& .MuiCardHeader-action': { m: '0px auto', alignSelf: 'center' }
};

const AreaChart: React.FC<AreaChartProps> = ({
  data = [],
  colors,
  showYaxisLabels = true,
  height = 350,
  xaxisLabels = [],
  yaxisTitle = '',
  title,
  showLegendForSingleSeries = false
}) => {
  const [series, setSeries] = useState<SeriesData[]>([]);
  const [options, setOptions] = useState<ApexOptions>(chartOptions);

  useEffect(() => {
    setSeries(data);
    setOptions((prevState) => ({
      ...prevState,
      legend: {
        show: true,
        showForSingleSeries: showLegendForSingleSeries
      },
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
  }, [data, colors, showYaxisLabels, xaxisLabels, yaxisTitle, showLegendForSingleSeries]);

  return (
    <Card sx={{ borderRadius: 5, boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }}>
      <CardHeader sx={headerSX} titleTypographyProps={{ variant: 'h5' }} title={title} />
      <Divider />
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
