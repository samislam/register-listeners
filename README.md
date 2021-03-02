# register-listeners

register multiple event listeners at once for nodeJS.

# intro

Originally created in 24 - 01 - 2021


Normally, when you want to add multiple event listeners in JavaScript, you would do it like this:

```js
const server = app.listen(port) // say for example you're using expressJS

server.on("listening", ()=> log.info("listening on port 3000..."));
server.on("error", ()=> log.error("error! 🔥️"));
```

Using `register-listeners`:
```js
const server = app.listen(port)

registerListeners(server, {
	listening: ()=> log.info("listening on port 3000..."),
	error: ()=> log.error("error! 🔥️")
})
```

Using `register-listeners` is a lot cleaner if you're registering more and more event listeners.


# Usage

```js
registerListeners(on, obj)
```

| argument | Description |
| --- | --- |
| on  | The emitter that you want to listen for its' events, for example: the express server as shown in the example above. |
| obj | a key value pair representing the following: <br><br>the key: is the exact name of the event that you want to listen for.<br><br>the value: a callback function that you want to execute if that event was emitted. |

# Side note about the `log()` function
The `log.error()` and `log.info()` functions that I used in the code above is from [@samislam/log](https://www.npmjs.com/package/@samislam/log), it's a simple module that helps you to print colorful output to your console, which makes the development process a lot easier. to you can download it from [npm](https://www.npmjs.com/package/@samislam/log).