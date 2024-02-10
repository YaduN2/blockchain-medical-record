import { phoneNumbers } from '@clerk/nextjs/api';
import mongosse from 'mongoose';



const schema = new mongosse.Schema({
    firstname: String,
    lastname: String,
    email: String,
    phoneNumbers: String,
    height: String,
    address: String,
    weight: String,
    hbd: Date,
    role: String,
    allergy: String,
    blood: String,
    recent: String,
    metamask: String
})

const model = mongosse.model('User', schema);
export default model;
