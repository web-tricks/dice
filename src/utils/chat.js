module.exports = (username, message) => {
    return {
        username,
        text: message,
        created: new Date().getTime()
    }
} 
