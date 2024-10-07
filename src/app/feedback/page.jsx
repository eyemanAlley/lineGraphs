'use client';
import React, { useEffect, useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "src/app/config/firebaseInit.js";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavHeader from "src/app/components/navHeader";

const FeedbackForm = () => {

  useEffect(() => { 
    document.title = 'CIREGS - Submit Feedback';
  },[]);

  const [formData, setFormData] = useState({ // Initialize form data
    name: "",
    email: "",
    feedback: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value, // Update form data with the user's input
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Name cannot be empty.');
      return;
    }

    if (formData.name.length > 30) {
      toast.error('Name must be at most 30 characters.'); // Show error message if name exceeds 30 characters
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex for email validation
    if (formData.email.length > 60 || !emailRegex.test(formData.email)) {
      toast.error('Invalid email format or exceeds 60 characters.'); // Show error message if email exceeds 30 characters or is invalid
      return;
    }

    try {
      // Add the feedback to the 'feedback' collection in Firebase
      const docRef = await addDoc(collection(db, "feedback"), formData);
      console.log("Feedback added with ID: ", docRef.id); // Print the ID of the newly added feedback

      // Clear the form after submission
      setFormData({
        name: "",
        email: "",
        feedback: "",
      });
      toast.success('Feedback submitted successfully!'); // Show success message if feedback submission is successful
    } catch (error) {
      console.error("Error adding feedback: ", error); // Show error message if feedback submission fails
    }
  };

  return (
    <>
    <NavHeader />
    <div className="grid grid-cols-5 grid-rows-5 gap-4 h-screen bg-white  h-screen bg-landing-img bg-cover">
        <div className="col-span-3 row-span-4 col-start-2 mt-20 pt-20">
            <form onSubmit={handleSubmit} class="max-w-sm mx-auto p-t 10">
            <label for="website-admin" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label> 
            <div class="flex">
                <span class="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                    <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
                    </svg>
                </span>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    id="website-admin"
                    class="rounded-none rounded-e-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="John Doe"
                />
            </div>
            <br />
            <label for="website-admin" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email:</label>
            <div class="flex">
                <span class="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
                    <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z"/>
                    <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z"/>
                </svg>
                </span>
                <input
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    id="website-admin"
                    class="rounded-none rounded-e-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="JohnDoe@outlook.com"
                />
            </div>
            <br />
                <label for="message" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your message:</label>
                <textarea name="feedback" rows="10" value={formData.feedback} onChange={handleChange} class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Leave a comment..." />
            <br />
            <ToastContainer />
            <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Submit Feedback</button>
            </form>
        </div>
    </div>
    </>
  );
};

export default FeedbackForm;