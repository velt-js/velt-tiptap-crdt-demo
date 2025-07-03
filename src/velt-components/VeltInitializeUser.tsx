import { useVeltClient } from '@veltdev/react';
import { User } from '@veltdev/types';
import { useEffect, useState } from 'react';

const users: Record<string, User> = {
    'michael': {
        userId: 'michael',
        name: 'Michael Scott',
        email: 'michael.scott@dundermifflin.com',
        organizationId: 'crdt-tiptap-org1',
    },
    'jim': {
        userId: 'jim',
        name: 'Jim Halpert',
        email: 'jim.halpert@dundermifflin.com',
        organizationId: 'crdt-tiptap-org1',
    },
    'pam': {
        userId: 'pam',
        name: 'Pam Beesly',
        email: 'pam.beesly@dundermifflin.com',
        organizationId: 'crdt-tiptap-org1',
    },
    // 'dwight': {
    //     userId: 'dwight',
    //     name: 'Dwight Schrute',
    //     email: 'dwight.schrute@dundermifflin.com',
    //     organizationId: 'crdt-tiptap-org1',
    // },
    // 'angela': {
    //     userId: 'angela',
    //     name: 'Angela Martin',
    //     email: 'angela.martin@dundermifflin.com',
    //     organizationId: 'crdt-tiptap-org1',
    // },
    // 'kevin': {
    //     userId: 'kevin',
    //     name: 'Kevin Malone',
    //     email: 'kevin.malone@dundermifflin.com',
    //     organizationId: 'crdt-tiptap-org1',
    // },
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
        setTimeout(() => {
            window.location.reload();
        }, 1000);
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