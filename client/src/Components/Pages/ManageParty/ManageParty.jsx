import React, { useState, useEffect } from "react";
import axios from 'axios';
import './ManageParty.css'
import DeleteConfirmationPopup from "./DeleteConfirmationPopup";

function ManageParty() {
    const [partyNames, setPartyNames] = useState([]);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [partyNameToDelete, setPartyNameToDelete] = useState('');
    const backendUrl = 'http://localhost:5000';
    
    useEffect(() => {
        fetchPartyNames();
    }, []);

    const fetchPartyNames = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/party`);
            setPartyNames(response.data);
        } catch (error) {
            console.error('Error fetching party names:', error);
        }
    };

    const handleDeleteParty = async (partyNameToDelete) => {
        try {
            await axios.delete(`${backendUrl}/api/party/${partyNameToDelete}`);
            // After successful deletion, fetch updated party names
            fetchPartyNames();
        } catch (error) {
            console.error('Error deleting party:', error);
        }
    };

    const onDeleteConfirmation = async () => {
        await handleDeleteParty(partyNameToDelete);
        setShowDeleteConfirmation(false);
    };

    const onCancelDelete = () => {
        setShowDeleteConfirmation(false);
    };

    return (
        <div>
            <table className="table-container">
                <thead>
                    <tr>
                        <th>Serial No</th>
                        <th>Party Name</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(partyNames) && partyNames.map((partyName, index) => (
                        <tr key={index}>
                            <td style={{fontWeight:'500',fontSize:'20px'}}>{index + 1}</td>
                            <td style={{fontWeight:'500',fontSize:'20px'}}>{partyName}</td>
                            <td>
                                <button onClick={() => {
                                    setPartyNameToDelete(partyName);
                                    setShowDeleteConfirmation(true);
                                }}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {showDeleteConfirmation && (
                <DeleteConfirmationPopup
                    partyNameToDelete={partyNameToDelete}
                    onDelete={onDeleteConfirmation}
                    onCancel={onCancelDelete}
                />
            )}
        </div>
    );
}

export default ManageParty;
