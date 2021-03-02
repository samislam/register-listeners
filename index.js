const check = require('@samislam/checktypes')

const register = (input) => {
    const { callback, type = 'on', event, on, properties } = input
    // prettier-ignore
    if (!callback) throw new Error(`a "callback" in a nested object syntax is always required, eg: callback: ()=>{...your code}`)
    const typeEnums = ['on', 'once']
    // prettier-ignore
    if(!typeEnums.includes(type.trim())) throw new Error(`type field enums: [${typeEnums}], value given: ${type.trim()}`)
    //Everything is okay,
    if (properties) {
        const cb = callback.bind(properties)
        on[type](event, cb)
    } else {
        on[type](event, callback)
    }
}

const shallowObject = (on, obj) => {
    const nested = {}
    for (const [event, value] of Object.entries(obj)) {
        if (check.isFunction(value) || check.isAsyncFunction(value)) on.on(event, value)
        else if (check.isObject(value)) nested[event] = value
        // prettier-ignore
        else throw new Error(`callback must be of type object or function, type given: ${check.typeOf(value)}`)
    }
    return nested
}

const nestedObject = (on, obj) => {
    for (const [event, nestedObject] of Object.entries(obj)) {
        let callback, type, properties
        for (const [nestedObjectKey, nestedObjectValue] of Object.entries(nestedObject)) {
            const message = `{#}. at { ${nestedObjectKey}: ${check.typeOf(nestedObjectValue)} }`
            switch (nestedObjectKey) {
                case 'callback':
                    // prettier-ignore
                    if(check.isAsycOrSyncFunc(check.throwErr({message}), nestedObjectValue)) 
                    callback = nestedObjectValue
                    break
                case 'type':
                    // prettier-ignore
                    check.isString(check.throwErr({message}), nestedObjectValue)
                    type = nestedObjectValue
                    break
                case 'properties':
                    // prettier-ignore
                    check.isObject(check.throwErr({message}), nestedObjectValue)
                    properties = nestedObjectValue
                    break

                default:
                    // prettier-ignore
                    throw new Error(`enums: [callback, type, properties], key given: ( ${nestedObjectKey} )`)
            }
        }
        register({ callback, type, event, on, properties })
    }
}

function registerListeners(on, obj) {
    const nested = shallowObject(on, obj)
    if (Object.keys(nested).length != 0) nestedObject(on, nested) // checking if the obj is not empty
}

module.exports = registerListeners

/* 
Updated at 25 - 01 - 2021
author : sam Islam
version: 2.0.0

 remember in the documentation to mention that you can't use arrow functions in nested objects

*/

