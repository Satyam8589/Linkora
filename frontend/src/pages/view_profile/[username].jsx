import { clientServer, BASE_URL } from "@/config";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import React from "react";
import styles from "./index.module.css";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { sendConnectionRequest } from "@/config/redux/action/authAction";

export default function ViewProfilePage({ userProfile, posts }) {
    const searchParams = useSearchParams();
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);
    const [connectionStatus, setConnectionStatus] = useState('connect'); // 'connect', 'pending', 'connected'

    // Safely access user data
    const user = userProfile?.userId || {};
    const profile = userProfile || {};

    // Check connection status function
    const checkConnectionStatus = async () => {
        const token = localStorage.getItem('token');
        if (!token || !user._id) return;

        try {
            // Fetch both sent and received requests
            const [sentResponse, receivedResponse] = await Promise.all([
                clientServer.get('/user/getConnectionsRequests', { params: { token } }),
                clientServer.get('/user/user_connection_request', { params: { token } })
            ]);

            const sentRequests = sentResponse.data.connections || [];
            const receivedRequests = receivedResponse.data.connections || [];

            // Check if there's a connection with this user
            const sentConnection = sentRequests.find(
                conn => conn.connectionId?._id === user._id
            );
            const receivedConnection = receivedRequests.find(
                conn => conn.userId?._id === user._id
            );

            // Determine status
            if (sentConnection) {
                if (sentConnection.status_accepted === true) {
                    setConnectionStatus('connected');
                } else if (sentConnection.status_accepted === false) {
                    setConnectionStatus('connect'); // Rejected, can send again
                } else {
                    setConnectionStatus('pending');
                }
            } else if (receivedConnection) {
                if (receivedConnection.status_accepted === true) {
                    setConnectionStatus('connected');
                } else {
                    setConnectionStatus('pending'); // They sent you a request
                }
            } else {
                setConnectionStatus('connect');
            }
        } catch (error) {
            console.error('Error checking connection status:', error);
        }
    };

    // Check connection status on page load and when user returns to tab
    useEffect(() => {
        checkConnectionStatus();

        // Add event listener for when user returns to the tab
        const handleFocus = () => {
            checkConnectionStatus();
        };

        window.addEventListener('focus', handleFocus);

        return () => {
            window.removeEventListener('focus', handleFocus);
        };
    }, [user._id]);

    // Handle connection request
    const handleConnect = async () => {
        const token = localStorage.getItem('token');
        
        if (!token) {
            alert('Please login to connect');
            return;
        }

        try {
            await dispatch(sendConnectionRequest({
                token: token,
                user_id: user._id
            })).unwrap();
            
            setConnectionStatus('pending');
            alert('Connection request sent!');
        } catch (error) {
            console.error('Error sending connection request:', error);
            alert(error.message || 'Failed to send connection request');
        }
    };

    return (
        <UserLayout>
            <DashboardLayout>
                <div className={styles.container}>
                    <div className={styles.coverSection}>
                        <div className={styles.coverPhoto}>
                            {profile.coverPhoto ? (
                                <Image 
                                    src={`${BASE_URL}/${profile.coverPhoto}`} 
                                    alt="Cover" 
                                    fill
                                    style={{ objectFit: 'cover' }}
                                />
                            ) : (
                                <div className={styles.defaultCover}></div>
                            )}
                        </div>

                        <div className={styles.profilePictureWrapper}>
                            <div className={styles.profilePicture}>
                                <Image 
                                    src={
                                        user.profilePicture 
                                            ? (user.profilePicture.startsWith('uploads/') 
                                                ? `${BASE_URL}/${user.profilePicture}` 
                                                : `${BASE_URL}/uploads/${user.profilePicture}`)
                                            : `${BASE_URL}/uploads/default.jpg`
                                    } 
                                    alt={user.name || 'User'} 
                                    fill
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.userInfo}>
                        <div className={styles.userDetails}>
                            <h1 className={styles.userName}>{user.name || 'Anonymous User'}</h1>
                            <p className={styles.userUsername}>@{user.username || 'username'}</p>
                            {profile.headline && (
                                <p className={styles.userHeadline}>{profile.headline}</p>
                            )}
                        </div>

                        <div className={styles.actionButtons}>
                            <button 
                                className={styles.connectBtn} 
                                onClick={handleConnect}
                                disabled={connectionStatus !== 'connect'}
                            >
                                {connectionStatus === 'connect' && 'Connect'}
                                {connectionStatus === 'pending' && 'Pending'}
                                {connectionStatus === 'connected' && 'Connected'}
                            </button>
                            <button className={styles.messageBtn}>Message</button>
                        </div>
                    </div>

                    <div className={styles.statsSection}>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>{profile.connectionsCount || 0}</span>
                            <span className={styles.statLabel}>Connections</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>{posts?.length || 0}</span>
                            <span className={styles.statLabel}>Posts</span>
                        </div>
                    </div>

                    <div className={styles.bioSection}>
                        <h2 className={styles.sectionTitle}>About</h2>
                        <p className={styles.bioText}>
                            {profile.bio || 'No bio available yet.'}
                        </p>
                        {profile.skills && profile.skills.length > 0 && (
                            <div className={styles.skillsContainer}>
                                <h3 className={styles.skillsTitle}>Skills</h3>
                                <div className={styles.skillsList}>
                                    {profile.skills.map((skill, index) => (
                                        <span key={index} className={styles.skillTag}>{skill}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={styles.postsSection}>
                        <h2 className={styles.sectionTitle}>Posts & Activity</h2>
                        <div className={styles.postsGrid}>
                            {posts && posts.length > 0 ? (
                                posts.map((post) => (
                                    <div key={post._id} className={styles.postCard}>
                                        {post.media && (
                                            <div className={styles.postMedia}>
                                                {post.fileType === 'mp4' || post.fileType === 'webm' ? (
                                                    <video 
                                                        src={`${BASE_URL}/uploads/${post.media}`}
                                                        controls
                                                        className={styles.postVideo}
                                                    />
                                                ) : (
                                                    <div className={styles.postImageWrapper}>
                                                        <Image 
                                                            src={`${BASE_URL}/uploads/${post.media}`}
                                                            alt="Post media"
                                                            fill
                                                            style={{ objectFit: 'cover' }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        <div className={styles.postContent}>
                                            <p className={styles.postBody}>{post.body}</p>
                                            <div className={styles.postFooter}>
                                                <span className={styles.postLikes}>❤️ {post.likes}</span>
                                                <span className={styles.postDate}>
                                                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className={styles.emptyState}>
                                    <p>No posts yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </UserLayout>
    );
}

export async function getServerSideProps(context) {
    try {
        // Fetch user profile and posts in parallel
        const [profileRequest, postsRequest] = await Promise.all([
            clientServer.get("/user/get_user_profile_and_user_based_on_username", {
                params: {
                    username: context.query.username
                }
            }),
            clientServer.get("/posts/user", {
                params: {
                    username: context.query.username
                }
            })
        ]);

        const profileResponse = profileRequest.data;
        const postsResponse = postsRequest.data;

        return {
            props: {
                userProfile: profileResponse.userProfile,
                posts: postsResponse.posts || []
            }
        }
    } catch (error) {
        console.error("Error fetching profile data:", error);
        return {
            props: {
                userProfile: null,
                posts: []
            }
        }
    }
}