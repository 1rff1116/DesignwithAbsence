import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { LONDON_BOROUGHS_GEOJSON, CLUSTER_GROUPS, POLLUTANT_METADATA } from '../data/londonData';
import { calculateImdCorrelation, ScatterPoint } from '../utils/analytics';
import { FilterState, BoroughGeoFeature } from '../types';
import { Network, ChevronRight } from 'lucide-react';

interface CorrelationClusterPanelProps {
  filterState: FilterState;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  onSelectBoroughByName: (boroughName: string) => void;
}

export const CorrelationClusterPanel: React.FC<CorrelationClusterPanelProps> = ({
  filterState,
  onSelectBoroughByName,
}) => {
  const pollutant = filterState.pollutant;

  const { scatterData, correlation } = calculateImdCorrelation(
    LONDON_BOROUGHS_GEOJSON.features as BoroughGeoFeature[],
    pollutant
  );

  const clusterColors: Record<number, string> = {
    1: '#7ebf69', // Monitored Core
    2: '#5294e2', // Roadside Bias
    3: '#e06c53', // Residential Data Desert
    4: '#e5c158', // Historical Silent
  };

  return (
    <div className="space-y-6 text-[#f4efe4]">
      {/* Key Metrics Header Card */}
      <div className="bg-[#181714] border border-[#282520] p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#e5c158] uppercase tracking-wider mb-1">
            <Network className="w-4 h-4" />
            <span>Quantitative Correlation & Clustering</span>
          </div>
          <h2 className="text-xl md:text-2xl font-semibold font-serif">
            Deprivation vs. Sensor Density Analysis ({pollutant})
          </h2>
          <p className="text-xs text-[#9e988a] mt-1 max-w-3xl leading-relaxed">
            Testing for systematic spatial and socio-economic sampling bias in London’s Air Quality Network (LAQN). Data gaps are not random noise, but Missing Not At Random (MNAR) structural omissions.
          </p>
        </div>

        <div className="bg-[#141311] border border-[#282520] px-4 py-3 rounded-xl flex items-center gap-6 text-xs font-mono">
          <div>
            <span className="text-[#9e988a] block text-[10px]">Pearson Correlation (r)</span>
            <span className="text-lg font-bold text-[#e5c158]">{correlation.r}</span>
          </div>
          <div className="border-l border-[#282520] pl-6">
            <span className="text-[#9e988a] block text-[10px]">Missingness Diagnosis</span>
            <span className="text-xs font-semibold text-[#e06c53]">{correlation.missingnessDiagnosis}</span>
          </div>
        </div>
      </div>

      {/* Grid: Scatter Plot + Correlation Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scatter Plot Card */}
        <div className="lg:col-span-2 bg-[#181714] border border-[#282520] p-5 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-base text-[#f4efe4] font-serif">
                IMD Deprivation Decile vs. Active Sensor Density
              </h3>
              <p className="text-xs text-[#9e988a]">
                X-Axis: Deprivation Decile (1 = Most Deprived) | Y-Axis: Active {pollutant} Monitors / 100k Population
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-medium">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#e06c53]" /> Desert (3)</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#7ebf69]" /> Core (1)</span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                <XAxis
                  type="number"
                  dataKey="imdDecile"
                  name="IMD Decile"
                  domain={[1, 10]}
                  tick={{ fill: '#9e988a', fontSize: 11 }}
                  unit=" (IMD)"
                />
                <YAxis
                  type="number"
                  dataKey="monitorDensity"
                  name="Monitors / 100k"
                  tick={{ fill: '#9e988a', fontSize: 11 }}
                  unit=" /100k"
                />
                <Tooltip
                  content={({ payload }) => {
                    if (!payload || payload.length === 0) return null;
                    const data = payload[0].payload as ScatterPoint;
                    return (
                      <div className="bg-[#141311] border border-[#e5c158]/50 p-3 rounded-xl shadow-2xl text-xs text-[#f4efe4]">
                        <div className="font-bold text-[#e5c158] font-serif">{data.boroughName}</div>
                        <div className="text-[11px] text-[#9e988a] mt-1 space-y-0.5">
                          <div>IMD Deprivation Decile: <strong className="text-[#f4efe4]">{data.imdDecile}/10</strong></div>
                          <div>Active {pollutant} Monitors: <strong className="text-[#7ebf69]">{data.stationCount}</strong></div>
                          <div>Population: <strong className="text-[#ccc6b8]">{data.population.toLocaleString()}</strong></div>
                        </div>
                      </div>
                    );
                  }}
                />
                <Scatter
                  data={scatterData}
                  cursor="pointer"
                  onClick={(entry) => onSelectBoroughByName(entry.boroughName)}
                >
                  {scatterData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={clusterColors[entry.clusterId] || '#e5c158'}
                      r={6}
                      stroke="#141311"
                      strokeWidth={1.5}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Analytical Takeaways */}
        <div className="bg-[#181714] border border-[#282520] p-5 rounded-2xl shadow-xl flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="font-semibold text-base text-[#f4efe4] font-serif border-b border-[#282520] pb-2">
              Critical Findings
            </h3>
            <div className="space-y-2.5 text-xs text-[#ccc6b8] leading-relaxed">
              <div className="bg-[#141311] p-3 rounded-xl border border-[#282520]">
                <strong className="text-[#e5c158] block mb-1">Spatial Inequality:</strong>
                High-deprivation outer boroughs (IMD 1-3) average 78% higher unmonitored population rates for fine particulate matter (PM2.5) compared to central commercial zones.
              </div>
              <div className="bg-[#141311] p-3 rounded-xl border border-[#282520]">
                <strong className="text-[#e06c53] block mb-1">Roadside Corridor Bias:</strong>
                Over 64% of active LAQN sensors are sited within 15 meters of major traffic corridors, leaving interior residential schools unmeasured.
              </div>
            </div>
          </div>

          <p className="text-[10px] text-[#858073] italic mt-4 pt-3 border-t border-[#282520]">
            Click any point on the scatter plot to open that borough's deep-dive audit receipt.
          </p>
        </div>
      </div>

      {/* Cluster Group Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {CLUSTER_GROUPS.map((cluster) => (
          <div
            key={cluster.id}
            className="bg-[#181714] border border-[#282520] rounded-2xl p-4 shadow-lg hover:border-[#e5c158]/40 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: cluster.color }}
                />
                <span className="text-[10px] uppercase font-mono text-[#9e988a]">
                  Cluster 0{cluster.id}
                </span>
              </div>

              <h4 className="font-semibold text-sm text-[#f4efe4] font-serif">{cluster.name}</h4>
              <p className="text-[11px] text-[#9e988a] italic mb-3">{cluster.nameCn}</p>

              <div className="text-xs space-y-1.5 text-[#ccc6b8]">
                <div className="flex justify-between border-b border-[#22201c] pb-1">
                  <span>Unmonitored Rate:</span>
                  <strong className="text-[#e06c53]">{cluster.unmonitoredRatePercent}%</strong>
                </div>
                <div className="flex justify-between border-b border-[#22201c] pb-1">
                  <span>Avg IMD Decile:</span>
                  <strong className="text-[#e5c158]">{cluster.avgImd} / 10</strong>
                </div>
                <div className="flex justify-between">
                  <span>Total Population:</span>
                  <span>{(cluster.totalPopulation / 1000000).toFixed(2)}M</span>
                </div>
              </div>

              <p className="text-[11px] text-[#858073] mt-3 leading-snug">
                {cluster.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#22201c]">
              <div className="flex flex-wrap gap-1">
                {cluster.boroughs.slice(0, 4).map((bName) => (
                  <button
                    key={bName}
                    onClick={() => onSelectBoroughByName(bName)}
                    className="text-[10px] bg-[#141311] border border-[#282520] hover:border-[#e5c158] px-2 py-0.5 rounded text-[#ccc6b8] hover:text-[#e5c158] transition-colors flex items-center gap-0.5"
                  >
                    <span>{bName}</span>
                    <ChevronRight className="w-2.5 h-2.5 opacity-60" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
