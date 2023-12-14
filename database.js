const { MongoClient, ObjectId } = require("mongodb");
const Client = new MongoClient(process.env.DB_URL);
const dotenv = require("dotenv");
dotenv.config();
const Db = Client.db(process.env.DB_NAME);
const Collection = Db.collection(process.env.DB_COLLECTION);

module.exports = { Client, Collection, ObjectId };
