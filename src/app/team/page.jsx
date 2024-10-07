'use client';
import NavHeader from "src/app/components/navHeader";
import React, { useEffect } from "react";
import ImageComponent from "../components/imageComponent";

const Team = () => {

  useEffect(() => {
    document.title = 'CIREGS - Team';
  }
    , []);


  return (
    <>
      <NavHeader />
      <div className="bg-landing-img">
        <div className="text-center pt-20">
          <h1 className={`text-8xl text-[#DDFEBC] pl-6 ml-6 w-[80% font-montserrat]`}>Meet The Team</h1>
        </div>
        <div className="grid justify-items-center">
          <div className="flex">

          <div className="p-10 text-center flex-1 relative backdrop-blur-sm hover:backdrop-blur hover:border border-transparent hover:border-gray-500 transition-all">
              <div className="flex flex-col items-center p-4">
                <ImageComponent
                  placeholderSrc={"/img/Empty.png"}
                  src="/img/alexandre-canet.jpg"
                  alt="Photo of Alexandre Canet"
                  width={250}
                  height={250}
                />
                <div className="pt-2 absolute text-white bottom-0 font-mono text-center">
                  <h2 className="font-bold">Alexandre Canet</h2>
                  <p className="text-xs italic">
                    Research associate at Cardiff University
                  </p>
                </div>
              </div>
            </div>

            <div className="p-10 text-center flex-1 relative backdrop-blur-sm hover:backdrop-blur hover:border border-transparent hover:border-gray-500 transition-all">
              <div className="flex flex-col items-center p-4">
                <ImageComponent
                  placeholderSrc={"/img/Empty.png"}
                  src="/img/ali-al-wakeel.jpg"
                  alt="Photo of Ali Al-Wakeel"
                  width={250}
                  height={250}
                />
                <div className="pt-2 absolute text-white bottom-0 font-mono text-center">
                  <h2 className="font-bold">Ali Al-Wakeel</h2>
                  <p className="text-xs italic">
                    PhD Researcher at Cardiff University
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
        <div className="text-center">
        </div>
        <div className="grid justify-items-center">
          <div className="flex">

            <div className="p-10 text-center flex-1 relative backdrop-blur-sm hover:backdrop-blur hover:border border-transparent hover:border-gray-500 transition-all">
              <div className="flex flex-col items-center p-4">
                <ImageComponent
                  placeholderSrc={"/img/Empty.png"}
                  src="/img/meysam-qadrdan.jpg"
                  alt="Photo of Meysam Qadrdan"
                  width={250}
                  height={250}
                />
                <div className="pt-2 absolute text-white bottom-0 font-mono text-center">
                  <h2 className="font-bold">Meysam Qadrdan</h2>
                  <p className="text-xs italic">
                    Professor in Energy Networks and Systems
                  </p>
                </div>
              </div>
            </div>

            <div className="p-10 text-center flex-1 relative backdrop-blur-sm hover:backdrop-blur hover:border border-transparent hover:border-gray-500 transition-all">
              <div className="flex flex-col items-center p-4">
                <ImageComponent
                  placeholderSrc={"/img/Empty.png"}
                  src="/img/nick-jenkins.jpg"
                  alt="Photo of Nick Jenkins"
                  width={250}
                  height={250}
                />
                <div className="pt-2 absolute text-white bottom-0 font-mono text-center">
                  <h2 className="font-bold">Nick Jenkins</h2>
                  <p className="text-xs italic">Professor at Cardiff University</p>
                </div>
              </div>
            </div>

            <div className="p-10 text-center flex-1 relative backdrop-blur-sm hover:backdrop-blur hover:border border-transparent hover:border-gray-500 transition-all">
              <div className="flex flex-col items-center p-4">
                <ImageComponent
                  placeholderSrc={"/img/Empty.png"}
                  src="/img/jianzhong-wu.jpg"
                  alt="Photo of Jianzhong Wu"
                  width={250}
                  height={250}
                />

                <div className="pt-2 absolute text-white bottom-0 font-mono text-center">
                  <h2 className="font-bold">Jianzhong Wu</h2>
                  <p className="text-xs italic">
                    Head of School, Engineering at Cardiff University
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
        <div className="text-center pt-10">
          <h1 className="text-lg underline bg-slate-200">Acknowledgments</h1>

          <div className="grid justify-items-center pt-4 pb-10 bg-slate-200">
            <div className="flex justify-center h-10">
              <div className="aspect-w-4 aspect-h-1 flex items-center p-4">
                <ImageComponent
                  src="/img/epsrc-logo.png"
                  alt="EPSRC Logo"
                  objectFit="contain"
                  width={100}
                  height={10}
                />
              </div>
              <div className="aspect-w-4 aspect-h-1 flex items-center p-4">
                <ImageComponent
                  src="/cu-logo.svg"
                  alt="Cardiff University Logo"
                  objectFit="contain"
                  width={50}
                  height={10}
                />
              </div>
              <div className="aspect-w-4 aspect-h-1 flex items-center p-4">
                <ImageComponent
                  src="/img/ukerc-logo.jpg"
                  alt="CUKERC Logo"
                  objectFit="contain"
                  width={100}
                  height={10}
                />
              </div>
              <div className="aspect-w-4 aspect-h-1 flex items-center p-4">
                <ImageComponent
                  src="/img/flexis-logo.png"
                  alt="Flexis Logo"
                  objectFit="contain"
                  width={100}
                  height={10}
                />
              </div>
              <div className="aspect-w-4 aspect-h-1 flex items-center p-4">
                <ImageComponent
                  src="/img/zero-2050-logo.jpeg"
                  alt="Zero 2050 Logo"
                  objectFit="contain"
                  width={100}
                  height={10}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Team;
