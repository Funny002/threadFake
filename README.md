# threadFake

> This is a fake multithreading  
> 这是一个伪造的多线程


``` javascript
const thread = new ThreadFake();

callback = index => {
  console.log('index ->>', index)
}

for (let i = 0; i < 200; i++) {
  thread.add(() => {
    if (Math.floor(Math.random() * 100) % 2 === 0) {
      return i
    } else {
      return new Promise((resolve, reject) => {
        try {
          setTimeout(() => {
            resolve(i)
          }, 1000)
        } catch (e) {
          reject(e)
        }
      })
    }
  }, callback)
}
```
