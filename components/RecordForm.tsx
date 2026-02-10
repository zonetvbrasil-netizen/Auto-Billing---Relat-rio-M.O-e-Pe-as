
import React, { useState, useEffect } from 'react';
import { Plus, X, Save } from 'lucide-react';
import { BillingRecord } from '../types';
import { generateId } from '../utils';
import { INSURERS, BRANDS } from '../constants';

interface RecordFormProps {
  onAdd: (record: BillingRecord) => void;
  onEdit: (record: BillingRecord) => void;
  isOpen: boolean;
  onClose: () => void;
  recordToEdit: BillingRecord | null;
}

const RecordForm: React.FC<RecordFormProps> = ({ onAdd, onEdit, isOpen, onClose, recordToEdit }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    insurance: '',
    brand: '',
    model: '',
    plate: '',
    laborInsuranceValue: 0,
    laborDealershipValue: 0,
    partsValue: 0,
  });

  useEffect(() => {
    if (recordToEdit) {
      setFormData({
        date: recordToEdit.date,
        insurance: recordToEdit.insurance,
        brand: recordToEdit.brand,
        model: recordToEdit.model,
        plate: recordToEdit.plate,
        laborInsuranceValue: recordToEdit.laborInsuranceValue,
        laborDealershipValue: recordToEdit.laborDealershipValue,
        partsValue: recordToEdit.partsValue,
      });
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        insurance: '',
        brand: '',
        model: '',
        plate: '',
        laborInsuranceValue: 0,
        laborDealershipValue: 0,
        partsValue: 0,
      });
    }
  }, [recordToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const total = Number(formData.laborInsuranceValue) + 
                  Number(formData.laborDealershipValue) + 
                  Number(formData.partsValue);
    
    const recordData: BillingRecord = {
      ...formData,
      id: recordToEdit ? recordToEdit.id : generateId(),
      laborInsuranceValue: Number(formData.laborInsuranceValue),
      laborDealershipValue: Number(formData.laborDealershipValue),
      partsValue: Number(formData.partsValue),
      totalValue: total
    };

    if (recordToEdit) {
      onEdit(recordData);
    } else {
      onAdd(recordData);
    }

    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">
            {recordToEdit ? 'Editar Lançamento' : 'Novo Lançamento'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Data</label>
              <input type="date" name="date" required value={formData.date} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Seguradora</label>
              <select name="insurance" required value={formData.insurance} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="">Selecione...</option>
                {INSURERS.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Marca</label>
              <select name="brand" required value={formData.brand} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="">Selecione...</option>
                {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Modelo</label>
              <input type="text" name="model" required value={formData.model} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1">Placa</label>
              <input type="text" name="plate" required value={formData.plate} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none uppercase" />
            </div>
            
            <div className="bg-slate-50 p-4 rounded-xl space-y-4 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase">M.O. Seguradora</label>
                <input type="number" step="0.01" name="laborInsuranceValue" value={formData.laborInsuranceValue} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase">M.O. Concessionária</label>
                <input type="number" step="0.01" name="laborDealershipValue" value={formData.laborDealershipValue} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase">Valor Peças</label>
                <input type="number" step="0.01" name="partsValue" value={formData.partsValue} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="flex items-end">
                <div className="w-full bg-blue-600 p-2 rounded-lg text-center shadow-inner">
                  <p className="text-[10px] text-blue-100 font-bold uppercase">Total Geral</p>
                  <p className="text-lg font-bold text-white">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                      Number(formData.laborInsuranceValue) + Number(formData.laborDealershipValue) + Number(formData.partsValue)
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-50">
            <button type="button" onClick={onClose} className="px-6 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-xl transition-colors">Cancelar</button>
            <button type="submit" className="px-8 py-2 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2">
              {recordToEdit ? <Save size={18} /> : <Plus size={18} />}
              {recordToEdit ? 'Atualizar Faturamento' : 'Salvar Faturamento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecordForm;
