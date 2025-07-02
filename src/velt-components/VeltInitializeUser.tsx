import { useVeltClient } from '@veltdev/react';
import { User } from '@veltdev/types';
import React, { useEffect, useState } from 'react'

const users: Record<string, User> = {
    'rakesh': {
        userId: 'rakesh',
        name: 'Rakesh',
        photoUrl: '',
        email: 'rakesh@trysnippyly.com',
        plan: 'free',
        organizationId: 'crdt-tiptap-org1',
    },
    'tej': {
        userId: 'tej',
        name: 'Tej',
        photoUrl: '',
        email: 'tej@trysnippyly.com',
        plan: 'paid',
        organizationId: 'crdt-tiptap-org1',
    },
    'vivek': {
        userId: 'vivek',
        name: 'Vivek',
        photoUrl: '',
        email: 'vivek@trysnippyly.com',
        plan: 'trial',
        organizationId: 'crdt-tiptap-org1',
    },
    'mayank': {
        userId: 'mayank',
        name: 'Mayank',
        photoUrl: '',
        email: 'mayank@trysnippyly.com',
        plan: 'trial',
        organizationId: 'crdt-tiptap-org1',
    },
    'mihir': {
        userId: 'mihir',
        name: 'Mihir',
        photoUrl: '',
        email: 'mihir@trysnippyly.com',
        plan: 'trial',
        organizationId: 'crdt-tiptap-org1',
    },
    'samarth': {
        userId: 'samarth',
        name: 'Samarth',
        photoUrl: '',
        email: 'samarth@trysnippyly.com',
        plan: 'trial',
        organizationId: 'crdt-tiptap-org1',
    },
}

function VeltInitializeUser() {

    const { client } = useVeltClient();
    const [user, setUser] = useState<User | undefined>();

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            setUser(JSON.parse(user));
        }
    }, []);

    useEffect(() => {
        if (client && user) {
            client.identify(user);
        }
    }, [client, user])

    const loginWithUser = (userId: string) => {
        const user = users[userId];
        if (user) {
            setUser(user);
            localStorage.setItem('user', JSON.stringify(user));
        }
    }

    const logout = () => {
        setUser(undefined);
        localStorage.removeItem('user');
        if (client) {
            client.signOutUser();
        }
    }

    return (
        <>
            <div className="user-controls">
                {
                    user ? (
                        <div className="user-logged-in">
                            <span>Welcome, {user.name}</span>
                            <button onClick={logout} className="logout-btn">
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="login-buttons">
                            <span>Login as:</span>
                            {
                                Object.keys(users).map((userId) => (
                                    <button 
                                        key={userId} 
                                        onClick={() => loginWithUser(userId)}
                                        className="login-btn"
                                    >
                                        {users[userId].name}
                                    </button>
                                ))
                            }
                        </div>
                    )
                }
            </div>
        </>
    )
}

export default VeltInitializeUser;