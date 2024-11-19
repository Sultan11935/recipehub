/* global use, db */
// MongoDB Playground

const database = 'recipehub';  // The database name you wish to use
use(database);

// Create Users Collection with Schema
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["AuthorId", "username", "email", "passwordHash"],
      properties: {
        AuthorId: {
          bsonType: "number",
          description: "must be a number and is required"
        },
        AuthorName: {
          bsonType: "string",
          description: "optional name of the author"
        },
        username: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        email: {
          bsonType: "string",
          pattern: "^.+@.+$",
          description: "must be a valid email and is required"
        },
        passwordHash: {
          bsonType: "string",
          description: "must be a string and is required"
        }
      }
    }
  }
});

// Create Recipes Collection with Schema
db.createCollection("recipes", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["RecipeId", "Name", "user"],
      properties: {
        RecipeId: {
          bsonType: "number",
          description: "must be a unique number and is required"
        },
        Name: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        user: {
          bsonType: "objectId",
          description: "reference to the User who created the recipe"
        },
        CookTime: { bsonType: "string" },
        PrepTime: { bsonType: "string" },
        TotalTime: { bsonType: "string" },
        DatePublished: { bsonType: "string" },
        Description: { bsonType: "string" },
        Images: { bsonType: "array", items: { bsonType: "string" } },
        RecipeCategory: { bsonType: "string" },
        Keywords: { bsonType: "array", items: { bsonType: "string" } },
        RecipeIngredientQuantities: { bsonType: "string" },
        RecipeIngredientParts: { bsonType: "string" },
        AggregatedRating: { bsonType: "number" },
        ReviewCount: { bsonType: "number" },
        Calories: { bsonType: "number" },
        FatContent: { bsonType: "number" },
        SaturatedFatContent: { bsonType: "number" },
        CholesterolContent: { bsonType: "number" },
        SodiumContent: { bsonType: "number" },
        CarbohydrateContent: { bsonType: "number" },
        FiberContent: { bsonType: "number" },
        SugarContent: { bsonType: "number" },
        ProteinContent: { bsonType: "number" },
        RecipeServings: { bsonType: "number" },
        RecipeYield: { bsonType: "string" },
        RecipeInstructions: { bsonType: "string" }
      }
    }
  }
});

// Create Ratings Collection with Schema
db.createCollection("ratings", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["ReviewId", "recipe", "user", "Rating"],
      properties: {
        ReviewId: {
          bsonType: "number",
          description: "must be a unique number and is required"
        },
        recipe: {
          bsonType: "objectId",
          description: "reference to the Recipe being reviewed"
        },
        user: {
          bsonType: "objectId",
          description: "reference to the User who created the rating"
        },
        Rating: {
          bsonType: "number",
          minimum: 1,
          maximum: 5,
          description: "must be a number between 1 and 5 and is required"
        },
        Review: { bsonType: "string" },
        DateSubmitted: { bsonType: "date", default: Date.now },
        DateModified: { bsonType: "date" }
      }
    }
  }
});

// List collections to confirm creation
print("Collections in the database:");
printjson(db.getCollectionNames());
