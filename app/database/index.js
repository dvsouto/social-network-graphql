/**
 * MongoDB Connection
 *
 * @author Davi Souto
 * @since 23/02/2020
 */

import mongoose from 'mongoose';
import UserSchema from 'app/database/schemas/user'

export default class Database {
    constructor(){
        this.db = mongoose.connection;

        this.db.on('error', console.error);

        this.db.once('open', () => {
            console.log("Conectado com MongoDB !");
        });

        this.connect();
    }

    connect(){
        mongoose.connect('mongodb://localhost:27017/social-network', { 
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    }

    ////////////////////////

    // createUser(name, email){
    //     var user = new User({
    //         name: "Davi Souto",
    //         "email": "davi.souto@gmail.com"
    //     });

    //     user.save(function(err, user) {
    //       if (err) return console.error(err);
    //       console.dir(user);
    //     });
    // }
}

export {
    UserSchema,
}

/////////////////////////
