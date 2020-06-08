const ObjectId = require("mongodb").ObjectID;
const { validationResult } = require("express-validator");
const conn = require("./app");

exports.createPost = async (req, res) => {
  const client = await conn.conn();
  const db = client.db('api')
  try {
    const errors = validationResult(req);

    const title = req.body.title;
    const coverImage = req.body.coverImage;
    const excerpt = req.body.excerpt;
    const content = req.body.content;

    let tags = [];

    if(req.body.tags) {
      tags = req.body.tags.split(',')
    }


    const updatedAt = new Date();
    if (!errors.isEmpty()) {
      return res
        .status(422)
        .json({ message: "Validation failed, entered data" });
    }
    let result = await db.collection("posts").insertOne({
      title: title,
      coverImage: coverImage,
      excerpt: excerpt,
      content: content,
      tags: tags,
      updatedAt: updatedAt,
    });

    res.status(201).json({
      message: "Added!",
    });
  } catch (error) {
    console.log("error inserting data", error);
  }
};

exports.getPosts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10 ;
  const tag = req.query.tag;

  let findQuery = {}

  if (tag) {
    let _tags = tag.split(',')
    findQuery.tags =  { $in: _tags };
  }



  const client = await conn.conn();
  const db = client.db('api')
  try {
    let result = await db
      .collection("posts")
      .find(findQuery)
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    res.status(200).json({
      posts: result,
    });
  } catch (error) {
    res.sendStatus(404);
  }
};

exports.getPostbyID = async (req, res) => {
  const id = req.params.id;
  const client = await conn.conn();
  const db = client.db('api')
  try {
    console.log("db1o", db);
    let result = await db.collection("posts").findOne({ _id: ObjectId(id) });
    res.status(200).json({
      post: result,
    });
  } catch (error) {
    console.log("error getting data", error);
    console.log("dbo", db);
  }
};

exports.updatePost = async (req, res) => {
  const errors = validationResult(req);

  const title = req.body.title;
  const coverImage = req.body.coverImage;
  const excerpt = req.body.excerpt;
  const content = req.body.content;
  const id = req.params.id;


  let tags = [];

  if(req.body.tags) {
    tags = req.body.tags.split(',')
  }


  const updatedAt = new Date();
  const client = await conn.conn();
  const db = client.db('api')
  try {
    if (!errors.isEmpty()) {
      return res
        .status(422)
        .json({ message: "Validation failed, entered data" });
    }

    let result = await db.collection("posts").updateOne(
      { _id: ObjectId(id) },
      {
        $set: {
          title: title,
          coverImage: coverImage,
          excerpt: excerpt,
          content: content,
          tags: tags,
          updatedAt: updatedAt,
        },
      }
    );


    let newPost = null;
    if (result) {
      newPost = await db.collection('posts').findOne({ _id: ObjectId(id)})

    }

  
    res.status(200).json({
      post: newPost,
    });
        
  } catch(error) {
    console.log("error", error);

  }
};

exports.deletePost = async (req, res) => {
  const id = req.params.id;
  const client = await conn.conn();
  const db = client.db('api')
  try {
    let result = await db.collection("posts").deleteOne({ _id: ObjectId(id) });

    res.status(200).json({
      post: result,
    });
  } catch (e) {
    console.log("Error connection mongodb");
    res.status(500).json({
      error: "Error Post is not deleted",
    });
  }
};

