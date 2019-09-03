/**
 * 配列をシャッフルする関数。もともとの配列に対しては影響を与えない
 * @param arr 配列
 */
const shuffleArray = <T>(arr: T[]): T[] => {
  const target = Array.from(arr);
  for (let i = target.length - 1; i >= 0; i--) {
    const rand = Math.floor(Math.random() * (i + 1));
    [target[i], target[rand]] = [target[rand], target[i]];
  }
  return target;
};

export default shuffleArray;
