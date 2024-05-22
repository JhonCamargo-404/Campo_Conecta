import React from 'react';
import NavBar from "./NavBarAdmin";
import MenuAdmin from "./MenuAdmin";
import DeleteAdvertisements from "./DeleteAdvertisements"; 

const DeleteMyAdvertisement = () => {
    return (
        <div className="flex flex-col w-screen h-full min-h-screen">
          <NavBar />
          <div className="flex flex-1 min-h-0 bg-white p-5">
            <MenuAdmin />
            <div className="flex-1 overflow-y-auto bg-white">
              <DeleteAdvertisements />
            </div>
          </div>
        </div>
      );
};

export default DeleteMyAdvertisement;
