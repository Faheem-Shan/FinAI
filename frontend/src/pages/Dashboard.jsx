// import { useState, useEffect } from 'react';
// import api from '../api/axios';
// import { TrendingDown, Wallet, TrendingUp } from 'lucide-react';
// import { motion } from 'framer-motion';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Tooltip,
//   Legend,
//   ArcElement
// } from 'chart.js';
// import { Bar, Doughnut } from 'react-chartjs-2';

// ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, ArcElement);

// const Dashboard = () => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const isDark = document.documentElement.classList.contains("dark");

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await api.get('finance/dashboard/');
//         setData(res.data);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <div className="w-10 h-10 border-4 border-[var(--color-primary)]/20 border-t-[var(--color-primary)] rounded-full animate-spin"></div>
//       </div>
//     );
//   }

//   // 🎨 COLORS FROM CSS VARIABLES
//   const textColor = getComputedStyle(document.documentElement)
//     .getPropertyValue('--text-secondary');

//   const generateColors = (count) => {
//     const colors = [
//       "#15CC81", "#3B82F6", "#F59E0B",
//       "#EF4444", "#8B5CF6", "#06B6D4", "#F97316"
//     ];
//     return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
//   };

//   // 📊 BAR DATA
//   const barData = {
//     labels: data?.monthly_activity?.map(m => m.month) || [],
//     datasets: [
//       {
//         label: 'Income',
//         data: data?.monthly_activity?.map(m => m.income) || [],
//         backgroundColor: '#15CC81',
//         borderRadius: 6,
//       },
//       {
//         label: 'Expenses',
//         data: data?.monthly_activity?.map(m => m.expense) || [],
//         backgroundColor: '#E5E7EB',
//         borderRadius: 6,
//       },
//     ],
//   };

//   // 🍩 DONUT DATA
//   const donutData = {
//     labels: data?.spending_by_category?.length
//       ? data.spending_by_category.map(c => c.category__name)
//       : ['No Data'],
//     datasets: [{
//       data: data?.spending_by_category?.length
//         ? data.spending_by_category.map(c => c.amount)
//         : [1],
//       backgroundColor: generateColors(data?.spending_by_category?.length || 1),
//       borderColor: isDark ? '#0F172A' : '#ffffff',
//       borderWidth: 2,
//     }]
//   };

//   const chartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: { display: false },
//       tooltip: {
//         backgroundColor: isDark ? '#1F2937' : '#ffffff',
//         titleColor: isDark ? '#ffffff' : '#1A1A1A',
//         bodyColor: textColor,
//       }
//     },
//     scales: {
//       y: {
//         ticks: { color: textColor },
//         grid: { color: 'rgba(0,0,0,0.05)' }
//       },
//       x: {
//         ticks: { color: textColor },
//         grid: { display: false }
//       }
//     }
//   };

//   const StatCard = ({ title, value, icon: Icon }) => (
//     <div className="bg-[var(--bg-card)] p-6 rounded-2xl shadow-md border border-[var(--border)]">
//       <Icon size={22} className="text-[var(--color-primary)] mb-3" />
//       <p className="text-sm text-secondary">{title}</p>
//       <h2 className="text-2xl font-bold text-main">
//         ${value || 0}
//       </h2>
//     </div>
//   );

//   return (
//     <motion.div className="max-w-[1200px] mx-auto px-4 space-y-8 text-main">

//       {/* HEADER */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold">Financial Overview</h1>
//           <p className="text-sm text-secondary">
//             Track your income and expenses
//           </p>
//         </div>

//         <div className="flex bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-1">
//           <button className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm">
//             Monthly
//           </button>
//           <button className="px-4 py-2 text-sm text-secondary">
//             Yearly
//           </button>
//         </div>
//       </div>

//       {/* CARDS */}
//       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//         <StatCard title="Total Income" value={data?.total_income} icon={TrendingUp} />
//         <StatCard title="Total Expenses" value={data?.total_expense} icon={TrendingDown} />
//         <StatCard title="Total Savings" value={data?.total_savings} icon={Wallet} />
//       </div>

//       {/* CHARTS */}
//       <div className="grid lg:grid-cols-3 gap-6">

//         {/* BAR */}
//         <div className="lg:col-span-2 bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border)] shadow-md">
//           <h3 className="font-semibold mb-4">Cash Flow</h3>
//           <div className="h-[300px]">
//             <Bar data={barData} options={chartOptions} />
//           </div>
//         </div>

//         {/* DONUT */}
//         <div className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border)] shadow-md">
//           <h3 className="font-semibold mb-4">Categories</h3>
//           <div className="h-[260px]">
//             <Doughnut data={donutData} />
//           </div>
//         </div>

//       </div>

//     </motion.div>
//   );
// };

// export default Dashboard;

import { useState, useEffect } from 'react';
import api from '../api/axios';
import { TrendingDown, Wallet, TrendingUp } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, ArcElement);

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const isDark = document.documentElement.classList.contains("dark");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('finance/dashboard/');
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  const textColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--text-secondary');

  // 🎨 COLORS
  const generateColors = (count) => {
    const colors = [
      "#22C55E", "#3B82F6", "#F59E0B",
      "#EF4444", "#8B5CF6", "#06B6D4", "#F97316"
    ];
    return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
  };

  // 📊 BAR DATA
  const incomes = data?.monthly_activity?.map(m => m.income) || [];
  const expenses = data?.monthly_activity?.map(m => m.expense) || [];

  const maxValue = Math.max(...incomes, ...expenses, 1);

  const barData = {
    labels: data?.monthly_activity?.map(m => m.month) || [],
    datasets: [
      {
        label: 'Income',
        data: incomes,
        backgroundColor: '#22C55E',
        borderRadius: 8,
        barPercentage: 0.3,         // ✅ slim bars
        categoryPercentage: 0.4,
      },
      {
        label: 'Expenses',
        data: expenses,
        backgroundColor: '#EF4444', // ✅ make visible (red)
        borderRadius: 8,
        barPercentage: 0.3,
        categoryPercentage: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: textColor }
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: $${context.raw}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: maxValue * 1.2, // ✅ fix small expense visibility
        grid: { color: 'rgba(0,0,0,0.05)' },
        ticks: {
          color: textColor,
          callback: (value) => value.toLocaleString()
        }
      },
      x: {
        grid: { display: false },
        ticks: { color: textColor }
      }
    }
  };

  // 🍩 DONUT DATA
  const donutColors = generateColors(data?.spending_by_category?.length || 1);

  const donutData = {
    labels: data?.spending_by_category?.length
      ? data.spending_by_category.map(c => c.category__name)
      : ['No Data'],
    datasets: [{
      data: data?.spending_by_category?.length
        ? data.spending_by_category.map(c => c.amount)
        : [1],
      backgroundColor: donutColors,
      borderWidth: 2,
      borderColor: isDark ? '#0F172A' : '#ffffff',
    }]
  };

  // 💳 CARD
  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border)] shadow hover:shadow-lg transition">
      <Icon size={22} className={`mb-3 ${color}`} />
      <p className="text-sm text-secondary">{title}</p>
      <h2 className="text-2xl font-bold text-main">
        ${value?.toLocaleString() || 0}
      </h2>
    </div>
  );

  return (
    <div className="max-w-[1200px] mx-auto px-4 space-y-10">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Financial Overview</h1>
          <p className="text-sm text-secondary">Track your income and expenses</p>
        </div>

        <div className="flex bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-1">
          <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm">
            Monthly
          </button>
          <button className="px-4 py-2 text-sm text-secondary">
            Yearly
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Income" value={data?.total_income} icon={TrendingUp} color="text-green-500" />
        <StatCard title="Total Expenses" value={data?.total_expense} icon={TrendingDown} color="text-red-500" />
        <StatCard title="Total Savings" value={data?.total_savings} icon={Wallet} color="text-blue-500" />
      </div>

      {/* CHARTS */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* BAR */}
        <div className="lg:col-span-2 bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border)] shadow">
          <h3 className="text-lg font-bold mb-4">Cash Flow</h3>
          <div className="h-[320px]">
            <Bar data={barData} options={chartOptions} />
          </div>
        </div>

        {/* DONUT */}
        <div className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border)] shadow">
          <h3 className="text-lg font-bold mb-6 text-center">Spending Categories</h3>

          <div className="flex flex-col items-center">

            {/* CENTERED DONUT */}
            <div className="relative w-[200px] h-[200px]">
              <Doughnut
                data={donutData}
                options={{
                  cutout: "75%",
                  plugins: { legend: { display: false } }
                }}
              />

              {/* CENTER TEXT */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-xs text-secondary">Total</p>
                <h3 className="text-lg font-bold text-main">
                  ${data?.total_expense}
                </h3>
              </div>
            </div>

            {/* LEGEND BELOW */}
            <div className="mt-6 w-full space-y-2">
              {data?.spending_by_category?.map((c, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded"
                      style={{ background: donutColors[i] }}
                    />
                    <span>{c.category__name}</span>
                  </div>
                  <span className="font-semibold">${c.amount}</span>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;