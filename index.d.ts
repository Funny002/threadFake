declare module 'ThreadFake' {
  class ThreadFake {
    constructor(options?: ThreadFakeOptions)
    quit(): void
    start(): void
    pause(): void
    set(key: 'leisure', value: number[]): void
    set(key: 'max' | 'clock', value: number): void
    add<T = any, V = any>(func: () => T, callback: (data?: V) => void): void
  }

  export interface ThreadFakeOptions {
    // 最大执行数量
    max: number;
    // 实例化后立马执行
    state: boolean;
    // 执行数量最大时开始 “摆钟”，等待一个线程空闲 1/ms
    clock: number;
    // 当队列中没有任务时，开始晋级休息 1/s
    leisure: number[];
  }

  export default ThreadFake;
}
