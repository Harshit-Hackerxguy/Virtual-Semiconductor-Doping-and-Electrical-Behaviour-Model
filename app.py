import os
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS

from simulator import (
    COMMON_IMPURITIES,
    MATERIAL_OPTIONS,
    build_sample_result,
    compare_samples,
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIST_DIR = os.path.join(BASE_DIR, "frontend", "dist")
FRONTEND_ASSETS_DIR = os.path.join(FRONTEND_DIST_DIR, "assets")

app = Flask(
    __name__,
    static_folder=FRONTEND_ASSETS_DIR,
    static_url_path="/assets",
)

CORS(app)

def get_form_state(form_data):
    return {
        "sample_a_material": form_data.get("sample_a_material", "Silicon"),
        "sample_a_impurity": form_data.get("sample_a_impurity", ""),
        "sample_a_custom_impurity": form_data.get("sample_a_custom_impurity", ""),
        "sample_a_concentration": form_data.get("sample_a_concentration", ""),
        "sample_b_material": form_data.get("sample_b_material", "Silicon"),
        "sample_b_impurity": form_data.get("sample_b_impurity", ""),
        "sample_b_custom_impurity": form_data.get("sample_b_custom_impurity", ""),
        "sample_b_concentration": form_data.get("sample_b_concentration", ""),
    }


@app.route("/")
def index():
    if os.path.exists(os.path.join(FRONTEND_DIST_DIR, "index.html")):
        return send_from_directory(FRONTEND_DIST_DIR, "index.html")

    return (
        jsonify(
            {
                "message": "React frontend build not found.",
                "next_steps": [
                    "cd frontend",
                    "npm install",
                    "npm run build",
                    "python app.py",
                ],
            }
        ),
        503,
    )


@app.route("/<path:path>")
def spa_fallback(path):
    file_path = os.path.join(FRONTEND_DIST_DIR, path)
    if os.path.exists(file_path) and os.path.isfile(file_path):
        return send_from_directory(FRONTEND_DIST_DIR, path)

    if os.path.exists(os.path.join(FRONTEND_DIST_DIR, "index.html")):
        return send_from_directory(FRONTEND_DIST_DIR, "index.html")

    return jsonify({"error": "Frontend build missing."}), 404


@app.get("/api/options")
def api_options():
    return jsonify(
        {
            "materials": MATERIAL_OPTIONS,
            "impurities": COMMON_IMPURITIES,
            "defaults": get_form_state({}),
        }
    )


@app.post("/api/simulate")
def api_simulate():
    payload = request.get_json(silent=True) or {}
    compare_mode = bool(payload.get("compare_mode", False))

    raw_sample_a = payload.get("sample_a") or {}
    raw_sample_b = payload.get("sample_b") or {}

    errors = []
    sample_a = None
    sample_b = None
    comparison = None

    try:
        sample_a = build_sample_result(
            {
                "material": raw_sample_a.get("material", "Silicon"),
                "selected_impurity": raw_sample_a.get("selected_impurity", ""),
                "custom_impurity": raw_sample_a.get("custom_impurity", ""),
                "concentration": raw_sample_a.get("concentration", ""),
            },
            "Sample A",
        )
    except ValueError as error:
        errors.append(f"Sample A: {error}")

    if compare_mode:
        try:
            sample_b = build_sample_result(
                {
                    "material": raw_sample_b.get("material", "Silicon"),
                    "selected_impurity": raw_sample_b.get("selected_impurity", ""),
                    "custom_impurity": raw_sample_b.get("custom_impurity", ""),
                    "concentration": raw_sample_b.get("concentration", ""),
                },
                "Sample B",
            )
        except ValueError as error:
            errors.append(f"Sample B: {error}")

    if errors:
        return jsonify({"errors": errors}), 400

    if compare_mode and sample_a and sample_b:
        comparison = compare_samples(sample_a, sample_b)

    return jsonify(
        {
            "sample_a": sample_a,
            "sample_b": sample_b,
            "comparison": comparison,
            "compare_mode": compare_mode,
        }
    )


if __name__ == "__main__":
    app.run(debug=True)
