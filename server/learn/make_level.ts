// parse ascii into fen / level.
type Level = {
  fen: string;
  apples: string;
  walls: string;
};

const rank = ["a", "b", "c", "d", "e", "f", "g", "h"];
const file = [1, 2, 3, 4, 5, 6, 7, 8].reverse();
const obstacles = ["w", "a"];
const ignore = [".", ...obstacles];

const make = (ascii: string): Level => {
  const lines = ascii.split("\n");
  const color = lines.shift();
  const board = [];
  const apples = [];
  const walls = [];
  lines.forEach((line, ll) => {
    let row = "";
    let skipped = 0;
    for (let rr = 0; rr < line.length; rr++) {
      const square = rank[rr]+file[ll];
      if (ignore.includes(line[rr])) {
        if (obstacles.includes(line[rr])) {
          if (line[rr] === "a") {
            apples.push(square);
          } else {
            walls.push(square);
          }
        }
        skipped += 1;
      } else {
        if (skipped) {
          row += skipped;
        }
        row += line[rr];
        skipped = 0;
      }
    }
    if (skipped) {
      row += skipped;
    }
    board.push(row);
  });
  return {
    fen: [board.join("/"), color, '-', '-'].join(" "),
    apples: apples.join(" "),
    walls: walls.join(" "),
  };
};

const level = `w
wwwwwa..
awwwww..
a.wwwww.
...www.a
....w...
...BB...
www..www
wwwwwwww`;

console.log(make(level));
