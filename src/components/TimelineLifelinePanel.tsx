import React, { useState } from 'react';
import { LAQN_STATIONS, POLLUTANT_METADATA } from '../data/londonData';
import { FilterState } from '../types';
import { Play, Pause, RotateCcw, Calendar, AlertCircle } from 'lucide-react';

interface TimelineLifelinePanelProps {
  filterState: FilterState;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
}

export const TimelineLifelinePanel: React.FC<TimelineLifelinePanelProps> = ({
  filterState,
  setFilterState,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const currentYear = filterState.year;
  const pollutant = filterState.pollutant;

  const startYear = 1993;
  const endYear = 2024;
  const totalYears = endYear - startYear + 1;

  const stations = LAQN_STATIONS.filter((st) => st.readings[pollutant] !== null);

  const activeInCurrentYearCount = stations.filter(
    (st) => st.activeYears[0] <= currentYear && st.activeYears[1] >= currentYear
  ).length;

  const closedInCurrentYearCount = stations.filter(
    (st) => st.isClosed && st.activeYears[1] <= currentYear
  ).length;

  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    let year = currentYear >= endYear ? startYear : currentYear;

    const interval = setInterval(() => {
      year += 1;
      setFilterState((prev) => ({ ...prev, year }));
      if (year >= endYear) {
        clearInterval(interval);
        setIsPlaying(false);
      }
    }, 450);
  };

  return (
    <div className="bg-[#181714] border border-[#282520] p-5 rounded-2xl shadow-xl space-y-6 text-[#f4efe4]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#282520] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#e06c53] uppercase tracking-wider mb-1">
            <Calendar className="w-4 h-4" />
            <span>Temporal Missingness & Historical Attrition</span>
          </div>
          <h2 className="text-xl md:text-2xl font-semibold font-serif">
            LAQN Station Lifelines (1993 – 2024)
          </h2>
          <p className="text-xs text-[#9e988a] mt-1 leading-relaxed max-w-2xl">
            Scrubbing through 30+ years reveals physical station closures driven by municipal council budget cuts, creating permanent historical blind spots in residential London.
          </p>
        </div>

        {/* Player Controls */}
        <div className="flex items-center gap-3 bg-[#141311] border border-[#282520] px-4 py-2.5 rounded-xl">
          <button
            onClick={handlePlayPause}
            className="p-2 rounded-lg bg-[#e5c158] text-[#141311] hover:bg-[#d4b047] transition-colors font-bold"
            title={isPlaying ? 'Pause Timeline' : 'Play Timeline (1993-2024)'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setFilterState((prev) => ({ ...prev, year: 2024 }))}
            className="p-2 rounded-lg bg-[#22201c] text-[#9e988a] hover:text-[#f4efe4] transition-colors"
            title="Reset to 2024"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="pl-3 border-l border-[#282520]">
            <span className="text-[10px] text-[#9e988a] uppercase block font-semibold">Active Year</span>
            <span className="text-2xl font-bold text-[#e5c158] font-mono leading-none">
              {currentYear}
            </span>
          </div>
        </div>
      </div>

      {/* Year Scrubbing Slider */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-mono text-[#9e988a]">
          <span>1993 (Early LAQN Expansion)</span>
          <span className="text-[#e5c158] font-semibold">Scrubbing Year: {currentYear}</span>
          <span>2024 (Present)</span>
        </div>
        <input
          type="range"
          min={startYear}
          max={endYear}
          value={currentYear}
          onChange={(e) => setFilterState((prev) => ({ ...prev, year: parseInt(e.target.value) }))}
          className="w-full accent-[#e5c158] cursor-pointer bg-[#282520] h-2 rounded-lg"
        />
      </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-[#141311] border border-[#282520] p-3.5 rounded-xl">
          <span className="text-[#9e988a] block text-[10px] uppercase font-semibold">Operating Stations in {currentYear}</span>
          <span className="text-xl font-bold text-[#7ebf69] font-mono mt-1 block">
            {activeInCurrentYearCount}
          </span>
          <span className="text-[10px] text-[#858073]">Physical monitors active</span>
        </div>

        <div className="bg-[#141311] border border-[#282520] p-3.5 rounded-xl">
          <span className="text-[#9e988a] block text-[10px] uppercase font-semibold">Permanently Decommissioned</span>
          <span className="text-xl font-bold text-[#e06c53] font-mono mt-1 block">
            {closedInCurrentYearCount}
          </span>
          <span className="text-[10px] text-[#858073]">Closed prior to {currentYear}</span>
        </div>

        <div className="bg-[#141311] border border-[#282520] p-3.5 rounded-xl">
          <span className="text-[#9e988a] block text-[10px] uppercase font-semibold">Pollutant Focus</span>
          <span className="text-base font-bold text-[#e5c158] font-serif mt-1 block">
            {POLLUTANT_METADATA[pollutant]?.label || pollutant}
          </span>
          <span className="text-[10px] text-[#858073]">{POLLUTANT_METADATA[pollutant]?.unit}</span>
        </div>
      </div>

      {/* Station Lifeline Barcode Tracks */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-[#f4efe4] border-b border-[#282520] pb-2">
          <span>Station Lifeline Barcodes (Green = Active, Dark = Closed/Unmonitored)</span>
          <span className="text-[#9e988a] font-normal text-[11px]">Hover over barcode to view station history</span>
        </div>

        <div className="space-y-2 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
          {stations.map((st) => {
            const isOperatingInYear = st.activeYears[0] <= currentYear && st.activeYears[1] >= currentYear;

            return (
              <div
                key={st.id}
                className={`p-2.5 rounded-xl border transition-all ${
                  isOperatingInYear
                    ? 'bg-[#141311] border border-[#282520]'
                    : 'bg-[#141311]/50 border border-[#22201c] opacity-60'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5 text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isOperatingInYear ? 'bg-[#7ebf69]' : 'bg-[#e06c53]'
                      }`}
                    />
                    <strong className="text-[#f4efe4]">{st.name}</strong>
                    <span className="text-[10px] text-[#9e988a] bg-[#22201c] px-1.5 py-0.5 rounded">
                      {st.boro} ({st.type})
                    </span>
                  </div>

                  <span className="font-mono text-[10px] text-[#9e988a]">
                    {st.activeYears[0]} – {st.activeYears[1]} {st.isClosed && '· Closed'}
                  </span>
                </div>

                {/* Barcode Strip */}
                <div className="flex gap-0.5 h-3.5 w-full bg-[#1e1c18] rounded overflow-hidden p-0.5">
                  {Array.from({ length: totalYears }).map((_, idx) => {
                    const yr = startYear + idx;
                    const isActive = st.activeYears[0] <= yr && st.activeYears[1] >= yr;
                    const isSelected = yr === currentYear;

                    return (
                      <div
                        key={yr}
                        onClick={() => setFilterState((prev) => ({ ...prev, year: yr }))}
                        title={`${st.name} in ${yr}: ${isActive ? 'ACTIVE' : 'INACTIVE / CLOSED'}`}
                        className={`flex-1 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#e5c158] z-10 scale-125 rounded-xs'
                            : isActive
                            ? 'bg-[#7ebf69]/80 hover:bg-[#7ebf69]'
                            : 'bg-[#282520] opacity-40 hover:opacity-80'
                        }`}
                      />
                    );
                  })}
                </div>

                {st.isClosed && st.closureReason && st.activeYears[1] <= currentYear && (
                  <p className="text-[10px] text-[#e06c53] italic mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                    <span>Decommissioned: {st.closureReason}</span>
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
