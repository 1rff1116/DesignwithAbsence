import React from 'react';
import { Compass, BarChart3, MapPin, Sparkles, Filter, Calendar, ArrowLeft, SlidersHorizontal } from 'lucide-react';
import { FilterState } from '../types';

interface NavbarProps {
  activeTab: 'story' | 'analytics' | 'timeline' | 'witness';
  setActiveTab: (tab: 'story' | 'analytics' | 'timeline' | 'witness') => void;
  isFreeExploration: boolean;
  setIsFreeExploration: (free: boolean) => void;
  onReturnToStory: () => void;
  filterState: FilterState;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  isFilterOpen: boolean;
  setIsFilterOpen: (open: boolean) => void;
  openAiCritique: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isFreeExploration,
  setIsFreeExploration,
  onReturnToStory,
  filterState,
  isFilterOpen,
  setIsFilterOpen,
  openAiCritique,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#181714]/95 border-b border-[#282520] text-[#f4efe4] shadow-md backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & App Title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#2d261e] border border-[#e5c158]/40 flex items-center justify-center text-[#e5c158] font-bold text-base shadow-sm font-serif">
            A
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-semibold text-base md:text-lg tracking-tight text-[#f4efe4] font-serif">
                Designing with Absence
              </h1>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-[#282520] text-[#e5c158] border border-[#3d382e]">
                LAQN Critical Viz
              </span>
            </div>
            <p className="text-xs text-[#9e988a] hidden sm:block">
              Making Data Gaps & Unmeasured Realities Perceptible in London
            </p>
          </div>
        </div>

        {/* Primary View Switcher & Free Exploration Entry */}
        <div className="flex items-center gap-2">
          {!isFreeExploration ? (
            /* Narrative Spine Mode (Default) */
            <div className="flex items-center gap-2 bg-[#1d1b17] p-1 rounded-xl border border-[#2d2922]">
              <button
                id="nav-story-spine-btn"
                onClick={() => onReturnToStory()}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'story'
                    ? 'bg-[#e5c158] text-[#141311] font-semibold shadow'
                    : 'text-[#9e988a] hover:text-[#f4efe4] hover:bg-[#282520]'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Story Mode</span>
              </button>

              {activeTab !== 'story' && (
                <button
                  id="nav-return-story-btn"
                  onClick={onReturnToStory}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#282520] text-[#e5c158] border border-[#e5c158]/40 hover:bg-[#332f28] transition-all shadow-sm"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>← Return to Story</span>
                </button>
              )}

              <button
                id="nav-enable-free-explore-btn"
                onClick={() => setIsFreeExploration(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#858073] hover:text-[#f4efe4] hover:bg-[#282520] transition-all"
                title="Enable free exploration mode to show all tabs"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Explore Freely</span>
              </button>
            </div>
          ) : (
            /* Free Exploration Mode (Exposes all 4 tabs) */
            <nav className="flex items-center gap-1 bg-[#1d1b17] p-1 rounded-xl border border-[#e5c158]/40 shadow-inner">
              <button
                id="nav-story-tab"
                onClick={() => setActiveTab('story')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'story'
                    ? 'bg-[#e5c158] text-[#141311] font-semibold shadow'
                    : 'text-[#9e988a] hover:text-[#f4efe4] hover:bg-[#282520]'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Story Mode</span>
              </button>

              <button
                id="nav-analytics-tab"
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'analytics'
                    ? 'bg-[#e5c158] text-[#141311] font-semibold shadow'
                    : 'text-[#9e988a] hover:text-[#f4efe4] hover:bg-[#282520]'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Analytics & Clustering</span>
              </button>

              <button
                id="nav-timeline-tab"
                onClick={() => setActiveTab('timeline')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'timeline'
                    ? 'bg-[#e5c158] text-[#141311] font-semibold shadow'
                    : 'text-[#9e988a] hover:text-[#f4efe4] hover:bg-[#282520]'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Station Lifelines</span>
              </button>

              <button
                id="nav-witness-tab"
                onClick={() => setActiveTab('witness')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'witness'
                    ? 'bg-[#e06c53] text-[#ffffff] font-semibold shadow'
                    : 'text-[#9e988a] hover:text-[#f4efe4] hover:bg-[#282520]'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Counter-Mapping</span>
              </button>

              <button
                id="nav-disable-free-explore-btn"
                onClick={() => setIsFreeExploration(false)}
                className="text-[10px] bg-[#282520] text-[#e5c158] font-semibold px-2 py-1 rounded ml-1 hover:bg-[#332f28]"
                title="Return to Story Mode"
              >
                Exit Free Mode
              </button>
            </nav>
          )}
        </div>

        {/* Actions & Filters */}
        <div className="flex items-center gap-2">
          {/* AI Critical Tutor button */}
          <button
            id="nav-ai-tutor-btn"
            onClick={openAiCritique}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#1e271f] text-[#7ebf69] border border-[#2e422f] hover:bg-[#253327] transition-all shadow-sm"
            title="Ask Gemini AI for critical data studies theory analysis"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#7ebf69]" />
            <span className="hidden md:inline">AI Critical Tutor</span>
          </button>

          {/* Filter Drawer Toggle */}
          <button
            id="nav-filter-toggle-btn"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              isFilterOpen
                ? 'bg-[#e5c158] text-[#141311] border-[#e5c158] font-semibold'
                : 'bg-[#1d1b17] text-[#f4efe4] border-[#2d2922] hover:bg-[#282520]'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filters ({filterState.pollutant})</span>
          </button>
        </div>
      </div>
    </header>
  );
};

