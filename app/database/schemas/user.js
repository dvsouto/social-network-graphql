/**
 * User Schema
 * Tabela de usuários
 *
 * @author Davi Souto
 * @since 23/02/2020
 */
import mongoose from 'mongoose';

var userSchema = new mongoose.Schema({
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

var UserSchema = mongoose.model('User', userSchema);

export default UserSchema;
