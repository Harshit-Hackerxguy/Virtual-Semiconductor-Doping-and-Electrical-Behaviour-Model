from math import isfinite

ELECTRONIC_CHARGE = 1.602e-19

MATERIALS = {
    "Silicon": {
        "mobility_electron": 1350.0,
        "mobility_hole": 480.0,
        "intrinsic_carrier": 1.0e10,
        "critical_field": 3.0e5,
        "note": "Room-temperature estimate using common textbook silicon parameters.",
    },
    "Germanium": {
        "mobility_electron": 3900.0,
        "mobility_hole": 1900.0,
        "intrinsic_carrier": 2.4e13,
        "critical_field": 1.0e5,
        "note": "Room-temperature estimate using common textbook germanium parameters.",
    },
    "Gallium Arsenide": {
        "mobility_electron": 8500.0,
        "mobility_hole": 400.0,
        "intrinsic_carrier": 2.0e6,
        "critical_field": 4.0e5,
        "note": "Room-temperature estimate using common textbook GaAs parameters.",
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

QUALITY_SCORE = {"Low": 1, "Moderate": 2, "High": 3}


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
        f"'{impurity_name}' is not supported in this simulator. Try one of: {supported}."
    )


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

    if concentration < 1e12 or concentration > 1e20:
        raise ValueError("Use a practical range between 1e12 and 1e20 cm^-3.")

    return concentration


def determine_semiconductor_type(impurity_family):
    return "n-type" if impurity_family == "donor" else "p-type"


def determine_carriers(semiconductor_type):
    if semiconductor_type == "n-type":
        return "Electrons", "Holes"
    return "Holes", "Electrons"


def carrier_concentrations(semiconductor_type, doping, intrinsic_carrier):
    # Uses a first-order complete ionization estimate at room temperature.
    if semiconductor_type == "n-type":
        majority = doping
        minority = (intrinsic_carrier**2) / majority
    else:
        majority = doping
        minority = (intrinsic_carrier**2) / majority
    return majority, minority


def conductivity_and_resistivity(material, semiconductor_type, majority, minority):
    if semiconductor_type == "n-type":
        n0, p0 = majority, minority
    else:
        p0, n0 = majority, minority

    conductivity = ELECTRONIC_CHARGE * (
        n0 * material["mobility_electron"] + p0 * material["mobility_hole"]
    )
    resistivity = 1.0 / conductivity
    return conductivity, resistivity


def mobility_used(material, semiconductor_type):
    if semiconductor_type == "n-type":
        return material["mobility_electron"]
    return material["mobility_hole"]


def estimate_breakdown(material, doping):
    # Empirical one-sided junction style estimate at 300 K for educational trends.
    base = 60.0 * (doping / 1.0e16) ** (-0.75)
    breakdown_voltage = max(5.0, min(base, 1500.0))

    critical_field = material["critical_field"]
    depletion_width_cm = max(1e-6, (2.0 * breakdown_voltage) / critical_field)
    depletion_width_um = depletion_width_cm * 1e4

    if doping >= 2e18:
        mechanism = "Zener"
    elif doping <= 5e16:
        mechanism = "Avalanche"
    else:
        mechanism = "Mixed"

    if breakdown_voltage >= 250:
        hv_label = "High"
    elif breakdown_voltage >= 80:
        hv_label = "Moderate"
    else:
        hv_label = "Low"

    return {
        "breakdown_voltage": breakdown_voltage,
        "depletion_width_um": depletion_width_um,
        "high_voltage_capability": hv_label,
        "breakdown_mechanism": mechanism,
    }


def interpret_conductivity(conductivity):
    if conductivity < 0.1:
        return "Low"
    if conductivity < 10:
        return "Moderate"
    return "High"


def format_density(value):
    return f"{value:.2e} cm^-3"


def format_conductivity(value):
    if value >= 100:
        return f"{value:,.2f} S/cm"
    if value >= 1:
        return f"{value:,.3f} S/cm"
    return f"{value:.3e} S/cm"


def format_resistivity(value):
    if value >= 100:
        return f"{value:,.2f} ohm.cm"
    if value >= 1:
        return f"{value:,.3f} ohm.cm"
    return f"{value:.3e} ohm.cm"


def format_voltage(value):
    return f"{value:,.2f} V"


def format_width(value):
    if value >= 100:
        return f"{value:,.1f} um"
    return f"{value:,.2f} um"


def format_mobility(value):
    return f"{value:,.0f} cm^2/V.s"


def build_graphics_data(sample, material):
    # Assume a 1 um effective conduction length for simple current-density plotting.
    effective_length_cm = 1.0e-4
    carrier_term = sample["conductivity"] / ELECTRONIC_CHARGE

    iv_curve = []
    for step in range(0, 26):
        voltage = step * 0.2
        electric_field = voltage / effective_length_cm
        current_density = sample["conductivity"] * electric_field
        iv_curve.append(
            {
                "voltage": round(voltage, 3),
                "electric_field": round(electric_field, 3),
                "current_density": round(current_density, 6),
            }
        )

    sweep_points = [1e14, 3e14, 1e15, 3e15, 1e16, 3e16, 1e17, 3e17, 1e18, 3e18, 1e19]
    breakdown_sweep = []
    for doping in sweep_points:
        breakdown = estimate_breakdown(material, doping)
        breakdown_sweep.append(
            {
                "doping": doping,
                "breakdown_voltage": round(breakdown["breakdown_voltage"], 4),
                "depletion_width_um": round(breakdown["depletion_width_um"], 6),
            }
        )

    carrier_distribution = [
        {
            "type": "Majority",
            "density": sample["majority_density"],
        },
        {
            "type": "Minority",
            "density": sample["minority_density"],
        },
        {
            "type": "Intrinsic",
            "density": material["intrinsic_carrier"],
        },
    ]

    return {
        "iv_curve": iv_curve,
        "breakdown_sweep": breakdown_sweep,
        "carrier_distribution": carrier_distribution,
        "carrier_transport_term": carrier_term,
    }


def build_explanation(sample):
    return (
        f"{sample['impurity_name']} acts as a {sample['impurity_type'].lower()} impurity in "
        f"{sample['material']}, creating a {sample['semiconductor_type']} sample. "
        f"The first-order model estimates majority carrier density {sample['majority_density_display']} "
        f"and minority carrier density {sample['minority_density_display']}. "
        f"From mobility and charge transport, conductivity is {sample['conductivity_display']} "
        f"and resistivity is {sample['resistivity_display']}. "
        f"Estimated breakdown voltage is {sample['breakdown_voltage_display']} with "
        f"{sample['breakdown_mechanism']} tendency. {sample['material_note']}"
    )


def build_sample_result(sample_input, label):
    material_name = resolve_material(sample_input.get("material", "Silicon"))
    material = MATERIALS[material_name]

    impurity_name = resolve_impurity_name(sample_input)
    impurity_data = classify_impurity(impurity_name)

    concentration = parse_doping_concentration(sample_input.get("concentration", ""))
    semiconductor_type = determine_semiconductor_type(impurity_data["impurity_family"])
    majority_carrier, minority_carrier = determine_carriers(semiconductor_type)
    majority, minority = carrier_concentrations(
        semiconductor_type, concentration, material["intrinsic_carrier"]
    )

    conductivity, resistivity = conductivity_and_resistivity(
        material, semiconductor_type, majority, minority
    )
    conductivity_level = interpret_conductivity(conductivity)
    mobility = mobility_used(material, semiconductor_type)
    breakdown = estimate_breakdown(material, concentration)

    sample = {
        "label": label,
        "material": material_name,
        "material_note": material["note"],
        "impurity_name": impurity_data["name"],
        "impurity_type": impurity_data["impurity_type"],
        "semiconductor_type": semiconductor_type,
        "majority_carrier": majority_carrier,
        "minority_carrier": minority_carrier,
        "concentration": concentration,
        "majority_density": majority,
        "majority_density_display": format_density(majority),
        "minority_density": minority,
        "minority_density_display": format_density(minority),
        "conductivity": conductivity,
        "conductivity_display": format_conductivity(conductivity),
        "conductivity_level": conductivity_level,
        "resistivity": resistivity,
        "resistivity_display": format_resistivity(resistivity),
        "mobility": mobility,
        "mobility_display": format_mobility(mobility),
        "breakdown_voltage": breakdown["breakdown_voltage"],
        "breakdown_voltage_display": format_voltage(breakdown["breakdown_voltage"]),
        "depletion_width_um": breakdown["depletion_width_um"],
        "depletion_width_display": format_width(breakdown["depletion_width_um"]),
        "high_voltage_capability": breakdown["high_voltage_capability"],
        "high_voltage_score": QUALITY_SCORE[breakdown["high_voltage_capability"]],
        "breakdown_mechanism": breakdown["breakdown_mechanism"],
    }

    sample["graphics"] = build_graphics_data(sample, material)
    sample["explanation"] = build_explanation(sample)
    return sample


def compare_numeric_values(value_a, value_b, higher_is_better=True):
    tolerance = max(abs(value_a), abs(value_b), 1.0) * 0.01

    if abs(value_a - value_b) <= tolerance:
        return "Tie"

    if higher_is_better:
        return "Sample A" if value_a > value_b else "Sample B"
    return "Sample A" if value_a < value_b else "Sample B"


def compare_samples(sample_a, sample_b):
    conductivity_winner = compare_numeric_values(
        sample_a["conductivity"], sample_b["conductivity"], higher_is_better=True
    )
    voltage_winner = compare_numeric_values(
        sample_a["breakdown_voltage"], sample_b["breakdown_voltage"], higher_is_better=True
    )
    leakage_winner = compare_numeric_values(
        sample_a["resistivity"], sample_b["resistivity"], higher_is_better=True
    )

    if conductivity_winner == "Tie":
        conductivity_reason = "Both samples have nearly the same estimated conductivity."
    else:
        conductivity_reason = (
            f"{conductivity_winner} has higher conductivity based on concentration and carrier mobility."
        )

    if voltage_winner == "Tie":
        voltage_reason = "Both samples have a similar breakdown-voltage estimate."
    else:
        voltage_reason = (
            f"{voltage_winner} has the higher estimated breakdown voltage, useful for blocking applications."
        )

    if leakage_winner == "Tie":
        leakage_reason = "Both samples have similar resistivity so leakage tendency is close."
    else:
        leakage_reason = (
            f"{leakage_winner} has higher resistivity, which generally corresponds to lower leakage tendency."
        )

    summary = f"{conductivity_reason} {voltage_reason} {leakage_reason}"

    return {
        "higher_conductivity": {
            "winner": conductivity_winner,
            "reason": conductivity_reason,
        },
        "better_voltage_handling": {
            "winner": voltage_winner,
            "reason": voltage_reason,
        },
        "lower_leakage_tendency": {
            "winner": leakage_winner,
            "reason": leakage_reason,
        },
        "summary": summary,
    }
