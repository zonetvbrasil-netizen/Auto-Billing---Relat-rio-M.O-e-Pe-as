
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import RecordsTable from './components/RecordsTable';
import AIInsights from './components/AIInsights';
import RecordForm from './components/RecordForm';
import Reports from './components/Reports';
import { ViewType, BillingRecord } from './types';
import { Plus } from 'lucide-react';

const INITIAL_DATA: BillingRecord[] = [
  {
    id: '1',
    date: '2024-05-10',
    insurance: 'Porto Seguro',
    brand: 'Volkswagen',
    model: 'Golf',
    plate: 'GOL-2024',
    laborInsuranceValue: 1200,
    laborDealershipValue: 300,
    partsValue: 2500,
    totalValue: 4000
  },
  {
    id: '2',
    date: '2024-05-12',
    insurance: 'Bradesco',
    brand: 'Toyota',
    model: 'Corolla',
    plate: 'COR-1234',
    laborInsuranceValue: 1500,
    laborDealershipValue: 0,
    partsValue: 3200,
    totalValue: 4700
  },
  {
    id: '3',
    date: '2024-06-15',
    insurance: 'Particular',
    brand: 'Chevrolet',
    model: 'Onix',
    plate: 'ONX-9988',
    laborInsuranceValue: 0,
    laborDealershipValue: 800,
    partsValue: 400,
    totalValue: 1200
  }
];

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>('dashboard');
  const [records, setRecords] = useState<BillingRecord[]>(() => {
    const saved = localStorage.getItem('autobilling_records_v4');
    try {
      return saved ? JSON.parse(saved) : INITIAL_DATA;
    } catch (e) {
      return INITIAL_DATA;
    }
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<BillingRecord | null>(null);

  useEffect(() => {
    localStorage.setItem('autobilling_records_v4', JSON.stringify(records));
  }, [records]);

  const handleAddRecord = (record: BillingRecord) => {
    setRecords(prev => [record, ...prev]);
    setView('records');
  };

  const handleEditRecord = (record: BillingRecord) => {
    setRecords(prev => prev.map(r => r.id === record.id ? record : r));
    setEditingRecord(null);
  };

  const handleDeleteRecord = (id: string) => {
    const confirmDelete = window.confirm('TEM CERTEZA? Esta ação irá remover permanentemente o registro de faturamento selecionado.');
    if (confirmDelete) {
      // Usando atualização funcional para garantir o estado mais recente
      setRecords(currentRecords => {
        const filtered = currentRecords.filter(r => r.id !== id);
        return [...filtered];
      });
      // Se estiver editando o que foi excluído, fecha o form
      if (editingRecord?.id === id) {
        setEditingRecord(null);
        setIsFormOpen(false);
      }
    }
  };

  const openAddForm = () => {
    setEditingRecord(null);
    setIsFormOpen(true);
  };

  const openEditForm = (record: BillingRecord) => {
    setEditingRecord(record);
    setIsFormOpen(true);
  };

  const renderContent = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard records={records} />;
      case 'records':
        return <RecordsTable records={records} onDelete={handleDeleteRecord} onEdit={openEditForm} />;
      case 'reports':
        return <Reports records={records} />;
      case 'ai-insights':
        return <AIInsights records={records} />;
      default:
        return <Dashboard records={records} />;
    }
  };

  return (
    <Layout activeView={view} setView={setView}>
      {renderContent()}

      <button 
        onClick={openAddForm}
        className="fixed bottom-8 right-8 w-16 h-16 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-400/50 flex items-center justify-center hover:bg-blue-700 hover:scale-105 transition-all z-40 group"
      >
        <Plus size={32} className="group-hover:rotate-90 transition-transform duration-300" />
      </button>

      <RecordForm 
        isOpen={isFormOpen} 
        onClose={() => {
          setIsFormOpen(false);
          setEditingRecord(null);
        }} 
        onAdd={handleAddRecord}
        onEdit={handleEditRecord}
        recordToEdit={editingRecord}
      />
    </Layout>
  );
};

export default App;
