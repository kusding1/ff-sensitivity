import { PHONES, type Phone } from "@/data/phones";

export type { Phone };

export function getAllPhones(): Phone[] {
  return PHONES;
}

export function getPhoneById(id: string): Phone | undefined {
  return PHONES.find((p) => p.id === id);
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export type SearchOptions = {
  os?: "ios" | "android" | "all";
  limit?: number;
};

export function searchPhones(query: string, options: SearchOptions = {}): Phone[] {
  const { os = "all", limit = 12 } = options;
  const q = normalize(query);

  if (!q) return [];

  const filtered = os === "all" ? PHONES : PHONES.filter((p) => p.os === os);

  const startsWith: Phone[] = [];
  const contains: Phone[] = [];

  for (const phone of filtered) {
    const name = normalize(phone.name);
    if (name.startsWith(q)) {
      startsWith.push(phone);
    } else if (name.includes(q)) {
      contains.push(phone);
    }
  }

  return [...startsWith, ...contains].slice(0, limit);
}

export function formatPhoneLabel(phone: Phone): string {
  return phone.brand === "Apple" ? "IPHONE" : phone.brand.toUpperCase();
}

export const PHONE_COUNT = PHONES.length;
