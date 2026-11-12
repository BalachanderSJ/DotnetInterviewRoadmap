(function () {
  var search = document.getElementById("search");
  var clearButton = document.getElementById("clear-search");
  var empty = document.getElementById("empty-state");
  var emptyText = document.getElementById("empty-text");
  var summary = document.getElementById("visible-summary");
  var filters = document.querySelectorAll("[data-filter]");
  var items = document.querySelectorAll("[data-filter-item]");
  var blocks = document.querySelectorAll("[data-section-block]");
  var panels = document.querySelectorAll("[data-panel]");
  var active = "all";

  document.querySelectorAll(".card, .tool").forEach(function (card) {
    var heading = card.querySelector("h3, h4");
    if (!heading) return;
    var name = heading.textContent.trim();
    card.querySelectorAll("a.btn").forEach(function (link) {
      link.setAttribute("aria-label", link.textContent.trim() + ": " + name);
    });
  });

  function labelFor(filterId) {
    var match = document.querySelector('[data-filter="' + filterId + '"]');
    return match ? match.textContent.trim() : filterId;
  }

  function noun(count, singular, plural) {
    return count === 1 ? singular : plural;
  }

  function apply() {
    var query = search.value.trim().toLowerCase();
    clearButton.hidden = query.length === 0;

    var counts = {
      guide: { n: 0, t: 0 },
      file: { n: 0, t: 0 },
      tool: { n: 0, t: 0 }
    };

    items.forEach(function (item) {
      var sectionOk = active === "all" || item.dataset.section === active;
      var haystack = (item.dataset.search || "").toLowerCase();
      var queryOk = query === "" || haystack.indexOf(query) !== -1;
      var show = sectionOk && queryOk;
      item.hidden = !show;

      var bucket = counts[item.dataset.kind];
      if (bucket && sectionOk) {
        bucket.t += 1;
        if (queryOk) bucket.n += 1;
      }
    });

    panels.forEach(function (panel) {
      panel.hidden = !panel.querySelector("[data-filter-item]:not([hidden])");
    });

    var any = false;
    blocks.forEach(function (block) {
      var visible = block.querySelectorAll("[data-filter-item]:not([hidden])");
      var total = block.querySelectorAll("[data-filter-item]");
      var badge = block.querySelector("[data-section-count]");
      if (badge) badge.textContent = visible.length + " of " + total.length;
      var sectionOk = active === "all" || block.dataset.sectionBlock === active;
      var showBlock = sectionOk && visible.length > 0;
      block.hidden = !showBlock;
      if (showBlock) any = true;
    });

    var emptyMessage;
    if (query && active !== "all") {
      emptyMessage = "No resources match \u201c" + query + "\u201d in " + labelFor(active) + ".";
    } else if (query) {
      emptyMessage = "No resources match \u201c" + query + "\u201d.";
    } else {
      emptyMessage = "No resources in " + labelFor(active) + ".";
    }

    empty.hidden = any;
    if (!any) {
      emptyText.textContent = emptyMessage;
      summary.textContent = emptyMessage;
      return;
    }

    var pieces = [];
    if (counts.guide.t) {
      pieces.push(counts.guide.n + " of " + counts.guide.t + " " + noun(counts.guide.t, "guide", "guides"));
    }
    if (counts.file.t) {
      pieces.push(counts.file.n + " of " + counts.file.t + " " + noun(counts.file.t, "file", "files"));
    }
    if (counts.tool.t) {
      pieces.push(counts.tool.n + " of " + counts.tool.t + " " + noun(counts.tool.t, "script", "scripts"));
    }

    var text = "Showing " + pieces.join(", ") + ".";
    if (active !== "all") text += " Filter: " + labelFor(active) + ".";
    summary.textContent = text;
  }

  function setFilter(next) {
    active = next;
    filters.forEach(function (button) {
      button.setAttribute("aria-pressed", button.dataset.filter === active ? "true" : "false");
    });
    apply();
  }

  filters.forEach(function (button) {
    button.addEventListener("click", function () {
      setFilter(button.dataset.filter);
    });
  });

  search.addEventListener("input", apply);

  clearButton.addEventListener("click", function () {
    search.value = "";
    apply();
    search.focus();
  });

  document.getElementById("empty-clear").addEventListener("click", function () {
    search.value = "";
    setFilter("all");
    search.focus();
  });

  document.addEventListener("keydown", function (event) {
    var typing = event.target === search;
    if (event.key === "/" && !typing) {
      event.preventDefault();
      search.focus();
    }
    if (event.key === "Escape" && typing && search.value) {
      search.value = "";
      apply();
    }
  });

  apply();
})();
