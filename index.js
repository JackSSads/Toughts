const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const flash = require("express-flash");

const app = express();

const conn = require("./db/conn");

// Models
const Tougth = require("./models/Tought");
const User = require("./models/User");

// Import Routes
const toughtsRoutes = require("./routes/toughtsRoutes");
const authRoutes = require("./routes/authRoutes");

// Iport ToughtController
const ToughtsController = require("./controllers/ToughtsController");

// template engine
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

// receber respota do body
app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(express.json());


// session middlewares
app.use(
    session({
        name: 'session',
        secret: 'nosso_secret',
        resave: false,
        saveUninitialized: false,
        store: new FileStore({
            logFn: function () { },
            path: require('path').join(require('os').tmpdir(), 'sessions'),
        }),
        cookie: {
            secure: false,
            maxAge: 3600000,
            expires: new Date(Date.now() + 3600000),
            httpOnly: true,
        },
    }),
);

// flash messages
app.use(flash());

// public path
app.use(express.static("public"));

// set session to res
app.use((req, res, next) => {

    if (req.session.userid) {
        res.locals.session = req.session;
    };

    next();
});

// Routes
app.use("/toughts", toughtsRoutes);
app.use("/", authRoutes);

app.get("/", ToughtsController.showToughts);

conn
    //.sync({force: true})
    .sync()
    .then(() => { app.listen(3000); })
    .catch((error) => { console.log(error); });