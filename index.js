const express = require('express');
const app = express();
//config
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
//view engine
const handlebars = require('express-handlebars');
const Handlebars = require('handlebars');
//routes modules
const user = require('./routes/user');
const notepad = require('./routes/notepad');
//database credentials
const config = require('./config/config')

//static files
app.use('/public', express.static(__dirname + '/public'));

//view engine
app.engine('handlebars', handlebars({
    defaultLayout: 'main',
    partialsDir: './views/partials'
}));
app.set('view engine', 'handlebars');
Handlebars.registerPartial('header', '{{header}}');
Handlebars.registerPartial('footer', '{{footer}}');
Handlebars.registerPartial('nav', '{{nav}}');
//handlebars custom expressions
Handlebars.registerHelper('switchColor', (noteColor, selectColor) => {
    if (noteColor == selectColor) { return true; }
    return false;
})

//body-parser
app.use(express.json())

//middlewares
app.use(cookieParser())

//routes - start
app.use("/", user);
app.use("/notepad", notepad);
//404 handling
app.use((req, res, next)=>{
    res.status(404);

    if (req.accepts('html')) {
        return res.redirect('/');
    }

    if (req.accepts('json')) {
        return res.json({ error: "Not found"})
    }

    res.redirect('/')
});


//Database connection and app start.
mongoose.connect(config.connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true, 
    useCreateIndex: true
}).then().catch((er) => {
    console.log("Erro de conexão\n\n"+er);
});

app.listen(config.PORT, () => {
    console.log("Server is running at http://localhost:" + config.PORT);
})
