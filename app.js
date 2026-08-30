// ============================================================
// تعدد اللغات (عربي/إنكليزي)
// ============================================================
const STRINGS = {
  ar: {
    nav_movies: "أفلام", nav_tv: "مسلسلات", nav_anime: "أنمي",
    search_placeholder: "ابحث عن فيلم، مسلسل، أنمي…",
    hero_eyebrow: "يُعرض الآن",
    hero_trailer_btn: "▶ شاهد الإعلان", hero_details_btn: "تفاصيل أكثر",
    setup_banner_html: '⚠️ لتشغيل الموقع بمحتوى حقيقي، ضع مفتاح TMDB المجاني في ملف <code>js/config.js</code>. التفاصيل في ملف <code>README.md</code>.',
    dismiss_banner: "إغلاق",
    row_trending: "الأكثر رواجًا هذا الأسبوع", row_movies: "أفلام شائعة",
    row_tv: "مسلسلات شائعة", row_anime: "أنمي شائع", row_top_rated: "الأعلى تقييمًا",
    footer_ticket: "تذكرة صالحة لعرض واحد فقط · لوبي © 2026",
    footer_disclaimer: "هذا القالب يعرض بيانات وصور وإعلانات (تريلر) من مصادر عامة مجانية (TMDB وAniList) لأغراض العرض والتصفح فقط، ولا يستضيف أو يبث أي أفلام أو مسلسلات كاملة محمية بحقوق الملكية. لإضافة تشغيل فعلي، اربط الموقع بمصادر تملك حقوق بثها.",
    loading: "جاري التحميل…", searching: "جاري البحث…",
    no_results_prefix: "لا نتائج لـ",
    no_data: "لا توجد بيانات — تحقق من مفتاح TMDB في js/config.js",
    movie_label: "فيلم", tv_label: "مسلسل", anime_label: "أنمي",
    no_description: "لا يوجد وصف متاح.",
    watch_on_youtube: "الإعلان لا يعمل هنا؟ افتحه على يوتيوب مباشرة",
    minute: "دقيقة", minute_per_ep: "دقيقة/حلقة",
  },
  en: {
    nav_movies: "Movies", nav_tv: "TV Shows", nav_anime: "Anime",
    search_placeholder: "Search movies, TV shows, anime…",
    hero_eyebrow: "Now Showing",
    hero_trailer_btn: "▶ Watch Trailer", hero_details_btn: "More Details",
    setup_banner_html: '⚠️ To load real content, add your free TMDB key to <code>js/config.js</code>. See <code>README.md</code> for details.',
    dismiss_banner: "Dismiss",
    row_trending: "Trending This Week", row_movies: "Popular Movies",
    row_tv: "Popular TV Shows", row_anime: "Popular Anime", row_top_rated: "Top Rated",
    footer_ticket: "Valid for one screening only · Lobby © 2026",
    footer_disclaimer: "This template shows metadata, images, and trailers from free public sources (TMDB and AniList) for browsing purposes only, and does not host or stream any full movies or shows. To add real playback, connect it to a source you're licensed to stream from.",
    loading: "Loading…", searching: "Searching…",
    no_results_prefix: "No results for",
    no_data: "No data — check your TMDB key in js/config.js",
    movie_label: "Movie", tv_label: "TV", anime_label: "Anime",
    no_description: "No description available.",
    watch_on_youtube: "Trailer not playing? Open it on YouTube directly",
    minute: "min", minute_per_ep: "min/ep",
  },
};

let currentLang = "ar";
function t(key) { return STRINGS[currentLang][key] || key; }

function applyStaticTranslations() {
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";
  document.querySelectorAll("[data-i18n]").forEach((elm) => {
    elm.textContent = t(elm.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((elm) => {
    elm.placeholder = t(elm.dataset.i18nPlaceholder);
  });
  document.querySelectorAll("[data-i18n-html]").forEach((elm) => {
    elm.innerHTML = t(elm.dataset.i18nHtml);
  });
  document.getElementById("langToggle").textContent = currentLang === "ar" ? "EN" : "عربي";
}

document.getElementById("langToggle").addEventListener("click", () => {
  currentLang = currentLang === "ar" ? "en" : "ar";
  CONFIG.LANG = currentLang === "ar" ? "ar" : "en-US";
  applyStaticTranslations();
  init();
});


const IMG_POSTER = (path, size = "w342") =>
  path ? `${CONFIG.TMDB_IMG}/${size}${path}` : placeholderPoster();
const IMG_BACKDROP = (path, size = "w1280") =>
  path ? `${CONFIG.TMDB_IMG}/${size}${path}` : placeholderBackdrop();

function placeholderPoster() {
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="342" height="513">
      <rect width="100%" height="100%" fill="#241419"/>
      <text x="50%" y="50%" fill="#8C7A6E" font-size="20" font-family="sans-serif" text-anchor="middle">لا صورة</text>
    </svg>`);
}
function placeholderBackdrop() {
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720">
      <rect width="100%" height="100%" fill="#1C0F13"/>
    </svg>`);
}

function el(html) {
  const tmpl = document.createElement("template");
  tmpl.innerHTML = html.trim();
  return tmpl.content.firstElementChild;
}

// ---------- بطاقات ----------
function movieCard(item, kind) {
  const title = item.title || item.name || item.title_english || item.title_japanese || "—";
  const poster = kind === "anime"
    ? (item.images?.jpg?.large_image_url || item.images?.jpg?.image_url)
    : IMG_POSTER(item.poster_path);
  const year = kind === "anime"
    ? (item.year || item.aired?.prop?.from?.year || "")
    : (item.release_date || item.first_air_date || "").slice(0, 4);
  const rating = kind === "anime" ? (item.score ?? "—") : (item.vote_average ? item.vote_average.toFixed(1) : "—");

  const card = el(`
    <div class="card">
      <img class="card-poster" src="${poster || placeholderPoster()}" alt="${title}" loading="lazy">
      <div class="card-stub">
        <div class="card-title">${title}</div>
        <div class="card-sub">
          <span>${year || ""}</span>
          <span class="card-rating">★ ${rating}</span>
        </div>
      </div>
    </div>
  `);
  card.addEventListener("click", () => openModal(item, kind));
  return card;
}

function renderSkeletons(track, count = 8) {
  track.classList.add("loading");
  track.innerHTML = "";
  for (let i = 0; i < count; i++) {
    track.appendChild(el(`<div class="card-skeleton"></div>`));
  }
}

function renderRow(trackId, items, kind) {
  const track = document.getElementById(trackId);
  track.classList.remove("loading");
  track.innerHTML = "";
  if (!items || items.length === 0) {
    track.innerHTML = `<p class="search-empty">${t("no_data")}</p>`;
    return;
  }
  items.forEach((item) => track.appendChild(movieCard(item, kind)));
}

// ---------- الهيرو ----------
function setHero(item, kind) {
  if (!item) return;
  const title = item.title || item.name || "—";
  const overview = item.overview || item.synopsis || t("no_description");
  const backdrop = kind === "anime"
    ? (item.images?.jpg?.large_image_url)
    : IMG_BACKDROP(item.backdrop_path);
  const year = kind === "anime"
    ? (item.year || "")
    : (item.release_date || item.first_air_date || "").slice(0, 4);
  const rating = kind === "anime" ? (item.score ?? "—") : (item.vote_average ? item.vote_average.toFixed(1) : "—");

  document.getElementById("heroBackdrop").style.backgroundImage = `url(${backdrop || placeholderBackdrop()})`;
  document.getElementById("heroTitle").textContent = title;
  document.getElementById("heroOverview").textContent = overview;
  document.getElementById("heroMeta").textContent = `${year || ""} · ★ ${rating}`;

  const trailerBtn = document.getElementById("heroTrailerBtn");
  const detailsBtn = document.getElementById("heroDetailsBtn");
  trailerBtn.onclick = () => openModal(item, kind, true);
  detailsBtn.onclick = () => openModal(item, kind, false);
}

// ---------- المودال ----------
async function openModal(item, kind, autoTrailer = false) {
  const overlay = document.getElementById("modalOverlay");
  const body = document.getElementById("modalBody");
  body.innerHTML = `<p class="search-empty">${t("loading")}</p>`;
  overlay.classList.add("show");

  let details = item;
  let trailerKey = null;
  let genres = [];

  if (kind === "anime") {
    const full = await API.animeDetails(item.mal_id);
    details = full?.data || item;
    genres = (details.genres || []).map((g) => g.name);
    const trailerId = details.trailer?.youtube_id;
    if (trailerId) trailerKey = trailerId;
  } else {
    const fetchFn = kind === "tv" ? API.tvDetails : API.movieDetails;
    const full = await fetchFn(item.id);
    if (full) {
      details = full;
      genres = (full.genres || []).map((g) => g.name);
      const vids = full.videos?.results || [];
      const trailer = vids.find((v) => v.type === "Trailer" && v.site === "YouTube") || vids[0];
      if (trailer) trailerKey = trailer.key;
    }
  }

  const title = details.title || details.name || "—";
  const overview = details.overview || details.synopsis || t("no_description");
  const backdrop = kind === "anime"
    ? details.images?.jpg?.large_image_url
    : IMG_BACKDROP(details.backdrop_path || item.backdrop_path);
  const year = kind === "anime"
    ? (details.year || "")
    : (details.release_date || details.first_air_date || "").slice(0, 4);
  const rating = kind === "anime" ? (details.score ?? "—") : (details.vote_average ? details.vote_average.toFixed(1) : "—");
  const runtime = kind === "anime"
    ? (details.duration || "")
    : (details.runtime ? `${details.runtime} ${t("minute")}` : (details.episode_run_time?.[0] ? `${details.episode_run_time[0]} ${t("minute_per_ep")}` : ""));

  body.innerHTML = "";
  if (trailerKey) {
    body.appendChild(el(`
      <iframe class="modal-trailer" src="https://www.youtube.com/embed/${trailerKey}?autoplay=${autoTrailer ? 1 : 0}"
        title="${title}" allow="accelerometer; autoplay; encrypted-media; gyroscope" allowfullscreen></iframe>
    `));
    // بعض أصحاب الفيديوهات يمنعون التضمين (embedding) بمواقع خارجية،
    // فهذا الرابط يبقى يعمل حتى لو ظهر الإعلان فاضيًا أو معطلاً بالأعلى.
    body.appendChild(el(`
      <p class="trailer-fallback">
        <a href="https://www.youtube.com/watch?v=${trailerKey}" target="_blank" rel="noopener noreferrer">${t("watch_on_youtube")}</a>
      </p>
    `));
  } else {
    body.appendChild(el(`<img class="modal-backdrop-img" src="${backdrop || placeholderBackdrop()}" alt="${title}">`));
  }

  body.appendChild(el(`
    <div class="modal-body-inner">
      <h2 class="modal-title">${title}</h2>
      <div class="modal-meta">
        ${year ? `<span>${year}</span>` : ""}
        <span>★ ${rating}</span>
        ${runtime ? `<span>${runtime}</span>` : ""}
        ${genres.map((g) => `<span>${g}</span>`).join("")}
      </div>
      <p class="modal-overview">${overview}</p>
    </div>
  `));
}

document.getElementById("modalClose").addEventListener("click", closeModal);
document.getElementById("modalOverlay").addEventListener("click", (e) => {
  if (e.target.id === "modalOverlay") closeModal();
});
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

function closeModal() {
  const overlay = document.getElementById("modalOverlay");
  overlay.classList.remove("show");
  document.getElementById("modalBody").innerHTML = "";
}

// ---------- البحث ----------
let searchDebounce;
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");

searchInput.addEventListener("input", () => {
  clearTimeout(searchDebounce);
  const q = searchInput.value.trim();
  if (!q) { searchResults.classList.remove("show"); return; }
  searchDebounce = setTimeout(() => runSearch(q), 350);
});
document.addEventListener("click", (e) => {
  if (!e.target.closest(".search-wrap")) searchResults.classList.remove("show");
});

async function runSearch(query) {
  searchResults.innerHTML = `<p class="search-empty">${t("searching")}</p>`;
  searchResults.classList.add("show");

  const [tmdbRes, animeRes] = await Promise.all([
    API.hasKey() ? API.search(query) : Promise.resolve(null),
    API.searchAnime(query),
  ]);

  const tmdbItems = (tmdbRes?.results || []).filter((r) => r.media_type === "movie" || r.media_type === "tv");
  const animeItems = (animeRes?.data || []).map((a) => ({ ...a, media_type: "anime" }));
  const combined = [...tmdbItems, ...animeItems].slice(0, 12);

  if (combined.length === 0) {
    searchResults.innerHTML = `<p class="search-empty">${t("no_results_prefix")} «${query}»</p>`;
    return;
  }

  searchResults.innerHTML = "";
  combined.forEach((item) => {
    const kind = item.media_type === "movie" ? "movie" : item.media_type === "tv" ? "tv" : "anime";
    const title = item.title || item.name || "—";
    const poster = kind === "anime"
      ? (item.images?.jpg?.image_url)
      : IMG_POSTER(item.poster_path, "w92");
    const year = kind === "anime"
      ? (item.year || "")
      : (item.release_date || item.first_air_date || "").slice(0, 4);
    const typeLabel = kind === "movie" ? t("movie_label") : kind === "tv" ? t("tv_label") : t("anime_label");

    const row = el(`
      <div class="search-result-item">
        <img src="${poster || placeholderPoster()}" alt="${title}">
        <div>
          <div class="sri-title">${title}</div>
          <div class="sri-meta">${typeLabel}${year ? " · " + year : ""}</div>
        </div>
      </div>
    `);
    row.addEventListener("click", () => {
      openModal(item, kind);
      searchResults.classList.remove("show");
      searchInput.value = "";
    });
    searchResults.appendChild(row);
  });
}

// ---------- التنقل بين الأقسام ----------
document.querySelectorAll(".nav-link").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav-link").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.target)?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// ---------- تنبيه الإعداد ----------
document.getElementById("dismissBanner").addEventListener("click", () => {
  document.getElementById("setupBanner").classList.add("hidden");
});

// ---------- أزرار السكرول يمين/يسار لكل صف ----------
function setupRowScrollers() {
  document.querySelectorAll(".row-track").forEach((track) => {
    if (track.dataset.scrollersReady) return;
    track.dataset.scrollersReady = "1";

    const wrap = document.createElement("div");
    wrap.className = "row-track-wrap";
    track.parentNode.insertBefore(wrap, track);
    wrap.appendChild(track);

    const makeBtn = (side, icon, ariaLabel) => {
      const btn = document.createElement("button");
      btn.className = `scroll-btn scroll-btn-${side}`;
      btn.type = "button";
      btn.textContent = icon;
      btn.setAttribute("aria-label", ariaLabel);
      // بوضع الصفحة الإنكليزي (LTR): يمين = +1 ، يسار = -1
      // بوضع الصفحة العربي (RTL): المتصفح يعكس معنى scrollLeft، فنعكس الإشارة يدويًا.
      // نتحقق من الاتجاه وقت الضغط نفسه (مو وقت إنشاء الزر) حتى يبقى صحيح حتى لو بدّلت اللغة بعدين.
      btn.addEventListener("click", () => {
  const delta = side === "right" ? 1 : -1;
  track.scrollBy({ left: delta * track.clientWidth * 0.85, behavior: "smooth" });
});
      return btn;
    };

    wrap.appendChild(makeBtn("right", "❯", "سكرول لليمين"));
    wrap.appendChild(makeBtn("left", "❮", "سكرول لليسار"));
  });
}

// ---------- التحميل الأولي ----------
async function init() {
  if (!API.hasKey()) {
    document.getElementById("setupBanner").classList.remove("hidden");
  } else {
    document.getElementById("setupBanner").classList.add("hidden");
  }

  [
    "track-trending", "track-movies", "track-tv", "track-anime", "track-top-rated",
  ].forEach((id) => renderSkeletons(document.getElementById(id)));

  const [trending, movies, tv, topRated, anime] = await Promise.all([
    API.hasKey() ? API.trending() : Promise.resolve(null),
    API.hasKey() ? API.popularMovies() : Promise.resolve(null),
    API.hasKey() ? API.popularTV() : Promise.resolve(null),
    API.hasKey() ? API.topRated() : Promise.resolve(null),
    API.topAnime(),
  ]);

  const trendingItems = (trending?.results || []).filter((i) => i.media_type !== "person");
  renderRow("track-trending", trendingItems, "mixed");
  renderRow("track-movies", movies?.results, "movie");
  renderRow("track-tv", tv?.results, "tv");
  renderRow("track-top-rated", topRated?.results, "movie");
  renderRow("track-anime", anime?.data, "anime");

  // اختيار هيرو من الأكثر رواجًا، أو من الأنمي كبديل
  const heroPick = trendingItems[0] || anime?.data?.[0];
  const heroKind = trendingItems[0] ? (trendingItems[0].media_type === "tv" ? "tv" : "movie") : "anime";
  if (heroPick) setHero(heroPick, heroKind);
}

// ---------- ستارة الافتتاح ----------
window.addEventListener("load", () => {
  const curtain = document.getElementById("curtain");
  setTimeout(() => curtain.classList.add("open"), 500);
  setTimeout(() => curtain.classList.add("hidden"), 1700);
});

setupRowScrollers();
applyStaticTranslations();
init();