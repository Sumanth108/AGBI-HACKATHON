const config = {};

config.development = {
    name: 'development',
    httpPort: 8080,
    httpsPort: 443,
    database: 'mongodb+srv://mark47jacobs:testSIMPLE@clusteforagbihealthcare.lhhvw.mongodb.net/TheMainDatabase?retryWrites=true&w=majority',
    secret: 'coolcake',
}
let envToExport = config.development;

module.exports = envToExport;