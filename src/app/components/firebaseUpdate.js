import { setDoc, doc, collection, addDoc } from "firebase/firestore";
import { set } from "lodash";
import { db } from "src/app/config/firebaseInit.js";

async function firebasePush(file, selectedOption) {
    const collectionName = Date.now() + "-" + selectedOption + "-csv";
    const collectionRef = collection(db, collectionName);
  
    for (const key of Object.keys(file)) {
      const docName = key.replace(/\s+/g, '-');
      const documentRef = doc(collectionRef, docName);
  
      const currentObject = { [key]: file[key].toString() };
  
      try {
        await setDoc(documentRef, currentObject, { merge: true });
        console.log(`${key} successfully written`);
      } catch (err) {
        console.error(err);
      } finally {
        console.log("Insert complete for", key);
      }
  
      // Delay required to prevent Firebase rate limiting
      await delay(2000);
    }
  
    console.log("Insert complete for all documents");
    return false;
  }

  async function firebaseAddDocumentToCollection(collectionName, objectToAdd, nameOfDocument){
    const collectionRef = collection(db, collectionName);
    const documentRef = doc(collectionRef, nameOfDocument);

    try{
      setDoc(documentRef, objectToAdd);
    } catch (err) {
      console.error(err);
    } finally {
      console.log("Insert complete for", objectToAdd);
    }
    
    await delay(2000);
    return false;
  }

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  export {firebasePush, firebaseAddDocumentToCollection};
