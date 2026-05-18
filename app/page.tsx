"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Play, Info, Star, Calendar, Clock, Film, Tv } from "lucide-react";
import { Title, Credit, parseTitlesCSV, parseCreditsCSV } from "@/lib/types";

// CSV data will be loaded from public folder
const TITLES_URL = "/data/titles.csv";
const CREDITS_URL = "/data/credits.csv";

function MovieCard({
  title,
  onClick,
}: {
  title: Title;
  onClick: () => void;
}) {
  const genreColors: Record<string, string> = {
    action: "bg-red-600",
    comedy: "bg-yellow-600",
    drama: "bg-blue-600",
    horror: "bg-purple-600",
    scifi: "bg-cyan-600",
    romance: "bg-pink-600",
    thriller: "bg-orange-600",
    animation: "bg-green-600",
    documentary: "bg-teal-600",
    fantasy: "bg-indigo-600",
    crime: "bg-slate-600",
    war: "bg-stone-600",
    family: "bg-lime-600",
    music: "bg-fuchsia-600",
    western: "bg-amber-700",
    history: "bg-emerald-700",
    default: "bg-gray-600",
  };

  const getGenreColor = (genre: string) => {
    const key = genre.toLowerCase().replace(/[^a-z]/g, "");
    return genreColors[key] || genreColors.default;
  };

  return (
    <div
      onClick={onClick}
      className="group relative flex-shrink-0 w-[160px] md:w-[200px] cursor-pointer transition-transform duration-300 hover:scale-105 hover:z-10"
    >
      <div className="relative aspect-[2/3] bg-[var(--card)] rounded-md overflow-hidden shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-3">
          <div className="flex items-center gap-1 mb-1">
            {title.type === "MOVIE" ? (
              <Film className="w-3 h-3 text-[var(--primary)]" />
            ) : (
              <Tv className="w-3 h-3 text-blue-500" />
            )}
            <span className="text-[10px] text-[var(--secondary-foreground)] uppercase">
              {title.type === "MOVIE" ? "Filme" : "Série"}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-white line-clamp-2 leading-tight">
            {title.title}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-xs text-[var(--secondary-foreground)]">
            <span>{title.release_year}</span>
            {title.imdb_score && (
              <span className="flex items-center gap-0.5">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                {title.imdb_score.toFixed(1)}
              </span>
            )}
          </div>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-3 text-center">
          <Play className="w-10 h-10 text-white mb-2 fill-white" />
          <p className="text-xs text-gray-300 line-clamp-4">{title.description || "Sem descrição disponível"}</p>
          <div className="flex flex-wrap justify-center gap-1 mt-2">
            {title.genres.slice(0, 2).map((genre) => (
              <span
                key={genre}
                className={`text-[10px] px-1.5 py-0.5 rounded ${getGenreColor(genre)} text-white`}
              >
                {genre}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ContentRow({
  title,
  titles,
  onSelect,
}: {
  title: string;
  titles: Title[];
  onSelect: (title: Title) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (titles.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-4 px-4 md:px-12">
        {title}
      </h2>
      <div className="relative group/row">
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-0 bottom-0 z-10 w-12 bg-gradient-to-r from-[var(--background)] to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity flex items-center justify-center"
        >
          <span className="text-white text-2xl">&lt;</span>
        </button>
        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto scroll-container px-4 md:px-12 pb-4"
        >
          {titles.map((t) => (
            <MovieCard key={t.id} title={t} onClick={() => onSelect(t)} />
          ))}
        </div>
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-0 bottom-0 z-10 w-12 bg-gradient-to-l from-[var(--background)] to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity flex items-center justify-center"
        >
          <span className="text-white text-2xl">&gt;</span>
        </button>
      </div>
    </section>
  );
}

function Modal({
  title,
  credits,
  onClose,
}: {
  title: Title;
  credits: Credit[];
  onClose: () => void;
}) {
  const directors = credits.filter((c) => c.role === "DIRECTOR");
  const actors = credits.filter((c) => c.role === "ACTOR").slice(0, 10);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[var(--card)] rounded-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with gradient */}
        <div className="relative h-64 md:h-80 bg-gradient-to-b from-[var(--primary)]/30 to-[var(--card)]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[var(--card)] to-transparent">
            <div className="flex items-center gap-2 mb-2">
              {title.type === "MOVIE" ? (
                <Film className="w-5 h-5 text-[var(--primary)]" />
              ) : (
                <Tv className="w-5 h-5 text-blue-500" />
              )}
              <span className="text-sm text-[var(--secondary-foreground)] uppercase">
                {title.type === "MOVIE" ? "Filme" : "Série"}
              </span>
              {title.age_certification && title.age_certification !== "NR" && (
                <span className="px-2 py-0.5 bg-[var(--muted)] rounded text-xs text-white">
                  {title.age_certification}
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">{title.title}</h1>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Stats */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--secondary-foreground)]">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {title.release_year}
            </span>
            {title.runtime > 0 && (
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {title.runtime} min
              </span>
            )}
            {title.seasons && (
              <span className="flex items-center gap-1">
                <Tv className="w-4 h-4" />
                {title.seasons} temporada{title.seasons > 1 ? "s" : ""}
              </span>
            )}
            {title.imdb_score && (
              <span className="flex items-center gap-1 text-yellow-500">
                <Star className="w-4 h-4 fill-yellow-500" />
                {title.imdb_score.toFixed(1)} IMDb
                {title.imdb_votes && (
                  <span className="text-[var(--muted-foreground)]">
                    ({(title.imdb_votes / 1000).toFixed(0)}K votos)
                  </span>
                )}
              </span>
            )}
          </div>

          {/* Genres */}
          {title.genres.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {title.genres.map((genre) => (
                <span
                  key={genre}
                  className="px-3 py-1 bg-[var(--secondary)] rounded-full text-sm text-white capitalize"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          {title.description && (
            <p className="text-[var(--secondary-foreground)] leading-relaxed">
              {title.description}
            </p>
          )}

          {/* Directors */}
          {directors.length > 0 && (
            <div>
              <h3 className="text-white font-semibold mb-2">
                {directors.length > 1 ? "Diretores" : "Diretor"}
              </h3>
              <p className="text-[var(--secondary-foreground)]">
                {directors.map((d) => d.name).join(", ")}
              </p>
            </div>
          )}

          {/* Cast */}
          {actors.length > 0 && (
            <div>
              <h3 className="text-white font-semibold mb-2">Elenco</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {actors.map((actor) => (
                  <div
                    key={`${actor.person_id}-${actor.character}`}
                    className="bg-[var(--secondary)] rounded p-2"
                  >
                    <p className="text-white text-sm font-medium">{actor.name}</p>
                    {actor.character && (
                      <p className="text-[var(--muted-foreground)] text-xs truncate">
                        como {actor.character}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Countries */}
          {title.production_countries.length > 0 && (
            <div>
              <h3 className="text-white font-semibold mb-2">País de Produção</h3>
              <p className="text-[var(--secondary-foreground)]">
                {title.production_countries.join(", ")}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button className="flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded hover:bg-gray-200 transition-colors">
              <Play className="w-5 h-5 fill-black" />
              Assistir
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-[var(--secondary)] text-white font-semibold rounded hover:bg-[var(--muted)] transition-colors">
              <Info className="w-5 h-5" />
              Mais Info
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [titles, setTitles] = useState<Title[]>([]);
  const [credits, setCredits] = useState<Credit[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Title[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState<Title | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Load data
  useEffect(() => {
    async function loadData() {
      try {
        const [titlesRes, creditsRes] = await Promise.all([
          fetch(TITLES_URL),
          fetch(CREDITS_URL),
        ]);

        const titlesCSV = await titlesRes.text();
        const creditsCSV = await creditsRes.text();

        const parsedTitles = parseTitlesCSV(titlesCSV);
        const parsedCredits = parseCreditsCSV(creditsCSV);

        setTitles(parsedTitles);
        setCredits(parsedCredits);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Search functionality
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = titles.filter(
      (t) =>
        t.title.toLowerCase().includes(query) ||
        t.description?.toLowerCase().includes(query) ||
        t.genres.some((g) => g.toLowerCase().includes(query))
    );

    setSearchResults(results.slice(0, 50));
  }, [searchQuery, titles]);

  // Get credits for selected title
  const getCreditsForTitle = (titleId: string) => {
    return credits.filter((c) => c.id === titleId);
  };

  // Filter and sort titles for different sections
  const topRated = titles
    .filter((t) => t.imdb_score && t.imdb_score >= 8)
    .sort((a, b) => (b.imdb_score || 0) - (a.imdb_score || 0))
    .slice(0, 20);

  const movies = titles
    .filter((t) => t.type === "MOVIE")
    .sort((a, b) => (b.tmdb_popularity || 0) - (a.tmdb_popularity || 0))
    .slice(0, 20);

  const shows = titles
    .filter((t) => t.type === "SHOW")
    .sort((a, b) => (b.tmdb_popularity || 0) - (a.tmdb_popularity || 0))
    .slice(0, 20);

  const actionMovies = titles
    .filter((t) => t.genres.includes("action"))
    .sort((a, b) => (b.imdb_score || 0) - (a.imdb_score || 0))
    .slice(0, 20);

  const comedies = titles
    .filter((t) => t.genres.includes("comedy"))
    .sort((a, b) => (b.imdb_score || 0) - (a.imdb_score || 0))
    .slice(0, 20);

  const dramas = titles
    .filter((t) => t.genres.includes("drama"))
    .sort((a, b) => (b.imdb_score || 0) - (a.imdb_score || 0))
    .slice(0, 20);

  const recentTitles = titles
    .filter((t) => t.release_year >= 2010)
    .sort((a, b) => b.release_year - a.release_year)
    .slice(0, 20);

  const classicMovies = titles
    .filter((t) => t.release_year < 1990 && t.imdb_score && t.imdb_score >= 7)
    .sort((a, b) => (b.imdb_score || 0) - (a.imdb_score || 0))
    .slice(0, 20);

  // Featured title for hero
  const featuredTitle = topRated[0];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[var(--secondary-foreground)]">Carregando catálogo...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center justify-between px-4 md:px-12 py-4">
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--primary)]">
            LUIZFLIX
          </h1>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              {isSearching ? (
                <div className="flex items-center bg-black/80 border border-white/30 rounded">
                  <Search className="w-5 h-5 text-white ml-3" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Títulos, gêneros..."
                    className="w-48 md:w-64 px-3 py-2 bg-transparent text-white placeholder-gray-400 focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      setIsSearching(false);
                      setSearchQuery("");
                    }}
                    className="p-2 hover:text-[var(--primary)]"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsSearching(true)}
                  className="p-2 hover:text-[var(--primary)] transition-colors"
                >
                  <Search className="w-6 h-6 text-white" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Search Results */}
      {searchQuery && searchResults.length > 0 && (
        <div className="fixed inset-0 z-30 pt-20 bg-[var(--background)]/95 overflow-y-auto">
          <div className="px-4 md:px-12 py-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              Resultados para &quot;{searchQuery}&quot; ({searchResults.length})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {searchResults.map((title) => (
                <MovieCard
                  key={title.id}
                  title={title}
                  onClick={() => setSelectedTitle(title)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {searchQuery && searchResults.length === 0 && (
        <div className="fixed inset-0 z-30 pt-20 bg-[var(--background)]/95 flex items-center justify-center">
          <div className="text-center">
            <Search className="w-16 h-16 text-[var(--muted)] mx-auto mb-4" />
            <p className="text-xl text-white mb-2">Nenhum resultado encontrado</p>
            <p className="text-[var(--secondary-foreground)]">
              Tente buscar por outro título ou gênero
            </p>
          </div>
        </div>
      )}

      {/* Hero Section */}
      {featuredTitle && !searchQuery && (
        <section className="relative h-[70vh] md:h-[80vh] flex items-end">
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-transparent to-transparent" />

          <div className="relative z-10 px-4 md:px-12 pb-20 max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              {featuredTitle.type === "MOVIE" ? (
                <Film className="w-5 h-5 text-[var(--primary)]" />
              ) : (
                <Tv className="w-5 h-5 text-blue-500" />
              )}
              <span className="text-sm text-[var(--secondary-foreground)] uppercase">
                {featuredTitle.type === "MOVIE" ? "Filme em Destaque" : "Série em Destaque"}
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {featuredTitle.title}
            </h2>
            <p className="text-[var(--secondary-foreground)] text-lg mb-2 line-clamp-3">
              {featuredTitle.description}
            </p>
            <div className="flex items-center gap-4 text-sm text-[var(--secondary-foreground)] mb-6">
              <span>{featuredTitle.release_year}</span>
              {featuredTitle.imdb_score && (
                <span className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-4 h-4 fill-yellow-500" />
                  {featuredTitle.imdb_score.toFixed(1)}
                </span>
              )}
              {featuredTitle.genres.slice(0, 3).map((g) => (
                <span key={g} className="capitalize">{g}</span>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedTitle(featuredTitle)}
                className="flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded hover:bg-gray-200 transition-colors"
              >
                <Play className="w-5 h-5 fill-black" />
                Assistir
              </button>
              <button
                onClick={() => setSelectedTitle(featuredTitle)}
                className="flex items-center gap-2 px-6 py-3 bg-[var(--secondary)]/80 text-white font-semibold rounded hover:bg-[var(--secondary)] transition-colors"
              >
                <Info className="w-5 h-5" />
                Mais Info
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Content Rows */}
      {!searchQuery && (
        <div className="relative z-20 -mt-20 pb-20">
          <ContentRow title="Mais Bem Avaliados" titles={topRated} onSelect={setSelectedTitle} />
          <ContentRow title="Filmes Populares" titles={movies} onSelect={setSelectedTitle} />
          <ContentRow title="Séries Populares" titles={shows} onSelect={setSelectedTitle} />
          <ContentRow title="Ação e Aventura" titles={actionMovies} onSelect={setSelectedTitle} />
          <ContentRow title="Comédia" titles={comedies} onSelect={setSelectedTitle} />
          <ContentRow title="Drama" titles={dramas} onSelect={setSelectedTitle} />
          <ContentRow title="Lançamentos Recentes" titles={recentTitles} onSelect={setSelectedTitle} />
          <ContentRow title="Clássicos do Cinema" titles={classicMovies} onSelect={setSelectedTitle} />
        </div>
      )}

      {/* Modal */}
      {selectedTitle && (
        <Modal
          title={selectedTitle}
          credits={getCreditsForTitle(selectedTitle.id)}
          onClose={() => setSelectedTitle(null)}
        />
      )}
    </main>
  );
}
