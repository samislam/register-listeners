function registerListeners(on, obj) {
    for (const [event, callback] of Object.entries(obj)) {
        on.on(event, callback)
    }
}
module.exports = registerListeners

/* 
created at: 24 - 01 - 2021
author : sam Islam
version: 1.0.0
 */
