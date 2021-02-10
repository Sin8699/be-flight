const passportJWT = require('passport-jwt');
const User = require('../models/user');

let ExtractJwt = passportJWT.ExtractJwt;
let JwtStrategy = passportJWT.Strategy;

let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = process.env.JWT_SECRET || '';
jwtOptions.issuer = 'vnbc@rip113';

module.exports = (passport) => {
  console.log('passport', passport);
  passport.use(
    new JwtStrategy(jwtOptions, async function (jwt_payload, done) {
      console.log('jwt payload received : ', jwt_payload);
      let user = await User.getUser({ id: jwt_payload.id });
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    })
  );
};
