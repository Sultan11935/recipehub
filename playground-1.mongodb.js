/* global use, db */
// MongoDB Playground

const database = 'recipehub';  // The database name you wish to use
use(database);

// Create a collection for Users
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['username', 'email', 'passwordHash'],
      properties: {
        AuthorId: {
          bsonType: 'int',
          description: 'unique identifier for the author, optional'
        },
        AuthorName: {
          bsonType: 'string',
          description: 'name of the author, optional'
        },
        username: {
          bsonType: 'string',
          description: 'must be a string and is required'
        },
        email: {
          bsonType: 'string',
          pattern: '^.+@.+$',
          description: 'must be a valid email and is required'
        },
        passwordHash: {
          bsonType: 'string',
          description: 'hashed password, required'
        },
        password: {
          bsonType: 'string',
          description: 'plain text password, optional'
        }
      }
    }
  }
});

// Create a collection for Recipes
db.createCollection('recipes', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['Name', 'AuthorId', 'RecipeIngredientQuantities', 'RecipeIngredientParts', 'RecipeInstructions'],
      properties: {
        RecipeId: {
          bsonType: 'double',
          description: 'unique identifier for the recipe'
        },
        Name: {
          bsonType: 'string',
          description: 'must be a string and is required'
        },
        AuthorId: {
          bsonType: 'int',
          description: 'must be an integer representing the author ID and is required'
        },
        AuthorName: {
          bsonType: 'string',
          description: 'name of the author, optional'
        },
        CookTime: {
          bsonType: 'string',
          description: 'string representing the cook time'
        },
        PrepTime: {
          bsonType: 'string',
          description: 'string representing the prep time'
        },
        TotalTime: {
          bsonType: 'string',
          description: 'string representing the total time required'
        },
        DatePublished: {
          bsonType: 'string',
          description: 'date the recipe was published in ISO format'
        },
        Description: {
          bsonType: 'string',
          description: 'brief description of the recipe'
        },
        Images: {
          bsonType: 'string',
          description: 'URL(s) of images, represented as a string'
        },
        RecipeCategory: {
          bsonType: 'string',
          description: 'category of the recipe'
        },
        Keywords: {
          bsonType: 'string',
          description: 'keywords associated with the recipe, represented as a string'
        },
        RecipeIngredientQuantities: {
          bsonType: 'string',
          description: 'ingredient quantities as a single string, required'
        },
        RecipeIngredientParts: {
          bsonType: 'string',
          description: 'ingredient names as a single string, required'
        },
        AggregatedRating: {
          bsonType: 'double',
          description: 'average rating for the recipe'
        },
        ReviewCount: {
          bsonType: 'double',
          description: 'count of reviews for the recipe'
        },
        Calories: {
          bsonType: 'double',
          description: 'calories per serving'
        },
        FatContent: {
          bsonType: 'double',
          description: 'fat content in grams'
        },
        SaturatedFatContent: {
          bsonType: 'double',
          description: 'saturated fat content in grams'
        },
        CholesterolContent: {
          bsonType: 'double',
          description: 'cholesterol content in milligrams'
        },
        SodiumContent: {
          bsonType: 'double',
          description: 'sodium content in milligrams'
        },
        CarbohydrateContent: {
          bsonType: 'double',
          description: 'carbohydrate content in grams'
        },
        FiberContent: {
          bsonType: 'double',
          description: 'fiber content in grams'
        },
        SugarContent: {
          bsonType: 'double',
          description: 'sugar content in grams'
        },
        ProteinContent: {
          bsonType: 'double',
          description: 'protein content in grams'
        },
        RecipeServings: {
          bsonType: 'double',
          description: 'number of servings'
        },
        RecipeYield: {
          bsonType: 'string',
          description: 'yield or output of the recipe'
        },
        RecipeInstructions: {
          bsonType: 'string',
          description: 'step-by-step instructions as a string, required'
        }
      }
    }
  }
});

// Create a collection for Reviews/Ratings
db.createCollection('ratings', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['RecipeId', 'AuthorId', 'Rating'],
      properties: {
        ReviewId: {
          bsonType: 'int',
          description: 'unique identifier for the review'
        },
        RecipeId: {
          bsonType: 'int',
          description: 'must be an integer representing the recipe ID, required'
        },
        AuthorId: {
          bsonType: 'int',
          description: 'must be an integer representing the author of the review, required'
        },
        AuthorName: {
          bsonType: 'string',
          description: 'name of the review author, optional'
        },
        Rating: {
          bsonType: 'int',
          minimum: 1,
          maximum: 5,
          description: 'integer representing the rating (1-5 stars), required'
        },
        Review: {
          bsonType: 'string',
          description: 'text review left by the user, optional'
        },
        DateSubmitted: {
          bsonType: 'string',
          description: 'date the review was submitted, ISO formatted string'
        },
        DateModified: {
          bsonType: 'string',
          description: 'date the review was modified, ISO formatted string'
        }
      }
    }
  }
});

// List collections to confirm creation
print("Collections in the database:");
printjson(db.getCollectionNames());
