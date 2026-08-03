import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sparkles, Info, Layers, MapPin, BookOpen, X, ArrowRight, BarChart3, Calendar, ShieldAlert, Compass, Eye, SlidersHorizontal } from 'lucide-react';
import { FilterState, PollutantType, BoroughGeoFeature } from '../types';
import { POLLUTANT_METADATA } from '../data/londonData';
import { MapView } from './MapView';

interface StoryBoardViewProps {
  currentStage: number;
  setCurrentStage: (stage: number) => void;
  onTriggerAction: (actionType: string, payload?: any) => void;
  onNavigateToDeepDive: (tab: 'analytics' | 'timeline' | 'witness', nodeId: string) => void;
  filterState: FilterState;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  splitRatio: number;
  setSplitRatio: (ratio: number) => void;
  onSelectBorough: (borough: BoroughGeoFeature) => void;
  activeWitnessMarkMode: boolean;
  onPlaceWitnessMark?: (lat: number, lon: number) => void;
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

type StepKey = 'hero' | 'step01' | 'step02' | 'step03';

export const StoryBoardView: React.FC<StoryBoardViewProps> = ({
  onTriggerAction,
  onNavigateToDeepDive,
  filterState,
  setFilterState,
  splitRatio,
  setSplitRatio,
  onSelectBorough,
  activeWitnessMarkMode,
  onPlaceWitnessMark,
}) => {
  const [showTheoryModal, setShowTheoryModal] = useState(false);
  const [activeStep, setActiveStep] = useState<StepKey>('hero');
  const activeStepRef = useRef<StepKey>('hero');
  const isManualOverrideRef = useRef(false);

  const pollutants: PollutantType[] = ['NO2', 'PM25', 'PM10', 'O3'];

  // Apply visual state corresponding to the active step
  const applyStepState = useCallback((step: StepKey) => {
    activeStepRef.current = step;
    setActiveStep(step);

    if (step === 'hero') {
      setSplitRatio(1.0); // Smooth interpolated surface
      setFilterState((prev) => ({ ...prev, pollutant: 'PM25', year: 2024 }));
    } else if (step === 'step01') {
      setSplitRatio(0.48); // Split curtain: deprivation & physical sensors
      setFilterState((prev) => ({ ...prev, pollutant: 'PM25', year: 2024 }));
    } else if (step === 'step02') {
      setSplitRatio(0.5); // Temporal attrition state
      setFilterState((prev) => ({ ...prev, year: 2012 }));
    } else if (step === 'step03') {
      setSplitRatio(0.05); // Dark void mode with citizen witness marks
      setFilterState((prev) => ({ ...prev, pollutant: 'PM25' }));
    }
  }, [setSplitRatio, setFilterState]);

  // Viewport center-based scrollytelling trigger with hysteresis and IntersectionObserver
  useEffect(() => {
    const stepConfigs: { id: string; key: StepKey }[] = [
      { id: 'node-hero', key: 'hero' },
      { id: 'node-evidence', key: 'step01' },
      { id: 'node-timeline', key: 'step02' },
      { id: 'node-witness', key: 'step03' },
    ];

    let rafId: number | null = null;

    const checkClosestStepToCenter = () => {
      if (isManualOverrideRef.current) return;

      const viewportCenter = window.innerHeight / 2;
      let closestKey: StepKey | null = null;
      let minDistance = Infinity;
      let currentActiveDistance = Infinity;

      stepConfigs.forEach(({ id, key }) => {
        const el = document.getElementById(id);
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const elementCenter = rect.top + rect.height / 2;
        const dist = Math.abs(elementCenter - viewportCenter);

        if (key === activeStepRef.current) {
          currentActiveDistance = dist;
        }

        if (dist < minDistance) {
          minDistance = dist;
          closestKey = key;
        }
      });

      if (closestKey && closestKey !== activeStepRef.current) {
        // Hysteresis dead zone (40px): Candidate must be at least 40px closer to center
        // than current active step to trigger a switch, avoiding jitter near boundaries.
        const HYSTERESIS_PX = 40;
        if (minDistance < currentActiveDistance - HYSTERESIS_PX || currentActiveDistance === Infinity) {
          applyStepState(closestKey);
        }
      }
    };

    const handleScrollOrResize = () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(checkClosestStepToCenter);
    };

    // IntersectionObserver with tight center band rootMargin (-45% 0px -45% 0px)
    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '-45% 0px -45% 0px',
      threshold: 0,
    };

    const observer = new IntersectionObserver(() => {
      handleScrollOrResize();
    }, observerOptions);

    stepConfigs.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize, { passive: true });

    // Run initial check
    checkClosestStepToCenter();

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [applyStepState]);

  const handlePollutantChange = (p: PollutantType) => {
    isManualOverrideRef.current = true;
    setFilterState((prev) => ({ ...prev, pollutant: p }));
    setTimeout(() => { isManualOverrideRef.current = false; }, 3000);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    isManualOverrideRef.current = true;
    const y = parseInt(e.target.value, 10);
    setFilterState((prev) => ({ ...prev, year: y }));
    setTimeout(() => { isManualOverrideRef.current = false; }, 3000);
  };

  const scrollToStep = (stepId: string, key: StepKey) => {
    isManualOverrideRef.current = false;
    applyStepState(key);
    const el = document.getElementById(stepId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="text-[#f4efe4] space-y-6">
      {/* Navigation Quick Step Jump Bar */}
      <div className="bg-[#181714] border border-[#282520] p-3 rounded-xl flex items-center justify-between text-xs overflow-x-auto gap-2 shadow-lg">
        <div className="flex items-center gap-2 text-[#9e988a] shrink-0 font-medium">
          <Compass className="w-4 h-4 text-[#e5c158]" />
          <span>Story Scroller:</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => scrollToStep('node-hero', 'hero')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all text-xs ${
              activeStep === 'hero'
                ? 'bg-[#e5c158] text-[#141311] shadow'
                : 'bg-[#22201c] text-[#a8a295] hover:text-[#f4efe4]'
            }`}
          >
            00. Hero
          </button>
          <button
            onClick={() => scrollToStep('node-evidence', 'step01')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all text-xs ${
              activeStep === 'step01'
                ? 'bg-[#e5c158] text-[#141311] shadow'
                : 'bg-[#22201c] text-[#a8a295] hover:text-[#f4efe4]'
            }`}
          >
            01. Gaps Aren&apos;t Random
          </button>
          <button
            onClick={() => scrollToStep('node-timeline', 'step02')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all text-xs ${
              activeStep === 'step02'
                ? 'bg-[#5294e2] text-[#ffffff] shadow'
                : 'bg-[#22201c] text-[#a8a295] hover:text-[#f4efe4]'
            }`}
          >
            02. Map Goes Dark
          </button>
          <button
            onClick={() => scrollToStep('node-witness', 'step03')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all text-xs ${
              activeStep === 'step03'
                ? 'bg-[#e06c53] text-[#ffffff] shadow'
                : 'bg-[#22201c] text-[#a8a295] hover:text-[#f4efe4]'
            }`}
          >
            03. Witness the Gap
          </button>
        </div>

        <button
          onClick={() => setShowTheoryModal(true)}
          className="bg-[#23201a] hover:bg-[#2e2a22] border border-[#38332a] text-[#e5c158] px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ml-auto"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Why this design · Theory</span>
        </button>
      </div>

      {/* Main Two-Column Scrollytelling Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start relative">
        
        {/* LEFT COLUMN: Narrative Steps (Scrolls down) */}
        <div className="lg:col-span-5 space-y-10">
          
          {/* HERO SECTION */}
          <section
            id="node-hero"
            className={`bg-[#181714] border rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden transition-all duration-500 ease-in-out scroll-mt-24 ${
              activeStep === 'hero'
                ? 'border-[#e5c158] ring-1 ring-[#e5c158]/30 shadow-[#e5c158]/5'
                : 'border-[#282520] opacity-85 hover:opacity-100'
            }`}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#e5c158]/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="space-y-4 relative z-10">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#282520] text-[#e5c158] border border-[#3d382e]">
                  Story Mode · Intro
                </span>
                <span className="text-xs text-[#9e988a]">LAQN Case Study</span>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold font-serif text-[#f4efe4] leading-tight tracking-tight">
                Designing with Absence
              </h1>

              <p className="text-sm md:text-base font-serif italic text-[#e5c158]">
                Witnessing the Gaps in London&apos;s Air-Quality Data
              </p>

              <p className="text-sm text-[#ccc6b8] leading-relaxed font-sans">
                A standard air-quality map of London looks smooth, colourful and complete — every street covered, as if a sensor sat on every corner. It doesn&apos;t. That seamless surface is an algorithm&apos;s guess, and it quietly paints over where the city actually measures its air and where it never has. This project treats those gaps not as glitches to smooth away, but as something to make visible — and to stand in front of.
              </p>

              {/* Mobile Inline Visual Anchor for HERO */}
              <div className="block lg:hidden pt-3">
                <div className="text-[11px] font-semibold text-[#e5c158] mb-1.5 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Visual Preview: Smooth Interpolated Surface</span>
                </div>
                <div className="rounded-xl overflow-hidden border border-[#38332a] bg-[#141311]">
                  <MapView
                    filterState={filterState}
                    setFilterState={setFilterState}
                    splitRatio={splitRatio}
                    setSplitRatio={setSplitRatio}
                    onSelectBorough={onSelectBorough}
                    activeWitnessMarkMode={activeWitnessMarkMode}
                    onPlaceWitnessMark={onPlaceWitnessMark}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* STEP 01 SECTION */}
          <section
            id="node-evidence"
            className={`bg-[#181714] border rounded-2xl p-6 md:p-8 shadow-2xl space-y-5 transition-all duration-500 ease-in-out scroll-mt-24 ${
              activeStep === 'step01'
                ? 'border-[#e5c158] ring-1 ring-[#e5c158]/30 shadow-[#e5c158]/5'
                : 'border-[#282520] opacity-85 hover:opacity-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#e5c158]" />
              <span className="text-xs font-mono uppercase tracking-widest text-[#e5c158]">Step 01</span>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold font-serif text-[#f4efe4]">
              “The gaps aren&apos;t random”
            </h2>

            <div className="space-y-4 text-sm text-[#ccc6b8] leading-relaxed font-sans">
              <p>
                Zoom into the map and it stays calm and even. But lay London&apos;s poverty map over where the sensors actually sit, and the calm breaks. In the most deprived outer boroughs, the share of people with no nearby PM2.5 monitor runs about 78% higher than in the wealthy commercial centre. More than 64% of working sensors sit within 15 metres of a main road — so the traffic corridor is measured in fine detail while the residential streets and school gates behind it stay dark. This isn&apos;t random missing data (MAR — gaps by chance). It&apos;s Missing Not At Random (MNAR): who gets measured tracks who lives there.
              </p>
            </div>

            {/* Mobile Inline Visual Anchor for STEP 01 */}
            <div className="block lg:hidden pt-2">
              <div className="text-[11px] font-semibold text-[#e5c158] mb-1.5 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" />
                <span>Visual Preview: Deprivation & Sensor Distribution</span>
              </div>
              <div className="rounded-xl overflow-hidden border border-[#38332a] bg-[#141311]">
                <MapView
                  filterState={filterState}
                  setFilterState={setFilterState}
                  splitRatio={splitRatio}
                  setSplitRatio={setSplitRatio}
                  onSelectBorough={onSelectBorough}
                  activeWitnessMarkMode={activeWitnessMarkMode}
                  onPlaceWitnessMark={onPlaceWitnessMark}
                />
              </div>
            </div>

            {/* Embedded Hand-off Deep-dive Button 1 */}
            <div className="pt-3 border-t border-[#282520] flex flex-wrap items-center justify-between gap-4">
              <button
                onClick={() => onNavigateToDeepDive('analytics', 'node-evidence')}
                className="w-full px-5 py-3 rounded-xl bg-[#e5c158] text-[#141311] font-bold text-xs hover:bg-[#d4b047] transition-all shadow-lg hover:scale-[1.01] flex items-center justify-center gap-2 group"
              >
                <BarChart3 className="w-4 h-4" />
                <span>See the evidence — deprivation vs. sensor density →</span>
              </button>
            </div>
          </section>

          {/* STEP 02 SECTION */}
          <section
            id="node-timeline"
            className={`bg-[#181714] border rounded-2xl p-6 md:p-8 shadow-2xl space-y-5 transition-all duration-500 ease-in-out scroll-mt-24 ${
              activeStep === 'step02'
                ? 'border-[#5294e2] ring-1 ring-[#5294e2]/30 shadow-[#5294e2]/5'
                : 'border-[#282520] opacity-85 hover:opacity-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#5294e2]" />
              <span className="text-xs font-mono uppercase tracking-widest text-[#5294e2]">Step 02</span>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold font-serif text-[#f4efe4]">
              “The map goes dark over time”
            </h2>

            <div className="space-y-4 text-sm text-[#ccc6b8] leading-relaxed font-sans">
              <p>
                Air monitoring isn&apos;t something you build once and keep. Drag across 1993–2024 and whole stations blink out — quietly decommissioned as local-council budgets were cut. What disappears isn&apos;t just a machine; it&apos;s the only long-term environmental record some neighbourhoods ever had. The algorithm fills the hole with a historical average, smoothing a real loss into a clean, confident line.
              </p>
            </div>

            {/* Mobile Inline Visual Anchor for STEP 02 */}
            <div className="block lg:hidden pt-2">
              <div className="text-[11px] font-semibold text-[#5294e2] mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Visual Preview: Station Closures over 1993–2024</span>
              </div>
              <div className="rounded-xl overflow-hidden border border-[#38332a] bg-[#141311]">
                <MapView
                  filterState={filterState}
                  setFilterState={setFilterState}
                  splitRatio={splitRatio}
                  setSplitRatio={setSplitRatio}
                  onSelectBorough={onSelectBorough}
                  activeWitnessMarkMode={activeWitnessMarkMode}
                  onPlaceWitnessMark={onPlaceWitnessMark}
                />
              </div>
            </div>

            {/* Embedded Hand-off Deep-dive Button 2 */}
            <div className="pt-3 border-t border-[#282520] flex flex-wrap items-center justify-between gap-4">
              <button
                onClick={() => onNavigateToDeepDive('timeline', 'node-timeline')}
                className="w-full px-5 py-3 rounded-xl bg-[#e5c158] text-[#141311] font-bold text-xs hover:bg-[#d4b047] transition-all shadow-lg hover:scale-[1.01] flex items-center justify-center gap-2 group"
              >
                <Calendar className="w-4 h-4" />
                <span>Scrub 30 years of station lifelines →</span>
              </button>
            </div>
          </section>

          {/* STEP 03 SECTION */}
          <section
            id="node-witness"
            className={`bg-[#181714] border border-l-4 rounded-2xl p-6 md:p-8 shadow-2xl space-y-5 transition-all duration-500 ease-in-out scroll-mt-24 ${
              activeStep === 'step03'
                ? 'border-[#e06c53] border-l-[#e06c53] ring-1 ring-[#e06c53]/30 shadow-[#e06c53]/5'
                : 'border-[#282520] border-l-[#e06c53] opacity-85 hover:opacity-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#e06c53]" />
              <span className="text-xs font-mono uppercase tracking-widest text-[#e06c53]">Step 03</span>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold font-serif text-[#f4efe4]">
              “We don&apos;t guess the gap. We witness it.”
            </h2>

            <div className="space-y-4 text-sm text-[#ccc6b8] leading-relaxed font-sans">
              <p>
                Where the official network is silent and the algorithm only guesses, the people who live there still know their air — the exhaust at the school gate, the smell on a still evening. &quot;Not measured&quot; has never meant &quot;not happening.&quot; Instead of letting the model quietly close the gap, this map invites residents to leave a mark in the blank — turning a forgotten void into a public record kept by the people who noticed.
              </p>
            </div>

            {/* Mobile Inline Visual Anchor for STEP 03 */}
            <div className="block lg:hidden pt-2">
              <div className="text-[11px] font-semibold text-[#e06c53] mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>Visual Preview: Dark Void with Citizen Marks</span>
              </div>
              <div className="rounded-xl overflow-hidden border border-[#38332a] bg-[#141311]">
                <MapView
                  filterState={filterState}
                  setFilterState={setFilterState}
                  splitRatio={splitRatio}
                  setSplitRatio={setSplitRatio}
                  onSelectBorough={onSelectBorough}
                  activeWitnessMarkMode={activeWitnessMarkMode}
                  onPlaceWitnessMark={onPlaceWitnessMark}
                />
              </div>
            </div>

            {/* Embedded Hand-off Deep-dive Button 3 */}
            <div className="pt-4 border-t border-[#282520] flex flex-wrap items-center justify-between gap-4">
              <button
                onClick={() => onNavigateToDeepDive('witness', 'node-witness')}
                className="w-full px-6 py-3.5 rounded-xl bg-[#e06c53] text-[#ffffff] font-bold text-xs hover:bg-[#c95941] transition-all shadow-xl hover:scale-[1.01] flex items-center justify-center gap-2 group"
              >
                <MapPin className="w-4 h-4" />
                <span>Leave your mark on the map →</span>
              </button>
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN: STICKY GRAPHIC PANE (Desktop Only) */}
        <div className="hidden lg:block lg:col-span-7 lg:sticky lg:top-[70px] z-20 space-y-3">
          
          {/* Sticky Visual Header & Interactive Controls */}
          <div className="bg-[#181714] border border-[#282520] rounded-2xl p-4 shadow-2xl space-y-3 motion-safe:transition-all motion-safe:duration-500 motion-reduce:transition-none">
            <div className="flex items-center justify-between border-b border-[#282520] pb-2.5">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  activeStep === 'hero' ? 'bg-[#e5c158] animate-pulse' :
                  activeStep === 'step01' ? 'bg-[#e5c158]' :
                  activeStep === 'step02' ? 'bg-[#5294e2]' : 'bg-[#e06c53]'
                }`} />
                <span className="text-xs font-bold uppercase tracking-wider text-[#f4efe4]">
                  {activeStep === 'hero' && 'Step 00 · Complete Model Surface'}
                  {activeStep === 'step01' && 'Step 01 · Structural Absence Curtain'}
                  {activeStep === 'step02' && 'Step 02 · Station Lifelines & Attrition'}
                  {activeStep === 'step03' && 'Step 03 · Dark Void & Citizen Counter-Map'}
                </span>
              </div>

              <span className="text-[11px] text-[#9e988a]">
                Showing <strong className="text-[#e5c158]">{filterState.pollutant}</strong> ({filterState.year})
              </span>
            </div>

            {/* Quick Interactive Map Controls */}
            <div className="grid grid-cols-12 gap-2 items-center text-xs">
              {/* Pollutant selector */}
              <div className="col-span-6 bg-[#141311] border border-[#282520] p-1.5 rounded-xl flex items-center gap-1.5">
                <span className="text-[10px] font-semibold text-[#858073] pl-1">
                  Pollutant:
                </span>
                <div className="grid grid-cols-4 gap-1 w-full">
                  {pollutants.map((p) => {
                    const isSelected = filterState.pollutant === p;
                    return (
                      <button
                        key={p}
                        onClick={() => handlePollutantChange(p)}
                        className={`py-1 px-1 rounded text-center transition-all text-[10px] font-semibold ${
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

              {/* Year slider */}
              <div className="col-span-6 bg-[#141311] border border-[#282520] p-1.5 rounded-xl flex items-center gap-2">
                <span className="text-[10px] font-semibold text-[#858073] whitespace-nowrap">
                  Year: <strong className="text-[#e5c158] text-xs font-mono">{filterState.year}</strong>
                </span>
                <input
                  type="range"
                  min={2000}
                  max={2024}
                  step={1}
                  value={filterState.year}
                  onChange={handleYearChange}
                  className="w-full accent-[#e5c158] bg-[#282520] h-1.5 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Active Step Caption Subtitle */}
            <div className="text-xs text-[#ccc6b8] bg-[#141311] p-2.5 rounded-xl border border-[#282520] flex items-center justify-between">
              <span className="italic">
                {activeStep === 'hero' && 'Seamless surface: algorithmic interpolation projects total coverage.'}
                {activeStep === 'step01' && 'Split view: exposing road bias (64%) and residential gaps (+78%).'}
                {activeStep === 'step02' && '30-year decline: stations decommissioned due to council funding cuts.'}
                {activeStep === 'step03' && 'Counter-archive: residents placing witness marks in unmonitored voids.'}
              </span>
              
              <div className="flex items-center gap-1 text-[10px] text-[#9e988a] ml-2 shrink-0">
                <span>Curtain:</span>
                <button
                  onClick={() => { isManualOverrideRef.current = true; setSplitRatio(1.0); }}
                  className={`px-1.5 py-0.5 rounded ${splitRatio >= 0.9 ? 'bg-[#e5c158] text-[#141311] font-bold' : 'bg-[#22201c] text-[#9e988a]'}`}
                >
                  Smooth
                </button>
                <button
                  onClick={() => { isManualOverrideRef.current = true; setSplitRatio(0.48); }}
                  className={`px-1.5 py-0.5 rounded ${splitRatio > 0.1 && splitRatio < 0.9 ? 'bg-[#e5c158] text-[#141311] font-bold' : 'bg-[#22201c] text-[#9e988a]'}`}
                >
                  Split
                </button>
                <button
                  onClick={() => { isManualOverrideRef.current = true; setSplitRatio(0.05); }}
                  className={`px-1.5 py-0.5 rounded ${splitRatio <= 0.1 ? 'bg-[#e06c53] text-[#ffffff] font-bold' : 'bg-[#22201c] text-[#9e988a]'}`}
                >
                  Dark
                </button>
              </div>
            </div>

            {/* The Sticky Map Container */}
            <div className="rounded-xl overflow-hidden border border-[#282520] shadow-xl motion-safe:transition-all motion-safe:duration-500 motion-reduce:transition-none">
              <MapView
                filterState={filterState}
                setFilterState={setFilterState}
                splitRatio={splitRatio}
                setSplitRatio={setSplitRatio}
                onSelectBorough={onSelectBorough}
                activeWitnessMarkMode={activeWitnessMarkMode}
                onPlaceWitnessMark={onPlaceWitnessMark}
              />
            </div>
          </div>

        </div>

      </div>

      {/* Theory Rationale Modal */}
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
                Why this design · Theory
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
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


