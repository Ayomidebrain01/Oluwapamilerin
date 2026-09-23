(function () {
  var nav = document.getElementById("nav");
  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("menu");

  var progress = document.getElementById("navProgress");
  var toTop = document.getElementById("toTop");
  function onScroll() {
    var y = window.scrollY;
    if (nav) nav.classList.toggle("is-stuck", y > 8);
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
    if (progress) progress.style.transform = "scaleX(" + p + ")";
    if (nav) nav.classList.toggle("has-progress", p > 0.008);
    if (toTop) toTop.classList.toggle("is-on", y > 480);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });

  function closeMenu() {
    if (!menu || !toggle) return;
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    document.body.classList.remove("menu-open");
  }
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.classList.toggle("menu-open", open);
    });
    menu.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", closeMenu); });
    var logo = document.querySelector(".logo");
    if (logo) logo.addEventListener("click", closeMenu);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });
  }

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var nodes = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    nodes.forEach(function (el) { el.classList.add("on"); });
  } else {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("on");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });
    nodes.forEach(function (el) { obs.observe(el); });
  }

  var pills = document.getElementById("navLinks");
  var thumb = document.getElementById("navThumb");
  var links = pills ? [].slice.call(pills.querySelectorAll("a")) : [];
  var sectionFor = {
    top: "#top",
    approach: "#top",
    work: "#work",
    proof: "#work",
    offer: "#offer",
    process: "#process",
    about: "#about",
    talk: "#about",
    who: "#offer",
    tools: "#process",
    start: "#about"
  };

  function setActive(href) {
    var active = null;
    links.forEach(function (a) {
      var on = a.getAttribute("href") === href;
      a.classList.toggle("is-on", on);
      if (on) active = a;
    });
    if (!active || !thumb || window.innerWidth < 768) return;
    thumb.style.width = active.offsetWidth + "px";
    thumb.style.transform = "translateX(" + active.offsetLeft + "px)";
  }

  if (links.length) {
    setActive("#top");
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { setActive("#top"); });
    }
    var visible = {};
    if ("IntersectionObserver" in window) {
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          visible[entry.target.id] = entry.isIntersecting ? entry.intersectionRatio : 0;
        });
        var best = "top";
        var ratio = -1;
        Object.keys(visible).forEach(function (id) {
          if (visible[id] > ratio) {
            ratio = visible[id];
            best = id;
          }
        });
        setActive(sectionFor[best] || "#top");
      }, { rootMargin: "-22% 0px -48% 0px", threshold: [0, 0.2, 0.4, 0.65, 1] });
      ["top", "approach", "work", "proof", "offer", "who", "process", "tools", "about", "start", "talk"].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) spy.observe(el);
      });
    }
    window.addEventListener("resize", function () {
      var on = pills.querySelector("a.is-on");
      if (on) setActive(on.getAttribute("href"));
    });
  }

  if (new URLSearchParams(location.search).get("sent") === "1") {
    var form = document.getElementById("enquiry");
    var thanks = document.getElementById("thanks");
    if (form && thanks) {
      form.hidden = true;
      thanks.hidden = false;
    }
    var talk = document.getElementById("talk");
    if (talk) talk.scrollIntoView();
  }
})();
