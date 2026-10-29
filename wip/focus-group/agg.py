import json, glob, os, collections
D = os.path.dirname(os.path.abspath(__file__))
panel = {p["id"]: p for p in json.load(open(f"{D}/panel.json")) if p["w"]}
SCALE = 1000 / sum(p["w"] for p in panel.values())
rows = []
for f in sorted(glob.glob(f"{D}/[A-F].json")):
    for r in json.load(open(f)):
        if r["id"] in panel:
            r["group"] = os.path.basename(f)[0]; r["W"] = panel[r["id"]]["w"] * SCALE; rows.append(r)
def seg(p):
    a = p["age"]; d = p["diet"].lower(); t = p["tech"].lower()
    return {
        "Age": "18 to 29" if a < 30 else "30 to 44" if a < 45 else "45 to 64" if a < 65 else "65 plus",
        "Diet": "Faith-based (halal, kosher, no beef, Jain, fasting)" if any(k in d for k in ("halal", "kosher", "no beef", "jain", "fasting")) else
                "Vegetarian or vegan" if any(k in d for k in ("vegan", "vegetarian", "pescatarian")) else
                "Allergy or intolerance" if any(k in d for k in ("coeliac", "gluten", "nut", "lactose", "dairy", "diabetic")) else "No restrictions",
        "Tech": "Low" if t.startswith("low") else "High" if ("high" in t) else "Medium",
        "Device": "Desktop" if p["device"].startswith("desktop") else "Phone or tablet",
    }
KEYS = ["first_impression", "clarity", "find_film", "menu_appeal", "recipe_usefulness", "diet_fit", "shopping_list", "video_store", "candy_bar", "speed", "accessibility", "trust_privacy", "delight", "would_use_again"]
def wavg(rs, k):
    v = [(r["scores"].get(k), r["W"]) for r in rs if isinstance(r["scores"].get(k), (int, float))]
    tw = sum(w for _, w in v)
    return round(sum(s * w for s, w in v) / tw, 1) if tw else None
def nps(rs):
    v = [(r["scores"].get("nps"), r["W"]) for r in rs if isinstance(r["scores"].get("nps"), (int, float))]
    tw = sum(w for _, w in v)
    if not tw: return None
    pro = sum(w for s, w in v if s >= 9); det = sum(w for s, w in v if s <= 6)
    return round(100 * (pro - det) / tw)
out = {"n_personas": len(rows), "weighted_total": round(sum(r["W"] for r in rows)),
       "overall": {k: wavg(rows, k) for k in KEYS}, "nps": nps(rows),
       "completed_goal_pct": round(100 * sum(r["W"] for r in rows if r.get("completed_goal")) / sum(r["W"] for r in rows)),
       "segments": {}}
for dim in ("Age", "Diet", "Tech", "Device"):
    g = collections.defaultdict(list)
    for r in rows: g[seg(panel[r["id"]])[dim]].append(r)
    out["segments"][dim] = {k: {"people": round(sum(r["W"] for r in v)), "nps": nps(v), "use_again": wavg(v, "would_use_again"), "diet_fit": wavg(v, "diet_fit"), "clarity": wavg(v, "clarity"), "completed_pct": round(100 * sum(r["W"] for r in v if r.get("completed_goal")) / sum(r["W"] for r in v))} for k, v in sorted(g.items())}
fr = []
for r in rows:
    for x in r.get("frictions", []):
        fr.append({"id": r["id"], "W": round(r["W"]), **x})
out["frictions"] = fr
out["wishes"] = [{"id": r["id"], "W": round(r["W"]), "w": w} for r in rows for w in r.get("wishes", [])]
out["loved"] = [{"id": r["id"], "W": round(r["W"]), "l": l} for r in rows for l in r.get("loved", [])]
out["quotes"] = [{"id": r["id"], "name": panel[r["id"]]["name"], "age": panel[r["id"]]["age"], "q": r.get("quote"), "pay": r.get("would_pay"), "done": r.get("completed_goal"), "gave_up": r.get("gave_up_at"), "nps": r["scores"].get("nps")} for r in rows]
json.dump(out, open(f"{D}/agg.json", "w"), indent=1)
print(json.dumps({k: out[k] for k in ("n_personas", "weighted_total", "overall", "nps", "completed_goal_pct")}, indent=1))
print(json.dumps(out["segments"], indent=1))
print(len(fr), "frictions,", len(out["wishes"]), "wishes")
