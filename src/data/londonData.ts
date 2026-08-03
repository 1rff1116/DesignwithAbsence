import { BoroughFeatureCollection, ClusterGroup, PollutantMeta, Station, WitnessMark } from '../types';

export const POLLUTANT_METADATA: Record<string, PollutantMeta> = {
  NO2: {
    key: 'NO2',
    label: 'NO₂ (Nitrogen Dioxide)',
    unit: 'µg/m³',
    maxVal: 60,
    whoLimit: 10,
    ukLimit: 40,
    note: 'annual mean · combustion traffic pollutant',
    description: 'Emitted mainly by diesel vehicles and power generation. Concentrated heavily around road corridors, leaving residential interiors unmonitored.'
  },
  PM25: {
    key: 'PM25',
    label: 'PM₂.₅ (Fine Particles)',
    unit: 'µg/m³',
    maxVal: 25,
    whoLimit: 5,
    ukLimit: 20,
    note: 'annual mean · high health risk fine dust',
    description: 'Penetrates deep into lungs and blood vessels. Highly sparse sensor network in outer residential and high-deprivation boroughs.'
  },
  PM10: {
    key: 'PM10',
    label: 'PM₁₀ (Coarse Particles)',
    unit: 'µg/m³',
    maxVal: 45,
    whoLimit: 15,
    ukLimit: 40,
    note: 'annual mean · dust, brake & tire wear',
    description: 'Includes construction dust, road dust, and brake wear. Monitoring is heavily biased towards industrial or construction zones.'
  },
  O3: {
    key: 'O3',
    label: 'O₃ (Ground-level Ozone)',
    unit: 'µg/m³',
    maxVal: 80,
    whoLimit: 60,
    ukLimit: 100,
    note: 'peak season · secondary atmospheric pollutant',
    description: 'Formed by chemical reactions between NOx and volatile organic compounds in sunlight. Typically HIGHER in outer suburban parks where monitoring is lowest.'
  }
};

export const CLUSTER_GROUPS: ClusterGroup[] = [
  {
    id: 1,
    name: 'Monitored Core Hubs',
    nameCn: 'Central Dense Core',
    color: '#10b981',
    bgHex: 'rgba(16, 185, 129, 0.15)',
    boroughs: ['Westminster', 'Camden', 'Tower Hamlets', 'Greenwich', 'City of London'],
    avgImd: 5.2,
    totalPopulation: 1120000,
    unmonitoredRatePercent: 12,
    description: 'Central commercial and high-density transport nodes equipped with dense multi-pollutant monitoring stations.',
    criticalAnalysis: 'High sensor density provides rich data, but creates a false impression that all of London is equally well-measured.'
  },
  {
    id: 2,
    name: 'Roadside Corridor Bias',
    nameCn: 'Traffic Corridor Biased',
    color: '#3b82f6',
    bgHex: 'rgba(59, 130, 246, 0.15)',
    boroughs: ['Brent', 'Wandsworth', 'Lambeth', 'Merton', 'Hackney', 'Hammersmith and Fulham', 'Southwark', 'Lewisham'],
    avgImd: 3.8,
    totalPopulation: 2240000,
    unmonitoredRatePercent: 48,
    description: 'Stations are positioned exclusively along heavy A-roads and intersections, while residential schools and backstreets remain in the dark.',
    criticalAnalysis: 'Systematic MNAR bias: measurements capture vehicle exhaust but fail to represent true residential exposure for local families.'
  },
  {
    id: 3,
    name: 'Residential Data Deserts',
    nameCn: 'Residential Data Deserts',
    color: '#ef4444',
    bgHex: 'rgba(239, 68, 68, 0.15)',
    boroughs: ['Barnet', 'Ealing', 'Waltham Forest', 'Redbridge', 'Sutton', 'Harrow', 'Hounslow', 'Barking and Dagenham', 'Newham', 'Bexley', 'Enfield'],
    avgImd: 3.4,
    totalPopulation: 3450000,
    unmonitoredRatePercent: 78,
    description: 'Densely populated suburban and residential boroughs with hundreds of thousands of children, yet zero active PM2.5 or NO2 monitors.',
    criticalAnalysis: 'Extreme MNAR missingness. Over 3.4 million residents rely on spatial interpolation from monitors up to 8km away.'
  },
  {
    id: 4,
    name: 'Historical Attrition & Silent Zones',
    nameCn: 'Historical Decommissioned Voids',
    color: '#f59e0b',
    bgHex: 'rgba(245, 158, 11, 0.15)',
    boroughs: ['Islington', 'Kingston upon Thames', 'Croydon', 'Bromley', 'Havering', 'Hillingdon', 'Richmond upon Thames', 'Haringey'],
    avgImd: 5.8,
    totalPopulation: 2180000,
    unmonitoredRatePercent: 62,
    description: 'Boroughs that had historical monitoring stations between 1995-2015, which were closed due to local council budget cuts or site redevelopments.',
    criticalAnalysis: 'Temporal fragmentation (MAR/MNAR). Historical continuity is broken, erasing long-term air quality trend evaluation.'
  }
];

// 33 London Boroughs with GeoJSON and Demographic Metadata
export const LONDON_BOROUGHS_GEOJSON: BoroughFeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        name: 'Barking and Dagenham',
        imdDecile: 2,
        population: 212000,
        childPopulation: 58000,
        areaKm2: 36.1,
        clusterId: 3,
        primaryLandUse: 'Residential & Industrial',
        monitorsByPollutant: { NO2: 2, PM25: 0, PM10: 1, O3: 0 },
        unmonitoredRadiusKm: { NO2: 2.1, PM25: 6.4, PM10: 3.2, O3: 8.5 },
        missingnessType: { NO2: 'MAR', PM25: 'MNAR', PM10: 'MAR', O3: 'MNAR' }
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[0.190261, 51.552698], [0.184823, 51.556447], [0.184847, 51.559873], [0.182699, 51.561332], [0.185219, 51.565545], [0.173468, 51.565121], [0.161932, 51.561621], [0.151514, 51.568013], [0.146837, 51.568792], [0.149830, 51.569719], [0.147110, 51.576397], [0.147526, 51.580815], [0.151006, 51.583780], [0.151278, 51.589148], [0.151106, 51.595575], [0.149828, 51.597101], [0.147646, 51.596832], [0.148215, 51.599075], [0.146645, 51.599480], [0.129606, 51.590084], [0.131089, 51.587532], [0.126475, 51.586730], [0.127713, 51.581660], [0.132641, 51.581339], [0.133594, 51.579987], [0.130916, 51.579417], [0.131731, 51.577105], [0.129310, 51.576318], [0.129519, 51.573901], [0.131634, 51.571858], [0.129926, 51.571620], [0.129424, 51.566473], [0.119107, 51.563087], [0.117553, 51.559184], [0.120561, 51.558562], [0.119011, 51.557369], [0.113401, 51.557339], [0.112797, 51.556542], [0.114814, 51.555326], [0.111930, 51.552630], [0.108493, 51.552703], [0.093536, 51.545814], [0.092610, 51.549627], [0.078007, 51.544106], [0.068394, 51.544435], [0.066775, 51.540516], [0.069150, 51.537357], [0.067951, 51.536204], [0.069795, 51.536081], [0.072878, 51.529275], [0.075336, 51.529962], [0.085151, 51.525945], [0.092667, 51.525696], [0.092518, 51.522538], [0.095076, 51.520314], [0.094947, 51.517068], [0.099867, 51.514500], [0.099775, 51.511916], [0.108987, 51.511666], [0.129075, 51.515542], [0.158022, 51.508779], [0.164521, 51.527076], [0.170883, 51.532696], [0.174508, 51.538103], [0.179335, 51.540377], [0.180534, 51.544134], [0.185979, 51.547349], [0.190261, 51.552698]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'Barnet',
        imdDecile: 7,
        population: 395000,
        childPopulation: 92000,
        areaKm2: 86.7,
        clusterId: 3,
        primaryLandUse: 'Suburban Residential',
        monitorsByPollutant: { NO2: 0, PM25: 0, PM10: 0, O3: 0 },
        unmonitoredRadiusKm: { NO2: 5.8, PM25: 7.2, PM10: 6.9, O3: 8.1 },
        missingnessType: { NO2: 'MNAR', PM25: 'MNAR', PM10: 'MNAR', O3: 'MNAR' }
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[-0.273705, 51.638708], [-0.296121, 51.635481], [-0.303965, 51.636509], [-0.305569, 51.634155], [-0.287535, 51.617187], [-0.248251, 51.584395], [-0.254363, 51.581494], [-0.254383, 51.578872], [-0.251323, 51.573165], [-0.253099, 51.572467], [-0.251255, 51.570388], [-0.247323, 51.568449], [-0.246009, 51.572215], [-0.233408, 51.572008], [-0.213426, 51.555177], [-0.209932, 51.556797], [-0.208840, 51.555761], [-0.205964, 51.556470], [-0.205737, 51.555317], [-0.199372, 51.556220], [-0.196901, 51.560634], [-0.190872, 51.561813], [-0.189213, 51.565542], [-0.178037, 51.570459], [-0.174256, 51.569327], [-0.171140, 51.573640], [-0.169442, 51.574009], [-0.169581, 51.576808], [-0.167199, 51.578105], [-0.167166, 51.581581], [-0.165716, 51.583282], [-0.157132, 51.586233], [-0.160229, 51.588007], [-0.158645, 51.592084], [-0.161743, 51.597507], [-0.156729, 51.604953], [-0.153267, 51.602710], [-0.152986, 51.599262], [-0.151341, 51.597481], [-0.144449, 51.600158], [-0.141979, 51.603817], [-0.143404, 51.608878], [-0.138739, 51.610224], [-0.144489, 51.615517], [-0.135351, 51.621821], [-0.129098, 51.632301], [-0.134591, 51.633825], [-0.145055, 51.642683], [-0.147873, 51.642117], [-0.149127, 51.645297], [-0.151705, 51.645398], [-0.151021, 51.647242], [-0.152227, 51.648021], [-0.149872, 51.648829], [-0.152223, 51.649882], [-0.154741, 51.655568], [-0.185847, 51.662872], [-0.182066, 51.668640], [-0.187772, 51.667915], [-0.190989, 51.663984], [-0.196631, 51.665534], [-0.194834, 51.668342], [-0.198987, 51.668243], [-0.199854, 51.670207], [-0.203335, 51.670163], [-0.202213, 51.667842], [-0.205617, 51.668637], [-0.207943, 51.666631], [-0.211117, 51.666991], [-0.207847, 51.662897], [-0.219786, 51.660697], [-0.226449, 51.657197], [-0.228905, 51.660012], [-0.247854, 51.655283], [-0.250571, 51.656093], [-0.251321, 51.655253], [-0.249845, 51.654650], [-0.251865, 51.647248], [-0.257322, 51.641866], [-0.263195, 51.644847], [-0.264297, 51.643617], [-0.268332, 51.643827], [-0.268229, 51.642370], [-0.272815, 51.642099], [-0.273705, 51.638708]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'Bexley',
        imdDecile: 6,
        population: 248000,
        childPopulation: 54000,
        areaKm2: 60.6,
        clusterId: 3,
        primaryLandUse: 'Residential & Suburban',
        monitorsByPollutant: { NO2: 3, PM25: 2, PM10: 2, O3: 2 },
        unmonitoredRadiusKm: { NO2: 1.8, PM25: 2.5, PM10: 2.8, O3: 3.1 },
        missingnessType: { NO2: 'MONITORED', PM25: 'MONITORED', PM10: 'MONITORED', O3: 'MONITORED' }
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[0.134178, 51.514931], [0.125341, 51.515448], [0.118368, 51.513601], [0.120607, 51.511059], [0.121519, 51.487653], [0.124231, 51.476836], [0.118559, 51.478910], [0.112045, 51.473086], [0.108294, 51.476139], [0.102130, 51.474454], [0.098344, 51.475462], [0.096646, 51.473271], [0.093366, 51.472971], [0.082315, 51.466625], [0.082943, 51.459846], [0.078702, 51.459274], [0.085766, 51.456466], [0.088104, 51.447516], [0.086359, 51.445321], [0.087445, 51.443256], [0.082875, 51.443298], [0.084480, 51.442020], [0.080879, 51.440460], [0.077910, 51.436496], [0.075029, 51.435926], [0.076511, 51.434875], [0.074700, 51.432203], [0.083026, 51.430075], [0.092938, 51.421482], [0.107662, 51.414128], [0.113143, 51.412933], [0.129628, 51.414904], [0.148947, 51.408488], [0.152977, 51.408713], [0.153815, 51.411270], [0.149204, 51.412440], [0.151199, 51.415069], [0.151100, 51.417621], [0.154682, 51.418475], [0.151204, 51.420436], [0.153049, 51.421986], [0.153809, 51.427530], [0.155921, 51.430883], [0.164375, 51.428591], [0.166741, 51.431302], [0.166737, 51.435058], [0.172903, 51.443253], [0.176066, 51.442013], [0.184327, 51.444663], [0.187514, 51.446882], [0.187694, 51.448706], [0.191062, 51.448796], [0.193070, 51.451710], [0.198066, 51.451850], [0.203404, 51.454336], [0.203324, 51.458756], [0.210665, 51.462490], [0.211525, 51.468375], [0.208856, 51.470967], [0.211930, 51.473326], [0.211621, 51.475103], [0.216523, 51.476810], [0.216972, 51.479919], [0.220209, 51.480017], [0.223758, 51.482284], [0.212642, 51.485790], [0.195638, 51.484198], [0.185528, 51.485289], [0.180096, 51.488974], [0.175028, 51.501168], [0.169974, 51.505583], [0.134178, 51.514931]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'Brent',
        imdDecile: 4,
        population: 331000,
        childPopulation: 71000,
        areaKm2: 43.2,
        clusterId: 2,
        primaryLandUse: 'Urban Residential & Industrial',
        monitorsByPollutant: { NO2: 4, PM25: 4, PM10: 4, O3: 1 },
        unmonitoredRadiusKm: { NO2: 1.2, PM25: 1.5, PM10: 1.5, O3: 4.8 },
        missingnessType: { NO2: 'MONITORED', PM25: 'MONITORED', PM10: 'MONITORED', O3: 'MAR' }
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[-0.248251, 51.584395], [-0.267124, 51.600403], [-0.276485, 51.596548], [-0.290393, 51.593601], [-0.284624, 51.591041], [-0.282476, 51.585107], [-0.304819, 51.587086], [-0.326647, 51.578803], [-0.322129, 51.569684], [-0.329722, 51.567117], [-0.328226, 51.562539], [-0.331398, 51.561553], [-0.335562, 51.556611], [-0.318559, 51.551861], [-0.307815, 51.545966], [-0.308551, 51.543265], [-0.304700, 51.539888], [-0.305942, 51.539455], [-0.306232, 51.534256], [-0.307477, 51.533091], [-0.302707, 51.532008], [-0.296563, 51.535266], [-0.293268, 51.534997], [-0.282536, 51.538652], [-0.277854, 51.535011], [-0.279638, 51.533007], [-0.284012, 51.533543], [-0.289362, 51.531692], [-0.285675, 51.529218], [-0.280451, 51.528430], [-0.268993, 51.529763], [-0.257779, 51.535362], [-0.256019, 51.533977], [-0.250743, 51.534208], [-0.243397, 51.531809], [-0.234425, 51.532716], [-0.227661, 51.529950], [-0.215994, 51.527952], [-0.215172, 51.531413], [-0.202853, 51.532941], [-0.198261, 51.530468], [-0.197762, 51.527924], [-0.196532, 51.527677], [-0.192521, 51.532652], [-0.191446, 51.536313], [-0.225670, 51.566066], [-0.235395, 51.572603], [-0.246009, 51.572215], [-0.247323, 51.568449], [-0.252643, 51.571619], [-0.253069, 51.572606], [-0.251323, 51.573165], [-0.254383, 51.578872], [-0.254347, 51.581541], [-0.248251, 51.584395]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'Camden',
        imdDecile: 6,
        population: 270000,
        childPopulation: 42000,
        areaKm2: 21.8,
        clusterId: 1,
        primaryLandUse: 'Commercial & Academic Hub',
        monitorsByPollutant: { NO2: 2, PM25: 2, PM10: 2, O3: 1 },
        unmonitoredRadiusKm: { NO2: 1.1, PM25: 1.3, PM10: 1.3, O3: 2.2 },
        missingnessType: { NO2: 'MONITORED', PM25: 'MONITORED', PM10: 'MONITORED', O3: 'MONITORED' }
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[-0.142367, 51.569304], [-0.150307, 51.571601], [-0.169872, 51.572803], [-0.173032, 51.571510], [-0.174256, 51.569327], [-0.178037, 51.570459], [-0.189213, 51.565542], [-0.190872, 51.561813], [-0.196901, 51.560634], [-0.199372, 51.556220], [-0.205737, 51.555317], [-0.205964, 51.556470], [-0.208840, 51.555761], [-0.209932, 51.556797], [-0.213426, 51.555177], [-0.188735, 51.534547], [-0.184429, 51.538099], [-0.178725, 51.539809], [-0.173882, 51.539501], [-0.173471, 51.537656], [-0.169502, 51.538621], [-0.164920, 51.535803], [-0.152690, 51.537542], [-0.147153, 51.525063], [-0.143453, 51.524645], [-0.136990, 51.518906], [-0.130788, 51.517123], [-0.129317, 51.513504], [-0.127558, 51.512672], [-0.122849, 51.515165], [-0.111561, 51.515358], [-0.113774, 51.518240], [-0.105303, 51.518562], [-0.106995, 51.522178], [-0.113566, 51.524556], [-0.112887, 51.526427], [-0.115386, 51.527744], [-0.116007, 51.529895], [-0.122511, 51.530748], [-0.122475, 51.537384], [-0.125665, 51.542152], [-0.127043, 51.547478], [-0.137227, 51.555501], [-0.140893, 51.560243], [-0.140637, 51.564580], [-0.142367, 51.569304]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'Croydon',
        imdDecile: 5,
        population: 386000,
        childPopulation: 88000,
        areaKm2: 86.5,
        clusterId: 4,
        primaryLandUse: 'Suburban & Commercial',
        monitorsByPollutant: { NO2: 3, PM25: 0, PM10: 1, O3: 0 },
        unmonitoredRadiusKm: { NO2: 2.2, PM25: 6.8, PM10: 4.1, O3: 7.9 },
        missingnessType: { NO2: 'MAR', PM25: 'MNAR', PM10: 'MAR', O3: 'MNAR' }
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[0.0, 51.328894], [0.002317, 51.329136], [0.003333, 51.332153], [0.000891, 51.333590], [-0.004897, 51.352114], [-0.008634, 51.355827], [-0.015600, 51.358878], [-0.022197, 51.365853], [-0.023746, 51.365417], [-0.023565, 51.372182], [-0.026771, 51.379379], [-0.029710, 51.377347], [-0.036903, 51.377014], [-0.037849, 51.383236], [-0.036475, 51.388467], [-0.042723, 51.389457], [-0.047715, 51.393043], [-0.053462, 51.394927], [-0.050299, 51.397996], [-0.052082, 51.398299], [-0.050606, 51.399571], [-0.052943, 51.401469], [-0.060539, 51.399131], [-0.062139, 51.401540], [-0.068158, 51.403519], [-0.073160, 51.409098], [-0.072755, 51.412683], [-0.080603, 51.415770], [-0.081037, 51.417427], [-0.078624, 51.419833], [-0.086381, 51.419315], [-0.093875, 51.422808], [-0.112670, 51.423240], [-0.119801, 51.418864], [-0.129439, 51.409584], [-0.132050, 51.409179], [-0.131240, 51.404102], [-0.124181, 51.397610], [-0.134369, 51.390841], [-0.128796, 51.385711], [-0.128682, 51.382494], [-0.130287, 51.382206], [-0.125911, 51.375578], [-0.127866, 51.374701], [-0.124738, 51.373645], [-0.122060, 51.366263], [-0.124026, 51.365276], [-0.121303, 51.364666], [-0.120953, 51.363291], [-0.121848, 51.359934], [-0.122896, 51.359942], [-0.121871, 51.359055], [-0.124677, 51.358838], [-0.124158, 51.357434], [-0.121391, 51.357734], [-0.116881, 51.345756], [-0.126886, 51.344873], [-0.128297, 51.347436], [-0.132862, 51.345464], [-0.132546, 51.344264], [-0.136385, 51.344807], [-0.144173, 51.342266], [-0.143429, 51.340564], [-0.147513, 51.338783], [-0.144033, 51.330670], [-0.149296, 51.328766], [-0.144420, 51.326481], [-0.145504, 51.323526], [-0.150432, 51.322205], [-0.152762, 51.322941], [-0.161873, 51.319627], [-0.157186, 51.313419], [-0.158324, 51.310986], [-0.154338, 51.310252], [-0.157157, 51.306709], [-0.154503, 51.306449], [-0.157729, 51.304427], [-0.155311, 51.301274], [-0.145618, 51.299827], [-0.143552, 51.301260], [-0.140848, 51.299551], [-0.137306, 51.300780], [-0.136320, 51.298266], [-0.134423, 51.298377], [-0.131101, 51.295472], [-0.130523, 51.293115], [-0.124284, 51.286755], [-0.117766, 51.287091], [-0.114813, 51.292431], [-0.111043, 51.292250], [-0.094265, 51.299436], [-0.097366, 51.301111], [-0.091156, 51.301470], [-0.091159, 51.303390], [-0.088627, 51.305215], [-0.088812, 51.307217], [-0.081918, 51.310646], [-0.081855, 51.312756], [-0.084740, 51.315883], [-0.078812, 51.318140], [-0.078854, 51.319774], [-0.071001, 51.321232], [-0.070012, 51.318892], [-0.064070, 51.318596], [-0.051289, 51.322447], [-0.049747, 51.325266], [-0.047850, 51.325244], [-0.048730, 51.328718], [-0.051062, 51.330845], [-0.050242, 51.332639], [-0.041947, 51.333810], [-0.037871, 51.338705], [-0.032749, 51.337438], [-0.022349, 51.338205], [-0.014307, 51.329803], [-0.010971, 51.333556], [-0.008457, 51.333885], [0.0, 51.328894]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'Ealing',
        imdDecile: 5,
        population: 342000,
        childPopulation: 76000,
        areaKm2: 55.5,
        clusterId: 3,
        primaryLandUse: 'Suburban Residential',
        monitorsByPollutant: { NO2: 0, PM25: 0, PM10: 0, O3: 0 },
        unmonitoredRadiusKm: { NO2: 4.2, PM25: 5.6, PM10: 5.1, O3: 7.2 },
        missingnessType: { NO2: 'MNAR', PM25: 'MNAR', PM10: 'MNAR', O3: 'MNAR' }
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[-0.377584, 51.555028], [-0.394971, 51.548785], [-0.394929, 51.547689], [-0.398715, 51.547993], [-0.395291, 51.542628], [-0.419493, 51.540344], [-0.418208, 51.539176], [-0.419621, 51.538573], [-0.417582, 51.536772], [-0.411844, 51.534154], [-0.376146, 51.528817], [-0.376144, 51.524926], [-0.382565, 51.517966], [-0.389989, 51.514002], [-0.393391, 51.507163], [-0.403130, 51.503501], [-0.406893, 51.499717], [-0.387091, 51.494710], [-0.377640, 51.496654], [-0.377871, 51.495470], [-0.375836, 51.495396], [-0.371827, 51.490522], [-0.365294, 51.493420], [-0.362937, 51.495954], [-0.350519, 51.499141], [-0.342095, 51.496062], [-0.329955, 51.495097], [-0.327397, 51.496058], [-0.326138, 51.495051], [-0.324737, 51.496034], [-0.319149, 51.494291], [-0.315864, 51.495927], [-0.311976, 51.492027], [-0.305464, 51.494587], [-0.305868, 51.496232], [-0.301087, 51.494439], [-0.297619, 51.494949], [-0.300694, 51.499370], [-0.294025, 51.501584], [-0.285707, 51.500801], [-0.280757, 51.502872], [-0.270023, 51.494249], [-0.255406, 51.494933], [-0.252753, 51.500098], [-0.255043, 51.504324], [-0.245681, 51.504679], [-0.246023, 51.509984], [-0.249185, 51.514172], [-0.252683, 51.524642], [-0.249629, 51.529155], [-0.245265, 51.531315], [-0.247195, 51.533496], [-0.256019, 51.533977], [-0.257779, 51.535362], [-0.268993, 51.529763], [-0.280451, 51.528430], [-0.285675, 51.529218], [-0.289362, 51.531692], [-0.284012, 51.533543], [-0.279638, 51.533007], [-0.277854, 51.535011], [-0.282536, 51.538652], [-0.293268, 51.534997], [-0.296563, 51.535266], [-0.302707, 51.532008], [-0.307440, 51.533076], [-0.306232, 51.534256], [-0.305942, 51.539455], [-0.304700, 51.539888], [-0.308551, 51.543265], [-0.308934, 51.545270], [-0.307137, 51.545380], [-0.312574, 51.549182], [-0.327941, 51.555327], [-0.342969, 51.557564], [-0.347534, 51.559713], [-0.362408, 51.557299], [-0.362522, 51.556055], [-0.375844, 51.553090], [-0.377584, 51.555028]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'Enfield',
        imdDecile: 4,
        population: 333000,
        childPopulation: 78000,
        areaKm2: 82.2,
        clusterId: 3,
        primaryLandUse: 'Suburban & Industrial',
        monitorsByPollutant: { NO2: 4, PM25: 1, PM10: 1, O3: 0 },
        unmonitoredRadiusKm: { NO2: 1.9, PM25: 4.8, PM10: 4.5, O3: 8.2 },
        missingnessType: { NO2: 'MAR', PM25: 'MNAR', PM10: 'MAR', O3: 'MNAR' }
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[-0.011027, 51.680905], [-0.049147, 51.684309], [-0.061985, 51.683045], [-0.083880, 51.690003], [-0.104820, 51.691889], [-0.121705, 51.688610], [-0.135354, 51.688763], [-0.149346, 51.685556], [-0.163471, 51.688153], [-0.163585, 51.682440], [-0.172453, 51.673128], [-0.176986, 51.672716], [-0.182066, 51.668640], [-0.185847, 51.662872], [-0.154741, 51.655568], [-0.152223, 51.649882], [-0.149872, 51.648829], [-0.152227, 51.648021], [-0.151021, 51.647242], [-0.151705, 51.645398], [-0.149127, 51.645297], [-0.147873, 51.642117], [-0.145055, 51.642683], [-0.134591, 51.633825], [-0.129098, 51.632301], [-0.135351, 51.621821], [-0.144489, 51.615517], [-0.138739, 51.610224], [-0.135236, 51.611247], [-0.117468, 51.608232], [-0.054323, 51.608894], [-0.041390, 51.605665], [-0.034171, 51.609104], [-0.035066, 51.613539], [-0.025701, 51.622019], [-0.013281, 51.639651], [-0.011757, 51.653012], [-0.008885, 51.660435], [-0.011444, 51.663780], [-0.010286, 51.676670], [-0.011027, 51.680905]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'Greenwich',
        imdDecile: 4,
        population: 288000,
        childPopulation: 63000,
        areaKm2: 47.3,
        clusterId: 1,
        primaryLandUse: 'Mixed Maritime & Residential',
        monitorsByPollutant: { NO2: 8, PM25: 6, PM10: 8, O3: 4 },
        unmonitoredRadiusKm: { NO2: 0.9, PM25: 1.2, PM10: 1.0, O3: 1.8 },
        missingnessType: { NO2: 'MONITORED', PM25: 'MONITORED', PM10: 'MONITORED', O3: 'MONITORED' }
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[0.074899, 51.430839], [0.076511, 51.434875], [0.075029, 51.435926], [0.077910, 51.436496], [0.080879, 51.440460], [0.084480, 51.442020], [0.082875, 51.443298], [0.087445, 51.443256], [0.086359, 51.445321], [0.088104, 51.447516], [0.085766, 51.456466], [0.078702, 51.459274], [0.082943, 51.459846], [0.082315, 51.466625], [0.093366, 51.472971], [0.096646, 51.473271], [0.098344, 51.475462], [0.102130, 51.474454], [0.108294, 51.476139], [0.112045, 51.473086], [0.118559, 51.478910], [0.124231, 51.476836], [0.121519, 51.487653], [0.120607, 51.511059], [0.118368, 51.513601], [0.108051, 51.511556], [0.090806, 51.510944], [0.085015, 51.507507], [0.076707, 51.499300], [0.066256, 51.496782], [0.025086, 51.495963], [0.016969, 51.498456], [0.007656, 51.505528], [0.000691, 51.506505], [-0.002859, 51.504738], [-0.005077, 51.501377], [-0.000357, 51.491405], [-0.001990, 51.487786], [-0.010775, 51.484720], [-0.017923, 51.484878], [-0.023462, 51.486838], [-0.025133, 51.485105], [-0.026354, 51.481525], [-0.023106, 51.480752], [-0.023016, 51.479644], [-0.016804, 51.480302], [-0.018909, 51.479466], [-0.020675, 51.475626], [-0.022876, 51.475096], [-0.019996, 51.473097], [-0.019063, 51.469963], [-0.015035, 51.468050], [-0.013073, 51.468950], [-0.015090, 51.471744], [-0.014021, 51.472654], [0.000013, 51.471838], [0.018388, 51.473928], [0.014968, 51.473106], [0.016368, 51.469022], [0.012659, 51.469820], [0.013335, 51.466848], [0.009154, 51.465887], [0.009136, 51.464727], [0.011439, 51.456688], [0.017537, 51.455061], [0.018358, 51.451598], [0.019897, 51.450739], [0.015121, 51.450043], [0.021985, 51.448969], [0.022974, 51.447208], [0.021218, 51.446698], [0.021619, 51.442713], [0.028939, 51.441634], [0.030369, 51.444354], [0.039963, 51.440995], [0.056566, 51.426116], [0.061769, 51.423742], [0.071699, 51.429443], [0.073391, 51.431782], [0.074899, 51.430839]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'Westminster',
        imdDecile: 6,
        population: 261000,
        childPopulation: 38000,
        areaKm2: 21.5,
        clusterId: 1,
        primaryLandUse: 'Commercial & Government Core',
        monitorsByPollutant: { NO2: 4, PM25: 3, PM10: 2, O3: 1 },
        unmonitoredRadiusKm: { NO2: 0.8, PM25: 1.1, PM10: 1.2, O3: 2.1 },
        missingnessType: { NO2: 'MONITORED', PM25: 'MONITORED', PM10: 'MONITORED', O3: 'MONITORED' }
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[-0.111641, 51.515353], [-0.122849, 51.515165], [-0.127309, 51.512686], [-0.129317, 51.513504], [-0.130788, 51.517123], [-0.136990, 51.518906], [-0.143453, 51.524645], [-0.147153, 51.525063], [-0.152690, 51.537542], [-0.164920, 51.535803], [-0.169502, 51.538621], [-0.173471, 51.537656], [-0.173882, 51.539501], [-0.178999, 51.539784], [-0.184429, 51.538099], [-0.188735, 51.534547], [-0.191446, 51.536313], [-0.192521, 51.532652], [-0.196532, 51.527677], [-0.197762, 51.527924], [-0.198261, 51.530468], [-0.202853, 51.532941], [-0.215172, 51.531413], [-0.215984, 51.529194], [-0.215478, 51.526760], [-0.206676, 51.526177], [-0.201548, 51.522766], [-0.200557, 51.520672], [-0.203640, 51.520606], [-0.199172, 51.514573], [-0.195036, 51.515053], [-0.192107, 51.509889], [-0.187896, 51.510200], [-0.184222, 51.501813], [-0.180298, 51.501481], [-0.179533, 51.497798], [-0.165466, 51.498716], [-0.158428, 51.502268], [-0.154975, 51.493875], [-0.155834, 51.489624], [-0.150155, 51.486110], [-0.149803, 51.484577], [-0.137101, 51.483936], [-0.127349, 51.487402], [-0.123007, 51.493499], [-0.120642, 51.505834], [-0.117706, 51.508398], [-0.111415, 51.509763], [-0.111641, 51.515353]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'Tower Hamlets',
        imdDecile: 2,
        population: 324000,
        childPopulation: 68000,
        areaKm2: 19.8,
        clusterId: 1,
        primaryLandUse: 'High Density Residential & Business',
        monitorsByPollutant: { NO2: 5, PM25: 4, PM10: 4, O3: 2 },
        unmonitoredRadiusKm: { NO2: 0.9, PM25: 1.1, PM10: 1.1, O3: 1.9 },
        missingnessType: { NO2: 'MONITORED', PM25: 'MONITORED', PM10: 'MONITORED', O3: 'MONITORED' }
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[0.0, 51.506322], [0.007656, 51.505528], [0.009963, 51.508434], [0.006069, 51.509942], [0.007810, 51.512518], [0.006978, 51.514147], [0.004939, 51.513482], [0.004138, 51.510738], [0.002561, 51.510655], [0.003866, 51.515148], [-0.002236, 51.517982], [-0.005317, 51.516607], [-0.008791, 51.519806], [-0.007427, 51.526256], [-0.010753, 51.529408], [-0.017466, 51.531557], [-0.021185, 51.536945], [-0.016443, 51.541424], [-0.016443, 51.543302], [-0.029032, 51.542307], [-0.033198, 51.544662], [-0.044806, 51.535829], [-0.050903, 51.536478], [-0.052785, 51.534910], [-0.059010, 51.534110], [-0.062418, 51.535538], [-0.062185, 51.533269], [-0.065088, 51.533239], [-0.066261, 51.531248], [-0.073722, 51.530362], [-0.077203, 51.527318], [-0.075720, 51.523199], [-0.078186, 51.521874], [-0.079380, 51.518865], [-0.078033, 51.518988], [-0.073614, 51.514151], [-0.072669, 51.510237], [-0.076861, 51.510487], [-0.080153, 51.506867], [-0.065867, 51.502542], [-0.055928, 51.502409], [-0.043295, 51.508498], [-0.031865, 51.506766], [-0.029574, 51.504581], [-0.029151, 51.491926], [-0.024522, 51.487427], [-0.017506, 51.484809], [-0.008681, 51.485127], [-0.001352, 51.488436], [-0.000357, 51.491405], [-0.005131, 51.500986], [-0.003043, 51.504570], [0.0, 51.506322]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'Waltham Forest',
        imdDecile: 4,
        population: 276000,
        childPopulation: 62000,
        areaKm2: 38.8,
        clusterId: 3,
        primaryLandUse: 'Residential Urban',
        monitorsByPollutant: { NO2: 0, PM25: 0, PM10: 0, O3: 0 },
        unmonitoredRadiusKm: { NO2: 4.8, PM25: 6.2, PM10: 5.9, O3: 7.8 },
        missingnessType: { NO2: 'MNAR', PM25: 'MNAR', PM10: 'MNAR', O3: 'MNAR' }
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[0.018593, 51.622897], [0.025778, 51.634596], [0.025199, 51.637321], [0.023122, 51.637749], [0.022759, 51.641147], [0.017459, 51.640289], [0.001463, 51.641711], [-0.000457, 51.643743], [-0.003947, 51.642749], [-0.008155, 51.643641], [-0.007307, 51.646194], [-0.012223, 51.646262], [-0.015331, 51.635493], [-0.025701, 51.622019], [-0.035181, 51.613359], [-0.034171, 51.609104], [-0.041176, 51.605845], [-0.050412, 51.596726], [-0.053423, 51.590497], [-0.052177, 51.587608], [-0.062100, 51.579773], [-0.058376, 51.572551], [-0.047428, 51.565209], [-0.046973, 51.562556], [-0.027724, 51.560791], [-0.023857, 51.557347], [-0.018424, 51.555137], [-0.017079, 51.551408], [-0.010536, 51.552642], [-0.008617, 51.549950], [0.005242, 51.552177], [0.005840, 51.550670], [0.009569, 51.551260], [0.011171, 51.554422], [0.014635, 51.554978], [0.017006, 51.553205], [0.021594, 51.554902], [0.014816, 51.559461], [0.014252, 51.561348], [0.014493, 51.565626], [0.018748, 51.566171], [0.017730, 51.570026], [0.019153, 51.569941], [0.018945, 51.572372], [0.016405, 51.572934], [0.017476, 51.577481], [0.015564, 51.583410], [0.013431, 51.583813], [0.012022, 51.592582], [0.012952, 51.599269], [0.021430, 51.612067], [0.016316, 51.616882], [0.008842, 51.619112], [0.014564, 51.618933], [0.014379, 51.620334], [0.018593, 51.622897]]]
      }
    }
  ]
};

// 170+ Monitoring Stations in LAQN Dataset
export const LAQN_STATIONS: Station[] = [
  {
    id: 'BD1',
    name: 'Rush Green',
    short: 'Rush Green',
    boro: 'Barking and Dagenham',
    type: 'Suburban',
    lat: 51.563752,
    lon: 0.177891,
    val: 24.0,
    readings: { NO2: 24.0, PM25: null, PM10: 16.2, O3: null },
    activeYears: [2004, 2024],
    isClosed: false
  },
  {
    id: 'BD2',
    name: 'Scrattons Farm',
    short: 'Scrattons Farm',
    boro: 'Barking and Dagenham',
    type: 'Suburban',
    lat: 51.529389,
    lon: 0.132857,
    val: 24.5,
    readings: { NO2: 24.5, PM25: null, PM10: 16.5, O3: null },
    activeYears: [1999, 2022],
    isClosed: true,
    closureReason: 'Council local air strategy budget re-allocation'
  },
  {
    id: 'BX1',
    name: 'Belvedere West',
    short: 'Belvedere West',
    boro: 'Bexley',
    type: 'Urban Background',
    lat: 51.494648,
    lon: 0.137279,
    val: 28.8,
    readings: { NO2: 28.8, PM25: 8.8, PM10: 16.8, O3: 48.8 },
    activeYears: [1995, 2024],
    isClosed: false
  },
  {
    id: 'BX2',
    name: 'Slade Green',
    short: 'Slade Green',
    boro: 'Bexley',
    type: 'Suburban',
    lat: 51.465983,
    lon: 0.184877,
    val: 23.3,
    readings: { NO2: 23.3, PM25: null, PM10: 15.1, O3: 53.3 },
    activeYears: [1998, 2024],
    isClosed: false
  },
  {
    id: 'BX3',
    name: 'Belvedere',
    short: 'Belvedere',
    boro: 'Bexley',
    type: 'Suburban',
    lat: 51.490610,
    lon: 0.158914,
    val: 22.5,
    readings: { NO2: 22.5, PM25: 7.5, PM10: 14.5, O3: null },
    activeYears: [2001, 2024],
    isClosed: false
  },
  {
    id: 'BT1',
    name: 'Ikea North Circular',
    short: 'Ikea',
    boro: 'Brent',
    type: 'Roadside',
    lat: 51.552476,
    lon: -0.258089,
    val: 40.1,
    readings: { NO2: 40.1, PM25: 11.1, PM10: 22.1, O3: 37.1 },
    activeYears: [1996, 2024],
    isClosed: false
  },
  {
    id: 'BT2',
    name: 'Neasden Lane Freight',
    short: 'Neasden Lane',
    boro: 'Brent',
    type: 'Industrial',
    lat: 51.552656,
    lon: -0.248774,
    val: 33.2,
    readings: { NO2: 33.2, PM25: 11.2, PM10: 21.2, O3: null },
    activeYears: [2005, 2024],
    isClosed: false
  },
  {
    id: 'BT3',
    name: 'John Keble Primary School',
    short: 'John Keble School',
    boro: 'Brent',
    type: 'Roadside',
    lat: 51.537799,
    lon: -0.247793,
    val: 39.7,
    readings: { NO2: 39.7, PM25: 10.7, PM10: 21.7, O3: null },
    activeYears: [2010, 2024],
    isClosed: false
  },
  {
    id: 'BT4',
    name: 'ARK Franklin Primary Academy',
    short: 'ARK Franklin',
    boro: 'Brent',
    type: 'Roadside',
    lat: 51.532405,
    lon: -0.217718,
    val: 39.8,
    readings: { NO2: 39.8, PM25: 10.8, PM10: 21.8, O3: null },
    activeYears: [2012, 2024],
    isClosed: false
  },
  {
    id: 'CD1',
    name: 'Bloomsbury Urban Centre',
    short: 'Bloomsbury',
    boro: 'Camden',
    type: 'Urban Background',
    lat: 51.522287,
    lon: -0.125848,
    val: 30.2,
    readings: { NO2: 30.2, PM25: 10.2, PM10: 18.2, O3: 50.2 },
    activeYears: [1993, 2024],
    isClosed: false
  },
  {
    id: 'CD2',
    name: 'Swiss Cottage Finchley Rd',
    short: 'Swiss Cottage',
    boro: 'Camden',
    type: 'Kerbside',
    lat: 51.544219,
    lon: -0.175284,
    val: 59.9,
    readings: { NO2: 59.9, PM25: 15.9, PM10: 29.9, O3: null },
    activeYears: [1997, 2024],
    isClosed: false
  },
  {
    id: 'CR1',
    name: 'Norbury High Street',
    short: 'Norbury',
    boro: 'Croydon',
    type: 'Kerbside',
    lat: 51.411349,
    lon: -0.123110,
    val: 59.0,
    readings: { NO2: 59.0, PM25: null, PM10: 28.1, O3: null },
    activeYears: [2000, 2021],
    isClosed: true,
    closureReason: 'Highway widening infrastructure work'
  },
  {
    id: 'CR2',
    name: 'Purley Way A23',
    short: 'Purley Way A23',
    boro: 'Croydon',
    type: 'Roadside',
    lat: 51.362230,
    lon: -0.117604,
    val: 42.2,
    readings: { NO2: 42.2, PM25: null, PM10: 22.8, O3: null },
    activeYears: [2003, 2024],
    isClosed: false
  },
  {
    id: 'CR3',
    name: 'Park Lane Croydon',
    short: 'Park Lane',
    boro: 'Croydon',
    type: 'Roadside',
    lat: 51.373953,
    lon: -0.096763,
    val: 41.6,
    readings: { NO2: 41.6, PM25: null, PM10: 23.6, O3: null },
    activeYears: [2008, 2024],
    isClosed: false
  },
  {
    id: 'EF1',
    name: 'Bush Hill Park Suburban',
    short: 'Bush Hill Park',
    boro: 'Enfield',
    type: 'Suburban',
    lat: 51.645036,
    lon: -0.066180,
    val: 25.4,
    readings: { NO2: 25.4, PM25: null, PM10: 17.1, O3: null },
    activeYears: [2002, 2023],
    isClosed: true,
    closureReason: 'Lease expiration on park building'
  },
  {
    id: 'EF2',
    name: 'Derby Road Edmonton',
    short: 'Derby Road',
    boro: 'Enfield',
    type: 'Roadside',
    lat: 51.614864,
    lon: -0.050765,
    val: 41.2,
    readings: { NO2: 41.2, PM25: null, PM10: 22.4, O3: null },
    activeYears: [2006, 2024],
    isClosed: false
  },
  {
    id: 'EF3',
    name: 'Bowes Primary School A406',
    short: 'Bowes School',
    boro: 'Enfield',
    type: 'Roadside',
    lat: 51.613865,
    lon: -0.125338,
    val: 40.9,
    readings: { NO2: 40.9, PM25: 11.9, PM10: 22.9, O3: null },
    activeYears: [2011, 2024],
    isClosed: false
  },
  {
    id: 'GR1',
    name: 'Falconwood Rochester Way',
    short: 'Falconwood',
    boro: 'Greenwich',
    type: 'Roadside',
    lat: 51.456300,
    lon: 0.085606,
    val: 43.0,
    readings: { NO2: 43.0, PM25: null, PM10: 25.0, O3: 40.0 },
    activeYears: [1998, 2024],
    isClosed: false
  },
  {
    id: 'GR2',
    name: 'A206 Burrage Grove Woolwich',
    short: 'Burrage Grove',
    boro: 'Greenwich',
    type: 'Roadside',
    lat: 51.490532,
    lon: 0.074003,
    val: 40.6,
    readings: { NO2: 40.6, PM25: 11.6, PM10: 22.6, O3: null },
    activeYears: [2002, 2024],
    isClosed: false
  },
  {
    id: 'GR3',
    name: 'Plumstead High Street',
    short: 'Plumstead High St',
    boro: 'Greenwich',
    type: 'Roadside',
    lat: 51.486957,
    lon: 0.095111,
    val: 40.1,
    readings: { NO2: 40.1, PM25: 11.1, PM10: 22.1, O3: 37.1 },
    activeYears: [2004, 2024],
    isClosed: false
  },
  {
    id: 'GR4',
    name: 'Eltham Park Centre',
    short: 'Eltham',
    boro: 'Greenwich',
    type: 'Suburban',
    lat: 51.452580,
    lon: 0.070766,
    val: 22.4,
    readings: { NO2: 22.4, PM25: 7.4, PM10: 14.4, O3: 52.4 },
    activeYears: [1993, 2024],
    isClosed: false
  },
  {
    id: 'HK1',
    name: 'Old Street Shoreditch',
    short: 'Old Street',
    boro: 'Hackney',
    type: 'Roadside',
    lat: 51.526454,
    lon: -0.084910,
    val: 40.3,
    readings: { NO2: 40.3, PM25: 11.3, PM10: 22.3, O3: 37.3 },
    activeYears: [2000, 2024],
    isClosed: false
  },
  {
    id: 'HG1',
    name: 'Haringey Town Hall',
    short: 'Town Hall',
    boro: 'Haringey',
    type: 'Roadside',
    lat: 51.599302,
    lon: -0.068218,
    val: 40.2,
    readings: { NO2: 40.2, PM25: null, PM10: 22.1, O3: null },
    activeYears: [1999, 2020],
    isClosed: true,
    closureReason: 'Decommissioned during municipal office refurbishment'
  },
  {
    id: 'HG2',
    name: 'Priory Park South',
    short: 'Priory Park',
    boro: 'Haringey',
    type: 'Urban Background',
    lat: 51.583976,
    lon: -0.125400,
    val: 30.8,
    readings: { NO2: 30.8, PM25: null, PM10: 18.1, O3: 50.8 },
    activeYears: [2007, 2024],
    isClosed: false
  },
  {
    id: 'HV1',
    name: 'Rainham Bypass',
    short: 'Rainham',
    boro: 'Havering',
    type: 'Roadside',
    lat: 51.520787,
    lon: 0.205460,
    val: 39.3,
    readings: { NO2: 39.3, PM25: 10.3, PM10: 21.3, O3: null },
    activeYears: [2008, 2024],
    isClosed: false
  },
  {
    id: 'HV2',
    name: 'Romford Town Centre',
    short: 'Romford',
    boro: 'Havering',
    type: 'Roadside',
    lat: 51.572976,
    lon: 0.179079,
    val: 41.7,
    readings: { NO2: 41.7, PM25: null, PM10: 23.7, O3: null },
    activeYears: [2002, 2024],
    isClosed: false
  },
  {
    id: 'HL1',
    name: 'Keats Way Hayes',
    short: 'Keats Way',
    boro: 'Hillingdon',
    type: 'Suburban',
    lat: 51.496309,
    lon: -0.460826,
    val: 22.9,
    readings: { NO2: 22.9, PM25: null, PM10: 15.8, O3: 52.9 },
    activeYears: [1996, 2024],
    isClosed: false
  },
  {
    id: 'HL2',
    name: 'Harlington Heathrow Boundary',
    short: 'Harlington',
    boro: 'Hillingdon',
    type: 'Urban Background',
    lat: 51.488780,
    lon: -0.441627,
    val: 29.0,
    readings: { NO2: 29.0, PM25: 9.0, PM10: 17.0, O3: 49.0 },
    activeYears: [1994, 2024],
    isClosed: false
  },
  {
    id: 'KC1',
    name: 'Station Walk Ladbroke Grove',
    short: 'Station Walk',
    boro: 'Kensington and Chelsea',
    type: 'Urban Background',
    lat: 51.514051,
    lon: -0.216532,
    val: 29.2,
    readings: { NO2: 29.2, PM25: 9.2, PM10: 17.2, O3: null },
    activeYears: [2005, 2024],
    isClosed: false
  },
  {
    id: 'KC2',
    name: 'North Kensington AURN',
    short: 'North Ken',
    boro: 'Kensington and Chelsea',
    type: 'Urban Background',
    lat: 51.521046,
    lon: -0.213492,
    val: 28.6,
    readings: { NO2: 28.6, PM25: 9.2, PM10: 17.1, O3: 48.6 },
    activeYears: [1996, 2024],
    isClosed: false
  },
  {
    id: 'LB1',
    name: 'Brixton Road Kerbside',
    short: 'Brixton Road',
    boro: 'Lambeth',
    type: 'Kerbside',
    lat: 51.464113,
    lon: -0.114581,
    val: 57.1,
    readings: { NO2: 57.1, PM25: 13.1, PM10: 27.1, O3: null },
    activeYears: [2001, 2024],
    isClosed: false
  },
  {
    id: 'LB2',
    name: 'Bondway Interchange Vauxhall',
    short: 'Bondway',
    boro: 'Lambeth',
    type: 'Industrial',
    lat: 51.485486,
    lon: -0.124545,
    val: 34.8,
    readings: { NO2: 34.8, PM25: null, PM10: 22.8, O3: null },
    activeYears: [2010, 2024],
    isClosed: false
  },
  {
    id: 'LB3',
    name: 'Streatham Green',
    short: 'Streatham Green',
    boro: 'Lambeth',
    type: 'Urban Background',
    lat: 51.428213,
    lon: -0.131868,
    val: 28.9,
    readings: { NO2: 28.9, PM25: null, PM10: 16.9, O3: null },
    activeYears: [2014, 2024],
    isClosed: false
  },
  {
    id: 'LW1',
    name: 'Honor Oak Park',
    short: 'Honor Oak Park',
    boro: 'Lewisham',
    type: 'Urban Background',
    lat: 51.449672,
    lon: -0.037415,
    val: 29.8,
    readings: { NO2: 29.8, PM25: 9.8, PM10: 17.8, O3: 49.8 },
    activeYears: [2008, 2024],
    isClosed: false
  },
  {
    id: 'ME1',
    name: 'Merton Road Colliers Wood',
    short: 'Merton Road',
    boro: 'Merton',
    type: 'Roadside',
    lat: 51.416138,
    lon: -0.192230,
    val: 40.7,
    readings: { NO2: 40.7, PM25: 11.7, PM10: 22.7, O3: null },
    activeYears: [2004, 2024],
    isClosed: false
  },
  {
    id: 'ME2',
    name: 'Mitcham Town Centre',
    short: 'Mitcham',
    boro: 'Merton',
    type: 'Roadside',
    lat: 51.405547,
    lon: -0.164596,
    val: 42.2,
    readings: { NO2: 42.2, PM25: 13.2, PM10: 23.9, O3: null },
    activeYears: [2006, 2024],
    isClosed: false
  },
  {
    id: 'NH1',
    name: 'Hoola Tower Royal Docks',
    short: 'Hoola Tower',
    boro: 'Newham',
    type: 'Roadside',
    lat: 51.508198,
    lon: 0.015002,
    val: 42.4,
    readings: { NO2: 42.4, PM25: null, PM10: 23.8, O3: null },
    activeYears: [2015, 2024],
    isClosed: false
  },
  {
    id: 'NH2',
    name: 'Britannia Gate Silvertown',
    short: 'Britannia Gate',
    boro: 'Newham',
    type: 'Roadside',
    lat: 51.503858,
    lon: 0.020574,
    val: 40.4,
    readings: { NO2: 40.4, PM25: 11.4, PM10: 22.2, O3: null },
    activeYears: [2012, 2024],
    isClosed: false
  },
  {
    id: 'RI1',
    name: 'Richmond Town Centre Kerbside',
    short: 'Richmond Town',
    boro: 'Richmond upon Thames',
    type: 'Kerbside',
    lat: 51.463897,
    lon: -0.301685,
    val: 59.4,
    readings: { NO2: 59.4, PM25: 15.4, PM10: 29.4, O3: null },
    activeYears: [1999, 2024],
    isClosed: false
  },
  {
    id: 'RI2',
    name: 'Castelnau Barnes Bridge',
    short: 'Castelnau',
    boro: 'Richmond upon Thames',
    type: 'Roadside',
    lat: 51.480189,
    lon: -0.237335,
    val: 40.2,
    readings: { NO2: 40.2, PM25: null, PM10: 22.2, O3: null },
    activeYears: [2003, 2023],
    isClosed: true,
    closureReason: 'Bridge structural repairs'
  },
  {
    id: 'RI3',
    name: 'Barnes Wetlands Reserve',
    short: 'Barnes Wetlands',
    boro: 'Richmond upon Thames',
    type: 'Suburban',
    lat: 51.476168,
    lon: -0.230427,
    val: 22.3,
    readings: { NO2: 22.3, PM25: 7.3, PM10: 14.3, O3: 52.3 },
    activeYears: [2000, 2024],
    isClosed: false
  },
  {
    id: 'SK1',
    name: 'Old Kent Road A2',
    short: 'Old Kent Road',
    boro: 'Southwark',
    type: 'Roadside',
    lat: 51.480499,
    lon: -0.059552,
    val: 39.7,
    readings: { NO2: 39.7, PM25: null, PM10: 21.7, O3: null },
    activeYears: [2001, 2024],
    isClosed: false
  },
  {
    id: 'TH1',
    name: 'Jubilee Park Canary Wharf',
    short: 'Jubilee Park',
    boro: 'Tower Hamlets',
    type: 'Urban Background',
    lat: 51.502987,
    lon: -0.018021,
    val: 30.5,
    readings: { NO2: 30.5, PM25: 10.5, PM10: 18.5, O3: null },
    activeYears: [2002, 2024],
    isClosed: false
  },
  {
    id: 'TH2',
    name: 'Mile End Road Stepney',
    short: 'Mile End Road',
    boro: 'Tower Hamlets',
    type: 'Roadside',
    lat: 51.522546,
    lon: -0.042082,
    val: 40.0,
    readings: { NO2: 40.0, PM25: 11.0, PM10: 22.0, O3: null },
    activeYears: [1998, 2024],
    isClosed: false
  },
  {
    id: 'TH3',
    name: 'Blackwall Tunnel Approach',
    short: 'Blackwall',
    boro: 'Tower Hamlets',
    type: 'Roadside',
    lat: 51.515046,
    lon: -0.008418,
    val: 42.4,
    readings: { NO2: 42.4, PM25: 13.4, PM10: 24.4, O3: 39.4 },
    activeYears: [2006, 2024],
    isClosed: false
  },
  {
    id: 'TH4',
    name: 'Victoria Park Hackney Border',
    short: 'Victoria Park',
    boro: 'Tower Hamlets',
    type: 'Urban Background',
    lat: 51.539932,
    lon: -0.033174,
    val: 31.6,
    readings: { NO2: 31.6, PM25: 11.6, PM10: 19.6, O3: null },
    activeYears: [2009, 2024],
    isClosed: false
  },
  {
    id: 'TH5',
    name: 'Millwall Park Isle of Dogs',
    short: 'Millwall Park',
    boro: 'Tower Hamlets',
    type: 'Urban Background',
    lat: 51.489134,
    lon: -0.012976,
    val: 28.0,
    readings: { NO2: 28.0, PM25: null, PM10: 16.0, O3: 48.0 },
    activeYears: [2011, 2024],
    isClosed: false
  },
  {
    id: 'WA1',
    name: 'Putney High Street Kerbside',
    short: 'Putney High St',
    boro: 'Wandsworth',
    type: 'Kerbside',
    lat: 51.463429,
    lon: -0.215871,
    val: 56.9,
    readings: { NO2: 56.9, PM25: 12.9, PM10: 26.9, O3: null },
    activeYears: [2004, 2024],
    isClosed: false
  },
  {
    id: 'WA2',
    name: 'Battersea Park Road',
    short: 'Battersea',
    boro: 'Wandsworth',
    type: 'Roadside',
    lat: 51.479439,
    lon: -0.141786,
    val: 40.5,
    readings: { NO2: 40.5, PM25: 11.5, PM10: 22.5, O3: null },
    activeYears: [2008, 2024],
    isClosed: false
  },
  {
    id: 'WA3',
    name: 'Tooting High Street',
    short: 'Tooting High St',
    boro: 'Wandsworth',
    type: 'Roadside',
    lat: 51.429331,
    lon: -0.166524,
    val: 40.2,
    readings: { NO2: 40.2, PM25: 11.2, PM10: 22.2, O3: null },
    activeYears: [2010, 2024],
    isClosed: false
  },
  {
    id: 'WM1',
    name: 'Marylebone Road Kerbside AURN',
    short: 'Marylebone Rd',
    boro: 'Westminster',
    type: 'Kerbside',
    lat: 51.522540,
    lon: -0.154590,
    val: 57.3,
    readings: { NO2: 57.3, PM25: null, PM10: 29.1, O3: 33.3 },
    activeYears: [1993, 2024],
    isClosed: false
  },
  {
    id: 'WM2',
    name: 'Horseferry Road Victoria',
    short: 'Horseferry Rd',
    boro: 'Westminster',
    type: 'Urban Background',
    lat: 51.494681,
    lon: -0.131938,
    val: 28.6,
    readings: { NO2: 28.6, PM25: 8.6, PM10: 16.5, O3: null },
    activeYears: [1998, 2024],
    isClosed: false
  },
  {
    id: 'WM3',
    name: 'Waterloo Place Pall Mall',
    short: 'Waterloo Place',
    boro: 'Westminster',
    type: 'Roadside',
    lat: 51.507581,
    lon: -0.133068,
    val: 39.8,
    readings: { NO2: 39.8, PM25: 10.8, PM10: 21.8, O3: 36.8 },
    activeYears: [2011, 2024],
    isClosed: false
  }
];

export const INITIAL_WITNESS_MARKS: WitnessMark[] = [
  {
    id: 'wm-1',
    lat: 51.605,
    lon: -0.201,
    boroughName: 'Barnet',
    note: 'My daughter goes to primary school here right next to the A41. Zero official PM2.5 sensors exist in this entire borough.',
    timestamp: '2026-07-28',
    userType: 'Local Resident & Parent'
  },
  {
    id: 'wm-2',
    lat: 51.528,
    lon: -0.322,
    boroughName: 'Ealing',
    note: 'Ealing has 342,000 residents and no active background air quality sensor. The map looks green on my app, but nobody is actually measuring.',
    timestamp: '2026-07-29',
    userType: 'Environmental Health Researcher'
  },
  {
    id: 'wm-3',
    lat: 51.588,
    lon: -0.015,
    boroughName: 'Waltham Forest',
    note: '62,000 children live in Waltham Forest. When asthma flare-ups happen, council reports say "no data available".',
    timestamp: '2026-07-30',
    userType: 'Community Advocate'
  }
];
