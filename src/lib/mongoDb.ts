import mongoose from 'mongoose';
import model from './schema';
import { MongoClient } from 'mongodb';
import { connect } from 'http2';

type Tuser = {
  firstname: string,
  lastname: string,
  email: string,
  phone: string,
  height: string,
  address: string,
  weight: string,
  hbd: Date,
  role: string,
  allergy: string,
  blood: string,
  recent: string,
  metamask: string,
}


let db: mongoose.Connection;

async function connectToDb() {
  const pass = process.env.MONGO_PASS;
  const user = process.env.MONGO_USER;

  if (db) {
    return;
  }

  try {
    const client = await mongoose.connect(`mongodb+srv://${user}:${pass}@cluster0.wxjmfne.mongodb.net/?retryWrites=true&w=majority`);
    db = client.connection;
    console.log('Connected to database');
  } catch (err) {
    console.log(err);
  }
}

export async function createUser(data: Tuser) {
  await connectToDb();
  const user = await model.findOne({metamask: data.metamask});

  try {
    if (user) {
      await model.updateOne(data, {metamask: data.metamask});
    } else {
      const newUser = new model(data);
      await newUser.save();
    }
  } catch (err) {
    console.log(err);
  }
}

export async function getUser(metamask: string) {
  await connectToDb();
  const user = await model.findOne({metamask});
  return user;
}