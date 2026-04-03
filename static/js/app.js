document.addEventListener("DOMContentLoaded", () => {
    const compareToggle = document.getElementById("compare_mode");
    const comparePanel = document.querySelector("[data-compare-panel]");

    if (!compareToggle || !comparePanel) {
        return;
    }

    const compareInputs = comparePanel.querySelectorAll("input, select");

    function syncComparePanel() {
        const enabled = compareToggle.checked;
        comparePanel.classList.toggle("is-hidden", !enabled);

        compareInputs.forEach((input) => {
            input.disabled = !enabled;
        });
    }

    syncComparePanel();
    compareToggle.addEventListener("change", syncComparePanel);
});
