import React from 'react';
import Popup from "reactjs-popup";
import Sidebar from "../Sidebar";


function TestLibrary() {
  return (
     <div className="flex ">
      <Sidebar active={"button2"} venue={'student'} />
      <div className="main dashboard">
        <div className="header flex">
          <div className="row-right">
            <Popup
              trigger={<i className="fa-solid fa-bars" />}
              position="bottom left"
              closeOnDocumentClick
              mouseLeaveDelay={300}
              mouseEnterDelay={0}
              contentStyle={{ padding: "0px", border: "none" }}
              arrow={false}
            >
              <Sidebar />
            </Popup>
             <h3>Dashboard</h3>
          </div>
          <div className="row-left">
            <i className="fa-regular fa-bell" />
            <i className="fa-solid fa-gear" />
            <i className="fa-regular fa-circle-user" />
          </div>
        </div>
        <div className="main-wrapper">
          <div className="flex">
          <div className="search-box-test">
            <input/>
            </div>
            <button>My BookMarks</button>
          </div>
        </div>
        </div>
        </div>
  )
}

export default TestLibrary