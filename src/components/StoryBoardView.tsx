import React, { useState } from 'react';
import { Sparkles, Info, Sliders, ShieldAlert, Layers, MapPin, Eye, BookOpen, X, ChevronRight } from 'lucide-react';
import { FilterState, PollutantType } from '../types';
import { POLLUTANT_METADATA } from '../data/londonData';

interface StoryBoardViewProps {
  currentStage: number;
  setCurrentStage: (stage: number) => void;
  onTriggerAction: (actionType: string, payload?: any) => void;
  filterState: FilterState;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  splitRatio: number;
  setSplitRatio: (ratio: number) => void;
}

export const STORY_STAGES = [
  {
    id: 1,
    title: 'Smooth Spatial Interpolation (Illusion of Completeness)',
    badge: 'Critique Mode',
    subtitle: 'Continuous color gradients create an illusion of total coverage.',
    description: 'Standard maps present mathematical spatial interpolation as neutral facts, concealing where physical monitors actually exist.',
    theory: 'Johanna Drucker (Graphesis) — Continuous spatial rendering presents constructed models as objective reality.',
    actionType: 'RESET_MAP_SMOOTH'
  },
  {
    id: 2,
    title: 'Peeling Back the Curtain (Data Absence)',
    badge: 'Perceptible Absence',
    subtitle: 'Drag curtain to reveal physical station light pools in dark unmonitored void.',
    description: 'Reveals glowing light pools around active sensors against vast unmeasured dark zones.',
    theory: 'Nicole Hengesbach et al. — Recoding missingness as a visible design presence.',
    actionType: 'SPLIT_CURTAIN_HALF'
  },
  {
    id: 3,
    title: 'Unmeasured Void Human Scale',
    badge: 'Human Anthropographics',
    subtitle: 'Hovering dark zones reveals true resident counts and sensor distance vectors.',
    description: 'Displays true child populations and distance vectors instead of speculative numbers.',
    theory: 'Andreasson & Riveiro — Coupling spatial emptiness with human anthropographics.',
    actionType: 'FOCUS_DARK_ZONE'
  },
  {
    id: 4,
    title: 'Temporal Station Lifelines',
    badge: 'Temporal Attrition',
    subtitle: 'Station lifelines reveal historical sensor closures due to council budget cuts.',
    description: 'Scrubbing 1993–2024 reveals station closures, leaving historical data gaps.',
    theory: 'Kennedy & Hill — Data instability felt through temporal data gaps.',
    actionType: 'OPEN_TIMELINE'
  },
  {
    id: 5,
    title: 'Postcode Deep-Dive Audit Receipts',
    badge: 'Situated Data',
    subtitle: 'Audit receipts highlight child populations in unmonitored data deserts.',
    description: 'Auditing postcodes (e.g. SE28) exposes fine-particle data deserts.',
    theory: 'D\'Ignazio & Klein (Data Feminism) — Foregrounding systematically omitted realities.',
    actionType: 'SEARCH_POSTCODE_SE28'
  },
  {
    id: 6,
    title: 'Citizen Witnessing & Counter-Mapping',
    badge: 'Counter-Archive',
    subtitle: 'Citizens leave witness marks in dark zones to build a shared counter-map.',
    description: 'Residents drop witness marks to create a crowd-sourced counter-archive.',
    theory: 'Jessica Hullman — Resisting false algorithmic closure.',
    actionType: 'OPEN_WITNESS_TOOL'
  }
];

export const StoryBoardView: React.FC<StoryBoardViewProps> = ({
  currentStage,
  setCurrentStage,
  onTriggerAction,
  filterState,
  setFilterState,
  splitRatio,
  setSplitRatio,
}) => {
  const [showTheoryModal, setShowTheoryModal] = useState(false);

  const pollutants: PollutantType[] = ['NO2', 'PM25', 'PM10', 'O3'];
  const activeMeta = POLLUTANT_METADATA[filterState.pollutant] || POLLUTANT_METADATA.NO2;

  const handlePollutantChange = (p: PollutantType) => {
    setFilterState((prev) => ({ ...prev, pollutant: p }));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const y = parseInt(e.target.value, 10);
    setFilterState((prev) => ({ ...prev, year: y }));
  };

  return (
    <div className="bg-[#181714] border border-[#282520] rounded-2xl p-4 md:p-5 text-[#f4efe4] shadow-xl space-y-4">
      {/* Top Header: Title & Quick Info Trigger */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#282520] pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#e5c158]/15 border border-[#e5c158]/30 text-[#e5c158] flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold font-serif text-[#f4efe4] flex items-center gap-2">
              <span>Designing with Absence: London Air Quality Map</span>
            </h2>
            <p className="text-xs text-[#9e988a]">
              Interactive dual-layer spatial map comparing smooth algorithmic models against physical sensor coverage.
            </p>
          </div>
        </div>

        {/* Hover / Click Info Button for Design Theory Context */}
        <button
          onClick={() => setShowTheoryModal(true)}
          className="bg-[#23201a] hover:bg-[#2e2a22] border border-[#38332a] hover:border-[#e5c158]/50 text-[#e5c158] px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
          title="Click to view Design Rationale & Theoretical Framework"
        >
          <Info className="w-4 h-4 text-[#e5c158]" />
          <span>Design Rationale & Methodology</span>
        </button>
      </div>

      {/* Interactive Control Panel Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center text-xs">
        {/* 1. Pollutant Quick Select Pills (4 Cols) */}
        <div className="md:col-span-5 bg-[#141311] border border-[#282520] p-2.5 rounded-xl flex items-center gap-2">
          <span className="text-[11px] font-semibold text-[#9e988a] whitespace-nowrap pl-1">
            Pollutant:
          </span>
          <div className="grid grid-cols-4 gap-1.5 w-full">
            {pollutants.map((p) => {
              const isSelected = filterState.pollutant === p;
              return (
                <button
                  key={p}
                  onClick={() => handlePollutantChange(p)}
                  className={`py-1.5 px-2 rounded-lg font-semibold text-center transition-all text-[11px] ${
                    isSelected
                      ? 'bg-[#e5c158] text-[#141311] shadow'
                      : 'bg-[#22201c] text-[#a8a295] hover:bg-[#2a2722] hover:text-[#f4efe4]'
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Timeline Scrubber (4 Cols) */}
        <div className="md:col-span-4 bg-[#141311] border border-[#282520] p-2.5 rounded-xl flex items-center gap-3">
          <span className="text-[11px] font-semibold text-[#9e988a] whitespace-nowrap">
            Year: <strong className="text-[#e5c158] text-sm font-mono">{filterState.year}</strong>
          </span>
          <input
            type="range"
            min={2000}
            max={2024}
            step={1}
            value={filterState.year}
            onChange={handleYearChange}
            className="w-full accent-[#e5c158] bg-[#282520] h-2 rounded-lg cursor-pointer"
          />
        </div>

        {/* 3. Curtain View Preset Buttons (3 Cols) */}
        <div className="md:col-span-3 bg-[#141311] border border-[#282520] p-2 rounded-xl flex items-center justify-between gap-1">
          <button
            onClick={() => {
              setSplitRatio(1.0);
              onTriggerAction('RESET_MAP_SMOOTH');
            }}
            className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-medium text-center transition-all ${
              splitRatio >= 0.95
                ? 'bg-[#e5c158]/20 text-[#e5c158] border border-[#e5c158]/50 font-bold'
                : 'text-[#9e988a] hover:text-[#f4efe4]'
            }`}
            title="Smooth Spatial Interpolation Model Only"
          >
            Smooth
          </button>

          <button
            onClick={() => {
              setSplitRatio(0.5);
              onTriggerAction('SPLIT_CURTAIN_HALF');
            }}
            className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-medium text-center transition-all ${
              splitRatio > 0.1 && splitRatio < 0.9
                ? 'bg-[#e5c158]/20 text-[#e5c158] border border-[#e5c158]/50 font-bold'
                : 'text-[#9e988a] hover:text-[#f4efe4]'
            }`}
            title="Split Curtain View (Compare Both Sides)"
          >
            Compare ↔
          </button>

          <button
            onClick={() => {
              setSplitRatio(0.05);
              onTriggerAction('FOCUS_DARK_ZONE');
            }}
            className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-medium text-center transition-all ${
              splitRatio <= 0.1
                ? 'bg-[#e06c53]/20 text-[#e06c53] border border-[#e06c53]/50 font-bold'
                : 'text-[#9e988a] hover:text-[#f4efe4]'
            }`}
            title="Focus Physical Monitors & Data Absence Void"
          >
            Dark Void
          </button>
        </div>
      </div>

      {/* Design Theory & Rationale Modal */}
      {showTheoryModal && (
        <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-md p-4 md:p-6 flex items-center justify-center">
          <div className="bg-[#1b1916] border border-[#302d26] rounded-2xl p-6 max-w-2xl w-full text-[#f4efe4] shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowTheoryModal(false)}
              className="absolute top-4 right-4 text-[#9e988a] hover:text-[#f4efe4] p-1.5 rounded-lg bg-[#282520]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 border-b border-[#2d2922] pb-3">
              <BookOpen className="w-5 h-5 text-[#e5c158]" />
              <h3 className="text-lg font-bold font-serif text-[#e5c158]">
                Design Rationale & Theoretical Framework
              </h3>
            </div>

            <div className="space-y-3.5 text-xs text-[#ccc6b8] leading-relaxed">
              <p>
                Standard air quality dashboards routinely present smooth mathematical color gradients across urban maps, treating spatial interpolation as complete objective truth. This project intentionally recodes <strong>data absence (MNAR: Missing Not At Random)</strong> as an active design material.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {STORY_STAGES.map((s) => (
                  <div key={s.id} className="bg-[#23201a] border border-[#38332a] p-3 rounded-xl space-y-1">
                    <div className="flex items-center justify-between font-semibold text-[#e5c158] text-[11px]">
                      <span>Stage 0{s.id}: {s.badge}</span>
                    </div>
                    <p className="font-medium text-[#f4efe4] text-xs">{s.title}</p>
                    <p className="text-[11px] text-[#9e988a] italic mt-1">{s.theory}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[#2d2922] flex justify-end">
              <button
                onClick={() => setShowTheoryModal(false)}
                className="bg-[#e5c158] text-[#141311] font-semibold px-4 py-2 rounded-xl text-xs hover:bg-[#d4b047] transition-colors"
              >
                Close Rationale
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
