import React, { useEffect, useState } from "react";
import UserLayout from "@/layout/UserLayout";
import DashboardLayout from "@/layout/DashboardLayout";
import styles from "./index.module.css";
import { useDispatch, useSelector } from "react-redux";
import { whatAreMyConnections, getSentConnectionRequests, acceptConnectionRequest, getAboutUser } from "@/config/redux/action/authAction";
import { BASE_URL } from "@/config";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function MyConnectionsPage() {
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('connections');
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    useEffect(() => {
        if (token) {
            fetchConnections();
            if (!authState.profileFetched) {
                dispatch(getAboutUser({ token }));
            }
        }
    }, []);

    const fetchConnections = async () => {
        try {
            await Promise.all([
                dispatch(whatAreMyConnections({ token })).unwrap(),
                dispatch(getSentConnectionRequests({ token })).unwrap()
            ]);
        } catch (error) {
            console.error('Error fetching connections:', error);
        }
    };

    const handleAccept = async (connectionId) => {
        try {
            await dispatch(acceptConnectionRequest({
                token,
                connectionId,
                action: 'accept'
            })).unwrap();
            
            alert('Connection request accepted!');
            fetchConnections();
        } catch (error) {
            console.error('Error accepting request:', error);
            alert('Failed to accept request');
        }
    };

    const handleReject = async (connectionId) => {
        try {
            await dispatch(acceptConnectionRequest({
                token,
                connectionId,
                action: 'reject'
            })).unwrap();
            
            alert('Connection request rejected');
            fetchConnections();
        } catch (error) {
            console.error('Error rejecting request:', error);
            alert('Failed to reject request');
        }
    };

    const renderConnectionCard = (connection, type) => {
        let user;
        const currentUserId = authState.user?.userId?._id;
        
        if (type === 'connections') {
            const senderId = connection.userId?._id || connection.userId;
            const receiverId = connection.connectionId?._id || connection.connectionId;
            
            if (String(senderId) === String(currentUserId)) {
                user = connection.connectionId;
            } else {
                user = connection.userId;
            }
        }
 else {
            user = type === 'received' ? connection.userId : connection.connectionId;
        }
        
        if (!user || typeof user === 'string') return null;

        const isAccepted = connection.status_accepted === true;

        return (
            <div key={connection._id} className={styles.connectionCard}>
                <div 
                    className={styles.userInfo} 
                    onClick={() => router.push(`/view_profile/${user.username}`)}
                    style={{ cursor: 'pointer' }}
                >
                    <div className={styles.avatar}>
                        <Image
                            src={
                                user.profilePicture
                                    ? (user.profilePicture.startsWith('uploads/')
                                        ? `${BASE_URL}/${user.profilePicture}`
                                        : `${BASE_URL}/uploads/${user.profilePicture}`)
                                    : `${BASE_URL}/uploads/default.jpg`
                            }
                            alt={user.name}
                            fill
                            style={{ objectFit: 'cover' }}
                        />
                    </div>
                    <div className={styles.userDetails}>
                        <h3 className={styles.userName}>{user.name}</h3>
                        <p className={styles.userUsername}>@{user.username}</p>
                    </div>
                </div>
                <div className={styles.actions}>
                    {isAccepted ? (
                        <button className={styles.connectedBtn} disabled>
                            Connected
                        </button>
                    ) : type === 'received' ? (
                        <>
                            <button 
                                className={styles.acceptBtn}
                                onClick={() => handleAccept(connection._id)}
                            >
                                Accept
                            </button>
                            <button 
                                className={styles.rejectBtn}
                                onClick={() => handleReject(connection._id)}
                            >
                                Reject
                            </button>
                        </>
                    ) : (
                        <button className={styles.pendingBtn} disabled>
                            Pending
                        </button>
                    )}
                </div>
            </div>
        );
    };

    const acceptedConnections = [
        ...(authState.receivedRequests?.filter(conn => conn.status_accepted === true) || []),
        ...(authState.sentRequests?.filter(conn => conn.status_accepted === true) || [])
    ];

    const pendingReceivedRequests = authState.receivedRequests?.filter(conn => conn.status_accepted === null) || [];
    const pendingSentRequests = authState.sentRequests?.filter(conn => conn.status_accepted === null) || [];

    return (
        <UserLayout>
            <DashboardLayout>
                <div className={styles.container}>
                    <h1 className={styles.pageTitle}>My Connections</h1>
                    
                    <div className={styles.tabs}>
                        <button
                            className={`${styles.tab} ${activeTab === 'connections' ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab('connections')}
                        >
                            My Connections
                            {acceptedConnections.length > 0 && (
                                <span className={styles.badge}>{acceptedConnections.length}</span>
                            )}
                        </button>
                        <button
                            className={`${styles.tab} ${activeTab === 'received' ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab('received')}
                        >
                            Connection Requests
                            {pendingReceivedRequests.length > 0 && (
                                <span className={styles.badge}>{pendingReceivedRequests.length}</span>
                            )}
                        </button>
                        <button
                            className={`${styles.tab} ${activeTab === 'sent' ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab('sent')}
                        >
                            Sent Requests
                            {pendingSentRequests.length > 0 && (
                                <span className={styles.badge}>{pendingSentRequests.length}</span>
                            )}
                        </button>
                    </div>

                    <div className={styles.content}>
                        {authState.isLoading ? (
                            <div className={styles.loading}>Loading...</div>
                        ) : (
                            <>
                                {activeTab === 'connections' && (
                                    <div className={styles.connectionsList}>
                                        {acceptedConnections.length > 0 ? (
                                            acceptedConnections.map(conn => renderConnectionCard(conn, 'connections'))
                                        ) : (
                                            <div className={styles.emptyState}>
                                                <p>No connections yet</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'received' && (
                                    <div className={styles.connectionsList}>
                                        {pendingReceivedRequests.length > 0 ? (
                                            pendingReceivedRequests.map(conn => renderConnectionCard(conn, 'received'))
                                        ) : (
                                            <div className={styles.emptyState}>
                                                <p>No connection requests received</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'sent' && (
                                    <div className={styles.connectionsList}>
                                        {pendingSentRequests.length > 0 ? (
                                            pendingSentRequests.map(conn => renderConnectionCard(conn, 'sent'))
                                        ) : (
                                            <div className={styles.emptyState}>
                                                <p>No connection requests sent</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </DashboardLayout>
        </UserLayout>
    );
}