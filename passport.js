const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const LocalStrategy = require("passport-local").Strategy;
const { JWT_SECRET } = require("./configuration/index");
const User = require("./models/user");

// JSON WEB TOKEN STRATEGY
passport.use(
    new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromHeader("authorization"),
            secretOrKey: JWT_SECRET
        },
        async (payload, done) => {
            try {
                // Find the client specifire in token
                const client = await Client.findById(payload.sub);

                // If client doesn't exist, handle it
                if (!client) {
                    return done(null, false);
                }

                // Otherwise, return the client
                done(null, client);
            } catch (error) {
                done(error, false);
            }
        }
    )
);

// LOCAL STRATEGY
passport.use(
    new LocalStrategy(
        {
            usernameField: "email"
        },
        async (email, password, done) => {
            try {

                // Find the client given the email
                const user = await User.findOne({ email });

                // If not, handle it
                if (!user) {
                    return done(null, false);
                    //#TODO status code response
                }

                // Check is the passport is correct
                console.log("password" + password)
                const isMatch = await client.isValidPassword(password);
                console.log(isMatch);



                // If not, handle it
                if (!isMatch) {
                    console.log("unexpected error")
                    return done(null, false);


                    //todo status code response
                }

                // Otherwise return the client
                done(null, client);
            } catch (error) {
                done(error, false);
            }
        }
    )
);
