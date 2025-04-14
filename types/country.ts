export interface Country {
  name: {
    common: string;
    official: string;
    nativeName: Record<string, { official: string; common: string; }>;
  };
  population: number;
  region: string;
  subregion: string;
  capital: string[];
  flags: {
    png: string;
    svg: string;
    alt: string;
  };
  borders?: string[];
  tld: string[];
  currencies: Record<string, { name: string; symbol: string; }>;
  languages: Record<string, string>;
  cca3: string;
}