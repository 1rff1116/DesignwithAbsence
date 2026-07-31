import React from 'react';
import { BoroughGeoFeature, PollutantType } from '../types';
import { POLLUTANT_METADATA } from '../data/londonData';
import { X, Sparkles, FileText, AlertCircle } from 'lucide-react';

interface BoroughDetailModalProps {
  borough: BoroughGeoFeature | null;
  onClose: () => void;
  onRequestAiCritique: (borough: BoroughGeoFeature) => void;
}

export const BoroughDetailModal: React.FC<BoroughDetailModalProps> = ({
  borough,
  onClose,
  onRequestAiCritique,
}) => {
  if (!borough) return null;

  const props = borough.properties;
  const pollutants: PollutantType[] = ['NO2', 'PM25', 'PM10', 'O3'];

  return (
    <div className="fixed inset-0 z-[1000] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#181714] border border-[#282520] text-[#f4efe4] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#141311] border-b border-[#282520] p-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-semibold text-[#e5c158] bg-[#22201c] px-2.5 py-0.5 rounded-full border border-[#3d382e]">
                Borough Deep-Dive Receipt
              </span>
              <span className="text-xs text-[#9e988a]">IMD Decile {props.imdDecile} / 10</span>
            </div>
            <h2 className="text-2xl font-semibold text-[#f4efe4] font-serif mt-1">{props.name}</h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#22201c] text-[#9e988a] hover:text-[#f4efe4] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Key Demographic Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="bg-[#141311] border border-[#282520] p-3 rounded-xl">
              <span className="text-[#9e988a] block text-[10px] uppercase">Total Population</span>
              <span className="text-base font-bold text-[#f4efe4]">
                {props.population.toLocaleString()}
              </span>
            </div>

            <div className="bg-[#141311] border border-[#282520] p-3 rounded-xl">
              <span className="text-[#9e988a] block text-[10px] uppercase">Children (&lt;18)</span>
              <span className="text-base font-bold text-[#e06c53]">
                {props.childPopulation.toLocaleString()}
              </span>
            </div>

            <div className="bg-[#141311] border border-[#282520] p-3 rounded-xl">
              <span className="text-[#9e988a] block text-[10px] uppercase">Deprivation Tier</span>
              <span className="text-base font-bold text-[#e5c158]">
                Decile {props.imdDecile}
              </span>
            </div>

            <div className="bg-[#141311] border border-[#282520] p-3 rounded-xl">
              <span className="text-[#9e988a] block text-[10px] uppercase">Primary Land Use</span>
              <span className="text-xs font-semibold text-[#ccc6b8] truncate block">
                {props.primaryLandUse}
              </span>
            </div>
          </div>

          {/* Pollutant-by-Pollutant Receipt Table */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-[#e5c158] font-serif flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>Pollutant-by-Pollutant Measurement Receipt</span>
            </h3>

            <div className="bg-[#141311] border border-[#282520] rounded-xl overflow-hidden text-xs">
              <div className="grid grid-cols-4 bg-[#100f0d] p-3 font-semibold text-[#9e988a] border-b border-[#282520]">
                <span>Pollutant</span>
                <span>Active Sensors</span>
                <span>Estimation Distance</span>
                <span>Missingness Diagnosis</span>
              </div>

              <div className="divide-y divide-[#22201c]">
                {pollutants.map((p) => {
                  const meta = POLLUTANT_METADATA[p];
                  const count = props.monitorsByPollutant[p];
                  const radius = props.unmonitoredRadiusKm[p];
                  const missingType = props.missingnessType[p];

                  return (
                    <div key={p} className="grid grid-cols-4 p-3 items-center text-[#ccc6b8]">
                      <div>
                        <strong className="text-[#f4efe4] font-serif">{meta.label}</strong>
                        <span className="block text-[10px] text-[#858073]">{meta.unit}</span>
                      </div>

                      <div>
                        <span
                          className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                            count > 0
                              ? 'bg-[#1e2d20] text-[#7ebf69]'
                              : 'bg-[#2e1d1b] text-[#e06c53]'
                          }`}
                        >
                          {count > 0 ? `${count} Active` : '0 Monitors'}
                        </span>
                      </div>

                      <div className="font-mono text-[11px]">
                        {count > 0 ? 'Direct On-Site' : `~${radius} km travel`}
                      </div>

                      <div>
                        <span
                          className={`text-[10px] font-semibold uppercase ${
                            missingType === 'MNAR'
                              ? 'text-[#e06c53]'
                              : missingType === 'MAR'
                              ? 'text-[#e5c158]'
                              : 'text-[#7ebf69]'
                          }`}
                        >
                          {missingType === 'MNAR'
                            ? 'Unmeasured Void (MNAR)'
                            : missingType === 'MAR'
                            ? 'Partial Gap (MAR)'
                            : 'Monitored'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-[#141311] border-t border-[#282520] p-4 flex items-center justify-between">
          <button
            onClick={() => {
              onRequestAiCritique(borough);
              onClose();
            }}
            className="py-2.5 px-4 rounded-xl bg-[#1e271f] hover:bg-[#253327] text-[#7ebf69] border border-[#2e422f] text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-[#7ebf69]" />
            <span>Generate Gemini AI Critical Data Studies Audit</span>
          </button>

          <button
            onClick={onClose}
            className="py-2 px-4 rounded-xl bg-[#22201c] hover:bg-[#2c2923] text-[#ccc6b8] text-xs font-semibold transition-colors"
          >
            Close Receipt
          </button>
        </div>
      </div>
    </div>
  );
};
