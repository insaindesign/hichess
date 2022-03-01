export interface EngineLevel {
  rating: number;
  randomness?: number;
  multipv: number;
  skill: number;
  id: number;
}

export const getLevelForRating = (rating: number): EngineLevel => {
  const rounded = Math.min(
    Math.max(Math.round(rating / 100) * 100, levels[0].rating),
    levels[levels.length - 1].rating
  );
  return levels.find((l) => rounded <= l.rating) as EngineLevel;
};

export const levels: EngineLevel[] = [
  {
    rating: 400,
    randomness: 0.9,
    multipv: 100,
    skill: 0,
  },
  {
    rating: 500,
    randomness: 0.8,
    multipv: 100,
    skill: 0,
  },
  {
    rating: 600,
    randomness: 0.68,
    multipv: 80,
    skill: 0,
  },
  {
    rating: 700,
    randomness: 0.56,
    multipv: 60,
    skill: 0,
  },
  {
    rating: 800,
    randomness: 0.45,
    multipv: 40,
    skill: 0,
  },
  {
    rating: 900,
    randomness: 0.35,
    multipv: 30,
    skill: 0,
  },
  {
    rating: 1000,
    randomness: 0.25,
    multipv: 20,
    skill: 0,
  },
  {
    rating: 1100,
    randomness: 0.15,
    multipv: 10,
    skill: 0,
  },
  {
    rating: 1200,
    multipv: 10,
    skill: 1,
  },
  {
    rating: 1400,
    multipv: 10,
    skill: 4,
  },
  {
    rating: 1600,
    multipv: 10,
    skill: 6,
  },
  {
    rating: 1800,
    multipv: 8,
    skill: 8,
  },
  {
    rating: 2000,
    multipv: 5,
    skill: 10,
  },
  {
    rating: 2200,
    multipv: 3,
    skill: 12,
  },
  {
    rating: 2400,
    multipv: 3,
    skill: 14,
  },
  {
    rating: 2600,
    multipv: 3,
    skill: 16,
  },
  {
    rating: 2800,
    multipv: 3,
    skill: 18,
  },
  {
    rating: 3000,
    multipv: 1,
    skill: 20,
  },
].map((l, id) => ({ ...l, id }));
