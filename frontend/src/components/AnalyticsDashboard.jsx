import { useState, useEffect } from 'react';
import { getHistory } from '../lib/api';
import { Loader2, Activity, Database, TrendingUp, ShieldAlert, BarChart3 } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';

export default function AnalyticsDashboard() {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getHistory().then(data => {
      setHistory(data);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[500px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  // Calculate Metrics
  const totalQueries = history.length;
  
  const dbCounts = history.reduce((acc, curr) => {
    acc[curr.db_type] = (acc[curr.db_type] || 0) + 1;
    return acc;
  }, {});
  const mostUsedDb = Object.keys(dbCounts).sort((a,b) => dbCounts[b] - dbCounts[a])[0] || 'N/A';

  const avgComplexity = Math.round(history.reduce((acc, curr) => acc + (curr.complexity_score || 50), 0) / (totalQueries || 1));

  // Risk Distribution Data
  const riskCounts = history.reduce((acc, curr) => {
    const risk = curr.query_risk_level || 'Medium';
    acc[risk] = (acc[risk] || 0) + 1;
    return acc;
  }, {});
  
  const riskData = Object.keys(riskCounts).map(key => ({
    name: key,
    value: riskCounts[key]
  }));

  const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'];

  // Activity Timeline Data (Simulated for this week based on history dates)
  const activityData = history.slice(0, 10).reverse().map((item, i) => ({
    name: `Q${i+1}`,
    complexity: item.complexity_score || 50
  }));

  return (
    <div className="space-y-6">
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#0f111a] border border-gray-800 rounded-2xl p-5 shadow-xl flex items-center justify-between group">
          <div>
            <p className="text-gray-500 font-bold text-xs uppercase tracking-wider mb-1">Total Optimized</p>
            <h4 className="text-3xl font-black text-white">{totalQueries}</h4>
          </div>
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl group-hover:scale-110 transition-transform"><Activity className="w-6 h-6"/></div>
        </div>
        
        <div className="bg-[#0f111a] border border-gray-800 rounded-2xl p-5 shadow-xl flex items-center justify-between group">
          <div>
            <p className="text-gray-500 font-bold text-xs uppercase tracking-wider mb-1">Top Database</p>
            <h4 className="text-xl font-bold text-white mt-1">{mostUsedDb}</h4>
          </div>
          <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl group-hover:scale-110 transition-transform"><Database className="w-6 h-6"/></div>
        </div>

        <div className="bg-[#0f111a] border border-gray-800 rounded-2xl p-5 shadow-xl flex items-center justify-between group">
          <div>
            <p className="text-gray-500 font-bold text-xs uppercase tracking-wider mb-1">Avg Complexity</p>
            <div className="flex items-end gap-1 mt-1">
              <h4 className="text-3xl font-black text-white">{avgComplexity}</h4>
              <span className="text-sm font-bold text-gray-500 mb-1">/100</span>
            </div>
          </div>
          <div className="p-3 bg-yellow-500/10 text-yellow-400 rounded-xl group-hover:scale-110 transition-transform"><TrendingUp className="w-6 h-6"/></div>
        </div>

        <div className="bg-[#0f111a] border border-gray-800 rounded-2xl p-5 shadow-xl flex items-center justify-between group">
          <div>
            <p className="text-gray-500 font-bold text-xs uppercase tracking-wider mb-1">High Risk Detected</p>
            <h4 className="text-3xl font-black text-red-400">{riskCounts['Critical'] || 0}</h4>
          </div>
          <div className="p-3 bg-red-500/10 text-red-400 rounded-xl group-hover:scale-110 transition-transform"><ShieldAlert className="w-6 h-6"/></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Line Chart */}
        <div className="bg-[#0f111a] border border-gray-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-white font-bold mb-6 flex items-center gap-2"><BarChart3 className="w-5 h-5 text-blue-400"/> Recent Query Complexity</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="name" stroke="#6b7280" tick={{fill: '#6b7280', fontSize: 12}} />
                <YAxis stroke="#6b7280" tick={{fill: '#6b7280', fontSize: 12}} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px' }}
                  itemStyle={{ color: '#60a5fa', fontWeight: 'bold' }}
                />
                <Line type="monotone" dataKey="complexity" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#111827' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-[#0f111a] border border-gray-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-white font-bold mb-6 flex items-center gap-2"><ShieldAlert className="w-5 h-5 text-orange-400"/> Risk Distribution</h3>
          <div className="h-[300px] w-full flex items-center justify-center relative">
            {history.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {riskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 font-medium text-sm">Not enough data to calculate risk.</p>
            )}
            
            {history.length > 0 && (
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                 <span className="block text-3xl font-black text-white">{totalQueries}</span>
                 <span className="block text-[10px] uppercase font-bold text-gray-500">Queries</span>
               </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
