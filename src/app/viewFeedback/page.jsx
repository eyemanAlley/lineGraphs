"use client";
import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from 'src/app/config/firebaseInit.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css';



const ManageUsers = () => {
    const [feedbackData, setFeedbackData] = useState([]);
    const [expandedFeedback, setExpandedFeedback] = useState({}); // Keep track of which feedback is expanded
  
    useEffect(() => {
      document.title = 'CIREGS - Admin / View Feedback';
      const fetchData = async () => {
        try {
          const feedbackCollection = collection(db, 'feedback'); // Get the 'feedback' collection from Firebase
          const snapshot = await getDocs(feedbackCollection);
  
          const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Map each document into snapshot
          setFeedbackData(data);
        } catch (error) {
          console.error('Error fetching feedback data:', error);
        }
      };
  
      fetchData();
    }, []);
  
    const handleExpandFeedback = (id) => {
      setExpandedFeedback((prev) => ({ ...prev, [id]: !prev[id] })); // Toggle the expanded state of the feedback
    };
  
    const handleViewLess = (id) => {
      setExpandedFeedback((prev) => ({ ...prev, [id]: false })); // Set the expanded state of the feedback to false
    };
    const handleDeleteAll = async () => {
      try {
        // Show confirmation dialog
        confirmAlert({
          title: 'Confirm Deletion',
          message: 'Are you sure you want to delete all data?',
          buttons: [
            {
              label: 'Yes',
              onClick: async () => {
                const feedbackCollection = collection(db, 'feedback');
                const snapshot = await getDocs(feedbackCollection); // Get all documents in the 'feedback' collection
  
                // Delete each document
                snapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
              });
  
                // Notify user on successful deletion
                toast.success('All data deleted successfully!');
              },
            },
            {
              label: 'No',
              // No action needed, just close the dialog
            },
          ],
        });
      } catch (error) {
        console.error('Error deleting data:', error);
        toast.error('Error deleting data. Please try again.');
      }
    };
  
    return (
      <div>
        <section class="py-1 bg-blueGray-50">
        <div class="">
          <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white ">
            <div class="rounded-t mb-0 px-4 py-3 border-0">
              <div class="">
                <div class="relative w-full px-4 max-w-full flex-grow flex-1">
                  <h3 class="font-semibold text-base text-black">
                    Feedback from Users!
                  </h3>
                </div>
                <div class="px-4 max-w-full flex-grow flex-1 text-right">
                  <button class="bg-red-500 text-white active:bg-red-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" onClick={handleDeleteAll}>
                    Delete all
                  </button>
                  <ToastContainer />
                </div>
              </div>
            </div>
          </div>
      </div>
        <div style={{ overflowY: 'auto', maxHeight: '500px' }} className='block w-full overflow-x-auto'>
          <table class="items-center w-full border-collapse text-blueGray-700  ">
            <thead class="thead-light ">
              <tr >
                <th class="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">Name</th>
                <th class="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">Email</th>
                <th class="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">Feedback</th>
              </tr>
            </thead>
            <tbody>
              {feedbackData.map(feedback => (
                <tr key={feedback.id}>
                  <td  style={{ padding: '8px' }}>{feedback.name}</td>
                  <td  style={{ padding: '8px' }}>{feedback.email}</td>
                  <td style={{ padding: '8px', maxWidth: '300px', wordWrap: 'break-word' }}>
                    {feedback.feedback.length <= 100
                      ? feedback.feedback
                      : (
                        <>
                          {expandedFeedback[feedback.id]
                            ? feedback.feedback
                            : `${feedback.feedback.slice(0, 100)}...`}
                          {' '}
                          {expandedFeedback[feedback.id]
                            ? <button style={{ color: 'red' }} onClick={() => handleViewLess(feedback.id)}>View Less</button>
                            : <button style={{ color: 'blue' }} onClick={() => handleExpandFeedback(feedback.id)}>View More</button>}
                        </>
                      )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      </div>
      
    );
  };
  
  export default ManageUsers;