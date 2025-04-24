const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;


// Creamos la instancia de Express
const app = express();

// Configuramos el middleware de sesion y Passport
app.use(session({ secret: 'clave', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// --- Configurar Passport con Google ---
passport.use(new GoogleStrategy({
  clientID: '386509328621-gm31oef54aandap26aotbnijijgfr0cb.apps.googleusercontent.com', //Lo conseguimos con el cliente de Google Console
  clientSecret: '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', //En el caso de ser un trabajo real y no un trabajo practico, guardaria todo en variables de entorno en mi archivo .env.
  callbackURL: '/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile); // En una aplicacion real, guardaria el usuario en la base de datos y lo buscaria por su id.
  // En este caso, solo lo guardamos en la sesion
}));

passport.serializeUser((user, done) => done(null, user)); //Guardamos el usuario en la sesion 
passport.deserializeUser((obj, done) => done(null, obj)); //Lo recuperamos de la sesion

// Ruta inicial, donde mostramos un mensaje de bienvenida y un enlace para iniciar sesión con Google
app.get('/', (req, res) => {
  res.send(`<h2>Bienvenido</h2><a href="/auth/google">Iniciar sesión con Google</a>`);
});
//Ruta de inicializacion de sesion con Google, donde se redirige al usuario a la pagina de inicio de sesion de Google
//Una vez que el usuario inicia sesion, Google redirige a la ruta de callback que hemos definido en la estrategia de Google
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] })
);

//Ruta de callback, donde se recibe el token de Google y se redirige al usuario a la pagina de perfil
//Si la autenticacion falla, se redirige a la pagina de inicio
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => res.redirect('/perfil')
);
//Si la autenticacion es exitosa, se redirige a la pagina de perfil donde se muestra el nombre del usuario y un enlace para cerrar sesion
//Si la autenticacion falla, se redirige a la pagina de inicio
app.get('/perfil', (req, res) => {
  if (!req.user) return res.redirect('/');
  res.send(`<h2>Hola, ${req.user.displayName}</h2><a href="/logout">Cerrar sesión</a>`);
});
//Cerramos la sesion y volvemos al inicio
app.get('/logout', (req, res) => {
  req.logout(() => res.redirect('/'));
});

app.listen(3000, () => console.log('Servidor en http://localhost:3000'));
