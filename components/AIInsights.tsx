
import React, { useState } from 'react';
import { BrainCircuit, Sparkles, Loader2 } from 'lucide-react';
import { BillingRecord } from '../types';
import { analyzeData } from '../services/geminiService';

interface AIInsightsProps {
  records: BillingRecord[];
}

const AIInsights: React.FC<AIInsightsProps> = ({ records }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (records.length === 0) return;
    setLoading(true);
    const result = await analyzeData(records);
    setAnalysis(result || null);
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Análise Inteligente</h2>
          <p className="text-slate-500">Insights gerados por inteligência artificial baseados em seus dados</p>
        </div>
        <button
          onClick={handleAnalyze}
          disabled={loading || records.length === 0}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
          {loading ? 'Analisando...' : 'Gerar Nova Análise'}
        </button>
      </header>

      {records.length === 0 && (
        <div className="bg-amber-50 border border-amber-100 p-8 rounded-2xl text-center text-amber-800">
          <BrainCircuit className="mx-auto mb-4 opacity-50" size={48} />
          <h3 className="text-lg font-bold">Sem dados suficientes</h3>
          <p>Adicione alguns lançamentos de faturamento para que a IA possa analisar seu negócio.</p>
        </div>
      )}

      {analysis ? (
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm prose prose-slate max-w-none">
          <div className="whitespace-pre-wrap leading-relaxed text-slate-700">
            {analysis.split('\n').map((line, i) => {
              if (line.startsWith('#')) return <h3 key={i} className="text-xl font-bold text-indigo-800 mt-6 mb-4">{line.replace(/^#+\s/, '')}</h3>;
              if (line.startsWith('-')) return <li key={i} className="ml-4 mb-2">{line.replace(/^-\s/, '')}</li>;
              return <p key={i} className="mb-4">{line}</p>;
            })}
          </div>
        </div>
      ) : records.length > 0 && !loading && (
        <div className="bg-white p-12 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-4">
            <BrainCircuit size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-800">Pronto para analisar</h3>
          <p className="text-slate-500 max-w-sm mt-2">Clique no botão acima para enviar seus dados para processamento e receber sugestões estratégicas.</p>
        </div>
      )}

      {loading && (
        <div className="space-y-4">
          <div className="h-4 bg-slate-200 rounded-full w-3/4 animate-pulse"></div>
          <div className="h-4 bg-slate-100 rounded-full w-1/2 animate-pulse"></div>
          <div className="h-4 bg-slate-100 rounded-full w-5/6 animate-pulse"></div>
          <div className="h-4 bg-slate-200 rounded-full w-2/3 animate-pulse"></div>
        </div>
      )}
    </div>
  );
};

export default AIInsights;
