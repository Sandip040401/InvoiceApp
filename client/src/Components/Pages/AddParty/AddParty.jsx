import React, { useState } from "react";
import "./AddParty.css";
import axios from "axios";

function AddParty() {
  const [partyName, setPartyName] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const backendUrl = "http://localhost:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/api/party`, {
        partyName,
      });
      setMessage(response.data.message);
      setIsError(false); // Resetting isError state on successful message
    } catch (error) {
      console.error("Error adding party:", error);
      setMessage("Party Already Exist");
      setIsError(true);
    }
  };

  return (
    <div className="add-party-container">
      <form className="add-party-form" onSubmit={handleSubmit}>
        <label htmlFor="party-name">Add Party Name:</label>
        <input
          type="text"
          name="party-name"
          placeholder="Enter the Name"
          value={partyName}
          onChange={(e) => setPartyName(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
      {message && (
        <div className={`message ${isError ? "error" : ""}`}>{message}</div>
      )}
    </div>
  );
}

export default AddParty;
