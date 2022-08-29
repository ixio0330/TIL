import styled from 'styled-components';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, Tooltip, Legend, LinearScale, PointElement, BarElement);

const BarChartTemplate = styled.div`
  ${({ styles }) => styles}}
`

export default function BarChart({ labels, datasets, styles }) {
  const chartData = {
    labels,
    datasets
  };

  const chartOptions = {
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {	
          padding: 10,
          bodySpacing: 5,
      }
  },
    responsive: true,
  };

  return (
    <BarChartTemplate styles={styles}>
      <Bar data={chartData} options={chartOptions} />
    </BarChartTemplate>
  )
}