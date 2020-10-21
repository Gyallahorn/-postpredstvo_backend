const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const quizSchema = new Schema({
    "_id": {
        "type": "object",
        "properties": {
          "$oid": {
            "type": "string"
          }
        },
        "required": [
          "$oid"
        ]
      },
      "test": {
        "type": "array",
        "items": [
          {
            "type": "array",
            "items": [
              {
                "type": "string"
              },
              {
                "type": "string"
              },
              {
                "type": "string"
              },
              {
                "type": "string"
              },
              {
                "type": "string"
              },
              {
                "type": "string"
              }
            ]
          },
          {
            "type": "array",
            "items": [
              {
                "type": "string"
              },
              {
                "type": "string"
              },
              {
                "type": "string"
              },
              {
                "type": "string"
              },
              {
                "type": "string"
              }
            ]
          },
          {
            "type": "array",
            "items": [
              {
                "type": "array",
                "items": [
                  {
                    "type": "string"
                  },
                  {
                    "type": "string"
                  }
                ]
              }
            ]
          }
        ]
      }
});



const Quiz = mongoose.model('Quiz', quizSchema);
module.exports = Quiz;