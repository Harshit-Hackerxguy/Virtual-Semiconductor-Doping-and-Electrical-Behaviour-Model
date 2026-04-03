import os
from flask import Flask, render_template, request

from simulator import (
    COMMON_IMPURITIES,
    MATERIAL_OPTIONS,
    build_sample_result,
    compare_samples,
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = Flask(
    __name__,
    template_folder=os.path.join(BASE_DIR, "templates"),
    static_folder=os.path.join(BASE_DIR, "static"),
)


def get_sample_input(form_data, prefix):
    return {
        "material": form_data.get(f"{prefix}_material", "Silicon"),
        "selected_impurity": form_data.get(f"{prefix}_impurity", ""),
        "custom_impurity": form_data.get(f"{prefix}_custom_impurity", ""),
        "concentration": form_data.get(f"{prefix}_concentration", ""),
    }


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


@app.route("/", methods=["GET", "POST"])
def index():
    compare_mode = False
    errors = []
    sample_a = None
    sample_b = None
    comparison = None
    form_state = get_form_state({})

    if request.method == "POST":
        compare_mode = request.form.get("compare_mode") == "on"
        form_state = get_form_state(request.form)

        try:
            sample_a = build_sample_result(get_sample_input(request.form, "sample_a"), "Sample A")
        except ValueError as error:
            errors.append(f"Sample A: {error}")

        if compare_mode:
            try:
                sample_b = build_sample_result(get_sample_input(request.form, "sample_b"), "Sample B")
            except ValueError as error:
                errors.append(f"Sample B: {error}")

        if compare_mode and sample_a and sample_b and not errors:
            comparison = compare_samples(sample_a, sample_b)

    return render_template(
        "index.html",
        materials=MATERIAL_OPTIONS,
        impurities=COMMON_IMPURITIES,
        form_state=form_state,
        compare_mode=compare_mode,
        errors=errors,
        sample_a=sample_a,
        sample_b=sample_b,
        comparison=comparison,
    )


if __name__ == "__main__":
    app.run(debug=True)
