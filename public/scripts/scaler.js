/**
 * Recipe Servings Scaler
 * Loaded only on recipe detail pages.
 * Reads base ingredient data from a <script type="application/json"> block
 * and updates ingredient quantities in the DOM when servings change.
 */
(function () {
  'use strict';

  const dataEl = document.getElementById('recipe-ingredients');
  const listEl = document.getElementById('ingredients-list');
  const input = document.getElementById('servings-input');
  const decBtn = document.getElementById('servings-dec');
  const incBtn = document.getElementById('servings-inc');
  const announce = document.getElementById('scaler-announce');

  if (!dataEl || !listEl || !input) return;

  const { baseServings, ingredients } = JSON.parse(dataEl.textContent || '{}');
  if (!baseServings || !Array.isArray(ingredients)) return;

  const items = listEl.querySelectorAll('.ingredients-list__item');

  /**
   * Format a quantity value for display.
   * - Close to integer → show as integer
   * - Otherwise → up to 2 decimal places, no trailing zeros
   */
  function formatQty(value) {
    const rounded = Math.round(value);
    if (Math.abs(value - rounded) < 0.01) return String(rounded);
    return parseFloat(value.toFixed(2)).toString();
  }

  /**
   * Update ingredient quantities in the DOM.
   */
  function updateIngredients(desiredServings) {
    const ratio = desiredServings / baseServings;

    ingredients.forEach(function (ing, i) {
      const item = items[i];
      if (!item) return;

      const qtyEl = item.querySelector('[data-ingredient-qty]');
      if (!qtyEl) return;

      // If quantity is null, or scalable is explicitly false — display as-is
      if (ing.quantity === null || ing.scalable === false) {
        // already set at render time; nothing to do
        return;
      }

      const scaled = ing.quantity * ratio;
      const displayQty = formatQty(scaled);
      const displayUnit = ing.unit ? ' ' + ing.unit : '';
      qtyEl.textContent = displayQty + displayUnit;
    });
  }

  /**
   * Handle servings input change.
   */
  function onServingsChange() {
    let val = parseInt(input.value, 10);
    if (isNaN(val) || val < 1) val = 1;
    if (val > 50) val = 50;
    input.value = val;

    updateIngredients(val);

    if (announce) {
      announce.textContent = 'Ingredients updated for ' + val + ' servings.';
      // Clear after announcement so it can repeat
      setTimeout(function () {
        announce.textContent = '';
      }, 1500);
    }

    decBtn.disabled = val <= 1;
    incBtn.disabled = val >= 50;
  }

  // Event listeners
  input.addEventListener('change', onServingsChange);
  input.addEventListener('input', onServingsChange);

  decBtn.addEventListener('click', function () {
    const val = parseInt(input.value, 10) || baseServings;
    if (val > 1) {
      input.value = val - 1;
      onServingsChange();
    }
  });

  incBtn.addEventListener('click', function () {
    const val = parseInt(input.value, 10) || baseServings;
    if (val < 50) {
      input.value = val + 1;
      onServingsChange();
    }
  });

  // Initialise button states
  decBtn.disabled = parseInt(input.value, 10) <= 1;
  incBtn.disabled = parseInt(input.value, 10) >= 50;
})();
