export interface IOptions {
  a: number;
}

export function test1(options: IOptions) {
  return options.a + 1;
}