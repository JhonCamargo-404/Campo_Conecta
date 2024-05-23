import React from 'react';
import NavBar from "./NavBarAdmin";
import MenuAdmin from "./MenuAdmin";
import DeleteUsers from "./DeleteUser"; 

const DeleteUsersContainer = () => {
    return (
        <div className="flex flex-col w-screen h-full min-h-screen">
          <NavBar />
          <div className="flex flex-1 min-h-0 bg-white p-5">
            <MenuAdmin />
            <div className="flex-1 overflow-y-auto bg-white">
              <DeleteUsers />
            </div>
          </div>
        </div>
      );
};

export default DeleteUsersContainer;
