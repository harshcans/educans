import React from 'react';
import { auth } from './firebase';
import image from './image.png';
import { Link,useNavigate } from 'react-router-dom';

const SidebarStudent = ({active}) => {

  const navigate = useNavigate();

  
  const handleSignOut = async () => {
    await auth.signOut();
    navigate('/login');
  };

  const buttonElement = document.getElementById(active);
  if (buttonElement){
  const currentClassName = buttonElement.className;
        const newClassName = currentClassName === 'button1' ? {active} : 'nav-active';
      buttonElement.className = newClassName;
  }

  return (
    <div className="sidebar flex-column">
  <div className="image-sidebar">
    <img src={image} alt="" /> 
  </div>
  <div className="buttons-sidebar flex-column width-100">
    <button className="button1" id="button1">
      <i className="fa-solid fa-house mr-rt-10" />
      Dashboard
    </button>
    <Link to='/user/testsgiven'><button className="button1" id="button2" >Tests Given</button></Link>
    <Link to='/user/courses'><button className="button1" id="button3">Course</button></Link>
    <Link to='/'><button className="button1" id="button4">Questions Bank</button></Link>
    <Link to='/'><button className="button1" id="button5">Setting</button></Link>
    <button className="button1" onClick={handleSignOut}>Logout</button>
  </div>
</div>

  );
};

export default SidebarStudent;
