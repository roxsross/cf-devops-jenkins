#!/usr/bin/env python3
"""Convierte el reporte JSON de OWASP ZAP a formato SARIF 2.1.0."""

import json
import os
import sys

INPUT = os.getenv("ZAP_JSON", "report_json.json")
OUTPUT = os.getenv("ZAP_SARIF", "zap-results.sarif")

EMPTY_SARIF = {
    "version": "2.1.0",
    "$schema": "https://raw.githubusercontent.com/oasis-tcs/sarif-spec/master/Schemata/sarif-schema-2.1.0.json",
    "runs": [{"tool": {"driver": {"name": "OWASP ZAP", "version": "stable", "rules": []}}, "results": []}],
}


def write(data):
    with open(OUTPUT, "w") as f:
        json.dump(data, f, indent=2)


if not os.path.exists(INPUT) or os.path.getsize(INPUT) == 0:
    print(f"[zap-to-sarif] {INPUT} no encontrado o vacío — generando SARIF vacío")
    write(EMPTY_SARIF)
    sys.exit(0)

with open(INPUT) as f:
    try:
        data = json.load(f)
    except json.JSONDecodeError as e:
        print(f"[zap-to-sarif] JSON inválido: {e} — generando SARIF vacío")
        write(EMPTY_SARIF)
        sys.exit(0)

rules, results = {}, []

for site in data.get("site", []):
    for alert in site.get("alerts", []):
        rid = alert.get("pluginid", "unknown")
        risk = alert.get("riskdesc", "Informational")

        if "High" in risk or "Critical" in risk:
            level = "error"
        elif "Informational" in risk or "False" in risk:
            level = "note"
        else:
            level = "warning"

        if rid not in rules:
            rules[rid] = {
                "id": rid,
                "name": alert.get("alert", rid),
                "shortDescription": {"text": alert.get("alert", rid)},
                "fullDescription": {"text": alert.get("desc", "")},
                "helpUri": alert.get("reference", ""),
                "properties": {"security-severity": str(alert.get("riskcode", 0))},
            }

        for inst in alert.get("instances", [{}]):
            results.append({
                "ruleId": rid,
                "level": level,
                "message": {"text": inst.get("evidence", alert.get("alert", ""))},
                "locations": [{"physicalLocation": {
                    "artifactLocation": {"uri": inst.get("uri", site.get("@name", "unknown"))},
                    "region": {"startLine": 1},
                }}],
            })

EMPTY_SARIF["runs"][0]["tool"]["driver"]["rules"] = list(rules.values())
EMPTY_SARIF["runs"][0]["results"] = results
write(EMPTY_SARIF)
print(f"[zap-to-sarif] SARIF generado: {len(results)} resultados → {OUTPUT}")
