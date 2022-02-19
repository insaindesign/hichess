import { createReadStream, writeFile } from "fs";
import { parse } from "csv-parse";

import db, { writeBatchQueue } from "../db";

type Row = {
  PuzzleId: string;
  FEN: string;
  Moves: string;
  Rating: string;
  RatingDeviation: string;
  Themes: string;
};

type Puzzle = {
  id: string;
  fen: string;
  solution: string;
  rating: number;
  themes: string;
};

// max 20000/day
const start = 60000;
const MAX = 20000;

const writeToFirebase = false;

const write = (data: any[]) => {
  data.slice(start, start + MAX).forEach((row) => {
    writeBatchQueue().set(db.collection("puzzle").doc(row.id), row);
  });
  console.log("writing from", start, "to", start + MAX);
  writeBatchQueue(true);
};

const themes = new Set();
const groupThemes = [
  "capturingDefender",
  "doubleCheck",
  "sacrifice",
  "hangingPiece",
  "trappedPiece",
  "pin",
  "skewer",
  "xRayAttack",
  "fork",
  "defensiveMove",
  "oneMove",
  "mateIn1",
  "mateIn2",
  "mateIn3",
  "promotion",
  "enPassant",
  "discoveredAttack",
];
const themeFilter = new RegExp('\\b('+groupThemes.join("|")+')\\b', 'gi');

const toJSONString = (arr) => {
  const out = {
    head: Object.keys(arr[0]),
    body: arr.map(obj => Object.values(obj))
  }
  return JSON.stringify(out);
}

const doWrite = <T>(obj: [T], key: string) => {
  writeFile(
    __dirname + "/data/" + key + ".json",
    toJSONString(obj),
    "utf-8",
    (err) => {
      if (err) {
        console.log('err', err);
      }
    }
  );
};

const writeEach = (obj) => {
  Object.keys(obj).forEach((key) => doWrite(obj[key], key));
}

const parser = parse({ columns: true }, function (err, data: Row[]) {
  console.log("loaded", data.length);
  const filtered = data
    .map((row) => {
      row.Themes.split(" ").forEach((t) => themes.add(t));
      return row;
    })
    .filter((row) => Boolean(row.Themes.match(themeFilter)))
    .filter((row) => parseInt(row.Rating, 10) < 1000)
    .map(
      (row) =>
        ({
          id: row.PuzzleId,
          fen: row.FEN,
          solution: row.Moves,
          rating: parseInt(row.Rating, 10),
          themes: row.Themes,
        } as Puzzle)
    );
  console.log("filtered", filtered.length);

  const groupedThemeRating = {};
  const groupedRating = {};
  const usedIds = {};
  filtered.forEach((puzzle) => {
    const themes = puzzle.themes.split(" ");
    groupThemes.forEach((theme) => {
      if (!themes.includes(theme) || usedIds[puzzle.id]) {
        return;
      }
      const rating = puzzle.rating >= 700 ? Math.floor(puzzle.rating / 100) * 100 : 600;
      const key = theme + "-" + rating;
      if (!groupedThemeRating[key]) {
        groupedThemeRating[key] = [];
      }
      if (!groupedRating[rating]) {
        groupedRating[rating] = [];
      }
      if (groupedThemeRating[key].length < 1000) {
        usedIds[puzzle.id] = true;
        groupedThemeRating[key].push(puzzle);
        groupedRating[rating].push(puzzle);
      }
    });
  });
  writeEach(groupedThemeRating);
  writeEach(groupedRating);
  console.log("loaded rows", data.length, Object.keys(usedIds).length);
  if (writeToFirebase) {
    write(filtered);
  }
});

const run = () => createReadStream(__dirname + "/data/puzzles.csv").pipe(parser);

export default run;
