// const Quiz = require('../models/test');
// const mongoose = require("mongoose");
// module.exports={
// getTests:async(res,req,next)=>{
//     jwt.verify(req.token, 'my_secret_key', async (err, data) => {
//         if (err) {
//             console.log(err);
//             return res.json({ msg: "invalid token", error: err });
//         }
//         userEmail = data.email;
//     });
//     Quiz.find( function (err, result) {
//         if (err) {
//             console.log("error!")
//             console.log(err);
//             return res.json({ msg: err });
//         }
//         else {
//             console.log(result.body);
//             return res.json(result);
//         }
//     });

// } 
// }