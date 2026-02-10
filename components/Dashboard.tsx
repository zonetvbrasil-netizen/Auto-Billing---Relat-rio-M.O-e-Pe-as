
import React, { useMemo } from 'react';
import { BillingRecord } from '../types';
import { formatCurrency } from '../utils';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, PieChart, Pie, Legend
} from 'recharts';
import { TrendingUp, ShieldCheck, Landmark, Package, Calendar } from 'lucide-react';

interface DashboardProps {
  records: BillingRecord[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const Dashboard: React.FC<DashboardProps> = ({ records }) => {
  const stats = useMemo(() => {
    return records.reduce((acc, curr) => ({
      total: acc.total + curr.totalValue,
      laborIns: acc.laborIns + curr.laborInsuranceValue,
      laborDeal: acc.laborDeal + curr.laborDealershipValue,
      parts: acc.parts + curr.partsValue,
    }), { total: 0, laborIns: 0, laborDeal: 0, parts: 0 });
  }, [records]);

  const monthlyData = useMemo(() => {
    const groups: Record<string, { month: string, label: string, seguradora: number, concessionaria: number }> = {};
    records.forEach(r => {
      const date = new Date(r.date + 'T00:00:00');
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!groups[monthKey]) {
        groups[monthKey] = { 
          month: monthKey, 
          label: date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
          seguradora: 0,
          concessionaria: 0
        };
      }
      groups[monthKey].seguradora += r.laborInsuranceValue;
      groups[monthKey].concessionaria += r.laborDealershipValue;
    });

    return Object.values(groups).sort((a, b) => a.month.localeCompare(b.month));
  }, [records]);

  return (
    <div className="space-y-8 pb-12">
      <header>
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Análise de Faturamento</h2>
        <p className="text-slate-500">Relatórios detalhados por tipo de serviço</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Geral', value: stats.total, icon: TrendingUp, color: 'blue' },
          { label: 'M.O. Seguradora', value: stats.laborIns, icon: ShieldCheck, color: 'emerald' },
          { label: 'M.O. Conc.', value: stats.laborDeal, icon: Landmark, color: 'purple' },
          { label: 'Peças', value: stats.parts, icon: Package, color: 'amber' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 bg-${stat.color}-50 text-${stat.color}-600`}>
              <stat.icon size={20} />
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
            <h3 className="text-xl font-bold text-slate-800 mt-1">{formatCurrency(stat.value)}</h3>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="text-blue-600" size={20} />
          <h3 className="text-lg font-bold text-slate-800">Evolução Mão de Obra (Seguradora vs Conc.)</h3>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => `R$ ${val/1000}k`} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
              <Legend verticalAlign="top" align="right" />
              <Bar name="M.O. Seguradora" dataKey="seguradora" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar name="M.O. Concessionária" dataKey="concessionaria" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
