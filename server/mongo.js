const { MongoClient, ObjectId } = require("mongodb");

class MongoDB {
  constructor() {
    this.connectionString = `mongodb://mongo:27017/todoDB`;
  }

  async connectClient() {
    this.client = await MongoClient.connect(this.connectionString, {
      useNewUrlParser: true
    });
  }

  async insertTodoItem(todoItem) {
    await this.connectClient();
    try {
      const db = this.client.db("todoDB");
      const collectionName = db.collection("tasks");
      return await collectionName.insertOne(todoItem);
    } finally {
      this.client.close();
    }
  }

  async getTodos() {
    await this.connectClient();
    try {
      const db = this.client.db("todoDB");
      const collectionName = db.collection("tasks");
      return await collectionName.find({}).toArray();
    } finally {
      this.client.close();
    }
  }

  async deleteTodo(id) {
    console.log("TCL: MongoDB -> deleteTodo -> id", id);
    await this.connectClient();
    try {
      const db = this.client.db("todoDB");
      const collectionName = db.collection("tasks");
      const query = { _id: ObjectId(id) };
      return await collectionName.deleteOne(query);
    } finally {
      this.client.close();
    }
  }

  async markTodo(todoItem) {
    await this.connectClient();
    try {
      const db = this.client.db("todoDB");
      const collectionName = db.collection("tasks");
      const query = { _id: ObjectId(todoItem.id) };
      const newvalues = { $set: { checked: todoItem.checked } };
      return await collectionName.updateOne(query, newvalues);
    } finally {
      this.client.close();
    }
  }
}

export const mongo = new MongoDB();
