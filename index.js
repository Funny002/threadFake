'use script'

/**
 * 这是一个伪造的多线程。
 * 如果你不想用 worker 或者自己写一个可以试试
*/
function ThreadFake(options) {
  // 安全模式
  if (!(this instanceof ThreadFake)) {
    return new ThreadFake(options)
  }
  options = options || { state: true }
  // 任务队列
  let __queue = [];
  // 当前执行个数
  let __count = 0;
  // 空闲长度
  let __leisure_timeout;
  // 空闲次数
  let __leisure_count = 0;
  // 状态
  let __state = options.state;
  // 最多执行个数
  let __max = options.max || 10;
  // 摆钟
  let __clock = options.clock || 100;
  // 空闲列表
  let __leisure = options.leisure || [10, 30, 60, 60 * 10];

  function ThreadFunc() {
    // 暂停
    if (__state) {
      if (__queue.length) {
        if (__count < __max) {
          __count += 1;

          __leisure_count = 0;

          setTimeout(() => {
            const t = __queue.shift();

            const res = t.func();

            if (res && res.then) {
              res.then(function (data) {
                __count -= 1;

                t.callback && t.callback(data);
              })
            } else {
              __count -= 1;

              t.callback && t.callback(res);
            }
          })
          // 直接执行
          ThreadFunc();
        } else {
          // 等等一会 ~ 保持心跳时间
          setTimeout(ThreadFunc, __clock);
        }
      } else {
        __leisure_count = Math.min(__leisure.length, __leisure_count + 1);
        __leisure_timeout = setTimeout(ThreadFunc, __leisure[__leisure_count - 1] * 1000);
      }
    }
  }

  function getType(value) {
    return Object.prototype.toString.call(value).slice(8, -1)
  }

  function set(key, value) {
    const types = getType(value)

    if (!['leisure', 'max', 'clock'].includes(key)) {
      throw new Error(`[ThreadFake] set: ${key} not`)
    }

    if (['max', 'clock'].includes(key)) {
      if (types !== 'Number') {
        throw new Error(`[ThreadFake] set: ${key} value type error`)
      }

      if (key === 'max') {
        __max = value
      } else if (key === 'clock') {
        __clock = value
      }
    } else if (key === 'leisure') {
      if (types !== 'Array') {
        throw new Error(`[ThreadFake] set: ${key} value type error`)
      }

      __leisure = value

      __leisure_count = Math.min(__leisure.length, __leisure_count);
    }
  }

  function start() {
    __state = true

    if (__leisure_timeout) {
      clearTimeout(__leisure_timeout);
    }

    ThreadFunc();
  }

  function add(func, callback) {
    __queue.push({ func, callback });

    if (__leisure_timeout && __state) {
      clearTimeout(__leisure_timeout);

      ThreadFunc();
    }
  }

  function pause() {
    __state = false;

    clearTimeout(__leisure_timeout);
  }

  function quit() {
    __queue = [];

    __state = false;

    clearTimeout(__leisure_timeout);
  }

  if (__state) {
    ThreadFunc();
  }

  return { start, set, add, pause, quit }
}

module.exports = ThreadFake