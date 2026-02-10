
import React, { useState } from 'react';
import { BillingRecord } from '../types';
import { formatCurrency, formatDate } from '../utils';
import { Search, Trash2, Shield, Landmark, Edit3, CarFront } from 'lucide-react';

interface RecordsTableProps {
  records: BillingRecord[];
  onDelete: (id: string) => void;
  onEdit: (record: BillingRecord) => void;
}

const RecordsTable: React.FC<RecordsTableProps> = ({ records, onDelete, onEdit }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecords = records.filter(r => 
    r.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.insurance.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Lançamentos</h2>
          <p className="text-slate-500 text-sm">Gerenciamento completo e edição de faturamentos</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por placa, modelo ou seguradora..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
          />
        </div>
      </header>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase">Data / Veículo</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase">Seguradora</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase">
                  <div className="flex items-center gap-1"><Shield size={12}/> Seguradora</div>
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase">
                  <div className="flex items-center gap-1"><Landmark size={12}/> Conc.</div>
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase">Peças</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase">Total</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredRecords.length > 0 ? filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                        <CarFront size={16} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-800">{record.model}</div>
                        <div className="text-[11px] text-slate-400 uppercase font-medium">{formatDate(record.date)} • {record.plate}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full border border-blue-100">
                      {record.insurance}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold text-emerald-600">
                    {formatCurrency(record.laborInsuranceValue)}
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold text-purple-600">
                    {formatCurrency(record.laborDealershipValue)}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-600">
                    {formatCurrency(record.partsValue)}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">
                    {formatCurrency(record.totalValue)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        type="button"
                        onClick={() => onEdit(record)}
                        className="p-2 text-blue-500 hover:bg-blue-100 rounded-lg transition-all"
                        title="Editar"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button 
                        type="button"
                        onClick={() => onDelete(record.id)}
                        className="p-2 text-red-400 hover:bg-red-100 hover:text-red-600 rounded-lg transition-all"
                        title="Excluir"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-400 italic">Nenhum faturamento encontrado.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RecordsTable;
