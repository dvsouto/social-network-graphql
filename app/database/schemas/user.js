/**
 * User Schema
 * Tabela de usuários
 *
 * @author Davi Souto
 * @since 23/02/2020
 */
import mongoose from 'mongoose';

var userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true },
  document: { type: String, required: true },
  password: { type: String, required: true },
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

/**
 * @TODO
 * Criar campos:
 *  - password
 *  - token
 *  - reset_password_token
 *  - confirmation_code
 *  - login_tentatives
 *  - retry_login_time
 *  - status (1 = active / 2 = inactive / 3 - wait_confirm / 4 = temp_ban)
 *  - ban_reason
 *  - ban_time
 *  - biography
 *  - photo
 *  - genre
 *  - filter_genre
 *  - filter_distance
 *  - account_type [default: normal] (normal / pro / admin)
 */

userSchema.index({location: '2dsphere'});

var UserSchema = mongoose.model('User', userSchema);

export default UserSchema;
