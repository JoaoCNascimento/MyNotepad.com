const User = require('../models/user');
const authConfig = require('../config/auth.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { isEmail, isDate } = require('validator');
const maxTokenAge = 1920000;
const { checkCurrentUser } = require('../middleware/middleware')

module.exports = {

    home: (req, res) => {
        res.render('index');
    },

    //LOGIN CONTROLLERS
    login_get: (req, res) => {
        if (req.cookies.jwt) { res.redirect('/notepad'); }
        res.render('login');
    },

    login_post: async (req, res) => {
        const user = req.body;
        const salt = bcrypt.genSalt();
        //check if the user exists
        //case true, proceed with the validation
        //else, send back an error message to the frontend.

        await User.findOne({email: user.email})
        .then( async (_user) => {
            if (!_user) {
                return res.status(404).send({ error_message: "Senha e/ou email inválido(s)."})
            }

            let passwordCheck = await bcrypt.compare(user.password, _user.password);

            if (!passwordCheck){
                return res.status(401).send({ error_message: "Senha e/ou email inválido(s)."})
            }

            res.cookie('jwt', createToken(_user._id), {
                maxAge: maxTokenAge,
                httpOnly: true
            })

            return res.status(200).send({user: _user})

        })
        .catch((er) => {
            return res.status(500).send({ error_message: "Ocorreu um erro no servidor, tente novamente mais tarde."})
        });
    },

    log_out_get: (req, res) => {
        res.cookie('jwt', '', {
            expiresIn: 1,
            maxAge: 1
        });
        return res.status(200).redirect('/')
    },

    //SIGN UP CONTROLLERS
    sign_up_get: (req, res) => {
        if (req.cookies.jwt) { res.redirect('/notepad'); }
        res.render('cadastro');
    },

    sign_up_post: async (req, res) => {
        //check if there is a user registered with the entered email
        //case true, returns a error message
        //else, proceed with the validations.

        const user = req.body;
        user.email = user.email.toLowerCase();

        if (user.name.length <= 0) {
            return res.status(400).send({ error_message: "Por favor, preencha o campo de nome." })
        }

        if (!isDate(user.birthDate)) {
            return res.status(400).send({ error_message: "Data de nascimento inválida."})
        }

        if (!isEmail(user.email)) {
            return res.status(400).send({ error_message: "Endereço de email inválido." })
        }

        if (user.password.length < 6) {
            return res.status(400).send({ error_message: "A senha deve possuir pelo menos 6 caracteres." })
        }

        if(user.password != user.passwordConfirm){
            return res.status(400).send({ error_message: "As senhas inseridas não condizem." })
        }

        await User.findOne({
            email: user.email
        })
        .then( async (_user) => {
            if (_user) {
                return res.status(400).send({ error_message: "Email já está em uso."})
            }

            await User.create({ 
                name: user.name,
                email: user.email,
                birthDate: user.birthDate,
                password: user.password
             })
             .then((user) => {
                
                if(user){
                    res.cookie('jwt', createToken(user._id), {
                        maxAge: maxTokenAge,
                        httpOnly: true
                    })
                    return res.status(200).send({user: user});
                }
            })
            .catch((er) => {
                console.log(er);
                return res.status(500).send({ error_message: "Ocorreu um erro no servidor." })
            })
        })
    },

    delete_user: async (req, res) => {

        const user = await checkCurrentUser(req, res);
        const password = req.body.password;

        const authorization = await bcrypt.compare(password, user.password);

        if (authorization) {
            User.findByIdAndDelete({
                _id: user._id
            })
            .then(() => {
                res.cookie('jwt','', {
                    maxAge: 1
                })
                return res.status(200).send({ success: "Exclusão concluída com êxito!" });
            })
            .catch((er) => {
                console.log(er);
                return res.status(500).send({ error_message: "Erro no servidor." });
            })
        }
        else 
            return res.status(401).send({ error_message: "Solicitação não autorizada"});
    }
}   

function createToken( payload ) {
    return jwt.sign({
        payload
    }, authConfig.secret, {
        expiresIn: 86400,
    })
}