const User = require("../models/User");

const bcrypt = require("bcryptjs"); // criptografia da senha

module.exports = class AuthController {

    static login(req, res) {
        res.render("auth/login");
    };

    static async loginPost(req, res) {
        const { email, password } = req.body;

        // find user
        const user = await User.findOne({ where: { email: email } });

        if (!user) {
            req.flash("message", "Usuário não encontrado!");
            res.render("auth/login");

            return;
        };

        // check if password math
        const passwordMath = bcrypt.compareSync(password, user.password);

        if (!passwordMath) {
            req.flash("message", "Senha inválida");
            res.render("auth/login");

            return;
        };

        // initialize session
        req.session.userid = user.id;

        req.flash("message", "Autenticado com sucesso!");

        req.session.save(() => {
            res.redirect("/");
        });
    };

    static register(req, res) {
        res.render("auth/register");
    };

    static async registerPost(req, res) {

        const { name, email, password, confPassword } = req.body;

        // password match validation
        if (name != null && email != null && password != null && confPassword != null) {

            if (password != confPassword) {

                // message
                req.flash("message", "As senhas não conferem, tente novamente!");
                res.render("auth/register");

                return;
            };

        } else {

            req.flash("message", "Preencha todos os campos corretamente!");
            res.render("auth/register");

            return;
        };

        // check if user exists
        const checkIfUserExists = await User.findOne({ where: { email: email } });

        if (checkIfUserExists) {

            req.flash("message", "O e-mail já está em uso!");
            res.render("auth/register");

            return;
        };

        // create a password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const user = {
            name,
            email,
            password: hashedPassword,
        };

        try {

            const createdUser = await User.create(user);

            // initialize session
            req.session.userid = createdUser.id;

            req.flash("message", "Cadastro realizado com sucesso!");

            req.session.save(() => {
                res.redirect("/");
            });

        } catch (err) {

            console.log(err);

        };

    };

    static logout(req, res) {

        req.session.destroy();

        res.redirect("/login");

    };
};
