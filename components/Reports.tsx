
import React, { useMemo } from 'react';
import { BillingRecord } from '../types';
import { formatCurrency } from '../utils';
import { FileText, Printer, Shield, Landmark, Package } from 'lucide-react';

interface ReportsProps {
  records: BillingRecord[];
}

const Reports: React.FC<ReportsProps> = ({ records }) => {
  const reportData = useMemo(() => {
    const insurers: Record<string, {
      name: string;
      laborIns: number;
      laborDeal: number;
      parts: number;
      total: number;
      count: number;
    }> = {};

    records.forEach(r => {
      if (!insurers[r.insurance]) {
        insurers[r.insurance] = {
          name: r.insurance,
          laborIns: 0,
          laborDeal: 0,
          parts: 0,
          total: 0,
          count: 0
        };
      }
      const data = insurers[r.insurance];
      data.laborIns += r.laborInsuranceValue;
      data.laborDeal += r.laborDealershipValue;
      data.parts += r.partsValue;
      data.total += r.totalValue;
      data.count += 1;
    });

    return Object.values(insurers).sort((a, b) => b.total - a.total);
  }, [records]);

  const grandTotal = useMemo(() => {
    return reportData.reduce((acc, curr) => ({
      laborIns: acc.laborIns + curr.laborIns,
      laborDeal: acc.laborDeal + curr.laborDeal,
      parts: acc.parts + curr.parts,
      total: acc.total + curr.total,
    }), { laborIns: 0, laborDeal: 0, parts: 0, total: 0 });
  }, [reportData]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 print:p-0">
      <header className="flex justify-between items-center print:hidden">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Relatórios Consolidados</h2>
          <p className="text-slate-500">Resumo de faturamento agrupado por seguradora</p>
        </div>
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm font-medium"
        >
          <Printer size={18} />
          Imprimir Relatório
        </button>
      </header>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase">Seguradora</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase text-center">Qtd. O.S</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase text-right">M.O. Seguradora</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase text-right">M.O. Conc.</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase text-right">Peças</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase text-right">Total Acumulado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {reportData.map((item) => (
              <tr key={item.name} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-700">{item.name}</td>
                <td className="px-6 py-4 text-center text-slate-500 font-medium">{item.count}</td>
                <td className="px-6 py-4 text-right text-emerald-600 font-medium">{formatCurrency(item.laborIns)}</td>
                <td className="px-6 py-4 text-right text-purple-600 font-medium">{formatCurrency(item.laborDeal)}</td>
                <td className="px-6 py-4 text-right text-slate-600">{formatCurrency(item.parts)}</td>
                <td className="px-6 py-4 text-right font-bold text-slate-900">{formatCurrency(item.total)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-slate-900 text-white">
            <tr>
              <td className="px-6 py-4 font-bold uppercase text-xs">Total Geral</td>
              <td className="px-6 py-4 text-center font-bold">{records.length}</td>
              <td className="px-6 py-4 text-right font-bold">{formatCurrency(grandTotal.laborIns)}</td>
              <td className="px-6 py-4 text-right font-bold">{formatCurrency(grandTotal.laborDeal)}</td>
              <td className="px-6 py-4 text-right font-bold">{formatCurrency(grandTotal.parts)}</td>
              <td className="px-6 py-4 text-right font-bold text-lg text-blue-400">{formatCurrency(grandTotal.total)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 print:hidden">
        <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
          <div className="flex items-center gap-3 text-emerald-700 mb-2">
            <Shield size={20} />
            <h4 className="font-bold">Participação Seguradora</h4>
          </div>
          <p className="text-2xl font-black text-emerald-800">
            {grandTotal.total > 0 ? ((grandTotal.laborIns / grandTotal.total) * 100).toFixed(1) : 0}%
          </p>
          <p className="text-emerald-600 text-sm">Do faturamento total em M.O.</p>
        </div>

        <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100">
          <div className="flex items-center gap-3 text-purple-700 mb-2">
            <Landmark size={20} />
            <h4 className="font-bold">Participação Concessionária</h4>
          </div>
          <p className="text-2xl font-black text-purple-800">
            {grandTotal.total > 0 ? ((grandTotal.laborDeal / grandTotal.total) * 100).toFixed(1) : 0}%
          </p>
          <p className="text-purple-600 text-sm">Do faturamento total em M.O.</p>
        </div>

        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-3 text-slate-700 mb-2">
            <Package size={20} />
            <h4 className="font-bold">Peso de Peças</h4>
          </div>
          <p className="text-2xl font-black text-slate-800">
            {grandTotal.total > 0 ? ((grandTotal.parts / grandTotal.total) * 100).toFixed(1) : 0}%
          </p>
          <p className="text-slate-500 text-sm">Representatividade no faturamento</p>
        </div>
      </div>
    </div>
  );
};

export default Reports;
