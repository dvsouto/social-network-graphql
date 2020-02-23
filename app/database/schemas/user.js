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
});

var User = Mongoose.model('User', userSchema);

export default User;