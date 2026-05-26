import json, math, sys
from pathlib import Path
import openpyxl
src = Path(sys.argv[1])
out = Path('spot-data.json')
wb = openpyxl.load_workbook(src, read_only=True, data_only=True, keep_vba=False)
def clean(v):
    if v is None: return None
    if hasattr(v, 'strftime'): return v.strftime('%Y-%m-%d')
    if isinstance(v, float) and math.isnan(v): return None
    return v
def rows(sheet_name):
    ws = wb[sheet_name]
    it = ws.iter_rows(values_only=True)
    headers = [str(x).strip() if x is not None else f'__EMPTY_{i}' for i, x in enumerate(next(it))]
    data = []
    for row in it:
        data.append({headers[i]: clean(row[i]) if i < len(row) else None for i in range(len(headers))})
    return data
payload = {'source': src.name, 'sheet96': '96点数据', 'sheet24': '24时数据', 'rows96': rows('96点数据'), 'rows24': rows('24时数据')}
out.write_text(json.dumps(payload, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
print(str(out.resolve()), len(payload['rows96']), len(payload['rows24']))
