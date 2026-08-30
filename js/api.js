// ============================================================
// طبقة الاتصال بالبيانات: TMDB (أفلام/مسلسلات) + Jikan (أنمي)
// ============================================================

const API = (() => {

  function hasKey() {
    return CONFIG.TMDB_API_KEY && CONFIG.TMDB_API_KEY.trim() !== "" &&
           CONFIG.TMDB_API_KEY !== "ضع_مفتاح_TMDB_هنا";
  }

  async function tmdb(path, params = {}) {
    if (!hasKey()) return null;
    const url = new URL(CONFIG.TMDB_BASE + path);
    url.searchParams.set("api_key", CONFIG.TMDB_API_KEY);
    url.searchParams.set("language", CONFIG.LANG);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    try {
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error("TMDB error " + res.status);
      return await res.json();
    } catch (err) {
      console.error("TMDB fetch failed:", err);
      return null;
    }
  }

  async function jikan(path, params = {}) {
    const url = new URL("https://api.jikan.moe/v4" + path);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    try {
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error("Jikan error " + res.status);
      return await res.json();
    } catch (err) {
      console.error("Jikan fetch failed:", err);
      return null;
    }
  }

  // ---------- AniList (مصدر بديل ومستقل عن MyAnimeList، لا يحتاج مفتاح) ----------
  async function anilist(query, variables) {
    try {
      const res = await fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ query, variables }),
      });
      if (!res.ok) throw new Error("AniList error " + res.status);
      const json = await res.json();
      if (json.errors) throw new Error(json.errors[0]?.message || "AniList error");
      return json.data;
    } catch (err) {
      console.error("AniList fetch failed:", err);
      return null;
    }
  }

  function normalizeAnime(m) {
    if (!m) return null;
    const desc = (m.description || "").replace(/<[^>]+>/g, "").trim();
    return {
      mal_id: m.id,
      title: m.title?.english || m.title?.romaji || m.title?.native || "بدون عنوان",
      images: { jpg: { large_image_url: m.coverImage?.large, image_url: m.coverImage?.large } },
      year: m.seasonYear || "",
      score: m.averageScore ? +(m.averageScore / 10).toFixed(1) : "—",
      synopsis: desc || "لا يوجد وصف متاح لهذا العمل حاليًا.",
      genres: (m.genres || []).map((g) => ({ name: g })),
      trailer: m.trailer && m.trailer.site === "youtube" ? { youtube_id: m.trailer.id } : null,
      duration: m.duration ? `${m.duration} دقيقة/حلقة` : "",
    };
  }

  const TOP_ANIME_QUERY = `
    query ($perPage: Int) {
      Page(page: 1, perPage: $perPage) {
        media(sort: POPULARITY_DESC, type: ANIME) {
          id
          title { romaji english native }
          coverImage { large }
          averageScore
          seasonYear
          description(asHtml: false)
          genres
          duration
          trailer { id site }
        }
      }
    }`;

  const SEARCH_ANIME_QUERY = `
    query ($search: String, $perPage: Int) {
      Page(page: 1, perPage: $perPage) {
        media(search: $search, type: ANIME) {
          id
          title { romaji english native }
          coverImage { large }
          averageScore
          seasonYear
        }
      }
    }`;

  const ANIME_DETAILS_QUERY = `
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
        id
        title { romaji english native }
        coverImage { large }
        averageScore
        seasonYear
        description(asHtml: false)
        genres
        duration
        trailer { id site }
      }
    }`;

  return {
    hasKey,
    trending: () => tmdb("/trending/all/week"),
    popularMovies: () => tmdb("/movie/popular"),
    popularTV: () => tmdb("/tv/popular"),
    topRated: () => tmdb("/movie/top_rated"),
    movieDetails: (id) => tmdb(`/movie/${id}`, { append_to_response: "videos,credits" }),
    tvDetails: (id) => tmdb(`/tv/${id}`, { append_to_response: "videos,credits" }),
    search: (query) => tmdb("/search/multi", { query, include_adult: false }),
    topAnime: async () => {
      const data = await anilist(TOP_ANIME_QUERY, { perPage: 18 });
      return { data: (data?.Page?.media || []).map(normalizeAnime) };
    },
    searchAnime: async (query) => {
      const data = await anilist(SEARCH_ANIME_QUERY, { search: query, perPage: 8 });
      return { data: (data?.Page?.media || []).map(normalizeAnime) };
    },
    animeDetails: async (malId) => {
      const data = await anilist(ANIME_DETAILS_QUERY, { id: malId });
      return { data: normalizeAnime(data?.Media) };
    },
  };
})();
