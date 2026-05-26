const API_URL = "https://api.open-meteo.com/v1/forecast";
const TIMEZONE = "Asia/Shanghai";
const DASHBOARD_HOURS = 48;

const CITIES = [
  ["南宁", 22.817, 108.3669],
  ["柳州", 24.3264, 109.4281],
  ["桂林", 25.2736, 110.29],
  ["梧州", 23.4769, 111.279],
  ["北海", 21.4811, 109.1202],
  ["防城港", 21.6869, 108.3547],
  ["钦州", 21.9797, 108.6543],
  ["贵港", 23.1115, 109.5989],
  ["玉林", 22.6545, 110.18],
  ["百色", 23.9022, 106.6184],
  ["贺州", 24.4036, 111.5667],
  ["河池", 24.6929, 108.0854],
  ["来宾", 23.7503, 109.2212],
  ["崇左", 22.3771, 107.3647],
];

const CURRENT_FIELDS = [
  "temperature_2m",
  "apparent_temperature",
  "relative_humidity_2m",
  "precipitation",
  "rain",
  "weather_code",
  "cloud_cover",
  "shortwave_radiation",
  "pressure_msl",
  "wind_speed_10m",
  "wind_direction_10m",
  "wind_gusts_10m",
];

const HOURLY_FIELDS = [
  "temperature_2m",
  "apparent_temperature",
  "relative_humidity_2m",
  "precipitation_probability",
  "precipitation",
  "rain",
  "weather_code",
  "cloud_cover",
  "shortwave_radiation",
  "direct_radiation",
  "diffuse_radiation",
  "wind_speed_10m",
  "wind_direction_10m",
  "wind_gusts_10m",
];

const DAILY_FIELDS = [
  "weather_code",
  "temperature_2m_max",
  "temperature_2m_min",
  "apparent_temperature_max",
  "apparent_temperature_min",
  "precipitation_sum",
  "rain_sum",
  "precipitation_probability_max",
  "wind_speed_10m_max",
  "wind_gusts_10m_max",
  "wind_direction_10m_dominant",
  "sunshine_duration",
  "shortwave_radiation_sum",
];

const WEATHER_CODE_CN = {
  0: "晴",
  1: "大致晴朗",
  2: "局部多云",
  3: "阴",
  45: "雾",
  48: "冻雾",
  51: "小毛毛雨",
  53: "中等毛毛雨",
  55: "大毛毛雨",
  56: "小冻毛毛雨",
  57: "大冻毛毛雨",
  61: "小雨",
  63: "中雨",
  65: "大雨",
  66: "小冻雨",
  67: "大冻雨",
  71: "小雪",
  73: "中雪",
  75: "大雪",
  77: "雪粒",
  80: "小阵雨",
  81: "中阵雨",
  82: "强阵雨",
  85: "小阵雪",
  86: "强阵雪",
  95: "雷暴",
  96: "雷暴伴小冰雹",
  99: "雷暴伴大冰雹",
};

const PLANTS = [
  { name: "防城港海上风电示范项目", type: "海上风电", city: "防城港", area: "北部湾防城港海域", capacity: "约 180 万千瓦规划", x: 330, y: 438, note: "广西首批海上风电竞争性配置项目之一，靠近沿海负荷与港口场景。" },
  { name: "钦州海上风电示范项目", type: "海上风电", city: "钦州", area: "北部湾钦州海域", capacity: "约 90 万千瓦规划", x: 390, y: 430, note: "沿海风资源与消纳条件较好，适合关注阵风和海上天气扰动。" },
  { name: "北海合浦乌家风电场", type: "陆上风电", city: "北海", area: "合浦县乌家镇", capacity: "约 10 万千瓦级", x: 455, y: 446, note: "北部湾沿海陆上风电代表项目，受季风和强对流影响较明显。" },
  { name: "百色田阳高德岭风电场", type: "陆上风电", city: "百色", area: "田阳区", capacity: "约 20 万千瓦", x: 150, y: 286, note: "桂西山地风电项目，适合与西部高温、降水和阵风风险联动观察。" },
  { name: "桂林资源金紫山风电场", type: "陆上风电", city: "桂林", area: "资源县", capacity: "多期山地风电", x: 505, y: 72, note: "高海拔山地风电，低温、大风和云雾对运维影响更突出。" },
  { name: "桂林兴安光华铺风电场", type: "陆上风电", city: "桂林", area: "兴安县", capacity: "约 7.5 万千瓦", x: 485, y: 105, note: "桂北风电项目，适合观察冷空气过程下的风速变化。" },
  { name: "来宾桥巩风电项目", type: "陆上风电", city: "来宾", area: "兴宾区桥巩镇", capacity: "约 15 万千瓦", x: 390, y: 250, note: "桂中风电点位，负荷中心附近的风况变化值得跟踪。" },
  { name: "来宾良江农光互补光伏", type: "光伏", city: "来宾", area: "兴宾区良江镇", capacity: "约 11.5 万千瓦", x: 372, y: 270, note: "农光互补项目，重点关注短波辐照、云量和降水。" },
  { name: "桂林恭城栗木光伏", type: "光伏", city: "桂林", area: "恭城县栗木镇常家村", capacity: "约 10 万千瓦", x: 548, y: 155, note: "桂东北光伏项目，山地云量和降雨会影响日内出力。" },
  { name: "崇左扶绥光伏基地", type: "光伏", city: "崇左", area: "扶绥县", capacity: "集中式光伏集群", x: 255, y: 372, note: "桂西南光伏资源区，晴热天气下辐照高、负荷也可能同步走强。" },
];

const state = {
  selectedCities: new Set(CITIES.map(([name]) => name)),
  data: [],
  view: "current",
  chartCity: "南宁",
  selectedDate: isoDate(new Date()),
};

const els = {
  cityList: document.querySelector("#cityList"),
  selectAllBtn: document.querySelector("#selectAllBtn"),
  clearBtn: document.querySelector("#clearBtn"),
  refreshBtn: document.querySelector("#refreshBtn"),
  exportBtn: document.querySelector("#exportBtn"),
  dashboardModeBtn: document.querySelector("#dashboardModeBtn"),
  compareModeBtn: document.querySelector("#compareModeBtn"),
  overviewModeBtn: document.querySelector("#overviewModeBtn"),
  spotModeBtn: document.querySelector("#spotModeBtn"),
  dashboardView: document.querySelector("#dashboardView"),
  compareView: document.querySelector("#compareView"),
  overviewView: document.querySelector("#overviewView"),
  spotView: document.querySelector("#spotView"),
  compareCitySelect: document.querySelector("#compareCitySelect"),
  periodAStart: document.querySelector("#periodAStart"),
  periodAEnd: document.querySelector("#periodAEnd"),
  periodBStart: document.querySelector("#periodBStart"),
  periodBEnd: document.querySelector("#periodBEnd"),
  compareBtn: document.querySelector("#compareBtn"),
  compareStatus: document.querySelector("#compareStatus"),
  compareMetrics: document.querySelector("#compareMetrics"),
  compareTableHead: document.querySelector("#compareTableHead"),
  compareTableBody: document.querySelector("#compareTableBody"),
  compareInsights: document.querySelector("#compareInsights"),
  overviewDate: document.querySelector("#overviewDate"),
  overviewBtn: document.querySelector("#overviewBtn"),
  overviewStatus: document.querySelector("#overviewStatus"),
  periodGrid: document.querySelector("#periodGrid"),
  gxMap: document.querySelector("#gxMap"),
  plantTitle: document.querySelector("#plantTitle"),
  plantSubtitle: document.querySelector("#plantSubtitle"),
  plantDetail: document.querySelector("#plantDetail"),
  overviewInsights: document.querySelector("#overviewInsights"),
  spotFileInput: document.querySelector("#spotFileInput"),
  spotDateSelect: document.querySelector("#spotDateSelect"),
  spotRenderBtn: document.querySelector("#spotRenderBtn"),
  spotStatus: document.querySelector("#spotStatus"),
  spotMetrics: document.querySelector("#spotMetrics"),
  priceCanvas: document.querySelector("#priceCanvas"),
  energyCanvas: document.querySelector("#energyCanvas"),
  seriesPicker: document.querySelector("#seriesPicker"),
  statusLine: document.querySelector("#statusLine"),
  tableTitle: document.querySelector("#tableTitle"),
  tableSubtitle: document.querySelector("#tableSubtitle"),
  tableHead: document.querySelector("#tableHead"),
  tableBody: document.querySelector("#tableBody"),
  maxFeel: document.querySelector("#maxFeel"),
  maxRadiation: document.querySelector("#maxRadiation"),
  maxGust: document.querySelector("#maxGust"),
  maxRainProb: document.querySelector("#maxRainProb"),
  chartCitySelect: document.querySelector("#chartCitySelect"),
  chartCityLabel: document.querySelector("#chartCityLabel"),
  chartStats: document.querySelector("#chartStats"),
  trendCanvas: document.querySelector("#trendCanvas"),
  insightList: document.querySelector("#insightList"),
};

const spotState = {
  priceRows: [],
  pointRows: [],
  hourly96: new Map(),
  dates: [],
  selectedSeries: new Set(),
};

function init() {
  initDashboardDateControl();
  renderCityControls();
  renderChartCityOptions();
  initCompareControls();
  initOverviewControls();
  renderMap();
  bindEvents();
  loadLocalSpotData();
  refreshData();
}

function initDashboardDateControl() {
  const tabs = document.querySelector(".view-tabs");
  if (!tabs) return;
  const label = document.createElement("label");
  label.className = "date-control dashboard-date-control";
  label.innerHTML = `<span>选择日期</span><input id="dashboardDate" type="date" />`;
  tabs.insertAdjacentElement("beforebegin", label);
  els.dashboardDate = label.querySelector("#dashboardDate");
  els.dashboardDate.value = state.selectedDate;
}

function bindEvents() {
  els.selectAllBtn.addEventListener("click", () => {
    state.selectedCities = new Set(CITIES.map(([name]) => name));
    renderCityControls();
    refreshData();
  });

  els.clearBtn.addEventListener("click", () => {
    state.selectedCities.clear();
    renderCityControls();
    renderAll();
  });

  els.refreshBtn.addEventListener("click", refreshData);
  els.exportBtn.addEventListener("click", exportCurrentView);
  els.dashboardModeBtn.addEventListener("click", () => setMode("dashboard"));
  els.compareModeBtn.addEventListener("click", () => setMode("compare"));
  els.overviewModeBtn.addEventListener("click", () => setMode("overview"));
  els.spotModeBtn.addEventListener("click", () => setMode("spot"));
  els.compareBtn.addEventListener("click", runDateCompare);
  els.overviewBtn.addEventListener("click", runOverview);
  els.spotFileInput.addEventListener("change", handleSpotFile);
  els.spotRenderBtn.addEventListener("click", renderSpotCharts);
  els.dashboardDate.addEventListener("change", () => {
    state.selectedDate = els.dashboardDate.value || isoDate(new Date());
    refreshData();
  });

  document.querySelectorAll(".tab-button").forEach((button) => {
    button.addEventListener("click", () => {
      state.view = button.dataset.view;
      document.querySelectorAll(".tab-button").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      renderTable();
    });
  });

  els.chartCitySelect.addEventListener("change", () => {
    state.chartCity = els.chartCitySelect.value;
    drawTrend();
  });
}

function setMode(mode) {
  els.dashboardView.classList.toggle("hidden", mode !== "dashboard");
  els.compareView.classList.toggle("hidden", mode !== "compare");
  els.overviewView.classList.toggle("hidden", mode !== "overview");
  els.spotView.classList.toggle("hidden", mode !== "spot");
  els.dashboardModeBtn.classList.toggle("active", mode === "dashboard");
  els.compareModeBtn.classList.toggle("active", mode === "compare");
  els.overviewModeBtn.classList.toggle("active", mode === "overview");
  els.spotModeBtn.classList.toggle("active", mode === "spot");
}

function renderCityControls() {
  els.cityList.innerHTML = CITIES.map(([name]) => {
    const checked = state.selectedCities.has(name) ? "checked" : "";
    return `
      <label class="city-item">
        <input type="checkbox" value="${name}" ${checked} />
        <span>${name}</span>
      </label>
    `;
  }).join("");

  els.cityList.querySelectorAll("input").forEach((input) => {
    input.addEventListener("change", () => {
      if (input.checked) {
        state.selectedCities.add(input.value);
      } else {
        state.selectedCities.delete(input.value);
      }
      renderAll();
    });
  });
}

function renderChartCityOptions() {
  els.chartCitySelect.innerHTML = CITIES.map(([name]) => `<option value="${name}">${name}</option>`).join("");
  els.chartCitySelect.value = state.chartCity;
}

function initCompareControls() {
  els.compareCitySelect.innerHTML = [
    `<option value="__overview__">总览（全部城市）</option>`,
    ...CITIES.map(([name]) => `<option value="${name}">${name}</option>`),
  ].join("");
  const today = new Date();
  const day = 24 * 60 * 60 * 1000;
  const iso = (date) => date.toISOString().slice(0, 10);
  els.periodAStart.value = iso(today);
  els.periodAEnd.value = iso(today);
  els.periodBStart.value = iso(new Date(today.getTime() + day));
  els.periodBEnd.value = iso(new Date(today.getTime() + day));
}

function initOverviewControls() {
  els.overviewDate.value = new Date().toISOString().slice(0, 10);
  selectPlant(PLANTS[0]);
}

async function refreshData() {
  const selected = CITIES.filter(([name]) => state.selectedCities.has(name));
  if (!selected.length) {
    state.data = [];
    renderAll();
    setStatus("请选择至少一个城市。");
    return;
  }

  setLoading(true);
  setStatus(`正在读取 ${selected.length} 个城市的天气数据...`);

  try {
    let completed = 0;
    const settled = await mapWithConcurrency(selected, 6, async ([name, lat, lon]) => {
      try {
        return await fetchCityWithRetry(name, lat, lon);
      } finally {
        completed += 1;
        setStatus(`正在读取天气数据... ${completed}/${selected.length}`);
      }
    });
    const results = settled.filter((item) => item.status === "fulfilled").map((item) => item.value);
    const failed = settled.length - results.length;
    if (!results.length) throw new Error("所有城市天气接口均读取失败，请稍后重试或检查网络代理。");
    state.data = results;
    cacheWeatherData(results);
    if (!state.selectedCities.has(state.chartCity)) {
      state.chartCity = results[0]?.city ?? "南宁";
      els.chartCitySelect.value = state.chartCity;
    }
    renderAll();
    setStatus(`已更新 ${results.length} 个城市${failed ? `，${failed} 个城市暂时失败` : ""}，数据时间 ${formatDateTime(new Date())}`);
  } catch (error) {
    const cached = readWeatherCache();
    if (cached.length) {
      state.data = cached;
      renderAll();
      setStatus(`天气接口暂时不可用，已显示上次缓存数据。原因：${error.message}`);
    } else {
      setStatus(`读取失败：${error.message}`);
    }
  } finally {
    setLoading(false);
  }
}

async function fetchCityWithRetry(city, latitude, longitude, retries = 1) {
  let lastError;
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      return await fetchCity(city, latitude, longitude);
    } catch (error) {
      lastError = error;
      if (attempt < retries) await wait(attempt * 400);
    }
  }
  throw new Error(`${city} 连续读取失败：${lastError.message}`);
}

async function fetchCity(city, latitude, longitude) {
  if (state.selectedDate === isoDate(new Date())) {
    return fetchCityForecast(city, latitude, longitude);
  }

  try {
    return await fetchCityForSelectedDate(city, latitude, longitude);
  } catch (error) {
    throw error;
  }
}

async function fetchCityForSelectedDate(city, latitude, longitude) {
  const startDate = state.selectedDate || isoDate(new Date());
  const endDate = addDays(startDate, 1);
  const params = new URLSearchParams({
    latitude,
    longitude,
    current: CURRENT_FIELDS.join(","),
    hourly: HOURLY_FIELDS.join(","),
    daily: DAILY_FIELDS.join(","),
    timezone: TIMEZONE,
    start_date: startDate,
    end_date: endDate,
    wind_speed_unit: "ms",
  });

  const payload = await fetchJson(`${API_URL}?${params.toString()}`);
  return normalizeCityData(city, payload);
}

async function fetchCityForecast(city, latitude, longitude) {
  const params = new URLSearchParams({
    latitude,
    longitude,
    current: CURRENT_FIELDS.join(","),
    hourly: HOURLY_FIELDS.join(","),
    daily: DAILY_FIELDS.join(","),
    timezone: TIMEZONE,
    forecast_hours: String(DASHBOARD_HOURS),
    forecast_days: "7",
    wind_speed_unit: "ms",
  });

  const payload = await fetchJson(`${API_URL}?${params.toString()}`);
  return normalizeCityData(city, payload);
}

function normalizeCityData(city, payload) {
  const hourly = toRows(city, payload.hourly, "time", HOURLY_FIELDS, DASHBOARD_HOURS);
  const daily = toRows(city, payload.daily, "date", DAILY_FIELDS, 7);
  const dayRows = rowsForDate(hourly, state.selectedDate);
  const daySample = dayRows.find((row) => String(row.time).includes("T12:")) ?? dayRows[0] ?? {};
  const current = {
    city,
    time: daySample.time ?? payload.current?.time,
    weather: weatherText(daySample.weather_code ?? payload.current?.weather_code),
    temperature: daySample.temperature_2m ?? payload.current?.temperature_2m,
    apparentTemperature: daySample.apparent_temperature ?? payload.current?.apparent_temperature,
    humidity: daySample.relative_humidity_2m ?? payload.current?.relative_humidity_2m,
    precipitation: payload.current?.precipitation,
    rain: payload.current?.rain,
    cloudCover: daySample.cloud_cover ?? payload.current?.cloud_cover,
    shortwaveRadiation: daySample.shortwave_radiation ?? payload.current?.shortwave_radiation,
    pressure: payload.current?.pressure_msl,
    windSpeed: daySample.wind_speed_10m ?? payload.current?.wind_speed_10m,
    windDirection: daySample.wind_direction_10m ?? payload.current?.wind_direction_10m,
    windGusts: daySample.wind_gusts_10m ?? payload.current?.wind_gusts_10m,
  };

  const risk = {
    maxTemperature: max(hourly, "temperature_2m"),
    maxApparentTemperature: max(hourly, "apparent_temperature"),
    maxRainProbability: max(hourly, "precipitation_probability"),
    maxWindGusts: max(hourly, "wind_gusts_10m"),
    maxRadiation: max(hourly, "shortwave_radiation"),
    avgRadiation: average(hourly, "shortwave_radiation"),
    dayRadiation: sum(dayRows, "shortwave_radiation"),
    dayAvgRadiation: average(dayRows, "shortwave_radiation"),
    dayMaxRadiation: max(dayRows, "shortwave_radiation"),
  };

  return { city, current, hourly, daily, risk };
}

function toRows(city, section, timeKey, fields, limit) {
  const times = (section?.time ?? []).slice(0, limit);
  return times.map((time, index) => {
    const row = { city, [timeKey]: time };
    fields.forEach((field) => {
      row[field] = section?.[field]?.[index] ?? null;
    });
    row.weather_text = weatherText(row.weather_code);
    return row;
  });
}

function renderAll() {
  renderMetrics();
  renderTable();
  drawTrend();
  renderInsights();
}

function renderMetrics() {
  const rows = state.data.map((item) => item.risk);
  els.maxFeel.textContent = withUnit(maxValue(rows, "maxApparentTemperature"), "°C");
  els.maxRadiation.textContent = withUnit(maxValue(rows, "maxRadiation"), "W/m²");
  els.maxGust.textContent = withUnit(maxValue(rows, "maxWindGusts"), "m/s");
  els.maxRainProb.textContent = withUnit(maxValue(rows, "maxRainProbability"), "%");
}

function renderTable() {
  const copy = {
    current: ["城市当前天气", "按电力市场关注度排序，突出负荷和运行风险。"],
    hourly: ["未来 48 小时预报", "展示各城市 48 小时温度、降水、辐射和风况变化。"],
    daily: ["未来 7 天趋势", "用于中期负荷、新能源出力和天气风险判断。"],
  };
  els.tableTitle.textContent = copy[state.view][0];
  els.tableSubtitle.textContent = copy[state.view][1];

  if (state.view === "current") renderCurrentTable();
  if (state.view === "hourly") renderHourlyTable();
  if (state.view === "daily") renderDailyTable();
}

function renderCurrentTable() {
  const rows = [...state.data]
    .map((item) => ({ ...item.current, ...item.risk, riskLevel: classifyRisk(item) }))
    .sort((a, b) => b.avgRadiation - a.avgRadiation);

  renderTableFrame(
    ["城市", "当天辐照", "当天平均辐照", "当天峰值辐照", "温度", "体感", "湿度", "云量", "风速", "阵风", "风险"],
    rows.map((row) => [
      row.city,
      withUnit(row.dayRadiation, "W/m²"),
      withUnit(row.dayAvgRadiation, "W/m²"),
      withUnit(row.dayMaxRadiation, "W/m²"),
      withUnit(row.temperature, "°C"),
      withUnit(row.apparentTemperature, "°C"),
      withUnit(row.humidity, "%"),
      withUnit(row.cloudCover, "%"),
      withUnit(row.windSpeed, "m/s"),
      withUnit(row.windGusts, "m/s"),
      riskPill(row.riskLevel),
    ]),
  );
}

function renderHourlyTable() {
  const rows = state.data.flatMap((item) => item.hourly.slice(0, DASHBOARD_HOURS));
  renderTableFrame(
    ["城市", "时间", "短波辐照", "直接辐照", "散射辐照", "温度", "体感", "降水概率", "云量", "风速", "阵风"],
    rows.map((row) => [
      row.city,
      shortTime(row.time),
      withUnit(row.shortwave_radiation, "W/m²"),
      withUnit(row.direct_radiation, "W/m²"),
      withUnit(row.diffuse_radiation, "W/m²"),
      withUnit(row.temperature_2m, "°C"),
      withUnit(row.apparent_temperature, "°C"),
      withUnit(row.precipitation_probability, "%"),
      withUnit(row.cloud_cover, "%"),
      withUnit(row.wind_speed_10m, "m/s"),
      withUnit(row.wind_gusts_10m, "m/s"),
    ]),
  );
}

function renderDailyTable() {
  const rows = state.data.flatMap((item) => item.daily);
  renderTableFrame(
    ["城市", "日期", "日辐照总量", "日照小时", "最高温", "最低温", "降水量", "降水概率", "最大风速", "最大阵风"],
    rows.map((row) => [
      row.city,
      row.date,
      withUnit(row.shortwave_radiation_sum, "MJ/m²"),
      withUnit(secondsToHours(row.sunshine_duration), "h"),
      withUnit(row.temperature_2m_max, "°C"),
      withUnit(row.temperature_2m_min, "°C"),
      withUnit(row.precipitation_sum, "mm"),
      withUnit(row.precipitation_probability_max, "%"),
      withUnit(row.wind_speed_10m_max, "m/s"),
      withUnit(row.wind_gusts_10m_max, "m/s"),
    ]),
  );
}

function renderTableFrame(headers, rows) {
  els.tableHead.innerHTML = `<tr>${headers.map((header) => `<th>${header}</th>`).join("")}</tr>`;
  els.tableBody.innerHTML = rows.length
    ? rows.map((row) => `<tr>${row.map((cell) => `<td>${cell ?? "--"}</td>`).join("")}</tr>`).join("")
    : `<tr><td colspan="${headers.length}">暂无数据</td></tr>`;
}

function drawTrend() {
  const canvas = els.trendCanvas;
  const ctx = canvas.getContext("2d");
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const width = rect.width;
  const height = rect.height;
  ctx.clearRect(0, 0, width, height);

  const item = state.data.find((entry) => entry.city === state.chartCity) ?? state.data[0];
  if (!item) {
    els.chartStats.innerHTML = "";
    drawEmptyChart(ctx, width, height, "暂无趋势数据");
    return;
  }

  state.chartCity = item.city;
  els.chartCitySelect.value = item.city;
  els.chartCityLabel.textContent = `${item.city} 未来 48 小时量化气象趋势`;

  const rows = item.hourly.slice(0, DASHBOARD_HOURS);
  const padding = { left: 46, right: 160, top: 28, bottom: 42 };
  const plotW = width - padding.left - padding.right;
  const plotH = height - padding.top - padding.bottom;

  renderChartStats(item);
  drawGrid(ctx, width, height, padding);
  const series = [
    { field: "temperature_2m", label: "温度", unit: "°C", color: "#d65843" },
    { field: "shortwave_radiation", label: "辐照", unit: "W/m²", color: "#d99a22" },
    { field: "wind_gusts_10m", label: "阵风", unit: "m/s", color: "#287f83" },
  ];
  const seriesResults = series.map((itemSeries) => drawSeries(ctx, rows, itemSeries, padding, plotW, plotH));
  drawRightLegend(ctx, seriesResults.filter(Boolean), width, height, padding);

  drawTimeAxis(ctx, rows, width, height, padding, plotW);
}

function drawGrid(ctx, width, height, padding) {
  const plotH = height - padding.top - padding.bottom;
  ctx.strokeStyle = "#edf1ec";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i += 1) {
    const y = padding.top + i * (plotH / 4);
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();
  }

  ctx.fillStyle = "#8a968e";
  ctx.font = "12px Microsoft YaHei, sans-serif";
  ctx.fillText("高", 14, padding.top + 4);
  ctx.fillText("低", 14, padding.top + plotH + 4);
}

function drawSeries(ctx, rows, series, padding, plotW, plotH) {
  const values = rows.map((row) => Number(row[series.field])).filter(Number.isFinite);
  if (!values.length) return;

  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;
  const points = rows
    .map((row, index) => {
      const value = Number(row[series.field]);
      if (!Number.isFinite(value)) return null;
      return {
        x: padding.left + (index / Math.max(rows.length - 1, 1)) * plotW,
        y: padding.top + plotH - ((value - minVal) / range) * plotH,
        value,
      };
    })
    .filter(Boolean);

  ctx.strokeStyle = series.color;
  ctx.lineWidth = 2.8;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  points.forEach((point, index) => {
    if (index === 0) {
      ctx.moveTo(point.x, point.y);
      return;
    }
    const prev = points[index - 1];
    const midX = (prev.x + point.x) / 2;
    ctx.quadraticCurveTo(prev.x, prev.y, midX, (prev.y + point.y) / 2);
  });
  ctx.stroke();

  const last = points.at(-1);
  if (!last) return;
  ctx.fillStyle = series.color;
  ctx.beginPath();
  ctx.arc(last.x, last.y, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = "12px Microsoft YaHei, sans-serif";
  return {
    ...series,
    latest: last.value,
    min: minVal,
    max: maxVal,
    y: last.y,
  };
}

function drawRightLegend(ctx, seriesResults, width, height, padding) {
  const x = width - padding.right + 22;
  const yStart = padding.top + 8;

  ctx.strokeStyle = "#e4ebe4";
  ctx.beginPath();
  ctx.moveTo(width - padding.right + 4, padding.top);
  ctx.lineTo(width - padding.right + 4, height - padding.bottom);
  ctx.stroke();

  ctx.fillStyle = "#526058";
  ctx.font = "12px Microsoft YaHei, sans-serif";
  ctx.fillText("图例 / 最新值", x, padding.top - 8);

  seriesResults.forEach((item, index) => {
    const y = yStart + index * 72;
    ctx.fillStyle = item.color;
    ctx.fillRect(x, y, 22, 4);
    ctx.beginPath();
    ctx.arc(x + 28, y + 2, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#17201b";
    ctx.font = "700 13px Microsoft YaHei, sans-serif";
    ctx.fillText(item.label, x, y + 22);

    ctx.fillStyle = item.color;
    ctx.font = "700 16px Microsoft YaHei, sans-serif";
    ctx.fillText(`${fmt(item.latest)}${item.unit}`, x, y + 44);

    ctx.fillStyle = "#7a867e";
    ctx.font = "11px Microsoft YaHei, sans-serif";
    ctx.fillText(`区间 ${fmt(item.min)}-${fmt(item.max)}`, x, y + 62);
  });
}

function drawTimeAxis(ctx, rows, width, height, padding, plotW) {
  ctx.fillStyle = "#6d7971";
  ctx.font = "12px Microsoft YaHei, sans-serif";
  const ticks = [0, 8, 16, 24, 32, 40, 47].filter((index) => rows[index]);
  ticks.forEach((index) => {
    const x = padding.left + (index / Math.max(rows.length - 1, 1)) * plotW;
    ctx.fillText(shortTime(rows[index].time), Math.min(x, width - padding.right - 74), height - 16);
  });
}

function renderChartStats(item) {
  const stats = [
    ["最高温度", withUnit(max(item.hourly.slice(0, DASHBOARD_HOURS), "temperature_2m"), "°C"), "load"],
    ["平均辐照", withUnit(average(item.hourly.slice(0, DASHBOARD_HOURS), "shortwave_radiation"), "W/m²"), "solar"],
    ["峰值辐照", withUnit(max(item.hourly.slice(0, DASHBOARD_HOURS), "shortwave_radiation"), "W/m²"), "solar"],
    ["最大阵风", withUnit(max(item.hourly.slice(0, DASHBOARD_HOURS), "wind_gusts_10m"), "m/s"), "wind"],
  ];
  els.chartStats.innerHTML = stats
    .map(([label, value, type]) => `
      <div class="chart-stat ${type}">
        <span>${label}</span>
        <strong>${value}</strong>
      </div>
    `)
    .join("");
}

function drawEmptyChart(ctx, width, height, text) {
  ctx.fillStyle = "#66736b";
  ctx.font = "16px Microsoft YaHei";
  ctx.textAlign = "center";
  ctx.fillText(text, width / 2, height / 2);
  ctx.textAlign = "start";
}

function renderInsights() {
  const data = state.data;
  if (!data.length) {
    els.insightList.innerHTML = `<div class="insight">请选择城市并刷新数据。</div>`;
    return;
  }

  const hottest = maxItem(data, (item) => item.risk.maxApparentTemperature);
  const wettest = maxItem(data, (item) => item.risk.maxRainProbability);
  const gustiest = maxItem(data, (item) => item.risk.maxWindGusts);
  const solar = maxItem(data, (item) => item.risk.avgRadiation);

  const insights = [
    ["load", `${hottest.city} 未来 48 小时最高体感温度 ${fmt(hottest.risk.maxApparentTemperature)}°C，空调负荷压力相对更强。`],
    ["solar", `${solar.city} 未来 48 小时平均短波辐照 ${fmt(solar.risk.avgRadiation)} W/m²，峰值 ${fmt(solar.risk.maxRadiation)} W/m²。`],
    ["wind", `${gustiest.city} 最大阵风 ${fmt(gustiest.risk.maxWindGusts)} m/s，关注风电波动和线路运行风险。`],
    ["risk", `${wettest.city} 最大降水概率 ${fmt(wettest.risk.maxRainProbability)}%，需关注雷暴、强降雨造成的短时扰动。`],
  ];

  els.insightList.innerHTML = insights
    .map(([type, text]) => `<div class="insight ${type}">${text}</div>`)
    .join("");
}

function exportCurrentView() {
  const rows = getExportRows();
  if (!rows.length) {
    setStatus("当前没有可导出的数据。");
    return;
  }

  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => csvValue(row[header])).join(",")),
  ].join("\n");

  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `guangxi-weather-${state.view}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

async function handleSpotFile(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  if (!window.XLSX) {
    els.spotStatus.textContent = "缺少 Excel 解析库，请确认 xlsx.full.min.js 已加载。";
    return;
  }
  els.spotStatus.textContent = `正在解析 ${file.name} ...`;
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array", cellDates: true });
  const sheet96 = workbook.Sheets["96点数据"] || workbook.Sheets["96点"];
  const sheet24 = workbook.Sheets["24时数据"] || workbook.Sheets["24点"] || workbook.Sheets["24点数据"];
  if (!sheet96 || !sheet24) {
    els.spotStatus.textContent = "未找到“96点数据”和“24时数据”工作表。";
    return;
  }
  applySpotPayload({
    source: file.name,
    rows96: XLSX.utils.sheet_to_json(sheet96, { defval: null }),
    rows24: XLSX.utils.sheet_to_json(sheet24, { defval: null }),
  });
  els.spotStatus.textContent = `已读取：96点 ${spotState.pointRows.length} 行，24时 ${spotState.priceRows.length} 行。`;
  renderSpotCharts();
}

async function loadLocalSpotData() {
  try {
    const response = await fetch("./spot-data.json", { cache: "no-store" });
    if (!response.ok) return;
    const payload = await response.json();
    applySpotPayload(payload);
    els.spotStatus.textContent = `已自动读取 ${payload.source}：96点 ${spotState.pointRows.length} 行，24时 ${spotState.priceRows.length} 行。`;
    renderSpotCharts();
  } catch {
    // No bundled local spot file yet.
  }
}

function applySpotPayload(payload) {
  spotState.pointRows = payload.rows96 ?? [];
  spotState.priceRows = payload.rows24 ?? [];
  buildSpotModel();
}


function buildSpotModel() {
  spotState.dates = [...new Set(spotState.priceRows.map((row) => normalizeExcelDate(row["日期"])).filter(Boolean))].sort();
  els.spotDateSelect.innerHTML = spotState.dates.map((date) => `<option value="${date}">${date}</option>`).join("");

  const numericFields96 = Object.keys(spotState.pointRows[0] ?? {})
    .filter((field) => !["年", "月", "日", "累计", "小时", "序号", "日期", "周", "时间（15分钟）"].includes(field))
    .filter((field) => spotState.pointRows.some((row) => Number.isFinite(Number(row[field]))));

  const defaultSeries = numericFields96.filter((field) => /新能源|风电|光伏|水电|统调负荷|联络线|非市场化/.test(field)).slice(0, 8);
  spotState.selectedSeries = new Set(defaultSeries.length ? defaultSeries : numericFields96.slice(0, 6));
  els.seriesPicker.innerHTML = numericFields96.map((field) => `
    <label class="series-pill">
      <input type="checkbox" value="${field}" ${spotState.selectedSeries.has(field) ? "checked" : ""} />
      ${field}
    </label>
  `).join("");
  els.seriesPicker.querySelectorAll("input").forEach((input) => {
    input.addEventListener("change", () => {
      if (input.checked) spotState.selectedSeries.add(input.value);
      else spotState.selectedSeries.delete(input.value);
      renderSpotCharts();
    });
  });

  spotState.hourly96 = new Map();
  for (const date of spotState.dates) {
    const rows = spotState.pointRows.filter((row) => normalizeExcelDate(row["日期"]) === date);
    const hourly = Array.from({ length: 24 }, (_, hour) => {
      const hourRows = rows.filter((row) => Number(row["小时"]) === hour);
      const item = { hour };
      for (const field of numericFields96) item[field] = average(hourRows, field);
      return item;
    });
    spotState.hourly96.set(date, hourly);
  }
}

function renderSpotCharts() {
  const date = els.spotDateSelect.value;
  if (!date) {
    els.spotStatus.textContent = "请先上传文件并选择日期。";
    return;
  }
  const priceRows = spotState.priceRows
    .filter((row) => normalizeExcelDate(row["日期"]) === date)
    .sort((a, b) => Number(a["小时"]) - Number(b["小时"]));
  const hourlyRows = spotState.hourly96.get(date) ?? [];

  const pricedRows = priceRows.map((row) => {
    const dayAhead = Number(row["日前电价"]);
    const realtime = Number(row["实时电价"]);
    const spread = Number.isFinite(dayAhead) && Number.isFinite(realtime) ? realtime - dayAhead : null;
    return {
      ...row,
      "正价差": spread > 0 ? spread : null,
      "负价差": spread < 0 ? spread : null,
    };
  });

  renderSpotMetrics(date, pricedRows, hourlyRows);
  drawMultiLineChart(els.priceCanvas, pricedRows, [
    { field: "日前电价", label: "日前电价", color: "#d99a22", unit: "元/MWh" },
    { field: "实时电价", label: "实时电价", color: "#5fd3ff", unit: "元/MWh" },
    { field: "正价差", label: "正价差", color: "#f1a35a", unit: "元/MWh", type: "bar" },
    { field: "负价差", label: "负价差", color: "#42d99c", unit: "元/MWh", type: "bar" },
  ], "小时");

  const colors = ["#287f83", "#d99a22", "#d65843", "#6848a6", "#3f7fbf", "#7c8a30", "#b35c9e", "#4f6b57"];
  const series = [...spotState.selectedSeries].map((field, index) => ({
    field,
    label: field,
    color: colors[index % colors.length],
    unit: "MW",
  }));
  drawMultiLineChart(els.energyCanvas, hourlyRows, series, "hour");
}

function renderSpotMetrics(date, priceRows, hourlyRows) {
  const dayAhead = average(priceRows, "日前电价");
  const realtime = average(priceRows, "实时电价");
  const spread = realtime - dayAhead;
  const maxPositive = max(priceRows, "正价差");
  const maxNegative = min(priceRows, "负价差");
  const positiveHours = priceRows.filter((row) => Number(row["正价差"]) > 0).length;
  const newEnergyField = [...spotState.selectedSeries].find((field) => field.includes("新能源"));
  const newEnergyAvg = newEnergyField ? average(hourlyRows, newEnergyField) : null;
  els.spotMetrics.innerHTML = [
    ["区间日前均价", fmt(dayAhead), "元/MWh", "¥", "由筛选日期计算"],
    ["区间实时均价", fmt(realtime), "元/MWh", "∿", "剔除实时缺失样本"],
    ["区间价差均值", `${spread > 0 ? "+" : ""}${fmt(spread)}`, "元/MWh", "↔", spread >= 0 ? "整体为正价差" : "整体呈负价差"],
    ["最大正价差", fmt(maxPositive), "元/MWh", "↗", date],
    ["最大负价差", fmt(maxNegative), "元/MWh", "↘", date],
    ["正价差时段数", positiveHours, "小时", "◴", `新能源均值 ${fmt(newEnergyAvg)}MW`],
  ].map(([label, value, unit, icon, note]) => `
    <article class="spot-card">
      <div class="spot-card-icon">${icon}</div>
      <div>
        <span>${label}</span>
        <strong>${value}<small>${unit}</small></strong>
        <em>${note}</em>
      </div>
    </article>
  `).join("");
}

function drawMultiLineChart(canvas, rows, series, xField) {
  const ctx = canvas.getContext("2d");
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const w = rect.width;
  const h = rect.height;
  const isSpot = canvas.closest(".spot-view");
  ctx.clearRect(0, 0, w, h);
  if (!rows.length || !series.length) {
    drawEmptyChart(ctx, w, h, "暂无数据");
    return;
  }
  const pad = { left: 50, right: 170, top: 26, bottom: 42 };
  const plotW = w - pad.left - pad.right;
  const plotH = h - pad.top - pad.bottom;
  if (isSpot) drawSpotGrid(ctx, w, h, pad);
  else drawGrid(ctx, w, h, pad);

  const lineSeries = series.filter((s) => s.type !== "bar");
  const barSeries = series.filter((s) => s.type === "bar");
  const allValues = lineSeries.flatMap((s) => rows.map((r) => Number(r[s.field])).filter(Number.isFinite));
  const minVal = Math.min(...allValues);
  const maxVal = Math.max(...allValues);
  const range = maxVal - minVal || 1;
  const legends = [];
  if (barSeries.length) {
    drawSpreadBars(ctx, rows, barSeries, pad, plotW, plotH);
  }
  lineSeries.forEach((s) => {
    ctx.strokeStyle = s.color;
    ctx.lineWidth = 2.4;
    ctx.shadowColor = isSpot ? s.color : "transparent";
    ctx.shadowBlur = isSpot ? 10 : 0;
    ctx.beginPath();
    let started = false;
    rows.forEach((row, idx) => {
      const value = Number(row[s.field]);
      if (!Number.isFinite(value)) return;
      const x = pad.left + (idx / Math.max(rows.length - 1, 1)) * plotW;
      const y = pad.top + plotH - ((value - minVal) / range) * plotH;
      if (!started) {
        ctx.moveTo(x, y);
        started = true;
      }
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.shadowBlur = 0;
    legends.push({ ...s, latest: Number(rows.at(-1)?.[s.field]), min: min(rows, s.field), max: max(rows, s.field) });
  });
  if (isSpot) drawSpotLegend(ctx, [...lineSeries, ...barSeries], w, pad);
  else drawRightLegend(ctx, legends, w, h, pad);
  ctx.fillStyle = isSpot ? "#9db4c9" : "#6d7971";
  ctx.font = "12px Microsoft YaHei, sans-serif";
  [0, 3, 6, 9, 12, 15, 18, 21, 23].forEach((i) => {
    if (!rows[i]) return;
    const x = pad.left + (i / Math.max(rows.length - 1, 1)) * plotW;
    ctx.fillText(`${String(rows[i][xField] ?? i).padStart(2, "0")}:00`, Math.min(x, w - pad.right - 45), h - 16);
  });
}

function drawSpotGrid(ctx, width, height, padding) {
  const plotH = height - padding.top - padding.bottom;
  ctx.fillStyle = "rgba(4, 20, 40, 0.72)";
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = "rgba(106, 190, 255, 0.16)";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i += 1) {
    const y = padding.top + i * (plotH / 5);
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();
  }
  ctx.fillStyle = "#9db4c9";
  ctx.font = "12px Microsoft YaHei, sans-serif";
  ctx.fillText("价格 / 价差", 14, padding.top + 4);
}

function drawSpreadBars(ctx, rows, barSeries, padding, plotW, plotH) {
  const values = barSeries.flatMap((s) => rows.map((row) => Number(row[s.field])).filter(Number.isFinite));
  if (!values.length) return;
  const maxAbs = Math.max(...values.map((value) => Math.abs(value))) || 1;
  const zeroY = padding.top + plotH * 0.54;
  const barWidth = Math.max(4, plotW / Math.max(rows.length, 1) * 0.36);
  barSeries.forEach((series) => {
    rows.forEach((row, index) => {
      const value = Number(row[series.field]);
      if (!Number.isFinite(value)) return;
      const x = padding.left + (index / Math.max(rows.length - 1, 1)) * plotW - barWidth / 2;
      const barH = Math.abs(value) / maxAbs * (plotH * 0.34);
      const y = value >= 0 ? zeroY - barH : zeroY;
      const gradient = ctx.createLinearGradient(0, y, 0, y + barH);
      gradient.addColorStop(0, series.color);
      gradient.addColorStop(1, "rgba(255,255,255,0.08)");
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth, Math.max(1, barH));
    });
  });
  ctx.strokeStyle = "rgba(255,255,255,0.24)";
  ctx.beginPath();
  ctx.moveTo(padding.left, zeroY);
  ctx.lineTo(padding.left + plotW, zeroY);
  ctx.stroke();
}

function drawSpotLegend(ctx, series, width, padding) {
  let x = padding.left + 260;
  const y = 20;
  ctx.font = "12px Microsoft YaHei, sans-serif";
  series.forEach((item) => {
    ctx.fillStyle = item.color;
    ctx.fillRect(x, y - 7, 20, 4);
    ctx.fillStyle = "#c9d9e8";
    ctx.fillText(`${item.label}（${item.unit}）`, x + 28, y);
    x += 150;
    if (x > width - padding.right - 160) x = padding.left + 260;
  });
}

function normalizeExcelDate(value) {
  if (!value) return "";
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  const text = String(value).trim().replaceAll("/", "-");
  const match = text.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (!match) return "";
  return `${match[1]}-${match[2].padStart(2, "0")}-${match[3].padStart(2, "0")}`;
}

async function runDateCompare() {
  const periodA = normalizePeriod(els.periodAStart.value, els.periodAEnd.value);
  const periodB = normalizePeriod(els.periodBStart.value, els.periodBEnd.value);
  if (!periodA || !periodB) {
    els.compareStatus.textContent = "请选择完整的 A/B 日期。";
    return;
  }

  els.compareBtn.disabled = true;
  els.compareBtn.textContent = "对比中...";

  try {
    const isOverview = els.compareCitySelect.value === "__overview__";
    const rowsA = isOverview
      ? await fetchCompareOverview(periodA, "A")
      : await fetchCompareCity(periodA);
    const rowsB = isOverview
      ? await fetchCompareOverview(periodB, "B")
      : await fetchCompareCity(periodB);
    const summaryA = summarizePeriod(rowsA);
    const summaryB = summarizePeriod(rowsB);
    const label = isOverview ? "广西总览" : els.compareCitySelect.value;
    renderCompareResult(label, periodA, periodB, summaryA, summaryB);
    els.compareStatus.textContent = `已完成 ${label} 日期对比。`;
  } catch (error) {
    els.compareStatus.textContent = `日期对比失败：${error.message}`;
  } finally {
    els.compareBtn.disabled = false;
    els.compareBtn.textContent = "开始对比";
  }
}

async function fetchCompareCity(period) {
  const city = CITIES.find(([name]) => name === els.compareCitySelect.value);
  if (!city) throw new Error("请选择城市。");
  els.compareStatus.textContent = `正在读取 ${city[0]} 的日期区间数据...`;
  return fetchDailyRange(city[0], city[1], city[2], period.start, period.end);
}

async function fetchCompareOverview(period, label) {
  let completed = 0;
  const settled = await mapWithConcurrency(CITIES, 4, async ([name, lat, lon]) => {
    try {
      return await fetchDailyRange(name, lat, lon, period.start, period.end);
    } finally {
      completed += 1;
      els.compareStatus.textContent = `正在读取 ${label} 区间全部城市... ${completed}/${CITIES.length}`;
    }
  });
  const rows = settled.filter((item) => item.status === "fulfilled").flatMap((item) => item.value);
  const failed = settled.length - settled.filter((item) => item.status === "fulfilled").length;
  if (!rows.length) throw new Error(`${label} 区间全部城市读取失败。`);
  if (failed) els.compareStatus.textContent = `${label} 区间有 ${failed} 个城市暂时失败，已用成功城市生成总览。`;
  return rows;
}

async function runOverview() {
  const date = els.overviewDate.value;
  if (!date) {
    els.overviewStatus.textContent = "请选择总览日期。";
    return;
  }

  els.overviewBtn.disabled = true;
  els.overviewBtn.textContent = "生成中...";
  els.overviewStatus.textContent = `正在聚合广西 14 个城市 ${date} 的小时气象数据...`;

  try {
    const rowsByCity = [];
    for (const [name, lat, lon] of CITIES) {
      els.overviewStatus.textContent = `正在读取 ${name} ${date} 的小时气象数据...`;
      rowsByCity.push(await fetchHourlyDayWithRetry(name, lat, lon, date));
      await wait(250);
    }
    const allRows = rowsByCity.flat();
    renderPeriodSummary(allRows, date);
    els.overviewStatus.textContent = `已完成 ${date} 广西整体三时段总结。`;
  } catch (error) {
    els.overviewStatus.textContent = `广西总览生成失败：${error.message}`;
  } finally {
    els.overviewBtn.disabled = false;
    els.overviewBtn.textContent = "生成总览";
  }
}

async function fetchHourlyDayWithRetry(city, latitude, longitude, date, retries = 4) {
  let lastError;
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      return await fetchHourlyDay(city, latitude, longitude, date);
    } catch (error) {
      lastError = error;
      await wait(attempt * 900);
    }
  }
  throw new Error(`${city} 连续读取失败：${lastError.message}`);
}

async function fetchHourlyDay(city, latitude, longitude, date) {
  const params = new URLSearchParams({
    latitude,
    longitude,
    hourly: HOURLY_FIELDS.join(","),
    timezone: TIMEZONE,
    start_date: date,
    end_date: date,
    wind_speed_unit: "ms",
  });
  const response = await fetch(`${API_URL}?${params.toString()}`);
  if (!response.ok) throw new Error(`${city} HTTP ${response.status}`);
  const payload = await response.json();
  return toRows(city, payload.hourly, "time", HOURLY_FIELDS, 24);
}

function renderPeriodSummary(rows, date) {
  const periods = [
    { name: "夜间", range: "00:00-08:00", start: 0, end: 8, type: "risk" },
    { name: "白天", range: "08:00-16:00", start: 8, end: 16, type: "solar" },
    { name: "晚高峰", range: "16:00-24:00", start: 16, end: 24, type: "load" },
  ].map((period) => {
    const periodRows = rows.filter((row) => {
      const hour = Number(row.time.slice(11, 13));
      return hour >= period.start && hour < period.end;
    });
    return {
      ...period,
      avgTemp: average(periodRows, "temperature_2m"),
      avgFeel: average(periodRows, "apparent_temperature"),
      avgHumidity: average(periodRows, "relative_humidity_2m"),
      avgRadiation: average(periodRows, "shortwave_radiation"),
      maxRadiation: max(periodRows, "shortwave_radiation"),
      rainSum: sum(periodRows, "precipitation"),
      maxRainProb: max(periodRows, "precipitation_probability"),
      maxGust: max(periodRows, "wind_gusts_10m"),
      maxWind: max(periodRows, "wind_speed_10m"),
    };
  });

  els.periodGrid.innerHTML = periods
    .map((period) => `
      <article class="period-card ${period.type}">
        <div>
          <span>${date} · ${period.range}</span>
          <h3>${period.name}</h3>
        </div>
        <dl>
          <div><dt>平均温度</dt><dd>${withUnit(period.avgTemp, "°C")}</dd></div>
          <div><dt>平均体感</dt><dd>${withUnit(period.avgFeel, "°C")}</dd></div>
          <div><dt>平均湿度</dt><dd>${withUnit(period.avgHumidity, "%")}</dd></div>
          <div><dt>平均辐照</dt><dd>${withUnit(period.avgRadiation, "W/m²")}</dd></div>
          <div><dt>峰值辐照</dt><dd>${withUnit(period.maxRadiation, "W/m²")}</dd></div>
          <div><dt>累计降水</dt><dd>${withUnit(period.rainSum, "mm")}</dd></div>
          <div><dt>最大降水概率</dt><dd>${withUnit(period.maxRainProb, "%")}</dd></div>
          <div><dt>最大阵风</dt><dd>${withUnit(period.maxGust, "m/s")}</dd></div>
        </dl>
      </article>
    `)
    .join("");

  const hottest = maxItem(periods, (p) => p.avgFeel);
  const sunniest = maxItem(periods, (p) => p.avgRadiation);
  const riskiest = maxItem(periods, (p) => p.maxRainProb + p.maxGust * 4);
  els.overviewInsights.innerHTML = [
    ["load", `${hottest.name}平均体感最高，为 ${fmt(hottest.avgFeel)}°C，是当日负荷压力重点时段。`],
    ["solar", `${sunniest.name}平均辐照最高，为 ${fmt(sunniest.avgRadiation)} W/m²，是光伏出力主窗口。`],
    ["risk", `${riskiest.name}综合天气扰动更强，最大降水概率 ${fmt(riskiest.maxRainProb)}%，最大阵风 ${fmt(riskiest.maxGust)} m/s。`],
  ].map(([type, text]) => `<div class="insight ${type}">${text}</div>`).join("");
}

function renderMap() {
  els.gxMap.setAttribute("viewBox", "0 0 1287 1045");
  const pointByName = {
    "防城港海上风电示范项目": [648, 842],
    "钦州海上风电示范项目": [760, 830],
    "北海合浦乌家风电场": [852, 872],
    "百色田阳高德岭风电场": [305, 505],
    "桂林资源金紫山风电场": [882, 176],
    "桂林兴安光华铺风电场": [858, 240],
    "来宾桥巩风电项目": [706, 525],
    "来宾良江农光互补光伏": [684, 568],
    "桂林恭城栗木光伏": [1002, 392],
    "崇左扶绥光伏基地": [498, 742],
  };
  const projectPoints = PLANTS.map((plant) => {
    const [mapX, mapY] = pointByName[plant.name] ?? [640, 520];
    return { ...plant, mapX, mapY };
  });
  els.gxMap.innerHTML = `
    <image href="./guangxi-map-base.jpg" x="0" y="0" width="1287" height="1045" preserveAspectRatio="xMidYMid meet"></image>
    <rect class="map-overlay-panel" x="36" y="884" width="360" height="94" rx="12"></rect>
    <circle class="legend-dot wind" cx="66" cy="916" r="11"></circle>
    <text class="map-legend-text" x="88" y="922">风电 / 海上风电项目</text>
    <circle class="legend-dot solar" cx="66" cy="952" r="11"></circle>
    <text class="map-legend-text" x="88" y="958">光伏 / 农光互补项目</text>
    <text class="map-note" x="36" y="1010">底图参考：广西壮族自治区地图 桂S(2020)48号。项目点位为业务示意定位。</text>
    ${projectPoints.map((plant, index) => `
      <g class="plant-marker ${plant.type.includes("光伏") ? "solar" : "wind"}" data-index="${index}" tabindex="0" role="button" aria-label="${plant.name}">
        <circle cx="${plant.mapX}" cy="${plant.mapY}" r="14"></circle>
        <text x="${plant.mapX + 20}" y="${plant.mapY + 7}">${plant.city}</text>
      </g>
    `).join("")}
  `;

  els.gxMap.querySelectorAll(".plant-marker").forEach((marker) => {
    marker.addEventListener("click", () => selectPlant(PLANTS[Number(marker.dataset.index)]));
    marker.addEventListener("keydown", (event) => {
      if (event.key === "Enter") selectPlant(PLANTS[Number(marker.dataset.index)]);
    });
  });
}

function selectPlant(plant) {
  if (!plant || !els.plantDetail) return;
  els.plantTitle.textContent = plant.name;
  els.plantSubtitle.textContent = `${plant.city} · ${plant.type}`;
  els.plantDetail.innerHTML = `
    <div class="plant-chip ${plant.type.includes("光伏") ? "solar" : "wind"}">${plant.type}</div>
    <dl>
      <div><dt>所在区域</dt><dd>${plant.area}</dd></div>
      <div><dt>装机/规模</dt><dd>${plant.capacity}</dd></div>
      <div><dt>调度观察</dt><dd>${plant.note}</dd></div>
    </dl>
    <p class="source-note">点位为示意坐标，依据公开项目报道整理，用于业务看板定位展示。</p>
  `;
}

function normalizePeriod(start, end) {
  if (!start || !end) return null;
  return start <= end ? { start, end } : { start: end, end: start };
}

async function fetchDailyRange(city, latitude, longitude, startDate, endDate) {
  const params = new URLSearchParams({
    latitude,
    longitude,
    daily: DAILY_FIELDS.join(","),
    timezone: TIMEZONE,
    start_date: startDate,
    end_date: endDate,
    wind_speed_unit: "ms",
  });
  const response = await fetch(`${API_URL}?${params.toString()}`);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const payload = await response.json();
  return toRows(city, payload.daily, "date", DAILY_FIELDS, 400);
}

function summarizePeriod(rows) {
  return {
    days: rows.length,
    avgMaxTemp: average(rows, "temperature_2m_max"),
    avgMinTemp: average(rows, "temperature_2m_min"),
    avgFeelMax: average(rows, "apparent_temperature_max"),
    rainSum: sum(rows, "precipitation_sum"),
    radiationSum: sum(rows, "shortwave_radiation_sum"),
    sunshineHours: sum(rows, "sunshine_duration") / 3600,
    maxRainProb: max(rows, "precipitation_probability_max"),
    maxWind: max(rows, "wind_speed_10m_max"),
    maxGust: max(rows, "wind_gusts_10m_max"),
  };
}

function renderCompareResult(city, periodA, periodB, a, b) {
  const metrics = [
    ["最高温均值", a.avgMaxTemp, b.avgMaxTemp, "°C", "load"],
    ["体感高温均值", a.avgFeelMax, b.avgFeelMax, "°C", "load"],
    ["降水累计", a.rainSum, b.rainSum, "mm", "risk"],
    ["辐照累计", a.radiationSum, b.radiationSum, "MJ/m²", "solar"],
    ["日照累计", a.sunshineHours, b.sunshineHours, "h", "solar"],
    ["最大阵风", a.maxGust, b.maxGust, "m/s", "wind"],
  ];

  els.compareMetrics.innerHTML = metrics
    .map(([name, av, bv, unit, type]) => {
      const diff = Number(bv) - Number(av);
      const sign = diff > 0 ? "+" : "";
      return `
        <article class="compare-card ${type}">
          <span>${name}</span>
          <strong>${sign}${fmt(diff)}${unit}</strong>
          <small>A ${fmt(av)}${unit} → B ${fmt(bv)}${unit}</small>
        </article>
      `;
    })
    .join("");

  renderTableFrameTo(
    els.compareTableHead,
    els.compareTableBody,
    ["指标", `A ${periodA.start} 至 ${periodA.end}`, `B ${periodB.start} 至 ${periodB.end}`, "差值(B-A)"],
    metrics.map(([name, av, bv, unit]) => [name, `${fmt(av)}${unit}`, `${fmt(bv)}${unit}`, `${fmt(Number(bv) - Number(av))}${unit}`]),
  );

  els.compareInsights.innerHTML = buildCompareInsights(city, a, b)
    .map(([type, text]) => `<div class="insight ${type}">${text}</div>`)
    .join("");
}

function renderTableFrameTo(head, body, headers, rows) {
  head.innerHTML = `<tr>${headers.map((header) => `<th>${header}</th>`).join("")}</tr>`;
  body.innerHTML = rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("");
}

function buildCompareInsights(city, a, b) {
  const tempDiff = b.avgFeelMax - a.avgFeelMax;
  const radDiff = b.radiationSum - a.radiationSum;
  const rainDiff = b.rainSum - a.rainSum;
  const gustDiff = b.maxGust - a.maxGust;
  return [
    ["load", `${city} B 区间体感高温均值较 A ${diffText(tempDiff, "°C")}，对应空调负荷压力${tempDiff >= 0 ? "增强" : "减弱"}。`],
    ["solar", `B 区间辐照累计较 A ${diffText(radDiff, "MJ/m²")}，光伏出力资源${radDiff >= 0 ? "改善" : "走弱"}。`],
    ["risk", `B 区间降水累计较 A ${diffText(rainDiff, "mm")}，短时扰动和湿热风险${rainDiff >= 0 ? "上升" : "下降"}。`],
    ["wind", `B 区间最大阵风较 A ${diffText(gustDiff, "m/s")}，风电波动和运行风险${gustDiff >= 0 ? "更需要关注" : "相对缓和"}。`],
  ];
}

function diffText(value, unit) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${fmt(value)}${unit}`;
}

function getExportRows() {
  if (state.view === "current") {
    return state.data.map((item) => ({ ...item.current, ...item.risk }));
  }
  if (state.view === "hourly") {
    return state.data.flatMap((item) => item.hourly);
  }
  return state.data.flatMap((item) => item.daily);
}

function classifyRisk(item) {
  const hot = item.risk.maxApparentTemperature >= 38;
  const wet = item.risk.maxRainProbability >= 75;
  const gust = item.risk.maxWindGusts >= 14;
  if (hot || wet || gust) return "高";
  if (item.risk.maxApparentTemperature >= 34 || item.risk.maxRainProbability >= 45) return "中";
  return "低";
}

function riskPill(level) {
  const cls = level === "高" ? "risk-high" : level === "中" ? "risk-mid" : "risk-low";
  return `<span class="risk-pill ${cls}">${level}</span>`;
}

function weatherText(code) {
  return WEATHER_CODE_CN[Number(code)] ?? `代码 ${code ?? "--"}`;
}

function max(rows, field) {
  return maxValue(rows, field);
}

function min(rows, field) {
  const values = rows.map((row) => Number(row[field])).filter(Number.isFinite);
  return values.length ? Math.min(...values) : null;
}

function average(rows, field) {
  const values = rows.map((row) => Number(row[field])).filter(Number.isFinite);
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
}

function sum(rows, field) {
  return rows.map((row) => Number(row[field])).filter(Number.isFinite).reduce((total, value) => total + value, 0);
}

function maxValue(rows, field) {
  const values = rows.map((row) => Number(row[field])).filter(Number.isFinite);
  return values.length ? Math.max(...values) : null;
}

function maxItem(items, getter) {
  return [...items].sort((a, b) => Number(getter(b) ?? -Infinity) - Number(getter(a) ?? -Infinity))[0];
}

function withUnit(value, unit) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "--";
  return `${fmt(value)}${unit}`;
}

function fmt(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "--";
  return Number.isInteger(number) ? String(number) : number.toFixed(1);
}

function secondsToHours(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number / 3600 : null;
}

function shortTime(value) {
  if (!value) return "--";
  return value.replace("T", " ").slice(5, 16);
}

function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

function addDays(dateText, days) {
  const date = new Date(`${dateText}T00:00:00`);
  date.setDate(date.getDate() + days);
  return isoDate(date);
}

function rowsForDate(rows, dateText) {
  return rows.filter((row) => String(row.time ?? "").startsWith(dateText));
}

async function fetchJson(url, timeoutMs = 5000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal, cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}

async function mapWithConcurrency(items, limit, worker) {
  const results = new Array(items.length);
  let nextIndex = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      try {
        results[currentIndex] = { status: "fulfilled", value: await worker(items[currentIndex], currentIndex) };
      } catch (reason) {
        results[currentIndex] = { status: "rejected", reason };
      }
    }
  });
  await Promise.all(runners);
  return results;
}

function cacheWeatherData(data) {
  try {
    localStorage.setItem("gx-weather-cache", JSON.stringify({ savedAt: Date.now(), data }));
  } catch {
    // Cache is optional.
  }
}

function readWeatherCache() {
  try {
    const cache = JSON.parse(localStorage.getItem("gx-weather-cache") || "{}");
    return Array.isArray(cache.data) ? cache.data : [];
  } catch {
    return [];
  }
}

function formatDateTime(date) {
  return date.toLocaleString("zh-CN", { hour12: false });
}

function csvValue(value) {
  const text = String(value ?? "");
  if (text.includes(",") || text.includes("\n") || text.includes('"')) {
    return `"${text.replaceAll('"', '""')}"`;
  }
  return text;
}

function setStatus(text) {
  els.statusLine.textContent = text;
}

function setLoading(isLoading) {
  els.refreshBtn.disabled = isLoading;
  els.refreshBtn.textContent = isLoading ? "读取中..." : "刷新数据";
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

init();
