import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import { db } from "src/app/config/firebaseInit.js";


/**
 * Provide collection name and document name and get all data fields
 * 
 * @param {string} collectionName - name of collection you want to retrieve document from
 * @param {string} docName - name of document you want to retrieve
 * @returns {object} - returns a JSON object with key value pairs of field name and field value
 */
async function getDocumentFieldsByDocumentName(collectionName, docName){
    // make a reference to specific document via collection name
    const docRef = doc(db, collectionName, docName);
    try{
        const docSnapshot = await getDoc(docRef);
        if (docSnapshot.exists()) {
            return docSnapshot.data();
        } else {
            console.log("No such document!");
            return null;
        }
    } catch(err){
        console.log(err);
        return null;
    }
}


/**
 * Provide collection name and get all document names
 * 
 * @param {string} collectionName - name of collection you want to retrieve document names from
 * @returns {array} - returns an array of document names
 */
async function getDocumentNamesByCollection(collectionName){
    const collectionRef = collection(db, collectionName);
    try{
        const querySnapshot = await getDocs(collectionRef);
        const documentNames = querySnapshot.docs.map(doc => doc.id);
        return documentNames;
    } catch(err){
        console.log(err);
        return null;
    }
}


/**
 * Provide collection name and get a JSON object with key value pairs of all documents and their data
 * 
 * @param {string} collectionName - name of collection you want to retrieve document names and data from
 * @returns {object} - returns a JSON object with key value pairs of document name and document data
 */
async function getAllDocumentNameAndDataByCollection(collectionName){
    const collectionRef = collection(db, collectionName);
    try{
        const querySnapshot = await getDocs(collectionRef);
        const documentData = querySnapshot.docs.reduce((acc, doc) => {
            acc[doc.id] = doc.data();
            return acc;
          }, {});
        return documentData;
    } catch(err){
        console.log(err);
        return null;
    }
}

export {getDocumentFieldsByDocumentName, getDocumentNamesByCollection, getAllDocumentNameAndDataByCollection};