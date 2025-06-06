import { MongoClient, Db, ServerApiVersion } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}
// MONGODB_DB_NAME is optional, can be specified in URI or here.
// If specified here, it overrides the one in URI if present.
// const dbName = process.env.MONGODB_DB_NAME; 

const uri = process.env.MONGODB_URI;

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Extending the global NodeJS namespace to declare a MongoDB client promise variable.
// This helps in reusing the MongoDB client instance across multiple hot reloads in development,
// preventing the creation of too many connections.
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, {
     serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
  });
  clientPromise = client.connect();
}

export async function getDb(databaseName?: string): Promise<Db> {
  const mongoClient = await clientPromise;
  // If MONGODB_DB_NAME is set, use it. Otherwise, the DB name must be in the URI.
  // If a databaseName arg is passed, it takes precedence.
  const dbToUse = databaseName || process.env.MONGODB_DB_NAME;
  if (!dbToUse && !mongoClient.options.dbName) {
     throw new Error(
      'MongoDB database name not found. Please set MONGODB_DB_NAME environment variable or include it in your MONGODB_URI, or pass it to getDb().'
    );
  }
  return mongoClient.db(dbToUse);
}

// Optional: export clientPromise if you need to access the MongoClient instance directly
export { clientPromise };
