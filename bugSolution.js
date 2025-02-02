// Solution: Using Firebase's offline capabilities and proper error handling

// Enable persistence
firebase.initializeApp(firebaseConfig);
firebase.firestore().enablePersistence().catch(function(err) {
  if (err.code == 'failed-precondition') {
    // Multiple tabs open, persistence can only be enabled
    // in one tab at a a time.
    console.log("Persistence failed.");
  } else if (err.code == 'unimplemented') {
    // The current browser doesn't support all of the
    // features required to enable persistence
    console.log("Persistence not available.");
  }
});

// Use transactions or .set({merge: true}) for better error handling
// Set data and handle errors
db.collection('myCollection').doc('myDoc').set(data, {
  merge: true
}).then(() => {
  console.log('Data written successfully!');
}).catch((error) => {
  console.error('Error writing document:', error);
});

// Listen for changes and handle offline events
const unsubscribe = db.collection('myCollection').onSnapshot((snapshot) => {
  snapshot.docChanges().forEach(change => {
    if (change.type === 'added') {
      console.log('New document added:', change.doc.data());
    } else if (change.type === 'modified') {
      console.log('Document modified:', change.doc.data());
    } else if (change.type === 'removed') {
      console.log('Document removed:', change.doc.data());
    }
  });
}, (error) => {
  console.error("Error fetching data: ", error);
});

// Unsubscribe when done
unsubscribe();