/**
 * User Schema
 * Tabela de usuários
 *
 * @author Davi Souto
 * @since 23/02/2020
 */
import Mongoose from 'Mongoose';

var userSchema = new Mongoose.Schema({
  name: String,
  email: String,
  location: {
    type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
    },
    coordinates: {
        type: [Number],
        default: [0, 0]
    }
  }
});

userSchema.index({location: '2dsphere'});

var UserSchema = Mongoose.model('User', userSchema);

export default UserSchema;