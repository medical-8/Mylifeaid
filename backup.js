const fs = require("fs");

const { initializeApp, cert } = require("firebase-admin/app");
const {
  getFirestore,
  Timestamp,
  GeoPoint,
  DocumentReference,
} = require("firebase-admin/firestore");

const serviceAccount = require(
  "C:\\Users\\luyan\\Downloads\\mylaid-f9947-firebase-adminsdk-fbsvc-826eff94ef.json"
);

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

function serialize(value) {
  if (value === null || value === undefined) {
    return value;
  }

  if (value instanceof Timestamp) {
    return {
      _type: "timestamp",
      value: value.toDate().toISOString(),
    };
  }

  if (value instanceof GeoPoint) {
    return {
      _type: "geopoint",
      latitude: value.latitude,
      longitude: value.longitude,
    };
  }

  if (value instanceof DocumentReference) {
    return {
      _type: "reference",
      path: value.path,
    };
  }

  if (Array.isArray(value)) {
    return value.map(serialize);
  }

  if (typeof value === "object") {
    const result = {};

    for (const [key, val] of Object.entries(value)) {
      result[key] = serialize(val);
    }

    return result;
  }

  return value;
}

async function exportCollection(collectionRef) {
  const snapshot = await collectionRef.get();

  const result = {};

  for (const doc of snapshot.docs) {
    console.log(`  Document: ${doc.ref.path}`);

    result[doc.id] = {
      ...serialize(doc.data()),
    };

    const subcollections = await doc.ref.listCollections();

    if (subcollections.length > 0) {
      result[doc.id].__subcollections = {};

      for (const subcollection of subcollections) {
        console.log(
          `    Subcollection: ${subcollection.path}`
        );

        result[doc.id].__subcollections[subcollection.id] =
          await exportCollection(subcollection);
      }
    }
  }

  return result;
}

async function main() {
  console.log("Starting Firestore backup...\n");

  const collections = await db.listCollections();

  console.log(
    `Found ${collections.length} top-level collection(s).\n`
  );

  const backup = {
    _metadata: {
      exportedAt: new Date().toISOString(),
      collections: collections.map((collection) => collection.id),
    },
    collections: {},
  };

  for (const collection of collections) {
    console.log(`Retrieving documents from ${collection.id}`);

    backup.collections[collection.id] =
      await exportCollection(collection);

    console.log(
      `Finished ${collection.id}: ${
        Object.keys(backup.collections[collection.id]).length
      } document(s)\n`
    );
  }

  fs.writeFileSync(
    "backupDB.json",
    JSON.stringify(backup, null, 2),
    "utf8"
  );

  console.log("=================================");
  console.log("Firestore backup completed!");
  console.log("=================================");
  console.log(
    `Saved to: ${process.cwd()}\\backupDB.json`
  );
}

main().catch((error) => {
  console.error("\nBackup failed:");
  console.error(error);
  process.exit(1);
});