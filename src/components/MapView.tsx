import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { BoroughGeoFeature, FilterState } from '../types';
import { LONDON_BOROUGHS_GEOJSON, LAQN_STATIONS, POLLUTANT_METADATA } from '../data/londonData';
import { getRampColor, getBoroughPollutantValue } from '../utils/analytics';
import { Search, Info, MapPin, AlertCircle, Sparkles, Database, ExternalLink, X } from 'lucide-react';

interface MapViewProps {
  filterState: FilterState;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  splitRatio: number; // 0 to 1
  setSplitRatio: (ratio: number) => void;
  onSelectBorough: (borough: BoroughGeoFeature) => void;
  activeWitnessMarkMode: boolean;
  onPlaceWitnessMark?: (lat: number, lon: number) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  filterState,
  splitRatio,
  setSplitRatio,
  onSelectBorough,
  activeWitnessMarkMode,
  onPlaceWitnessMark,
}) => {
  const leftContainerRef = useRef<HTMLDivElement>(null);
  const rightContainerRef = useRef<HTMLDivElement>(null);
  const parentContainerRef = useRef<HTMLDivElement>(null);

  const mapLeftRef = useRef<L.Map | null>(null);
  const mapRightRef = useRef<L.Map | null>(null);
  const isSyncingRef = useRef(false);

  // Layer Refs
  const leftGeoJsonRef = useRef<L.GeoJSON | null>(null);
  const rightGeoJsonRef = useRef<L.GeoJSON | null>(null);
  const stationsGroupRef = useRef<L.LayerGroup | null>(null);

  const [postcodeQuery, setPostcodeQuery] = useState('');
  const [hoveredBorough, setHoveredBorough] = useState<BoroughGeoFeature | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);
  const [isDraggingCurtain, setIsDraggingCurtain] = useState(false);
  const [showDataSourcesModal, setShowDataSourcesModal] = useState(false);

  const pollutant = filterState.pollutant;
  const year = filterState.year;
  const meta = POLLUTANT_METADATA[pollutant] || POLLUTANT_METADATA.NO2;

  // 1. INITIALIZE DUAL SYNCHRONIZED LEAFLET MAPS ONCE
  useEffect(() => {
    if (!leftContainerRef.current || !rightContainerRef.current) return;
    if (mapLeftRef.current || mapRightRef.current) return;

    const initialCenter: L.LatLngExpression = [51.505, -0.09];
    const initialZoom = 10;

    // LEFT MAP (Smooth Model & Colored Concentration Blocks)
    const mapLeft = L.map(leftContainerRef.current, {
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: true,
      minZoom: 9,
      maxZoom: 18,
    }).setView(initialCenter, initialZoom);

    L.control.zoom({ position: 'bottomright' }).addTo(mapLeft);

    // CartoDB Voyager Basemap (Detailed Street, River & Neighborhoods)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(mapLeft);

    // Left GeoJSON Layer (Borough Polygons with Pollutant Color Blocks & Sharp White Borders)
    const leftGeoJson = L.geoJSON(LONDON_BOROUGHS_GEOJSON as any, {
      style: (feature: any) => {
        const bData = getBoroughPollutantValue(
          feature as BoroughGeoFeature,
          'NO2',
          2024,
          LAQN_STATIONS
        );
        const rgb = getRampColor(bData.val, POLLUTANT_METADATA.NO2.maxVal);
        return {
          color: '#ffffff',
          weight: 2,
          opacity: 0.95,
          fillColor: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`,
          fillOpacity: 0.8, // Rich, clean color block strictly inside borough boundaries
        };
      },
      onEachFeature: (feature, layer) => {
        layer.on({
          mouseover: (e) => {
            (layer as L.Path).setStyle({ weight: 3.5, color: '#ffd700', fillOpacity: 0.92 });
            setHoveredBorough(feature as BoroughGeoFeature);
            setHoverPos({ x: e.containerPoint.x, y: e.containerPoint.y });
          },
          mousemove: (e) => {
            setHoverPos({ x: e.containerPoint.x, y: e.containerPoint.y });
          },
          mouseout: () => {
            if (leftGeoJsonRef.current) leftGeoJsonRef.current.resetStyle(layer as L.Path);
            setHoveredBorough(null);
            setHoverPos(null);
          },
          click: () => {
            onSelectBorough(feature as BoroughGeoFeature);
          },
        });
      },
    }).addTo(mapLeft);
    leftGeoJsonRef.current = leftGeoJson;

    // RIGHT MAP (Dark Unmonitored Void & Station Light Pools)
    const mapRight = L.map(rightContainerRef.current, {
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: true,
      minZoom: 9,
      maxZoom: 18,
    }).setView(initialCenter, initialZoom);

    // CartoDB Dark Matter Basemap
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(mapRight);

    // Right GeoJSON Layer (Unmonitored dark zones with dashed red borders)
    const rightGeoJson = L.geoJSON(LONDON_BOROUGHS_GEOJSON as any, {
      style: (feature: any) => {
        const isUnmonitored = feature.properties.monitorsByPollutant['NO2'] === 0;
        return {
          color: isUnmonitored ? '#e06c53' : 'rgba(212, 206, 189, 0.4)',
          weight: isUnmonitored ? 2.5 : 1,
          dashArray: isUnmonitored ? '6, 6' : undefined,
          fillColor: isUnmonitored ? '#12100d' : '#1a1815',
          fillOpacity: 0.88,
        };
      },
      onEachFeature: (feature, layer) => {
        layer.on({
          mouseover: (e) => {
            (layer as L.Path).setStyle({ weight: 3.5, color: '#ffd700', fillOpacity: 0.95 });
            setHoveredBorough(feature as BoroughGeoFeature);
            setHoverPos({ x: e.containerPoint.x, y: e.containerPoint.y });
          },
          mousemove: (e) => {
            setHoverPos({ x: e.containerPoint.x, y: e.containerPoint.y });
          },
          mouseout: () => {
            if (rightGeoJsonRef.current) rightGeoJsonRef.current.resetStyle(layer as L.Path);
            setHoveredBorough(null);
            setHoverPos(null);
          },
          click: () => {
            onSelectBorough(feature as BoroughGeoFeature);
          },
        });
      },
    }).addTo(mapRight);
    rightGeoJsonRef.current = rightGeoJson;

    // Station Glowing Light Pools Group in Right Map
    const stationsGroup = L.layerGroup([]).addTo(mapRight);
    stationsGroupRef.current = stationsGroup;

    // Witness mark placement on click
    mapLeft.on('click', (e) => {
      if (activeWitnessMarkMode && onPlaceWitnessMark) {
        onPlaceWitnessMark(e.latlng.lat, e.latlng.lng);
      }
    });
    mapRight.on('click', (e) => {
      if (activeWitnessMarkMode && onPlaceWitnessMark) {
        onPlaceWitnessMark(e.latlng.lat, e.latlng.lng);
      }
    });

    // MAP SYNCHRONIZATION LISTENERS (Bi-directional smoothly synchronized pan/zoom)
    const syncLeftToRight = () => {
      if (isSyncingRef.current || !mapRightRef.current) return;
      isSyncingRef.current = true;
      mapRightRef.current.setView(mapLeft.getCenter(), mapLeft.getZoom(), { animate: false });
      isSyncingRef.current = false;
    };

    const syncRightToLeft = () => {
      if (isSyncingRef.current || !mapLeftRef.current) return;
      isSyncingRef.current = true;
      mapLeftRef.current.setView(mapRight.getCenter(), mapRight.getZoom(), { animate: false });
      isSyncingRef.current = false;
    };

    mapLeft.on('move', syncLeftToRight);
    mapRight.on('move', syncRightToLeft);

    mapLeftRef.current = mapLeft;
    mapRightRef.current = mapRight;

    return () => {
      mapLeft.remove();
      mapRight.remove();
      mapLeftRef.current = null;
      mapRightRef.current = null;
    };
  }, []);

  // 2. UPDATE FILTER STATE & POLLUTANT COLORS INSTANTLY
  useEffect(() => {
    if (!mapLeftRef.current || !mapRightRef.current) return;

    // Update Left Borough Polygons (Vivid pollutant color blocks & filter opacity)
    if (leftGeoJsonRef.current) {
      leftGeoJsonRef.current.setStyle((feature: any) => {
        const bFeature = feature as BoroughGeoFeature;
        const imd = bFeature.properties.imdDecile;

        const isCoverageMatch =
          filterState.coverageFilter === 'ALL' ||
          (filterState.coverageFilter === 'MONITORED_ONLY' && bFeature.properties.monitorsByPollutant[pollutant] > 0) ||
          (filterState.coverageFilter === 'UNMONITORED_DARK' && bFeature.properties.monitorsByPollutant[pollutant] === 0);

        const isImdMatch = imd >= filterState.imdRange[0] && imd <= filterState.imdRange[1];

        const bData = getBoroughPollutantValue(bFeature, pollutant, year, LAQN_STATIONS);
        const rgb = getRampColor(bData.val, meta.maxVal);

        if (!isCoverageMatch || !isImdMatch) {
          return {
            color: 'rgba(200, 200, 200, 0.4)',
            weight: 1,
            fillColor: '#444444',
            fillOpacity: 0.25,
          };
        }

        return {
          color: '#ffffff',
          weight: 2,
          opacity: 0.95,
          fillColor: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`,
          fillOpacity: 0.8, // High-contrast, vibrant pollutant color block strictly bounded by borough polygon
        };
      });
    }

    // Update Right Borough Polygons (Dark unmonitored zones)
    if (rightGeoJsonRef.current) {
      rightGeoJsonRef.current.setStyle((feature: any) => {
        const bFeature = feature as BoroughGeoFeature;
        const count = bFeature.properties.monitorsByPollutant[pollutant] || 0;
        const isUnmonitored = count === 0;

        return {
          color: isUnmonitored ? '#e06c53' : 'rgba(212, 206, 189, 0.4)',
          weight: isUnmonitored ? 2.5 : 1,
          dashArray: isUnmonitored ? '6, 6' : undefined,
          fillColor: isUnmonitored ? '#12100d' : '#1a1815',
          fillOpacity: 0.88,
        };
      });
    }

    // Update Physical Station Glowing Light Dots on Right Map
    if (stationsGroupRef.current) {
      stationsGroupRef.current.clearLayers();

      const activeStations = LAQN_STATIONS.filter(
        (s) =>
          s.readings[pollutant] !== null &&
          s.readings[pollutant] !== undefined &&
          s.activeYears[0] <= year &&
          s.activeYears[1] >= year &&
          (filterState.stationTypes.length === 0 || filterState.stationTypes.includes(s.type))
      );

      activeStations.forEach((st) => {
        const val = st.readings[pollutant] || 0;

        // Outer glowing light circle pool
        const glowCircle = L.circle([st.lat, st.lon], {
          radius: 1800,
          color: '#ffd700',
          weight: 1.5,
          opacity: 0.7,
          fillColor: '#e5c158',
          fillOpacity: 0.3,
        });

        // Core bright station marker
        const coreMarker = L.circleMarker([st.lat, st.lon], {
          radius: 7,
          color: '#ffffff',
          weight: 2.5,
          fillColor: '#ffd700',
          fillOpacity: 1,
        });

        coreMarker.bindTooltip(
          `<div class="p-1 font-sans"><strong class="text-[#e5c158]">${st.name}</strong><br/>${pollutant} (${year}): <strong>${val} ${meta.unit}</strong><br/><span class="text-[10px] text-gray-300">${st.type}</span></div>`,
          { direction: 'top', className: 'custom-leaflet-tooltip' }
        );

        stationsGroupRef.current?.addLayer(glowCircle);
        stationsGroupRef.current?.addLayer(coreMarker);
      });
    }
  }, [pollutant, year, filterState, meta.maxVal]);

  // Pointer move handler for split curtain dragging
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingCurtain || !parentContainerRef.current) return;
    const rect = parentContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = Math.max(0.02, Math.min(0.98, x / rect.width));
    setSplitRatio(ratio);
  };

  // Search Postcode
  const handleSearchPostcode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postcodeQuery.trim() || !mapLeftRef.current) return;

    const q = postcodeQuery.toLowerCase().trim();

    const postcodeMap: Record<string, [number, number]> = {
      se28: [51.503, 0.115],
      e1: [51.515, -0.072],
      ec1: [51.524, -0.1],
      sw1: [51.497, -0.136],
      n1: [51.538, -0.099],
      nw1: [51.535, -0.145],
      w1: [51.515, -0.145],
      e5: [51.558, -0.05],
      w5: [51.515, -0.301],
      n3: [51.605, -0.198],
    };

    let targetCoord: [number, number] = [51.505, -0.09];
    for (const key in postcodeMap) {
      if (q.startsWith(key)) {
        targetCoord = postcodeMap[key];
        break;
      }
    }

    mapLeftRef.current.flyTo(targetCoord, 12.5, { duration: 1.2 });
  };

  // Compute hovered borough info
  const hoveredPollutantData = hoveredBorough
    ? getBoroughPollutantValue(hoveredBorough, pollutant, year, LAQN_STATIONS)
    : null;

  const hoveredColorRgb = hoveredPollutantData
    ? getRampColor(hoveredPollutantData.val, meta.maxVal)
    : [200, 200, 200];

  // Effective split ratio calculation
  // When ratio <= 0.05, collapse fully to 0 (Dark state)
  // When ratio >= 0.95, expand fully to 1 (Smooth state)
  const effectiveSplitRatio = splitRatio <= 0.05 ? 0 : (splitRatio >= 0.95 ? 1 : splitRatio);
  const pct = effectiveSplitRatio * 100;
  const handleLeftPos = Math.max(2, Math.min(98, pct));

  return (
    <div
      ref={parentContainerRef}
      style={{ isolation: 'isolate' }}
      className="relative w-full h-[540px] md:h-[620px] bg-[#141311] border border-[#282520] rounded-2xl overflow-hidden shadow-2xl select-none isolate z-0"
      onPointerMove={handlePointerMove}
      onPointerUp={() => setIsDraggingCurtain(false)}
    >
      {/* LEFT MAP WRAPPER (Clipped smooth map with pollutant color blocks for each London Borough) */}
      <div
        style={{
          clipPath: `polygon(0 0, ${pct}% 0, ${pct}% 100%, 0 100%)`,
          opacity: effectiveSplitRatio === 0 ? 0 : 1,
          visibility: effectiveSplitRatio === 0 ? 'hidden' : 'visible',
          pointerEvents: effectiveSplitRatio === 0 ? 'none' : 'auto',
        }}
        className="absolute inset-0 w-full h-full z-10 transition-opacity duration-300"
      >
        <div ref={leftContainerRef} className="w-full h-full bg-[#141311]" />
      </div>

      {/* RIGHT MAP WRAPPER (Clipped dark unmonitored void map with station light pools) */}
      <div
        style={{
          clipPath: effectiveSplitRatio === 0
            ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
            : `polygon(${pct}% 0, 100% 0, 100% 100%, ${pct}% 100%)`,
          opacity: effectiveSplitRatio === 1 ? 0 : 1,
          visibility: effectiveSplitRatio === 1 ? 'hidden' : 'visible',
          pointerEvents: effectiveSplitRatio === 1 ? 'none' : 'auto',
        }}
        className="absolute inset-0 w-full h-full z-20 transition-opacity duration-300"
      >
        <div ref={rightContainerRef} className="w-full h-full bg-[#100f0d]" />
      </div>

      {/* Split Curtain Drag Handle */}
      <div
        style={{ left: `${handleLeftPos}%` }}
        className="absolute top-0 bottom-0 w-2 bg-[#e5c158] z-[500] cursor-ew-resize -translate-x-1/2 shadow-2xl hover:bg-[#fff0a0] transition-colors"
        onPointerDown={() => setIsDraggingCurtain(true)}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#1b1916] text-[#e5c158] shadow-2xl border-2 border-[#e5c158] flex items-center justify-center font-bold text-xs hover:scale-110 transition-transform">
          ↔
        </div>
      </div>

      {/* Top Header Overlay Bar (Reflowed to avoid panel overlaps and edge clipping) */}
      <div className="absolute top-3 left-3 right-3 z-[450] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Active Mode Badge */}
        <div className="pointer-events-auto">
          {effectiveSplitRatio === 0 ? (
            <div className="bg-[#e06c53] text-[#ffffff] font-bold px-3 py-1.5 rounded-full text-xs shadow-lg flex items-center gap-1.5 border border-[#e06c53]/40">
              <MapPin className="w-3.5 h-3.5" />
              <span>Physical Monitors & Data Void</span>
            </div>
          ) : effectiveSplitRatio === 1 ? (
            <div className="bg-[#1b1916]/95 text-[#e6e2d8] border border-[#302d26] px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-md flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#e5c158]" />
              <span>Borough Pollutant Model ({pollutant})</span>
            </div>
          ) : (
            <div className="bg-[#1b1916]/95 text-[#e6e2d8] border border-[#302d26] px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-md flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#e5c158]" />
              <span className="hidden sm:inline">Borough Model</span>
              <span className="text-[#e5c158] font-bold">↔</span>
              <span>Monitors & Void</span>
            </div>
          )}
        </div>

        {/* Postcode Search & Data Scope Controls */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="bg-[#1b1916]/95 border border-[#302d26] p-1.5 rounded-xl shadow-lg w-40 sm:w-56 backdrop-blur-md">
            <form onSubmit={handleSearchPostcode} className="flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-[#9e988a] flex-shrink-0 ml-1" />
              <input
                type="text"
                placeholder="Postcode (SE28, W5)..."
                value={postcodeQuery}
                onChange={(e) => setPostcodeQuery(e.target.value)}
                className="w-full bg-transparent text-xs text-[#f4efe4] placeholder-[#7d786c] outline-none font-medium min-w-0"
              />
              <button
                type="submit"
                className="bg-[#e5c158] text-[#141311] text-[10px] font-bold px-2 py-0.5 rounded-lg hover:bg-[#d4b047] transition-colors shrink-0"
              >
                Go
              </button>
            </form>
          </div>

          <button
            onClick={() => setShowDataSourcesModal(true)}
            className="bg-[#1b1916]/95 border border-[#302d26] hover:border-[#e5c158]/50 text-[#e5c158] px-2.5 py-1.5 rounded-xl shadow-lg backdrop-blur-md flex items-center gap-1 text-xs font-medium transition-all"
            title="Data Sources & Scope Info"
          >
            <Database className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Data Scope Info</span>
          </button>
        </div>
      </div>

      {/* Legend Card with Pollutant Concentration Color Scale */}
      <div className="absolute bottom-3 left-3 z-[450] bg-[#1b1916]/95 border border-[#302d26] p-3 rounded-xl shadow-2xl w-[260px] sm:w-[290px] max-w-[calc(100%-1.5rem)] text-xs text-[#e6e2d8] backdrop-blur-md pointer-events-auto">
        <div className="flex items-center justify-between font-bold mb-1 gap-1">
          <span className="text-[#e5c158] font-bold text-xs sm:text-sm whitespace-nowrap">
            {pollutant === 'PM25' ? 'PM2.5' : pollutant === 'PM10' ? 'PM10' : pollutant === 'NO2' ? 'NO₂' : 'O₃'} ({year})
          </span>
          <span className="text-[#9e988a] font-normal text-[10px] shrink-0">{meta.unit}</span>
        </div>
        <div className="h-2.5 rounded-full w-full my-1.5 bg-gradient-to-r from-[#2f9e6e] via-[#8ac96a] via-[#e6d66b] via-[#f0b053] via-[#e88742] to-[#cf4f3a] shadow-inner" />
        <div className="flex justify-between text-[10px] text-[#9e988a] font-mono">
          <span>0</span>
          <span className="text-[#8ac96a]">WHO: {meta.whoLimit}</span>
          <span className="text-[#f0b053]">UK: {meta.ukLimit}</span>
          <span className="text-[#cf4f3a]">{meta.maxVal}+</span>
        </div>
        <p className="text-[10px] text-[#858073] mt-1.5 italic leading-tight">
          {effectiveSplitRatio === 0
            ? 'Dark Void mode: Showing unmonitored residential gaps and active physical station light pools.'
            : effectiveSplitRatio === 1
            ? 'Smooth Model mode: Showing interpolated pollutant concentrations across London Boroughs.'
            : 'Split view: Left shows borough model; Right shows physical monitors & unmonitored void. Drag ↔ curtain to compare.'}
        </p>
      </div>

      {/* Hover Tooltip with Google Maps Link */}
      {hoveredBorough && hoverPos && hoveredPollutantData && (
        <div
          style={{
            left: `${Math.min(window.innerWidth - 310, hoverPos.x + 15)}px`,
            top: `${Math.min(460, hoverPos.y + 15)}px`,
          }}
          className="absolute z-[600] bg-[#181714] text-[#f4efe4] border border-[#e5c158]/40 rounded-xl p-3.5 shadow-2xl pointer-events-none w-72 text-xs"
        >
          <div className="flex items-center justify-between font-semibold border-b border-[#2d2922] pb-2 mb-2">
            <span className="text-sm text-[#e5c158] font-serif">{hoveredBorough.properties.name}</span>
            <span className="text-[10px] bg-[#282520] px-2 py-0.5 rounded text-[#a8a295]">
              IMD Decile {hoveredBorough.properties.imdDecile}/10
            </span>
          </div>

          <div className="space-y-2 text-[11px] text-[#ccc6b8]">
            {/* Pollutant Concentration Badge */}
            <div className="flex items-center justify-between bg-[#23201a] p-2 rounded-lg border border-[#38332a]">
              <span className="font-medium text-[#a8a295]">{pollutant} ({year}):</span>
              <div className="flex items-center gap-1.5 font-bold text-sm">
                <span
                  className="w-3 h-3 rounded-full inline-block shadow-sm"
                  style={{ backgroundColor: `rgb(${hoveredColorRgb[0]}, ${hoveredColorRgb[1]}, ${hoveredColorRgb[2]})` }}
                />
                <span style={{ color: `rgb(${hoveredColorRgb[0]}, ${hoveredColorRgb[1]}, ${hoveredColorRgb[2]})` }}>
                  {hoveredPollutantData.val} {meta.unit}
                </span>
              </div>
            </div>

            <div className="flex justify-between">
              <span>Population:</span>
              <span className="font-semibold text-[#f4efe4]">{hoveredBorough.properties.population.toLocaleString()}</span>
            </div>

            <div className="flex justify-between">
              <span>Children (&lt;18):</span>
              <span className="font-semibold text-[#e06c53]">
                {hoveredBorough.properties.childPopulation.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Active {pollutant} Monitors:</span>
              <span
                className={`font-semibold ${
                  hoveredPollutantData.monitorCount > 0 ? 'text-[#7ebf69]' : 'text-[#e06c53]'
                }`}
              >
                {hoveredPollutantData.monitorCount} active
              </span>
            </div>

            {/* Google Maps External Deep Link */}
            <div className="pt-1.5 border-t border-[#2d2922] flex justify-between items-center text-[10px]">
              <span className="text-[#858073]">Deep Detail View:</span>
              <a
                href={`https://www.google.com/maps/@51.505,-0.09,12z`}
                target="_blank"
                rel="noreferrer"
                className="text-[#e5c158] hover:underline flex items-center gap-1 font-semibold pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <span>Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {hoveredPollutantData.monitorCount === 0 ? (
              <div className="bg-[#2d1b18] border border-[#592620] p-2 rounded-lg text-[10px] text-[#f29b8a] mt-1">
                <AlertCircle className="w-3.5 h-3.5 inline mr-1 text-[#e06c53] flex-shrink-0" />
                <strong>Unmeasured Dark Zone (MNAR):</strong> Zero active direct sensors. Concentration ({hoveredPollutantData.val} {meta.unit}) is estimated via spatial IDW model.
              </div>
            ) : (
              <div className="bg-[#1b281d] border border-[#2e4732] p-2 rounded-lg text-[10px] text-[#a1d99b] mt-1">
                <Info className="w-3.5 h-3.5 inline mr-1 text-[#7ebf69] flex-shrink-0" />
                Direct physical monitoring station active in this borough.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Witness Mode Banner */}
      {activeWitnessMarkMode && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[450] bg-[#e06c53] text-[#ffffff] font-semibold text-xs px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 animate-pulse">
          <MapPin className="w-4 h-4" />
          <span>Click on any unmonitored zone to place a Citizen Witness Mark</span>
        </div>
      )}

      {/* Data Scope Explanation Modal */}
      {showDataSourcesModal && (
        <div className="absolute inset-0 z-[700] bg-[#12110e]/85 backdrop-blur-md p-6 flex items-center justify-center">
          <div className="bg-[#1b1916] border border-[#302d26] rounded-2xl p-6 max-w-xl w-full text-[#f4efe4] shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowDataSourcesModal(false)}
              className="absolute top-4 right-4 text-[#9e988a] hover:text-[#f4efe4] p-1 rounded-lg bg-[#282520]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 border-b border-[#2d2922] pb-3">
              <Database className="w-5 h-5 text-[#e5c158]" />
              <h3 className="text-lg font-bold font-serif text-[#e5c158]">
                Data Scope & External Map Links
              </h3>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-[#ccc6b8]">
              <div className="bg-[#23201a] p-3 rounded-xl border border-[#38332a]">
                <h4 className="font-semibold text-[#e5c158] text-sm mb-1">
                  1. Spatial Extent & Borough Coverage
                </h4>
                <p>
                  The map precisely covers all <strong>33 Greater London Boroughs</strong>. Each borough is rendered with pollutant-specific choropleth colors bounded strictly within official administrative boundaries.
                </p>
                <p className="mt-1 text-[#a8a295]">
                  The right "Data Absence" layer highlights the extreme spatial inequality and blind spots of <strong>physical monitoring stations</strong>, where many residential areas lack active sensors (MNAR).
                </p>
              </div>

              <div className="bg-[#23201a] p-3 rounded-xl border border-[#38332a]">
                <h4 className="font-semibold text-[#e5c158] text-sm mb-1">
                  2. External Map View (Google Maps)
                </h4>
                <p>
                  For street-level building detail, major traffic corridors, or satellite views, click the "Google Maps ↗" button in any borough popup to inspect the exact location.
                </p>
              </div>

              <div className="bg-[#23201a] p-3 rounded-xl border border-[#38332a]">
                <h4 className="font-semibold text-[#e5c158] text-sm mb-1">
                  3. Primary Data Sources
                </h4>
                <ul className="list-disc pl-4 space-y-1 text-[#ccc6b8]">
                  <li>
                    <strong>LAQN (London Air Quality Network)</strong>: Historical station readings operated by Imperial College London (NO₂, PM2.5, PM10, O3).
                  </li>
                  <li>
                    <strong>UK Ministry of Housing (MHCLG)</strong>: Index of Multiple Deprivation 2019 (IMD Deciles 1–10).
                  </li>
                  <li>
                    <strong>ONS & GLA</strong>: Office for National Statistics & GLA demographic census datasets.
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowDataSourcesModal(false)}
                className="bg-[#e5c158] text-[#141311] font-semibold px-4 py-1.5 rounded-lg text-xs hover:bg-[#d4b047] transition-colors"
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
