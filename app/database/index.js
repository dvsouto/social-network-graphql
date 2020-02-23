/**
 * MongoDB Connection
 *
 * @author Davi Souto
 * @since 23/02/2020
 */

import Mongoose from 'Mongoose';
import User from './schemas/user.js'

export default class Database {
    constructor(){
        this.db = Mongoose.connection;

        this.db.on('error', console.error);

        this.db.once('open', () => {
            console.log("Conectado com MongoDB !");
        });

        this.connect();
    }

    connect(){
        Mongoose.connect('mongodb://localhost:27017/');
    }

    ////////////////////////

    createUser(name, email){
        var user = new User({
            name: "Davi Souto",
            "email": "davi.souto@gmail.com"
        });

        user.save(function(err, user) {
          if (err) return console.error(err);
          console.dir(user);
        });
    }
}

/////////////////////////