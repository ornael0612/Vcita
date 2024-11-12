import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function App() {
    const [token, setToken] = useState('');
    const [clients, setClients] = useState([]);
    const [newClientName, setNewClientName] = useState('');

    
    const initiateAuth = () => {
        window.location.href = `${API_URL}/auth`;
    };

   
    const getAccessToken = async (code) => {
        try {
            const response = await axios.get(`${API_URL}/auth/callback?code=${code}`);
            setToken(response.data.accessToken);
        } catch (error) {
            console.error('error in getting token ', error);
        }
    };


    const fetchClients = async () => {
        try {
            const response = await axios.get(`${API_URL}/clients`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setClients(response.data);
        } catch (error) {
            console.error('error when getting clients details', error);
        }
    };

   
    const createClient = async () => {
        try {
            const response = await axios.post(`${API_URL}/clients`, { name: newClientName }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setClients([...clients, response.data]); 
            setNewClientName(''); 
        } catch (error) {
            console.error('error when creating a new client', error);
        }
    };

    return (
        <div className="App p-4">
            <h1 className="text-2xl font-bold mb-4">Vcita client manager</h1>
            {/* Button for auth */}
            <button
                onClick={initiateAuth}
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded mb-4"
            >
                Auth with Vcita
            </button>

            {/* form for new client */}
            {token && (
                <>
                    <h2 className="text-xl font-bold mb-2">Create a new client</h2>
                    <input
                        type="text"
                        value={newClientName}
                        onChange={(e) => setNewClientName(e.target.value)}
                        placeholder="Client Name"
                        className="border p-2 rounded w-full mb-2"
                    />
                    <button
                        onClick={createClient}
                        className="bg-green-500 text-white font-bold py-2 px-4 rounded mb-4"
                    >
                        Add Client
                    </button>

                    {/* client's list */}
                    <h2 className="text-xl font-bold">client's list</h2>
                    <ul>
                        {clients.map(client => (
                            <li key={client.id} className="py-2 border-b">
                                {client.name}
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}

export default App;