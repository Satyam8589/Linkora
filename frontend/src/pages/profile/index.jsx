import React, { useEffect, useState } from "react";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import styles from "./index.module.css";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { getAboutUser, whatAreMyConnections, getSentConnectionRequests, updateCoverPhoto, updateProfileData } from "@/config/redux/action/authAction";
import { getAllPosts } from "@/config/redux/action/postAction";
import { BASE_URL, clientServer } from "@/config";
import { useRouter } from "next/router";

export default function Profile() {
    const dispatch = useDispatch();
    const router = useRouter();
    const authState = useSelector((state) => state.auth);
    const postState = useSelector((state) => state.postReducer);
    
    const [isEditMode, setIsEditMode] = useState(false);
    const [editableName, setEditableName] = useState("");
    
    const user = authState.user?.userId || {};
    const profile = authState.user || {};
    
    const userPosts = postState.posts?.filter(post => post.userId?._id === user._id) || [];

    const acceptedConnections = [
        ...(authState.receivedRequests?.filter(conn => conn.status_accepted === true) || []),
        ...(authState.sentRequests?.filter(conn => conn.status_accepted === true) || [])
    ];
    const connectionsCount = acceptedConnections.length;

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            dispatch(getAboutUser({ token }));
            dispatch(getAllPosts());
            dispatch(whatAreMyConnections({ token }));
            dispatch(getSentConnectionRequests({ token }));
        }
    }, []);

    useEffect(() => {
        if (user.name) {
            setEditableName(user.name);
        }
    }, [user.name]);

    const [editableBio, setEditableBio] = useState("");
    const [editableCurrentPost, setEditableCurrentPost] = useState("");
    const [editableEducation, setEditableEducation] = useState([]);
    const [editablePastWork, setEditablePastWork] = useState([]);

    useEffect(() => {
        if (profile.bio !== undefined) setEditableBio(profile.bio || "");
        if (profile.currentPost !== undefined) setEditableCurrentPost(profile.currentPost || "");
        if (profile.education !== undefined) setEditableEducation(profile.education || []);
        if (profile.pastWork !== undefined) setEditablePastWork(profile.pastWork || []);
    }, [profile.bio, profile.currentPost, profile.education, profile.pastWork]);

    const updateProfilePicture = async (file) => {
        if (!file) return;
        
        try {
            const formData = new FormData();
            formData.append("profile_picture", file);
            formData.append("token", localStorage.getItem("token"));

            const response = await clientServer.post(
                "/update_profile_picture",
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            await dispatch(
                getAboutUser({
                    token: localStorage.getItem("token"),
                })
            );
            
            alert("Profile picture updated successfully!");
        } catch (error) {
            console.error("Error updating profile picture:", error);
            alert("Failed to update profile picture. Please try again.");
        }
    };

    const handleProfilePictureChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            updateProfilePicture(file);
        }
    };

    const updateName = async (name) => {
        if (!name || name === user.name) return;
        
        try {
            const response = await clientServer.post(
                "/user_update",
                { 
                    name,
                    token: localStorage.getItem("token")
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            await dispatch(
                getAboutUser({
                    token: localStorage.getItem("token"),
                })
            );
            
            alert("Name updated successfully!");
        } catch (error) {
            console.error("Error updating name:", error);
            alert("Failed to update name. Please try again.");
        }
    };

    const updateCoverPhotoHandler = async (file) => {
        if (!file) return;
        
        try {
            const token = localStorage.getItem("token");
            
            await dispatch(updateCoverPhoto({ file, token })).unwrap();
            
            await dispatch(getAboutUser({ token }));
            
            alert("Cover photo updated successfully!");
        } catch (error) {
            console.error("Error updating cover photo:", error);
            alert(error.message || "Failed to update cover photo. Please try again.");
        }
    };

    const handleCoverPhotoChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            updateCoverPhotoHandler(file);
        }
    };

    const updateAboutSection = async () => {
        try {
            const token = localStorage.getItem("token");
            
            console.log("Updating About Section with:", {
                bio: editableBio,
                currentPost: editableCurrentPost,
                education: editableEducation,
                pastWork: editablePastWork
            });
            
            await dispatch(updateProfileData({
                token,
                bio: editableBio,
                currentPost: editableCurrentPost,
                education: editableEducation,
                pastWork: editablePastWork
            })).unwrap();

            await dispatch(getAboutUser({ token }));
            
            alert("About section updated successfully!");
        } catch (error) {
            console.error("Error updating about section:", error);
            alert(error.message || "Failed to update about section. Please try again.");
        }
    };

    const addEducation = () => {
        setEditableEducation([...editableEducation, { school: "", degree: "", fieldOfStudy: "" }]);
    };

    const updateEducation = (index, field, value) => {
        const updated = [...editableEducation];
        updated[index][field] = value;
        setEditableEducation(updated);
    };

    const removeEducation = (index) => {
        setEditableEducation(editableEducation.filter((_, i) => i !== index));
    };

    const addPastWork = () => {
        setEditablePastWork([...editablePastWork, { company: "", position: "", years: "" }]);
    };

    const updatePastWork = (index, field, value) => {
        const updated = [...editablePastWork];
        updated[index][field] = value;
        setEditablePastWork(updated);
    };

    const removePastWork = (index) => {
        setEditablePastWork(editablePastWork.filter((_, i) => i !== index));
    };


    return (
        <UserLayout>
            <DashboardLayout>
                <div className={styles.container}>
                    <div className={styles.coverSection}>
                        <div className={styles.coverPhoto}>
                            {profile.coverPhoto ? (
                                <Image 
                                    src={`${BASE_URL}/uploads/${profile.coverPhoto}`} 
                                    alt="Cover" 
                                    fill
                                    style={{ objectFit: 'cover' }}
                                />
                            ) : (
                                <div className={styles.defaultCover}></div>
                            )}
                            {isEditMode && (
                                <>
                                    <label htmlFor="coverPhotoInput" className={styles.coverCameraIconOverlay}>
                                        <svg 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            fill="none" 
                                            viewBox="0 0 24 24" 
                                            strokeWidth={2} 
                                            stroke="currentColor"
                                            className={styles.cameraIcon}
                                        >
                                            <path 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round" 
                                                d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" 
                                            />
                                            <path 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round" 
                                                d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" 
                                            />
                                        </svg>
                                        <span className={styles.coverCameraText}>Change Cover</span>
                                    </label>
                                    <input 
                                        type="file" 
                                        id="coverPhotoInput"
                                        accept="image/*"
                                        onChange={handleCoverPhotoChange}
                                        className={styles.hiddenFileInput}
                                    />
                                </>
                            )}
                        </div>

                        <div className={styles.profilePictureWrapper}>
                            <div className={styles.profilePicture}>
                                <div className={styles.profileImageWrapper}>
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
                                {isEditMode && (
                                    <>
                                        <label htmlFor="profilePictureInput" className={styles.cameraIconOverlay}>
                                            <svg 
                                                xmlns="http://www.w3.org/2000/svg" 
                                                fill="none" 
                                                viewBox="0 0 24 24" 
                                                strokeWidth={2} 
                                                stroke="currentColor"
                                                className={styles.cameraIcon}
                                            >
                                                <path 
                                                    strokeLinecap="round" 
                                                    strokeLinejoin="round" 
                                                    d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" 
                                                />
                                                <path 
                                                    strokeLinecap="round" 
                                                    strokeLinejoin="round" 
                                                    d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" 
                                                />
                                            </svg>
                                        </label>
                                        <input 
                                            type="file" 
                                            id="profilePictureInput"
                                            accept="image/*"
                                            onChange={handleProfilePictureChange}
                                            className={styles.hiddenFileInput}
                                        />
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className={styles.userInfo}>
                        <div className={styles.userDetails}>
                            {isEditMode ? (
                                <div className={styles.nameEditContainer}>
                                    <input 
                                        type="text"
                                        value={editableName}
                                        onChange={(e) => setEditableName(e.target.value)}
                                        className={styles.nameInput}
                                        placeholder="Enter your name"
                                    />
                                    <button 
                                        className={styles.saveNameBtn}
                                        onClick={() => updateName(editableName)}
                                    >
                                        Save
                                    </button>
                                </div>
                            ) : (
                                <h1 className={styles.userName}>{user.name || 'Anonymous User'}</h1>
                            )}
                            <p className={styles.userUsername}>@{user.username || 'username'}</p>
                            {profile.headline && (
                                <p className={styles.userHeadline}>{profile.headline}</p>
                            )}
                        </div>

                        <div className={styles.actionButtons}>
                            <button 
                                className={styles.editBtn}
                                onClick={() => setIsEditMode(!isEditMode)}
                            >
                                {isEditMode ? 'Done' : 'Edit Profile'}
                            </button>
                        </div>
                    </div>

                    <div className={styles.statsSection}>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>{connectionsCount}</span>
                            <span className={styles.statLabel}>Connections</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>{userPosts?.length || 0}</span>
                            <span className={styles.statLabel}>Posts</span>
                        </div>
                    </div>

                    <div className={styles.bioSection}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>About</h2>
                            {isEditMode && (
                                <button className={styles.saveSectionBtn} onClick={updateAboutSection}>
                                    Save About
                                </button>
                            )}
                        </div>

                        {/* Bio */}
                        {isEditMode ? (
                            <textarea
                                value={editableBio}
                                onChange={(e) => setEditableBio(e.target.value)}
                                className={styles.bioTextarea}
                                placeholder="Tell us about yourself..."
                                rows={4}
                            />
                        ) : (
                            <p className={styles.bioText}>
                                {profile.bio || 'No bio available yet.'}
                            </p>
                        )}

                        {/* Current Position */}
                        <div className={styles.subsection}>
                            <h3 className={styles.subsectionTitle}>Current Position</h3>
                            {isEditMode ? (
                                <input
                                    type="text"
                                    value={editableCurrentPost}
                                    onChange={(e) => setEditableCurrentPost(e.target.value)}
                                    className={styles.arrayInput}
                                    placeholder="e.g., Software Engineer at Google"
                                />
                            ) : (
                                <p className={styles.bioText}>
                                    {profile.currentPost || 'No current position added yet.'}
                                </p>
                            )}
                        </div>

                        {/* Education */}
                        <div className={styles.subsection}>
                            <div className={styles.subsectionHeader}>
                                <h3 className={styles.subsectionTitle}>Education</h3>
                                {isEditMode && (
                                    <button className={styles.addBtn} onClick={addEducation}>+ Add</button>
                                )}
                            </div>
                            {isEditMode ? (
                                editableEducation.length > 0 ? (
                                    editableEducation.map((edu, index) => (
                                        <div key={index} className={styles.arrayItem}>
                                            <input
                                                type="text"
                                                value={edu.school}
                                                onChange={(e) => updateEducation(index, 'school', e.target.value)}
                                                placeholder="School/University"
                                                className={styles.arrayInput}
                                            />
                                            <input
                                                type="text"
                                                value={edu.degree}
                                                onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                                                placeholder="Degree"
                                                className={styles.arrayInput}
                                            />
                                            <input
                                                type="text"
                                                value={edu.fieldOfStudy}
                                                onChange={(e) => updateEducation(index, 'fieldOfStudy', e.target.value)}
                                                placeholder="Field of Study"
                                                className={styles.arrayInput}
                                            />
                                            <button className={styles.removeBtn} onClick={() => removeEducation(index)}>Remove</button>
                                        </div>
                                    ))
                                ) : (
                                    <p className={styles.emptyText}>No education added yet.</p>
                                )
                            ) : (
                                profile.education && profile.education.length > 0 ? (
                                    profile.education.map((edu, index) => (
                                        <div key={index} className={styles.educationItem}>
                                            <p className={styles.itemTitle}>{edu.degree} in {edu.fieldOfStudy}</p>
                                            <p className={styles.itemSubtitle}>{edu.school}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className={styles.emptyText}>No education added yet.</p>
                                )
                            )}
                        </div>

                        {/* Past Work */}
                        <div className={styles.subsection}>
                            <div className={styles.subsectionHeader}>
                                <h3 className={styles.subsectionTitle}>Past Work</h3>
                                {isEditMode && (
                                    <button className={styles.addBtn} onClick={addPastWork}>+ Add</button>
                                )}
                            </div>
                            {isEditMode ? (
                                editablePastWork.length > 0 ? (
                                    editablePastWork.map((work, index) => (
                                        <div key={index} className={styles.arrayItem}>
                                            <input
                                                type="text"
                                                value={work.company}
                                                onChange={(e) => updatePastWork(index, 'company', e.target.value)}
                                                placeholder="Company"
                                                className={styles.arrayInput}
                                            />
                                            <input
                                                type="text"
                                                value={work.position}
                                                onChange={(e) => updatePastWork(index, 'position', e.target.value)}
                                                placeholder="Position"
                                                className={styles.arrayInput}
                                            />
                                            <input
                                                type="text"
                                                value={work.years}
                                                onChange={(e) => updatePastWork(index, 'years', e.target.value)}
                                                placeholder="Years (e.g., 2020-2022)"
                                                className={styles.arrayInput}
                                            />
                                            <button className={styles.removeBtn} onClick={() => removePastWork(index)}>Remove</button>
                                        </div>
                                    ))
                                ) : (
                                    <p className={styles.emptyText}>No past work added yet.</p>
                                )
                            ) : (
                                profile.pastWork && profile.pastWork.length > 0 ? (
                                    profile.pastWork.map((work, index) => (
                                        <div key={index} className={styles.workItem}>
                                            <p className={styles.itemTitle}>{work.position} at {work.company}</p>
                                            <p className={styles.itemSubtitle}>{work.years}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className={styles.emptyText}>No past work added yet.</p>
                                )
                            )}
                        </div>

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
                            {userPosts && userPosts.length > 0 ? (
                                userPosts.map((post) => (
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