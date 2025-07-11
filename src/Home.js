import React from "react";
import "./components/CSS/Homepage.css";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div>
      <div className="home">
        <nav
          className="navbar navbar-expand-lg navbar-light bg-white sticky snipcss-FY4cn style-bA3jh"
          data-offset={500}
          id="style-bA3jh"
        >
          <div className="container">
            <span className="navbar-brand">
              Edu<span className="text-primary">Grade.</span>
            </span>
            <button
              className="navbar-toggler"
              data-toggle="collapse"
              data-target="#navbarContent"
              aria-controls="navbarContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon" />
            </button>
            <div className="navbar-collapse collapse" id="navbarContent">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item active">
                  <span className="nav-link">Home</span>
                </li>
                <li className="nav-item">
                  <span className="nav-link">About</span>
                </li>

                <li className="nav-item">
                  <span className="nav-link">Services</span>
                </li>
                <li className="nav-item">
                  <span className="nav-link">Testimonials</span>
                </li>
                <li className="nav-item">
                  <span className="nav-link">Contact</span>
                </li>
                <Link to="/login">
                  <li className="nav-item">
                    <span className="btn btn-primary ml-lg-2">Log In</span>
                  </li>
                </Link>
              </ul>
            </div>
          </div>
        </nav>
        <div className="main2 container">
          <div className="row align-items-center flex-wrap-reverse h-100 snipcss-QSc22">
            <div
              className="col-md-6 wow fadeInLeft style-LA2qh"
              id="style-LA2qh"
            >
              <h1 className="mb-4">
                Let's Check and Optimize your MarksSheet!
              </h1>
              <p className="text-lg text-grey mb-5">
                Ignite the most powerfull growth engine you have ever built for
                your Preparation
              </p>
              <Link to="/signup">
                <div className="btn btn-primary btn-split">
                  Create your Account
                  <div className="fab">
                    <i className="fa-solid fa-caret-right"></i>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-md-6 wow zoomIn style-gGfTw" id="style-gGfTw">
              <div className="img-fluid text-center">
                <img
                  src="https://cdni.iconscout.com/illustration/premium/thumb/online-test-5526034-4609621.png"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
