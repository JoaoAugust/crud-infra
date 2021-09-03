var LocalStrategy   = require('passport-local').Strategy;

var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('./database');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        connection.query("SELECT * FROM usuarios WHERE id = ? ",[id], function(err, rows){
            done(err, rows[0]);
        });
    });

    passport.use(
        'local-signup',
        new LocalStrategy({
            usernameField : 'email',
            passwordField : 'senha',
            passReqToCallback : true
        },
        function(req, email, senha, done) {
            connection.query("SELECT * FROM usuarios WHERE email = ?",[email], function(err, rows) {
                if (err)
                    return done(err);
                if (rows.length) {
                    return done(null, false, req.flash('signupMessage', 'Esse email de usuário já existe'));
                } else {
                    var newUserMysql = {
                        email: email,
                        senha: bcrypt.hashSync(senha, null, null)
                    };

                    var insertQuery = "INSERT INTO usuarios ( email, senha ) values (?,?)";

                    connection.query(insertQuery,[newUserMysql.email, newUserMysql.senha],function(err, rows) {
                        newUserMysql.id = rows.insertId;

                        return done(null, newUserMysql);
                    });
                }
            });
        })
    );

    passport.use(
        'local-login',
        new LocalStrategy({
            usernameField : 'email',
            passwordField : 'senha',
            passReqToCallback : true
        },
        function(req, email, senha, done) {
            connection.query("SELECT * FROM usuarios WHERE email = ?",[email], function(err, rows){
                if (err)
                    return done(err);
                if (!rows.length) {
                    return done(null, false, req.flash('loginMessage', 'Usuário não existe'));
                }

                if (!bcrypt.compareSync(senha, rows[0].senha))
                    return done(null, false, req.flash('loginMessage', 'Senha incorreta'));

                return done(null, rows[0]);
            });
        })
    );
};
