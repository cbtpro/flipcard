/**
 *
 * @param now 当前时间，默认为当前时间
 * @description 获取当前时间的数组表示，格式为 [h1, h2,
 * @returns
 */
export function getTimeArr(now = new Date()) {
  // const Y = now.getFullYear()
  // const M = now.getMonth() + 1
  // const D = now.getDate()
  const h = now.getHours();
  const m = now.getMinutes();
  const s = now.getSeconds();
  return [
    // ...toArr(Y),
    // ...toArr(M),
    // ...toArr(D),
    ...toArr(h),
    ...toArr(m),
    ...toArr(s)
  ];
}

/**
 * 将数字转换为数组
 * @param n 数字
 * @returns 数字数组
 */
export function toArr(n: number): number[] {
  return n >= 10 ? ('' + n).split('').map(item => Number(item)) : [0, n];
}
