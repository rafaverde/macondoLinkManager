const countryNames = new Intl.DisplayNames(["pt-BR"], { type: "region" });

export function normalizeCountry(code: string | null | undefined) {
  if (!code) return "Não identificado";

  const name = countryNames.of(code.toUpperCase());
  return name ?? "Não identificado";
}

export function normalizeCity(city: string | null | undefined) {
  if (!city) return "Não identificada";
  return city ?? "Não identificada";
}
