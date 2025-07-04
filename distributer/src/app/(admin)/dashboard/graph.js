import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { getGraphview } from "../../components/config";
import { Chart as ChartJS, CategoryScale, LinearScale, Title, Tooltip, Legend, LineElement, PointElement, ArcElement } from "chart.js";

// Register components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  Title, 
  Tooltip, 
  Legend, 
  LineElement, 
  PointElement, 
  ArcElement
);

const LineGraph = () => {
  const [chartData, setChartData] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    getGraphview()
      .then((response) => {
        const data = response?.data || [];

        if (!Array.isArray(data) || data.length === 0) {
          throw new Error("Invalid or empty data received from API");
        }

        const dates = data.map((item) => item.date);
        const counts = data.map((item) => item.count);

        setChartData({
          labels: dates,
          datasets: [
            {
              label: "Assignments Over Time",
              data: counts,
              borderColor: "rgba(75,192,192,1)",
              backgroundColor: "rgba(75,192,192,0.2)",
              pointBackgroundColor: "rgba(75,192,192,1)",
            },
          ],
        });
      })
      .catch((err) => {
        console.error("Error fetching data:", err.message);
        setError(err.message);
      });
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div className="flex space-x-4">
          <div className="bg-blue-900 text-white rounded p-8">
            <h1 className="text-3xl text-white font-semibold">Assign Clients  </h1>
            
            <p className="text-lg text-center">6</p>
          </div>
          <div className="bg-green-900 p-8 rounded">
            <h1 className="text-3xl font-semibold text-white ">Employees</h1>
            <p className="text-lg text-white text-center"> 6</p>
          </div>
        </div>
      <h2 className="underline; mt-6">Total Assign Clients</h2>
      {chartData.labels ? (
        <Line
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: { display: true },
            },
            scales: {
              x: { title: { display: true, text: "Date" }, type: "category" },  // x-axis with category scale
              y: { title: { display: true, text: "Number of Assignments" }, type: "linear" },  // y-axis with linear scale
            },
          }}
        />
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default LineGraph;
