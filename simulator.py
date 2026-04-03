from math import isfinite

ELECTRONIC_CHARGE = 1.6e-19

MATERIALS = {
    "Silicon": {
        "mobility_electron": 1350.0,
        "mobility_hole": 480.0,
        "charge": ELECTRONIC_CHARGE,
        "note": "This educational estimate uses simplified room-temperature silicon constants.",
    },
    "Germanium": {
        "mobility_electron": 1350.0,
        "mobility_hole": 480.0,
        "charge": ELECTRONIC_CHARGE,
        "note": (
            "Germanium is accepted as an input, but this version still uses the same simplified "
            "silicon constants for a transparent educational model."
        ),
    },
}

MATERIAL_OPTIONS = list(MATERIALS.keys())

DONOR_IMPURITIES = {
    "phosphorus": "Phosphorus",
    "p": "Phosphorus",
    "arsenic": "Arsenic",
    "as": "Arsenic",
    "antimony": "Antimony",
    "sb": "Antimony",
}

ACCEPTOR_IMPURITIES = {
    "boron": "Boron",
    "b": "Boron",
    "aluminum": "Aluminum",
    "aluminium": "Aluminum",
    "al": "Aluminum",
    "gallium": "Gallium",
    "ga": "Gallium",
    "indium": "Indium",
    "in": "Indium",
}

COMMON_IMPURITIES = [
    "Phosphorus",
    "Arsenic",
    "Antimony",
    "Boron",
    "Aluminum",
    "Gallium",
    "Indium",
]

LEVEL_SCORES = {"Low": 1, "Moderate": 2, "Medium": 2, "High": 3}


def normalize_text(value):
    return " ".join((value or "").strip().split())


def resolve_material(material_name):
    cleaned_name = normalize_text(material_name)
    if cleaned_name not in MATERIALS:
        supported = ", ".join(MATERIAL_OPTIONS)
        raise ValueError(f"Choose a supported material: {supported}.")
    return cleaned_name


def resolve_impurity_name(sample_input):
    custom_impurity = normalize_text(sample_input.get("custom_impurity", ""))
    if custom_impurity:
        return custom_impurity

    selected_impurity = normalize_text(sample_input.get("selected_impurity", ""))
    if selected_impurity:
        return selected_impurity

    raise ValueError("Choose an impurity from the list or enter a known impurity name.")


def classify_impurity(impurity_name):
    lookup_key = normalize_text(impurity_name).lower()

    if lookup_key in DONOR_IMPURITIES:
        return {
            "name": DONOR_IMPURITIES[lookup_key],
            "impurity_type": "Donor",
            "impurity_family": "donor",
        }

    if lookup_key in ACCEPTOR_IMPURITIES:
        return {
            "name": ACCEPTOR_IMPURITIES[lookup_key],
            "impurity_type": "Acceptor",
            "impurity_family": "acceptor",
        }

    supported = ", ".join(COMMON_IMPURITIES)
    raise ValueError(
        f"'{impurity_name}' is not supported in this educational model. Try one of: {supported}."
    )


def determine_semiconductor_type(impurity_family):
    if impurity_family == "donor":
        return "n-type"
    if impurity_family == "acceptor":
        return "p-type"
    raise ValueError("Impurity family must be donor or acceptor.")


def determine_carriers(semiconductor_type):
    if semiconductor_type == "n-type":
        return "Electrons", "Holes"
    return "Holes", "Electrons"


def parse_doping_concentration(raw_value):
    cleaned_value = normalize_text(raw_value).replace(",", "").replace("_", "")

    if not cleaned_value:
        raise ValueError("Enter a doping concentration such as 1e15, 1e16, or 5e17.")

    try:
        concentration = float(cleaned_value)
    except ValueError as error:
        raise ValueError(
            "Doping concentration must be numeric. Scientific notation like 1e16 is allowed."
        ) from error

    if not isfinite(concentration):
        raise ValueError("Doping concentration must be a finite number.")

    if concentration <= 0:
        raise ValueError("Doping concentration must be greater than zero.")

    return concentration


def calculate_conductivity(material_name, semiconductor_type, concentration):
    material = MATERIALS[material_name]

    if semiconductor_type == "n-type":
        mobility = material["mobility_electron"]
    else:
        mobility = material["mobility_hole"]

    conductivity = material["charge"] * concentration * mobility
    return conductivity, mobility


def interpret_conductivity(conductivity):
    if conductivity < 0.05:
        return "Low"
    if conductivity < 1:
        return "Moderate"
    return "High"


def estimate_breakdown_behavior(concentration):
    if concentration >= 5e17:
        return {
            "doping_band": "Very high doping",
            "depletion_width": "Narrow",
            "high_voltage_capability": "Low",
            "breakdown_trend": "Low",
            "breakdown_mechanism": "Zener",
        }

    if concentration >= 1e15:
        return {
            "doping_band": "Moderate doping",
            "depletion_width": "Moderate",
            "high_voltage_capability": "Moderate",
            "breakdown_trend": "Medium",
            "breakdown_mechanism": "Transitional",
        }

    return {
        "doping_band": "Low doping",
        "depletion_width": "Wide",
        "high_voltage_capability": "High",
        "breakdown_trend": "High",
        "breakdown_mechanism": "Avalanche",
    }


def format_concentration(concentration):
    return f"{concentration:.2e} cm^-3"


def format_conductivity(conductivity):
    if conductivity >= 100:
        return f"{conductivity:,.2f} S/cm"
    if conductivity >= 1:
        return f"{conductivity:,.3f} S/cm"
    if conductivity >= 0.01:
        return f"{conductivity:,.4f} S/cm"
    return f"{conductivity:.3e} S/cm"


def format_mobility(mobility):
    return f"{mobility:,.0f} cm^2/V.s"


def build_explanation(sample):
    if sample["semiconductor_type"] == "n-type":
        mobility_sentence = (
            "Since electrons are the majority carriers and electron mobility is higher in this model, "
            "conductivity is usually stronger than an equally doped p-type sample."
        )
    else:
        mobility_sentence = (
            "Since holes are the majority carriers and hole mobility is lower in this model, "
            "conductivity is usually lower than an equally doped n-type sample."
        )

    explanation = (
        f"This impurity creates a {sample['semiconductor_type']} semiconductor. "
        f"{sample['majority_carrier']} are the majority carriers and {sample['minority_carrier'].lower()} "
        f"are the minority carriers. The estimated conductivity is {sample['conductivity_display']}, "
        f"which is categorized as {sample['conductivity_level'].lower()}. "
        f"{mobility_sentence} "
        f"Because the doping level is in the {sample['doping_band_label'].lower()} range, the model predicts "
        f"{sample['high_voltage_capability'].lower()} high-voltage capability, a "
        f"{sample['breakdown_trend'].lower()} breakdown-voltage trend, and "
        f"{sample['breakdown_mechanism']} breakdown tendency."
    )

    if sample["material"] != "Silicon":
        explanation += f" {sample['material_note']}"

    return explanation


def build_sample_result(sample_input, label):
    material_name = resolve_material(sample_input.get("material", "Silicon"))
    impurity_name = resolve_impurity_name(sample_input)
    impurity_data = classify_impurity(impurity_name)
    semiconductor_type = determine_semiconductor_type(impurity_data["impurity_family"])
    concentration = parse_doping_concentration(sample_input.get("concentration", ""))
    majority_carrier, minority_carrier = determine_carriers(semiconductor_type)
    conductivity, mobility = calculate_conductivity(material_name, semiconductor_type, concentration)
    conductivity_level = interpret_conductivity(conductivity)
    breakdown = estimate_breakdown_behavior(concentration)

    sample = {
        "label": label,
        "material": material_name,
        "material_note": MATERIALS[material_name]["note"],
        "impurity_name": impurity_data["name"],
        "impurity_type": impurity_data["impurity_type"],
        "semiconductor_type": semiconductor_type,
        "majority_carrier": majority_carrier,
        "minority_carrier": minority_carrier,
        "concentration": concentration,
        "concentration_display": format_concentration(concentration),
        "conductivity": conductivity,
        "conductivity_display": format_conductivity(conductivity),
        "conductivity_level": conductivity_level,
        "mobility": mobility,
        "mobility_display": format_mobility(mobility),
        "doping_band_label": breakdown["doping_band"],
        "depletion_width": breakdown["depletion_width"],
        "high_voltage_capability": breakdown["high_voltage_capability"],
        "high_voltage_score": LEVEL_SCORES[breakdown["high_voltage_capability"]],
        "breakdown_trend": breakdown["breakdown_trend"],
        "breakdown_score": LEVEL_SCORES[breakdown["breakdown_trend"]],
        "breakdown_mechanism": breakdown["breakdown_mechanism"],
    }

    sample["explanation"] = build_explanation(sample)
    return sample


def compare_numeric_values(value_a, value_b, higher_is_better=True):
    tolerance = max(abs(value_a), abs(value_b), 1.0) * 0.01

    if abs(value_a - value_b) <= tolerance:
        return "Tie"

    if higher_is_better:
        return "Sample A" if value_a > value_b else "Sample B"
    return "Sample A" if value_a < value_b else "Sample B"


def compare_voltage_capability(sample_a, sample_b):
    if sample_a["high_voltage_score"] != sample_b["high_voltage_score"]:
        return (
            "Sample A"
            if sample_a["high_voltage_score"] > sample_b["high_voltage_score"]
            else "Sample B"
        )

    return compare_numeric_values(
        sample_a["concentration"], sample_b["concentration"], higher_is_better=False
    )


def compare_lower_breakdown(sample_a, sample_b):
    if sample_a["breakdown_score"] != sample_b["breakdown_score"]:
        return (
            "Sample A"
            if sample_a["breakdown_score"] < sample_b["breakdown_score"]
            else "Sample B"
        )

    return compare_numeric_values(
        sample_a["concentration"], sample_b["concentration"], higher_is_better=True
    )


def compare_samples(sample_a, sample_b):
    conductivity_winner = compare_numeric_values(
        sample_a["conductivity"], sample_b["conductivity"], higher_is_better=True
    )
    voltage_winner = compare_voltage_capability(sample_a, sample_b)
    breakdown_winner = compare_lower_breakdown(sample_a, sample_b)

    if conductivity_winner == "Tie":
        conductivity_reason = "Both samples have nearly the same estimated conductivity."
    else:
        conductivity_reason = (
            f"{conductivity_winner} has the higher estimated conductivity based on carrier mobility "
            f"and doping concentration."
        )

    if voltage_winner == "Tie":
        voltage_reason = "Both samples fall in nearly the same high-voltage capability band."
    else:
        voltage_reason = (
            f"{voltage_winner} should handle higher voltage better because it is more lightly doped."
        )

    if breakdown_winner == "Tie":
        breakdown_reason = "Both samples have a very similar estimated breakdown-voltage trend."
    else:
        breakdown_reason = (
            f"{breakdown_winner} is expected to have the lower breakdown-voltage trend because it is more heavily doped."
        )

    summary = f"{conductivity_reason} {voltage_reason} {breakdown_reason}"

    return {
        "higher_conductivity": {
            "winner": conductivity_winner,
            "reason": conductivity_reason,
        },
        "better_voltage_handling": {
            "winner": voltage_winner,
            "reason": voltage_reason,
        },
        "lower_breakdown_voltage": {
            "winner": breakdown_winner,
            "reason": breakdown_reason,
        },
        "conduction_choice": conductivity_winner,
        "blocking_choice": voltage_winner,
        "summary": summary,
    }
