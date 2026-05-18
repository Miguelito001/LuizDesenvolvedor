export interface Title {
  id: string;
  title: string;
  type: "MOVIE" | "SHOW";
  description: string;
  release_year: number;
  age_certification: string;
  runtime: number;
  genres: string[];
  production_countries: string[];
  seasons: number | null;
  imdb_id: string;
  imdb_score: number | null;
  imdb_votes: number | null;
  tmdb_popularity: number | null;
  tmdb_score: number | null;
}

export interface Credit {
  person_id: string;
  id: string;
  name: string;
  character: string;
  role: "ACTOR" | "DIRECTOR";
}

export function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());

  return result;
}

export function parseGenres(genresStr: string): string[] {
  if (!genresStr || genresStr === "[]") return [];
  try {
    const cleaned = genresStr.replace(/'/g, '"');
    return JSON.parse(cleaned);
  } catch {
    return [];
  }
}

export function parseCountries(countriesStr: string): string[] {
  if (!countriesStr || countriesStr === "[]") return [];
  try {
    const cleaned = countriesStr.replace(/'/g, '"');
    return JSON.parse(cleaned);
  } catch {
    return [];
  }
}

export function parseTitlesCSV(csvContent: string): Title[] {
  const lines = csvContent.split("\n");
  const titles: Title[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const fields = parseCSVLine(line);
    if (fields.length < 15) continue;

    const title: Title = {
      id: fields[0],
      title: fields[1],
      type: fields[2] as "MOVIE" | "SHOW",
      description: fields[3],
      release_year: parseInt(fields[4]) || 0,
      age_certification: fields[5] || "NR",
      runtime: parseInt(fields[6]) || 0,
      genres: parseGenres(fields[7]),
      production_countries: parseCountries(fields[8]),
      seasons: fields[9] ? parseFloat(fields[9]) : null,
      imdb_id: fields[10],
      imdb_score: fields[11] ? parseFloat(fields[11]) : null,
      imdb_votes: fields[12] ? parseFloat(fields[12]) : null,
      tmdb_popularity: fields[13] ? parseFloat(fields[13]) : null,
      tmdb_score: fields[14] ? parseFloat(fields[14]) : null,
    };

    titles.push(title);
  }

  return titles;
}

export function parseCreditsCSV(csvContent: string): Credit[] {
  const lines = csvContent.split("\n");
  const credits: Credit[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const fields = parseCSVLine(line);
    if (fields.length < 5) continue;

    const credit: Credit = {
      person_id: fields[0],
      id: fields[1],
      name: fields[2],
      character: fields[3],
      role: fields[4] as "ACTOR" | "DIRECTOR",
    };

    credits.push(credit);
  }

  return credits;
}
