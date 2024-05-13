import React from "react";
import { Link } from "react-router-dom"; // Import useHistory
import './Navbar.css';
import DarkMode from "../Darkmode/Darkmode";

function Navbar(){
    return(
        <>
        <div className="navbar">
            <div className="navbar-container">
                <div className="navbar-left">
                    <div className="navbar-heading">
                        <h2 style={{
                            marginTop:'15px'
                        }}>Tonushree Agency</h2>
                    </div>
                    <div className="navbar-search-client margin">
                        <div className="dropdown">
                            <button className="dropbtn button-85">View/Print</button>
                            <div className="dropdown-content">
                                <Link to="/view-party" className="below-border">View Party</Link>
                                <Link to="/view-bill">View Bill</Link>
                            </div>
                        </div>
                    </div>
                    <div className="navbar-add-client margin" style={{marginLeft:"50px"}}>
                        <div className="dropdown">
                            <button className="dropbtn button-85">Add</button>
                            <div className="dropdown-content">
                                <Link to="/add-party" className="below-border">Add Party</Link>
                                <Link to="/add-weekly-bill">Add Weekly Bill</Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="navbar-right">
                    <div className="navbar-logout" style={{
                        marginRight:'40px'
                    }}>
                        <DarkMode/>
                    </div>
                </div>

            </div>
            {/* <hr style={{
                marginTop:'20px',
                height:'0.5px',
                backgroundColor:'black'
            }} /> */}
        </div>
        </>
    )
}

export default Navbar;
