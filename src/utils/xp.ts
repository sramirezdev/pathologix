export const getLevelFromXP = (xp: number): number => {
  let level = 1, required = 100, accumulated = 0;
  while (accumulated + required <= xp) {
    accumulated += required;
    level++;
    required = level * 100;
  }
  return level;
};

export const getXPProgress = (xp: number) => {
  const level = getLevelFromXP(xp);
  let accumulated = 0;
  for (let i = 1; i < level; i++) accumulated += i * 100;
  return { level, current: xp - accumulated, required: level * 100 };
};
