/**
 * Client-side recipe search.
 * Loaded only on /recipes page.
 * Fetches /search-index.json once, then filters on input.
 */
(function () {
  'use strict';

  const searchInput = document.getElementById('search-input');
  const resultsList = document.getElementById('recipes-list');
  const resultsCount = document.getElementById('results-count');
  const allCards = resultsList
    ? Array.from(resultsList.querySelectorAll('[data-recipe-slug]'))
    : [];

  if (!searchInput || !resultsList) return;

  let index = null;
  let fetchStarted = false;

  function normalise(str) {
    return (str || '').toLowerCase();
  }

  function matches(recipe, query) {
    const q = normalise(query);
    if (!q) return true;
    return (
      normalise(recipe.title).includes(q) ||
      normalise(recipe.description).includes(q) ||
      (recipe.categories || []).some(function (c) {
        return normalise(c).includes(q);
      }) ||
      (recipe.tags || []).some(function (t) {
        return normalise(t).includes(q);
      })
    );
  }

  function applyFilter(query) {
    if (!index) return; // index not loaded yet

    const q = query.trim();
    let visibleCount = 0;

    allCards.forEach(function (card) {
      const slug = card.getAttribute('data-recipe-slug');
      const recipe = index.find(function (r) {
        return r.slug === slug;
      });
      if (!recipe) return;

      const show = matches(recipe, q);
      card.style.display = show ? '' : 'none';
      if (show) visibleCount++;
    });

    if (resultsCount) {
      if (!q) {
        resultsCount.textContent = '';
      } else {
        resultsCount.textContent =
          visibleCount === 0
            ? 'No recipes found.'
            : visibleCount === 1
              ? '1 recipe found.'
              : visibleCount + ' recipes found.';
      }
    }

    // Show/hide empty state
    const noResults = document.getElementById('no-results');
    if (noResults) {
      noResults.hidden = visibleCount > 0 || !q;
    }
  }

  function loadIndex() {
    if (fetchStarted) return;
    fetchStarted = true;

    fetch('/search-index.json')
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        index = data;
        // Apply any pending query
        applyFilter(searchInput.value);
      })
      .catch(function (err) {
        console.warn('Search index failed to load:', err);
      });
  }

  // Load on first interaction or focus
  searchInput.addEventListener('focus', loadIndex, { once: true });
  searchInput.addEventListener('input', function () {
    if (!fetchStarted) loadIndex();
    applyFilter(searchInput.value);
  });
})();
