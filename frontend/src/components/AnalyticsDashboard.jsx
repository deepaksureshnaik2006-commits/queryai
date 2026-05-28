import { useState, useEffect } from 'react';
import { getHistory } from '../lib/api';
import { Loader2, Activity, Database, TrendingUp, ShieldAlert, BarChart3, Zap } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'];

export default function AnalyticsDashboard() {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getHistory()
      .then(data => { setHistory(Array.isArray(data) ? data : []); })
      .catch(() => { setHistory([]); })
      .finally(() => { setIsLoading(false); });
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[500px]">
        <Loader2 className="w-7 h-7 animate-spin text-blue-500" />
      </div>
    );
  }

  const totalQueries = history.length;

  const dbCounts = history.reduce((acc, curr) => {
    acc[curr.db_type] = (acc[curr.db_type] || 0) + 1;
    return acc;
  }, {});
  const mostUsedDb = Object.keys(dbCounts).sort((a, b) => dbCounts[b] - dbCounts[a])[0] || 'N/A';

  const avgComplexity = Math.round(
    history.reduce((acc, curr) => acc + (curr.complexity_score || 50), 0) / (totalQueries || 1)
  );

  const riskCounts = history.reduce((acc, curr) => {
    const risk = curr.query_risk_level || 'Medium';
    acc[risk] = (acc[risk] || 0) + 1;
    return acc;
  }, {});

  const riskData = Object.keys(riskCounts).map(key => ({ name: key, value: riskCounts[key] }));

  const activityData = history.slice(0, 10).reverse().map((item, i) => ({
    name: `Q${i + 1}`,
    complexity: item.complexity_score || 50,
  }));

  const KPI = [
    { label: 'Total Optimized', value: totalQueries, icon: Activity, color: 'blue', sub: 'queries analyzed' },
    { label: 'Top Database', value: mostUsedDb, icon: Database, color: 'purple', sub: 'most used engine' },
    { label: 'Avg Complexity', value: `${avgComplexity}/100`, icon: TrendingUp, color: 'yellow', sub: 'complexity score' },
    { label: 'Critical Risks', value: (riskCounts['Critical'] || 0) + (riskCounts['High'] || 0), icon: ShieldAlert, color: 'red', sub: 'flagged queries' },
  ];

  const colorMap = {
    blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    yellow: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
    red: 'bg-red-500/10 border-red-500/20 text-red-400',
  };

  const tooltipStyle = {
    contentStyle: { backgroundColor: '#0a0d14', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '12px', fontSize: '12px' },
    itemStyle: { color: '#60a5fa', fontWeight: 600 },
  };

  return (
    <div className="space-y-5">

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {KPI.map(({ label, value, icon: Icon, color, sub }) => (
          <div key={label} className="bg-[#0a0d14] border border-white/6 rounded-2xl p-5 flex items-start justify-between group hover:border-white/12 transition-all duration-200">
            <div>
              <p className="text-slate-500 font-semibold text-xs uppercase tracking-wider mb-2">{label}</p>
              <h4 className="text-2xl font-black text-white leading-none">{value}</h4>
              <p className="text-xs text-slate-600 mt-1.5">{sub}</p>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 group-hover:scale-105 transition-transform ${colorMap[color]}`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Line Chart */}
        <div className="bg-[#0a0d14] border border-white/6 rounded-2xl p-6">
          <h3 className="text-white font-bold mb-1 text-sm flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-500/15 flex items-center justify-center">
              <BarChart3 className="w-3.5 h-3.5 text-blue-400" />
            </div>
            Recent Query Complexity
          </h3>
          <p className="text-xs text-slate-600 mb-6 ml-8">Complexity score per query over time</p>
          {activityData.length > 0 ? (
            <div className="h-[280px]" style={{ minWidth: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.1)" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.1)" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <RechartsTooltip {...tooltipStyle} />
                  <Line
                    type="monotone"
                    dataKey="complexity"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#0a0d14' }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[280px] flex items-center justify-center border border-dashed border-white/6 rounded-xl">
              <p className="text-slate-600 text-sm">No data yet — run some queries first.</p>
            </div>
          )}
        </div>

        {/* Pie Chart */}
        <div className="bg-[#0a0d14] border border-white/6 rounded-2xl p-6">
          <h3 className="text-white font-bold mb-1 text-sm flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-orange-500/15 flex items-center justify-center">
              <ShieldAlert className="w-3.5 h-3.5 text-orange-400" />
            </div>
            Risk Distribution
          </h3>
          <p className="text-xs text-slate-600 mb-6 ml-8">Breakdown of risk levels detected</p>
          {history.length > 0 ? (
            <div className="h-[280px] relative" style={{ minWidth: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskData}
                    cx="50%"
                    cy="50%"
                    innerRadius={75}
                    outerRadius={105}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {riskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: '#0a0d14', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '12px', fontSize: '12px' }}
                    itemStyle={{ color: '#e2e8f0', fontWeight: 600 }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <span className="block text-3xl font-black text-white">{totalQueries}</span>
                <span className="block text-[10px] uppercase font-bold text-slate-600 tracking-wider">Queries</span>
              </div>
            </div>
          ) : (
            <div className="h-[280px] flex items-center justify-center border border-dashed border-white/6 rounded-xl">
              <p className="text-slate-600 text-sm">No data yet — run some queries first.</p>
            </div>
          )}

          {/* Legend */}
          {riskData.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-white/5">
              {riskData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-1.5 text-xs text-slate-400">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: COLORS[index % COLORS.length] }} />
                  {entry.name} ({entry.value})
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* DB usage bar chart */}
      {Object.keys(dbCounts).length > 0 && (
        <div className="bg-[#0a0d14] border border-white/6 rounded-2xl p-6">
          <h3 className="text-white font-bold mb-1 text-sm flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-purple-500/15 flex items-center justify-center">
              <Database className="w-3.5 h-3.5 text-purple-400" />
            </div>
            Database Usage
          </h3>
          <p className="text-xs text-slate-600 mb-6 ml-8">Queries run per database engine</p>
          <div className="h-[200px]" style={{ minWidth: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={Object.entries(dbCounts).map(([name, count]) => ({ name, count }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.1)" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.1)" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
                <RechartsTooltip {...tooltipStyle} />
                <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
