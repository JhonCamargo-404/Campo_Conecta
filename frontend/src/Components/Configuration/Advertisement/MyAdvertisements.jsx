import React from 'react';
import NavBar from "../../NavBar/NavBar";
import SideMenu from "../SideMenu/SideMenu";
import Advertisements from "./Advertisements"; 

const MyAdvertisements = () => {
    return (
        <div className="flex flex-col w-screen h-full min-h-screen">
          <NavBar />
          <div className="flex flex-1 min-h-0 bg-white p-5">
            <SideMenu />
            <div className="flex-1 overflow-y-auto bg-white">
              <Advertisements />
            </div>
          </div>
        </div>
      );
};

export default MyAdvertisements;
