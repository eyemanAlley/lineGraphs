'use client';
import React, { useEffect, useState } from "react";
import AdminAnalytics from "src/app/adminAnalytics/page.jsx";
import UpdateVisualisation from "src/app/updateVisuals/page.jsx";
import CreateVisualisation from "src/app/createVisuals/page.jsx";
import ViewFeedback from "src/app/viewFeedback/page.jsx";
import VisualOverview from "src/app/visualOverview/page.jsx";
import HazardTape from "src/app/components/hazardTape";
import NavHeader from "src/app/components/navHeader";
import { useRouter } from "next/navigation";
import { FaPlus } from "react-icons/fa6";
import { GrUpdate } from "react-icons/gr";
import { VscFeedback } from "react-icons/vsc";
import { MdModeEdit } from "react-icons/md";
import { gsap } from "gsap";

const AdminDashboard = () => {
  // new state for storing user's email
  const [userEmail, setUserEmail] = useState("");
  const router = useRouter();
  const [activePage, setActivePage] = useState("adminpage");
  useEffect(() => {
    document.title = 'CIREGS - Admin';
    const user = JSON.parse(localStorage.getItem("user"));
    if(user == null ){
      router.push("/");
    } else{
      setUserEmail(user.email);
    }
  }, [router]);

  if (userEmail === "") {
    return null;
  }


   // Animations done in gsap
  const onEnterButtonGreen = ({ currentTarget }) => {
    gsap.to(currentTarget, { backgroundColor: "#5aa11d", scale: 1 });
  };

  const onPushButton = ({ currentTarget }) => {
    var tl = gsap.timeline();
    tl.to(currentTarget, { backgroundColor: "#3b82f6", scale: 0.95, duration: 0.1, ease: "power1.in" });
    tl.to(currentTarget, { backgroundColor: "#3b82f6", scale: 1, duration: 0.1, ease: "power1.out" });
  };
  
  const onLeaveButtonWhite = ({ currentTarget }) => {
    gsap.to(currentTarget, { backgroundColor: "#ffffff", scale: 1 });
  };

  // Sets the page to be rendered based on the active page state.


  // Renders the content of the admin dashboard page based on the active page state.
  // Uses imports from the other admin dashboard . src/app/.../page.jsx files.

  const renderContent = () => {
    switch (activePage) {
      case "createVisualisation":
        return <CreateVisualisation />;
      case "updateVisualisation":
        return <UpdateVisualisation />;
      case "viewFeedback":
        return <ViewFeedback />;
      case "visualOverview":
        return <VisualOverview />;
      default:
        return <CreateVisualisation />; // default page the dashboard page renders
    }
  };

  return (
    <>
    <NavHeader />
    <div className="h-screen w-[100%] bg-admin-img bg-cover" id="content">
      <div className="h-full w-full p-5 flex items-center">
        <div className="bg-white h-[80%] w-full flex rounded-lg">
          <div className="w-[10%] h-full bg-gray-50 rounded-l-lg border-r-2">
            <div className="h-[25%] flex items-center border-b-2 hover:bg-gray-200 rounded-tl-lg cursor-pointer" onClick={() => setActivePage("createVisualisation")}
            onMouseEnter={onEnterButtonGreen}
            onMouseLeave={onLeaveButtonWhite}
            onMouseDown={onPushButton}
            >
              <div className="w-full flex items-center justify-center">
                <FaPlus size={20}/>
              </div>
            </div>
            <div className="h-[25%] w-full flex items-center border-b-2 hover:bg-gray-200 cursor-pointer" onClick={() => setActivePage("updateVisualisation")}
            onMouseEnter={onEnterButtonGreen}
            onMouseLeave={onLeaveButtonWhite}
            onMouseDown={onPushButton}
            >
              <div className="w-full flex items-center justify-center">
                <GrUpdate size={20}/>
              </div>
            </div>
            <div className="h-[25%] w-full flex items-center border-b-2 hover:bg-gray-200 cursor-pointer"  onClick={() => setActivePage("viewFeedback")}
            onMouseEnter={onEnterButtonGreen}
            onMouseLeave={onLeaveButtonWhite}
            onMouseDown={onPushButton}
            >
              <div className="w-full flex items-center justify-center">
                <VscFeedback size={20}/>
              </div>
            </div>
            <div className="h-[25%] w-full flex items-center hover:bg-gray-200 rounded-bl-lg cursor-pointer"
            onMouseEnter={onEnterButtonGreen}
            onMouseLeave={onLeaveButtonWhite}
            onMouseDown={onPushButton}
            >
              <div className="w-full flex items-center justify-center">
                <MdModeEdit size={20}/>
              </div>
            </div>
          </div>
          <div className="w-[90%] h-full">
          <HazardTape />
            <div className="w-full flex justify-between border-b-2">
              <div className="p-2">
                <p className="text-xs">Admin / Dashboard</p>
              </div>
              <div className="p-2">
                <p className="text-xs">Currently logged in as {userEmail}</p>
              </div>

            </div>
            <div className="overflow-auto h-[90%]">
                <div className="w-full">{renderContent()}</div>
              </div>
          </div>

        </div>
      </div>
    </div>
    </>
  );
};
export default AdminDashboard;
