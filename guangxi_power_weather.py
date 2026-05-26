#!/usr/bin/env python3
"""
Read Guangxi weather data from Open-Meteo for power-market analysis.

Default output:
- Current weather summary for Guangxi's 14 prefecture-level cities
- 72-hour hourly forecast fields related to load, PV, wind, and weather risk
- 7-day daily forecast fields for medium-range market view

Open-Meteo does not require an API key for non-commercial use.
"""

from __future__ import annotations

import argparse
import csv
import json
import sys
import time
from datetime import datetime
from pathlib import Path
from typing import Any
from urllib.parse import urlencode
from urllib.error import URLError
from urllib.request import urlopen


API_URL = "https://api.open-meteo.com/v1/forecast"
TIMEZONE = "Asia/Shanghai"


GUANGXI_CITIES: dict[str, tuple[float, float]] = {
    "南宁": (22.8170, 108.3669),
    "柳州": (24.3264, 109.4281),
    "桂林": (25.2736, 110.2900),
    "梧州": (23.4769, 111.2790),
    "北海": (21.4811, 109.1202),
    "防城港": (21.6869, 108.3547),
    "钦州": (21.9797, 108.6543),
    "贵港": (23.1115, 109.5989),
    "玉林": (22.6545, 110.1800),
    "百色": (23.9022, 106.6184),
    "贺州": (24.4036, 111.5667),
    "河池": (24.6929, 108.0854),
    "来宾": (23.7503, 109.2212),
    "崇左": (22.3771, 107.3647),
}


CURRENT_FIELDS = [
    "temperature_2m",
    "apparent_temperature",
    "relative_humidity_2m",
    "precipitation",
    "rain",
    "weather_code",
    "cloud_cover",
    "pressure_msl",
    "wind_speed_10m",
    "wind_direction_10m",
    "wind_gusts_10m",
]

HOURLY_FIELDS = [
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
]

DAILY_FIELDS = [
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
]


WEATHER_CODE_CN = {
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
}


def fetch_city_weather(
    city: str,
    latitude: float,
    longitude: float,
    forecast_hours: int,
    forecast_days: int,
) -> dict[str, Any]:
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "current": ",".join(CURRENT_FIELDS),
        "hourly": ",".join(HOURLY_FIELDS),
        "daily": ",".join(DAILY_FIELDS),
        "timezone": TIMEZONE,
        "forecast_hours": forecast_hours,
        "forecast_days": forecast_days,
        "wind_speed_unit": "ms",
    }
    url = f"{API_URL}?{urlencode(params)}"
    with urlopen(url, timeout=30) as response:
        data = json.loads(response.read().decode("utf-8"))
    data["city"] = city
    data["request_url"] = url
    return data


def fetch_city_weather_with_retry(
    city: str,
    latitude: float,
    longitude: float,
    forecast_hours: int,
    forecast_days: int,
    retries: int = 3,
) -> dict[str, Any]:
    last_error: Exception | None = None
    for attempt in range(1, retries + 1):
        try:
            return fetch_city_weather(city, latitude, longitude, forecast_hours, forecast_days)
        except (URLError, TimeoutError, json.JSONDecodeError) as exc:
            last_error = exc
            if attempt < retries:
                print(f"{city} 第 {attempt} 次读取失败，准备重试：{exc}", file=sys.stderr)
                time.sleep(attempt * 2)
    raise RuntimeError(f"{city} 连续 {retries} 次读取失败：{last_error}")


def weather_text(code: Any) -> str:
    try:
        return WEATHER_CODE_CN.get(int(code), f"未知天气代码 {code}")
    except (TypeError, ValueError):
        return "未知"


def trim_hourly(data: dict[str, Any], hours: int) -> list[dict[str, Any]]:
    hourly = data.get("hourly", {})
    times = hourly.get("time", [])[:hours]
    rows = []
    for index, time_value in enumerate(times):
        row = {"city": data["city"], "time": time_value}
        for field in HOURLY_FIELDS:
            values = hourly.get(field, [])
            row[field] = values[index] if index < len(values) else None
        row["weather_text"] = weather_text(row.get("weather_code"))
        rows.append(row)
    return rows


def trim_daily(data: dict[str, Any], days: int) -> list[dict[str, Any]]:
    daily = data.get("daily", {})
    times = daily.get("time", [])[:days]
    rows = []
    for index, date_value in enumerate(times):
        row = {"city": data["city"], "date": date_value}
        for field in DAILY_FIELDS:
            values = daily.get(field, [])
            row[field] = values[index] if index < len(values) else None
        row["weather_text"] = weather_text(row.get("weather_code"))
        rows.append(row)
    return rows


def current_summary(data: dict[str, Any]) -> dict[str, Any]:
    current = data.get("current", {})
    return {
        "city": data["city"],
        "time": current.get("time"),
        "weather": weather_text(current.get("weather_code")),
        "temperature_c": current.get("temperature_2m"),
        "apparent_temperature_c": current.get("apparent_temperature"),
        "humidity_pct": current.get("relative_humidity_2m"),
        "precipitation_mm": current.get("precipitation"),
        "rain_mm": current.get("rain"),
        "cloud_cover_pct": current.get("cloud_cover"),
        "pressure_hpa": current.get("pressure_msl"),
        "wind_speed_ms": current.get("wind_speed_10m"),
        "wind_direction_deg": current.get("wind_direction_10m"),
        "wind_gusts_ms": current.get("wind_gusts_10m"),
    }


def load_alert_score(hourly_rows: list[dict[str, Any]]) -> dict[str, Any]:
    temps = [row["temperature_2m"] for row in hourly_rows if row.get("temperature_2m") is not None]
    apparent = [
        row["apparent_temperature"]
        for row in hourly_rows
        if row.get("apparent_temperature") is not None
    ]
    rain_probs = [
        row["precipitation_probability"]
        for row in hourly_rows
        if row.get("precipitation_probability") is not None
    ]
    gusts = [row["wind_gusts_10m"] for row in hourly_rows if row.get("wind_gusts_10m") is not None]
    radiation = [
        row["shortwave_radiation"]
        for row in hourly_rows
        if row.get("shortwave_radiation") is not None
    ]

    return {
        "max_temperature_c_72h": max(temps) if temps else None,
        "max_apparent_temperature_c_72h": max(apparent) if apparent else None,
        "max_precipitation_probability_pct_72h": max(rain_probs) if rain_probs else None,
        "max_wind_gusts_ms_72h": max(gusts) if gusts else None,
        "max_shortwave_radiation_wm2_72h": max(radiation) if radiation else None,
    }


def write_json(path: Path, payload: Any) -> None:
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")


def write_csv(path: Path, rows: list[dict[str, Any]]) -> None:
    if not rows:
        return
    with path.open("w", encoding="utf-8-sig", newline="") as file:
        writer = csv.DictWriter(file, fieldnames=list(rows[0].keys()))
        writer.writeheader()
        writer.writerows(rows)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="读取广西天气数据，用于电力市场分析。")
    parser.add_argument(
        "--cities",
        nargs="*",
        default=["all"],
        help="城市名称列表，例如 --cities 南宁 桂林。默认 all 表示广西 14 个地级市。",
    )
    parser.add_argument("--hourly-hours", type=int, default=72, help="逐小时预报小时数，默认 72。")
    parser.add_argument("--daily-days", type=int, default=7, help="每日预报天数，默认 7。")
    parser.add_argument("--out-dir", default="weather_output", help="输出目录，默认 weather_output。")
    parser.add_argument("--no-files", action="store_true", help="只在控制台打印，不写入文件。")
    return parser.parse_args()


def selected_cities(city_args: list[str]) -> dict[str, tuple[float, float]]:
    if city_args == ["all"] or "all" in city_args:
        return GUANGXI_CITIES

    result = {}
    unknown = []
    for city in city_args:
        if city in GUANGXI_CITIES:
            result[city] = GUANGXI_CITIES[city]
        else:
            unknown.append(city)
    if unknown:
        valid = "、".join(GUANGXI_CITIES)
        raise ValueError(f"未知城市：{', '.join(unknown)}。可选城市：{valid}")
    return result


def print_summary(current_rows: list[dict[str, Any]], risk_rows: list[dict[str, Any]]) -> None:
    print("\n广西电力市场天气摘要")
    print(f"生成时间：{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("-" * 92)
    print(
        f"{'城市':<6} {'天气':<10} {'温度':>6} {'体感':>6} {'湿度':>6} "
        f"{'云量':>6} {'风速m/s':>8} {'阵风m/s':>8} {'72h最高温':>9} {'72h最大降水%':>12}"
    )
    print("-" * 92)

    risks_by_city = {row["city"]: row for row in risk_rows}
    for row in current_rows:
        risk = risks_by_city.get(row["city"], {})
        print(
            f"{row['city']:<6} "
            f"{row['weather']:<10} "
            f"{fmt(row['temperature_c']):>6} "
            f"{fmt(row['apparent_temperature_c']):>6} "
            f"{fmt(row['humidity_pct']):>6} "
            f"{fmt(row['cloud_cover_pct']):>6} "
            f"{fmt(row['wind_speed_ms']):>8} "
            f"{fmt(row['wind_gusts_ms']):>8} "
            f"{fmt(risk.get('max_temperature_c_72h')):>9} "
            f"{fmt(risk.get('max_precipitation_probability_pct_72h')):>12}"
        )
    print("-" * 92)
    print("说明：辐射/云量用于光伏判断；风速/阵风用于风电和运行风险；温度/湿度/体感用于负荷判断。")


def fmt(value: Any) -> str:
    if value is None:
        return "-"
    if isinstance(value, float):
        return f"{value:.1f}"
    return str(value)


def main() -> int:
    args = parse_args()
    try:
        cities = selected_cities(args.cities)
    except ValueError as exc:
        print(str(exc), file=sys.stderr)
        return 2

    current_rows: list[dict[str, Any]] = []
    hourly_rows: list[dict[str, Any]] = []
    daily_rows: list[dict[str, Any]] = []
    risk_rows: list[dict[str, Any]] = []
    raw_results: dict[str, Any] = {}

    for city, (latitude, longitude) in cities.items():
        print(f"读取 {city} ...", flush=True)
        try:
            data = fetch_city_weather_with_retry(
                city,
                latitude,
                longitude,
                forecast_hours=args.hourly_hours,
                forecast_days=args.daily_days,
            )
        except (URLError, TimeoutError, json.JSONDecodeError) as exc:
            print(f"读取 {city} 失败：{exc}", file=sys.stderr)
            return 1
        raw_results[city] = data

        city_hourly = trim_hourly(data, args.hourly_hours)
        current_rows.append(current_summary(data))
        hourly_rows.extend(city_hourly)
        daily_rows.extend(trim_daily(data, args.daily_days))
        risk_rows.append({"city": city, **load_alert_score(city_hourly)})

    print_summary(current_rows, risk_rows)

    if not args.no_files:
        out_dir = Path(args.out_dir)
        out_dir.mkdir(parents=True, exist_ok=True)
        write_csv(out_dir / "guangxi_current_weather.csv", current_rows)
        write_csv(out_dir / "guangxi_hourly_72h.csv", hourly_rows)
        write_csv(out_dir / "guangxi_daily_7d.csv", daily_rows)
        write_csv(out_dir / "guangxi_power_market_risk.csv", risk_rows)
        write_json(out_dir / "guangxi_weather_raw.json", raw_results)
        print(f"\n已写入输出目录：{out_dir.resolve()}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
