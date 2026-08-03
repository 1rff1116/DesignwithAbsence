import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { StoryBoardView } from './components/StoryBoardView';
import { MapView } from './components/MapView';
import { CorrelationClusterPanel } from './components/CorrelationClusterPanel';
import { TimelineLifelinePanel } from './components/TimelineLifelinePanel';
import { FilterDrawer } from './components/FilterDrawer';
import { BoroughDetailModal } from './components/BoroughDetailModal';
import { AiCritiqueModal } from './components/AiCritiqueModal';
import { WitnessCounterMapPanel } from './components/WitnessCounterMapPanel';
import { FilterState, BoroughGeoFeature } from './types';
import { LONDON_BOROUGHS_GEOJSON } from './data/londonData';
import { Layers, Calendar, MapPin, BarChart3, ArrowLeft } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'story' | 'analytics' | 'timeline' | 'witness'>('story');
  const [isFreeExploration, setIsFreeExploration] = useState(false);
  const [lastStoryNode, setLastStoryNode] = useState<string>('node-evidence');
  const [currentStoryStage, setCurrentStoryStage] = useState(1);
  const [splitRatio, setSplitRatio] = useState(0.52);

  const [filterState, setFilterState] = useState<FilterState>({
    pollutant: 'NO2',
    stationTypes: [],
    imdRange: [1, 10],
    coverageFilter: 'ALL',
    clusterIdFilter: 'ALL',
    year: 2024,
    searchPostcode: '',
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedBorough, setSelectedBorough] = useState<BoroughGeoFeature | null>(null);
  const [isAiCritiqueOpen, setIsAiCritiqueOpen] = useState(false);
  const [activeWitnessMarkMode, setActiveWitnessMarkMode] = useState(false);

  // Navigate to deep-dive view from embedded hand-off button
  const handleNavigateToDeepDive = (tab: 'analytics' | 'timeline' | 'witness', nodeId: string) => {
    setLastStoryNode(nodeId);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Return to exact story narrative node
  const handleReturnToStory = () => {
    setActiveTab('story');
    setTimeout(() => {
      const el = document.getElementById(lastStoryNode);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  };

  // Trigger actions from Storyboard
  const handleTriggerAction = (actionType: string) => {
    if (actionType === 'RESET_MAP_SMOOTH') {
      setSplitRatio(1.0);
    } else if (actionType === 'SPLIT_CURTAIN_HALF') {
      setSplitRatio(0.48);
    } else if (actionType === 'FOCUS_DARK_ZONE') {
      setSplitRatio(0.3);
      const barnet = LONDON_BOROUGHS_GEOJSON.features.find((f) => f.properties.name === 'Barnet');
      if (barnet) setSelectedBorough(barnet as BoroughGeoFeature);
    } else if (actionType === 'OPEN_TIMELINE') {
      handleNavigateToDeepDive('timeline', 'node-timeline');
    } else if (actionType === 'SEARCH_POSTCODE_SE28') {
      const bexley = LONDON_BOROUGHS_GEOJSON.features.find((f) => f.properties.name === 'Bexley');
      if (bexley) setSelectedBorough(bexley as BoroughGeoFeature);
    } else if (actionType === 'OPEN_WITNESS_TOOL') {
      handleNavigateToDeepDive('witness', 'node-witness');
      setActiveWitnessMarkMode(true);
    }
  };

  const handleSelectBoroughByName = (name: string) => {
    const feat = LONDON_BOROUGHS_GEOJSON.features.find((f) => f.properties.name === name);
    if (feat) {
      setSelectedBorough(feat as BoroughGeoFeature);
    }
  };

  const handlePlaceWitnessMark = () => {
    handleNavigateToDeepDive('witness', 'node-witness');
  };

  return (
    <div className="min-h-screen bg-[#12110e] text-[#f4efe4] font-sans flex flex-col selection:bg-[#e5c158]/30 selection:text-[#f4efe4]">
      {/* Top Header Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isFreeExploration={isFreeExploration}
        setIsFreeExploration={setIsFreeExploration}
        onReturnToStory={handleReturnToStory}
        filterState={filterState}
        setFilterState={setFilterState}
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
        openAiCritique={() => setIsAiCritiqueOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-8">
        
        {/* Sticky Return Bar for Deep-Dive Views */}
        {activeTab !== 'story' && (
          <div className="sticky top-[57px] z-40 bg-[#1d1b17]/95 border border-[#e5c158]/50 backdrop-blur-md px-4 py-3 rounded-2xl flex items-center justify-between shadow-2xl">
            <div className="flex items-center gap-2.5 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-[#e5c158] animate-pulse" />
              <span className="text-[#9e988a]">Current Deep Dive:</span>
              <span className="font-semibold text-[#f4efe4]">
                {activeTab === 'analytics' && 'Analytics & Clustering'}
                {activeTab === 'timeline' && 'Station Lifelines'}
                {activeTab === 'witness' && 'Counter-Mapping'}
              </span>
            </div>
            <button
              onClick={handleReturnToStory}
              className="bg-[#e5c158] text-[#141311] hover:bg-[#d4b047] font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-md hover:scale-105"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← Return to Story</span>
            </button>
          </div>
        )}

        {/* TAB 1: STORY MODE (Scrollytelling Narrative Spine) */}
        {activeTab === 'story' && (
          <StoryBoardView
            currentStage={currentStoryStage}
            setCurrentStage={setCurrentStoryStage}
            onTriggerAction={handleTriggerAction}
            onNavigateToDeepDive={handleNavigateToDeepDive}
            filterState={filterState}
            setFilterState={setFilterState}
            splitRatio={splitRatio}
            setSplitRatio={setSplitRatio}
            onSelectBorough={(b) => setSelectedBorough(b)}
            activeWitnessMarkMode={activeWitnessMarkMode}
            onPlaceWitnessMark={handlePlaceWitnessMark}
          />
        )}

        {/* TAB 2: ANALYTICS & CLUSTERING (Deep Dive) */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="border-b border-[#282520] pb-3">
              <h2 className="text-xl font-bold text-[#f4efe4] flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#e5c158]" />
                <span>Correlation & Missingness Cluster Analysis</span>
              </h2>
              <p className="text-xs text-[#9e988a] mt-1">
                Quantitative inquiry into the spatial intersection of borough deprivation (IMD) and monitoring sensor density.
              </p>
            </div>

            <CorrelationClusterPanel
              filterState={filterState}
              setFilterState={setFilterState}
              onSelectBoroughByName={handleSelectBoroughByName}
            />

            <div className="space-y-3 pt-4 border-t border-[#282520]">
              <h3 className="text-sm font-semibold text-[#f4efe4]">
                Spatial Cluster Verification Map
              </h3>
              <MapView
                filterState={filterState}
                setFilterState={setFilterState}
                splitRatio={splitRatio}
                setSplitRatio={setSplitRatio}
                onSelectBorough={(b) => setSelectedBorough(b)}
                activeWitnessMarkMode={activeWitnessMarkMode}
                onPlaceWitnessMark={handlePlaceWitnessMark}
              />
            </div>
          </div>
        )}

        {/* TAB 3: STATION LIFELINES (TIMELINE 1993 - 2024 Deep Dive) */}
        {activeTab === 'timeline' && (
          <div className="space-y-6">
            <div className="border-b border-[#282520] pb-3">
              <h2 className="text-xl font-bold text-[#f4efe4] flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#e5c158]" />
                <span>Station Lifeline Barcode Scrubber (1993 – 2024)</span>
              </h2>
              <p className="text-xs text-[#9e988a] mt-1">
                Scrub through 30+ years of station histories. Watch physical monitoring stations blink out due to local council budget cutbacks.
              </p>
            </div>

            <TimelineLifelinePanel
              filterState={filterState}
              setFilterState={setFilterState}
            />

            <div className="space-y-3 pt-4 border-t border-[#282520]">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#f4efe4]">
                  Active Sensor Coverage Map in Year {filterState.year}
                </h3>
                <span className="text-xs text-[#e5c158] font-mono">
                  Showing stations operating in {filterState.year}
                </span>
              </div>
              <MapView
                filterState={filterState}
                setFilterState={setFilterState}
                splitRatio={splitRatio}
                setSplitRatio={setSplitRatio}
                onSelectBorough={(b) => setSelectedBorough(b)}
                activeWitnessMarkMode={activeWitnessMarkMode}
                onPlaceWitnessMark={handlePlaceWitnessMark}
              />
            </div>
          </div>
        )}

        {/* TAB 4: PARTICIPATORY COUNTER-MAPPING (Deep Dive) */}
        {activeTab === 'witness' && (
          <div className="space-y-6">
            <div className="border-b border-[#282520] pb-3">
              <h2 className="text-xl font-bold text-[#f4efe4] flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#e06c53]" />
                <span>Participatory Counter-Mapping & Citizen Witnessing</span>
              </h2>
              <p className="text-xs text-[#9e988a] mt-1">
                Refusing to leave the void empty. Citizens contribute lived observations in unmonitored dark zones to build a counter-archive of attention.
              </p>
            </div>

            <WitnessCounterMapPanel
              onActivateMarkingMode={() => setActiveWitnessMarkMode(true)}
              isMarkingModeActive={activeWitnessMarkMode}
            />

            <div className="space-y-3 pt-4 border-t border-[#282520]">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#f4efe4]">
                  Interactive Counter-Map (Click Unmonitored Dark Zone to Add Witness Mark)
                </h3>
                {activeWitnessMarkMode && (
                  <span className="text-xs bg-[#e06c53] text-[#12110e] font-semibold px-2.5 py-0.5 rounded-full animate-pulse">
                    Click Map to Drop Mark
                  </span>
                )}
              </div>
              <MapView
                filterState={filterState}
                setFilterState={setFilterState}
                splitRatio={splitRatio}
                setSplitRatio={setSplitRatio}
                onSelectBorough={(b) => setSelectedBorough(b)}
                activeWitnessMarkMode={activeWitnessMarkMode}
                onPlaceWitnessMark={handlePlaceWitnessMark}
              />
            </div>
          </div>
        )}

      </main>

      {/* Footer & Academic References */}
      <footer className="border-t border-[#282520] bg-[#0d0c0a] py-6 text-xs text-[#7d786c] mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-[#9e988a]">
              Designing with Absence: Making Data Gaps Perceptible through Critical Visualisation
            </p>
            <p className="text-[11px] text-[#635f55] mt-0.5">
              School of Informatics, University of Edinburgh · Case Study: London Air Quality Network (LAQN)
            </p>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-[#9e988a]">
            <span>Johanna Drucker (Graphesis)</span>
            <span>·</span>
            <span>Nicole Hengesbach et al. (2022)</span>
            <span>·</span>
            <span>D'Ignazio & Klein (Data Feminism)</span>
          </div>
        </div>
      </footer>

      {/* Multi-Dimensional Filter Drawer */}
      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filterState={filterState}
        setFilterState={setFilterState}
      />

      {/* Borough Deep-Dive Modal */}
      <BoroughDetailModal
        borough={selectedBorough}
        onClose={() => setSelectedBorough(null)}
        onRequestAiCritique={() => setIsAiCritiqueOpen(true)}
      />

      {/* Gemini AI Critical Tutor Modal */}
      <AiCritiqueModal
        isOpen={isAiCritiqueOpen}
        onClose={() => setIsAiCritiqueOpen(false)}
        borough={selectedBorough}
        pollutant={filterState.pollutant}
      />
    </div>
  );
}

