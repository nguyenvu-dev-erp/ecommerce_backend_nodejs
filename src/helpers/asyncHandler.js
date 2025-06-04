'use strict'

const asyncHandler = fn => {
    return (req, res, next) => {
        console.log('asyncHandler')
        fn(req, res, next).catch(next)
    } 
}

module.exports = {
    asyncHandler,
}