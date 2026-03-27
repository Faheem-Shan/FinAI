// import { useState, useEffect } from 'react';
// import api from '../api/axios';
// import { TrendingDown, Wallet, ArrowUpRight, TrendingUp } from 'lucide-react';
// import { motion } from 'framer-motion';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement
// } from 'chart.js';
// import { Bar, Doughnut } from 'react-chartjs-2';

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement
// );

// const containerVariants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: {
//       staggerChildren: 0.1
//     }
//   }
// };

// const itemVariants = {
//   hidden: { y: 20, opacity: 0 },
//   visible: {
//     y: 0,
//     opacity: 1,
//     transition: {
//       duration: 0.5,
//       ease: "easeOut"
//     }
//   }
// };

// const Dashboard = () => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await api.get('finance/dashboard/');
//         setData(response.data);
//       } catch (error) {
//         console.error("Error fetching dashboard data", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
//         <div className="w-10 h-10 border-[3px] border-primary/20 border-t-primary rounded-full animate-spin"></div>
//         <p className="text-sm text-text-secondary font-semibold animate-pulse tracking-tight">Syncing your wealth...</p>
//       </div>
//     );
//   }

//   const textColor = '#666666';
//   const generateColors = (count) => {
//     const colors = ["#15CC81", "#10B981", "#34D399", "#6EE7B7", "#A7F3D0", "#059669", "#047857", "#064E3B"];
//     return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
//   };

//   const barData = {
//     labels: data?.monthly_activity?.map(m => m.month) || [],
//     datasets: [
//       {
//         label: 'Income',
//         data: data?.monthly_activity?.map(m => m.income) || [],
//         backgroundColor: '#15CC81',
//         borderRadius: 6,
//         hoverBackgroundColor: '#12b371',
//       },
//       {
//         label: 'Expenses',
//         data: data?.monthly_activity?.map(m => m.expense) || [],
//         backgroundColor: '#E5E7EB',
//         borderRadius: 6,
//         hoverBackgroundColor: '#D1D5DB',
//       },
//     ],
//   };

//   const donutData = {
//     labels: data?.spending_by_category?.length
//       ? data.spending_by_category.map(c => c.category__name)
//       : ['No Data'],
//     datasets: [{
//       data: data?.spending_by_category?.length
//         ? data.spending_by_category.map(c => c.amount)
//         : [1],
//       backgroundColor: generateColors(data?.spending_by_category?.length || 1),
//       borderWidth: 2,
//       borderColor: '#ffffff',
//     }]
//   };

//   const chartOptions = {
//     maintainAspectRatio: false,
//     responsive: true,
//     plugins: {
//       legend: { display: false },
//       tooltip: {
//         backgroundColor: '#FFFFFF',
//         titleColor: '#1A1A1A',
//         bodyColor: '#666666',
//         borderColor: '#E5E7EB',
//         borderWidth: 1,
//         padding: 10,
//         usePointStyle: true,
//       }
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         grid: { color: 'rgba(0,0,0,0.02)', drawBorder: false },
//         ticks: { color: textColor, font: { family: 'Inter', size: 11 } }
//       },
//       x: {
//         grid: { display: false },
//         ticks: { color: textColor, font: { family: 'Inter', size: 11 } }
//       }
//     }
//   };

//   const StatCard = ({ title, value, icon: Icon, trend, colorClass, bgClass }) => (
//     <motion.div 
//       variants={itemVariants}
//       className="bg-white p-5 rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300 group cursor-default"
//     >
//       <div className="flex items-start justify-between mb-4">
//         <div className={`p-2.5 rounded-xl ${bgClass} ${colorClass} group-hover:scale-110 transition-transform duration-300`}>
//           <Icon size={20} />
//         </div>
//         {trend && (
//           <div className={`text-[10px] font-black px-2 py-0.5 rounded-full ${trend.includes('+') ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'}`}>
//             {trend}
//           </div>
//         )}
//       </div>
//       <p className="text-[11px] font-black text-text-secondary uppercase tracking-widest">{title}</p>
//       <h2 className="text-2xl font-black text-text-main mt-0.5">${value?.toLocaleString()}</h2>
//     </motion.div>
//   );

//   return (
//     <motion.div 
//       initial="hidden"
//       animate="visible"
//       variants={containerVariants}
//       className="space-y-6 max-w-7xl mx-auto"
//     >
//       {/* Welcome Section */}
//       <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div>
//           <h1 className="font-outfit text-2xl font-bold text-text-main tracking-tight italic">Financial Overview</h1>
//           <p className="text-xs text-text-secondary font-medium mt-0.5">Real-time data synchronization active.</p>
//         </div>
//         <div className="flex bg-white p-1 rounded-xl border border-gray-100 shadow-sm self-start">
//            <button className="px-3 py-1.5 bg-primary text-white text-[11px] font-black rounded-lg shadow-lg shadow-primary/20">MONTHLY</button>
//            <button className="px-3 py-1.5 text-text-secondary text-[11px] font-black hover:text-primary transition-colors">YEARLY</button>
//         </div>
//       </motion.div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         <StatCard 
//           title="Total Income" 
//           value={data?.total_income} 
//           icon={TrendingUp} 
//           trend="+12.5%" 
//           colorClass="text-emerald-500" 
//           bgClass="bg-emerald-50"
//         />
//         <StatCard 
//           title="Total Expenses" 
//           value={data?.total_expense} 
//           icon={TrendingDown} 
//           trend="+4.2%" 
//           colorClass="text-red-500" 
//           bgClass="bg-red-50"
//         />
//         <StatCard 
//           title="Total Savings" 
//           value={data?.total_savings} 
//           icon={Wallet} 
//           trend={`${Math.round((data?.total_savings / (data?.total_income || 1)) * 100)}% saved`} 
//           colorClass="text-primary" 
//           bgClass="bg-primary/10"
//         />
//       </div>

//       {/* Charts Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <motion.div variants={itemVariants} className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-md">
//           <div className="flex items-center justify-between mb-6">
//             <h3 className="text-lg font-bold text-text-main">Cash Flow Activity</h3>
//             <div className="flex items-center gap-4">
//               <div className="flex items-center gap-1.5">
//                 <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
//                 <span className="text-[10px] font-black text-text-secondary uppercase">Income</span>
//               </div>
//               <div className="flex items-center gap-1.5">
//                 <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
//                 <span className="text-[10px] font-black text-text-secondary uppercase">Expenses</span>
//               </div>
//             </div>
//           </div>
//           <div className="h-[280px]">
//             <Bar data={barData} options={chartOptions} />
//           </div>
//         </motion.div>

//         <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-md">
//           <h3 className="text-lg font-bold text-text-main mb-6">Spending Categories</h3>
//           <div className="h-[240px] relative">
//             <Doughnut
//               data={donutData}
//               options={{
//                 maintainAspectRatio: false,
//                 cutout: '78%', 
//                 plugins: {
//                   legend: {
//                     position: 'bottom',
//                     labels: {
//                       usePointStyle: true,
//                       padding: 14,
//                       font: { family: 'Inter', size: 10, weight: 'bold' },
//                       color: textColor
//                     }
//                   }
//                 }
//               }}
//             />
//             <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
//                <p className="text-[9px] uppercase tracking-widest font-black text-text-secondary">Top Need</p>
//                <p className="text-lg font-black text-primary">Housing</p>
//             </div>
//           </div>
          
//           <div className="mt-4 space-y-2">
//              {data?.spending_by_category?.slice(0, 3).map((item, i) => (
//                 <div key={i} className="flex items-center justify-between p-2.5 bg-gray-50/50 rounded-xl border border-gray-100/50">
//                    <span className="text-[12px] font-bold text-text-main">{item.category__name}</span>
//                    <span className="text-[12px] font-black text-text-secondary line-through opacity-30 group-hover:no-underline transition-all"></span>
//                    <span className="text-[12px] font-black text-text-secondary">${item.amount.toLocaleString()}</span>
//                 </div>
//              ))}
//           </div>
//         </motion.div>
//       </div>
//     </motion.div>
//   );
// };

// export default Dashboard;


import { useState, useEffect } from 'react';
import api from '../api/axios';
import { TrendingDown, Wallet, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
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
        <div className="w-10 h-10 border-4 border-[var(--color-primary)]/20 border-t-[var(--color-primary)] rounded-full animate-spin"></div>
      </div>
    );
  }

  // 🎨 COLORS FROM CSS VARIABLES
  const textColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--text-secondary');

  const generateColors = (count) => {
    const colors = [
      "#15CC81", "#3B82F6", "#F59E0B",
      "#EF4444", "#8B5CF6", "#06B6D4", "#F97316"
    ];
    return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
  };

  // 📊 BAR DATA
  const barData = {
    labels: data?.monthly_activity?.map(m => m.month) || [],
    datasets: [
      {
        label: 'Income',
        data: data?.monthly_activity?.map(m => m.income) || [],
        backgroundColor: '#15CC81',
        borderRadius: 6,
      },
      {
        label: 'Expenses',
        data: data?.monthly_activity?.map(m => m.expense) || [],
        backgroundColor: '#E5E7EB',
        borderRadius: 6,
      },
    ],
  };

  // 🍩 DONUT DATA
  const donutData = {
    labels: data?.spending_by_category?.length
      ? data.spending_by_category.map(c => c.category__name)
      : ['No Data'],
    datasets: [{
      data: data?.spending_by_category?.length
        ? data.spending_by_category.map(c => c.amount)
        : [1],
      backgroundColor: generateColors(data?.spending_by_category?.length || 1),
      borderColor: isDark ? '#0F172A' : '#ffffff',
      borderWidth: 2,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: isDark ? '#1F2937' : '#ffffff',
        titleColor: isDark ? '#ffffff' : '#1A1A1A',
        bodyColor: textColor,
      }
    },
    scales: {
      y: {
        ticks: { color: textColor },
        grid: { color: 'rgba(0,0,0,0.05)' }
      },
      x: {
        ticks: { color: textColor },
        grid: { display: false }
      }
    }
  };

  const StatCard = ({ title, value, icon: Icon }) => (
    <div className="bg-[var(--bg-card)] p-6 rounded-2xl shadow-md border border-[var(--border)]">
      <Icon size={22} className="text-[var(--color-primary)] mb-3" />
      <p className="text-sm text-secondary">{title}</p>
      <h2 className="text-2xl font-bold text-main">
        ${value || 0}
      </h2>
    </div>
  );

  return (
    <motion.div className="max-w-[1200px] mx-auto px-4 space-y-8 text-main">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Financial Overview</h1>
          <p className="text-sm text-secondary">
            Track your income and expenses
          </p>
        </div>

        <div className="flex bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-1">
          <button className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm">
            Monthly
          </button>
          <button className="px-4 py-2 text-sm text-secondary">
            Yearly
          </button>
        </div>
      </div>

      {/* CARDS */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Income" value={data?.total_income} icon={TrendingUp} />
        <StatCard title="Total Expenses" value={data?.total_expense} icon={TrendingDown} />
        <StatCard title="Total Savings" value={data?.total_savings} icon={Wallet} />
      </div>

      {/* CHARTS */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* BAR */}
        <div className="lg:col-span-2 bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border)] shadow-md">
          <h3 className="font-semibold mb-4">Cash Flow</h3>
          <div className="h-[300px]">
            <Bar data={barData} options={chartOptions} />
          </div>
        </div>

        {/* DONUT */}
        <div className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border)] shadow-md">
          <h3 className="font-semibold mb-4">Categories</h3>
          <div className="h-[260px]">
            <Doughnut data={donutData} />
          </div>
        </div>

      </div>

    </motion.div>
  );
};

export default Dashboard;