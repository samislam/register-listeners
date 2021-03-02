# register-listeners

register multiple event listeners at once for nodeJS.

# intro

Originally Updated on 25 - 01 - 2021

Normally, when you want to add multiple event listeners in JavaScript, you would do it like this:

```js
// say for example you're using MongooseJS
const connection = Mongoose.connection
connection.on("connecting", () => log.info('connecting to Database...'))
connection.on("reconnected", () => log.success('connection to database has been Re-Established successfully'))
connection.on("disconnected", () => log.warn('disconnected from database'))
connection.on("error", (error) => log.error(error.message))
// connection.on("connected", () => log.success('DB connection established'))
```

Using `register-listeners`:

```js
registerListener(Mongoose.connection, {
    connecting: () => log.info('connecting to Database...'),
    reconnected: () => log.success('connection to database has been Re-Established successfully'),
    disconnected: () => log.warn('disconnected from database'),
    error: (error) => log.error(error.message),
    // connected: () => log.success('DB connection established'),
})
```

Using `register-listeners` is a lot cleaner if you're registering more and more event listeners.

`register-listeners` helps you adding async callbacks too, which is very cool.

# Side note about the `log()` function

throughout this guide, I'll be using the `log()` functions from [@samislam/log](https://www.npmjs.com/package/@samislam/log), it's a simple module that helps you to print colorful output to your console, which makes the development and debugging process a lot easier. you can install it from [npm](https://www.npmjs.com/package/@samislam/log).

# Usage

```js
registerListeners(on, obj)
```

| argument | Description |
| --- | --- |
| on  |     |
| obj |     |

# Code sample

The following is optional to read, it's just to give you an idea of how an application could be structured using `register-listeners`.

in this code sample, I was creating a function that uses expressJS, it adds a service on port 3000 for serving HTTP requests. the purpose was to test `register-listeners`.

It was easier to use `register-listeners` to complete this job, all the code required for this one job is done in one code block, this code block is stored in an independant module called `app.js`.

all the processes of error handling (simple error handling to fit my case at that time) is done inside this single code block using `register-listeners`.

```js
const listen = (port) => {
  return new Promise((resolve, reject) => {
    const server = app.listen(port)
    registerListener(server, {
      // * for more events, see https://nodejs.org/api/net.html#net_class_net_server
      listening() {
        const message = `Listening on port ${port}...`
        log.info(message)
        resolve(server)
      },
      error: {
        async callback(error) {
          if (error.code === 'EADDRINUSE') {
            this.times = this.times - 1
            let message
            if (this.showErrMsg) {
              message = tc(`port ${port} is already in use`)
              log.error(message)
              this.showErrMsg = false
            }
            message = `trying to restart the service on port ${port}... attempts left ${this.times}`
            log.warn(message)
            // server.close()
            if (this.times !== 0) {
              setTimeout(() => server.listen(port), this.duration)
            } else {
              // prettier-ignore
              const error = new Error(tc(`port ${port} is already being used by another service, unable to start express app for service test`))
              reject(error)
            }
          }
        },
        properties: {
          times: 5,
          duration: 5000,
          showErrMsg: true,
        },
      },
    })
  })
}

```

# this documentation is not complete.