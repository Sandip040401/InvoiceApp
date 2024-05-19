import React from 'react';
import './DeleteConfirmationPopup.css';

function DeleteConfirmationPopup({ partyNameToDelete, onDelete, onCancel }) {
    return (
        <div className="popup">
            <div className="popup-inner">
              <h2 style={{color:'red',marginBottom:"10px",fontSize:"30px"}}>Warning</h2>
                <h3 style={{fontWeight:"500"}}>Are you sure you want to delete <font size='5'><b>{partyNameToDelete}</b></font>?</h3>
                <button onClick={onDelete}>Yes</button>
                <button onClick={onCancel}>No</button>
            </div>
        </div>
    );
}

export default DeleteConfirmationPopup;
