import React from 'react';
import { FilterState, PollutantType, StationType } from '../types';
import { POLLUTANT_METADATA, CLUSTER_GROUPS } from '../data/londonData';
import { X, RefreshCw, SlidersHorizontal } from 'lucide-react';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filterState: FilterState;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  filterState,
  setFilterState,
}) => {
  if (!isOpen) return null;

  const pollutants: PollutantType[] = ['NO2', 'PM25', 'PM10', 'O3'];
  const stationTypes: StationType[] = [
    'Roadside',
    'Kerbside',
    'Urban Background',
    'Suburban',
    'Industrial',
  ];

  const handlePollutantChange = (p: PollutantType) => {
    setFilterState((prev) => ({ ...prev, pollutant: p }));
  };

  const handleStationTypeToggle = (type: StationType) => {
    setFilterState((prev) => {
      const exists = prev.stationTypes.includes(type);
      const updated = exists
        ? prev.stationTypes.filter((t) => t !== type)
        : [...prev.stationTypes, type];
      return { ...prev, stationTypes: updated };
    });
  };

  const handleResetFilters = () => {
    setFilterState({
      pollutant: 'NO2',
      stationTypes: [],
      imdRange: [1, 10],
      coverageFilter: 'ALL',
      clusterIdFilter: 'ALL',
      year: 2024,
      searchPostcode: '',
    });
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-black/70 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-[#181714] border-l border-[#282520] text-[#f4efe4] h-full overflow-y-auto p-6 flex flex-col justify-between shadow-2xl">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#282520] pb-4 mb-6">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-[#e5c158]" />
              <h3 className="font-semibold text-lg text-[#f4efe4] font-serif">Dynamic Map Filters</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[#22201c] text-[#9e988a] hover:text-[#f4efe4] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6 text-xs">
            {/* 1. Pollutant Selection */}
            <div className="space-y-2">
              <label className="font-semibold uppercase tracking-wider text-[#9e988a] block text-[10px]">
                1. Target Pollutant
              </label>
              <div className="grid grid-cols-2 gap-2">
                {pollutants.map((p) => {
                  const meta = POLLUTANT_METADATA[p];
                  const isSelected = filterState.pollutant === p;
                  return (
                    <button
                      key={p}
                      onClick={() => handlePollutantChange(p)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-[#e5c158] text-[#141311] border-[#e5c158] font-semibold shadow'
                          : 'bg-[#141311] text-[#9e988a] border-[#282520] hover:bg-[#22201c]'
                      }`}
                    >
                      <span className="block text-xs font-semibold">{meta.label}</span>
                      <span className="text-[10px] opacity-80 block">{meta.unit}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Station Type Filter */}
            <div className="space-y-2">
              <label className="font-semibold uppercase tracking-wider text-[#9e988a] block text-[10px]">
                2. Physical Station Siting Types
              </label>
              <div className="flex flex-wrap gap-2">
                {stationTypes.map((type) => {
                  const isChecked = filterState.stationTypes.includes(type);
                  return (
                    <button
                      key={type}
                      onClick={() => handleStationTypeToggle(type)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                        isChecked
                          ? 'bg-[#e5c158]/20 border-[#e5c158] text-[#e5c158]'
                          : 'bg-[#141311] border-[#282520] text-[#9e988a] hover:text-[#f4efe4]'
                      }`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Coverage Type */}
            <div className="space-y-2">
              <label className="font-semibold uppercase tracking-wider text-[#9e988a] block text-[10px]">
                3. Spatial Coverage Filter
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'ALL', label: 'All London' },
                  { key: 'MONITORED_ONLY', label: 'Monitored Only' },
                  { key: 'UNMONITORED_DARK', label: 'Dark Deserts' },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() =>
                      setFilterState((prev) => ({
                        ...prev,
                        coverageFilter: item.key as any,
                      }))
                    }
                    className={`py-2 px-2 rounded-xl border text-[11px] font-medium text-center transition-all ${
                      filterState.coverageFilter === item.key
                        ? 'bg-[#e5c158] text-[#141311] border-[#e5c158] font-semibold'
                        : 'bg-[#141311] border-[#282520] text-[#9e988a] hover:bg-[#22201c]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Cluster Group */}
            <div className="space-y-2">
              <label className="font-semibold uppercase tracking-wider text-[#9e988a] block text-[10px]">
                4. Focus Cluster Group
              </label>
              <select
                value={filterState.clusterIdFilter}
                onChange={(e) =>
                  setFilterState((prev) => ({
                    ...prev,
                    clusterIdFilter:
                      e.target.value === 'ALL' ? 'ALL' : parseInt(e.target.value),
                  }))
                }
                className="w-full bg-[#141311] border border-[#282520] rounded-xl p-2.5 text-[#f4efe4] outline-none font-medium"
              >
                <option value="ALL">Show All 4 Cluster Groups</option>
                {CLUSTER_GROUPS.map((cg) => (
                  <option key={cg.id} value={cg.id}>
                    Cluster 0{cg.id}: {cg.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Footer Reset */}
        <div className="pt-6 border-t border-[#282520]">
          <button
            onClick={handleResetFilters}
            className="w-full py-2.5 rounded-xl bg-[#22201c] hover:bg-[#2c2923] text-[#9e988a] hover:text-[#f4efe4] text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
};
