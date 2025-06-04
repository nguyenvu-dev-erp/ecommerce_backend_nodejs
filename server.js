const app = require("./src/app");

const PORT = process.env.PORT || 3056;

const server = app.listen(PORT, () => {
    console.log(`WSV eComerce API start with port ${PORT}`);
})

process.on('SIGNINT', () => {
    server.close(() => {
        ("Exit Server Express");
    })
})