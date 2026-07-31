import React, { useEffect, useState } from 'react';
import { BoroughGeoFeature, PollutantType } from '../types';
import { X, Sparkles, Loader2 } from 'lucide-react';

interface AiCritiqueModalProps {
  isOpen: boolean;
  onClose: () => void;
  borough?: BoroughGeoFeature | null;
  pollutant: PollutantType;
}

export const AiCritiqueModal: React.FC<AiCritiqueModalProps> = ({
  isOpen,
  onClose,
  borough,
  pollutant,
}) => {
  const [loading, setLoading] = useState(false);
  const [aiResponseText, setAiResponseText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchAiInsight = async () => {
    setLoading(true);
    setError(null);
    setAiResponseText(null);

    try {
      const payload = borough
        ? {
            mode: 'borough_critique',
            borough: borough.properties.name,
            pollutant,
            imdDecile: borough.properties.imdDecile,
            monitorCount: borough.properties.monitorsByPollutant[pollutant] || 0,
            population: borough.properties.population,
            unmeasuredRadius: borough.properties.unmonitoredRadiusKm[pollutant],
            clusterType: `Cluster ${borough.properties.clusterId}`,
          }
        : {
            mode: 'clustering_analysis',
            pollutant,
            clusterSummary: {
              title: 'London-wide LAQN Missingness Overview',
              pollutant,
            },
          };

      const res = await fetch('/api/ai-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`API response failed with status ${res.status}`);
      }

      const data = await res.json();
      setAiResponseText(data.text || 'No AI insight returned.');
    } catch (err: any) {
      console.error('Error fetching AI critique:', err);
      setError(err?.message || 'Failed to connect to AI server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAiInsight();
    }
  }, [isOpen, borough, pollutant]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1100] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#181714] border border-[#282520] text-[#f4efe4] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-[#141311] border-b border-[#282520] p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#1e271f] border border-[#2e422f] flex items-center justify-center text-[#7ebf69]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#f4efe4] font-serif">
                Gemini AI Critical Tutor Analysis
              </h2>
              <p className="text-xs text-[#9e988a]">
                {borough ? `Borough Critique: ${borough.properties.name}` : 'London-wide Data Missingness Analysis'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#22201c] text-[#9e988a] hover:text-[#f4efe4] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <Loader2 className="w-8 h-8 text-[#7ebf69] animate-spin" />
              <p className="text-xs text-[#9e988a] italic">
                Synthesizing Critical Data Studies literature (Drucker, D'Ignazio, Kennedy)...
              </p>
            </div>
          )}

          {error && (
            <div className="bg-[#2d1b18] border border-[#592620] p-4 rounded-xl text-xs text-[#f29b8a]">
              <strong>AI Analysis Connection Error:</strong> {error}
            </div>
          )}

          {aiResponseText && !loading && (
            <div className="prose prose-invert max-w-none text-xs md:text-sm text-[#ccc6b8] leading-relaxed whitespace-pre-wrap font-sans space-y-3">
              {aiResponseText}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#141311] border-t border-[#282520] p-4 flex justify-between items-center text-xs">
          <span className="text-[#858073] italic">
            Powered by Gemini 2.5 Flash · Critical Visualization Frameworks
          </span>
          <button
            onClick={onClose}
            className="py-2 px-4 rounded-xl bg-[#22201c] hover:bg-[#2c2923] text-[#ccc6b8] font-semibold transition-colors"
          >
            Close Critique
          </button>
        </div>
      </div>
    </div>
  );
};
