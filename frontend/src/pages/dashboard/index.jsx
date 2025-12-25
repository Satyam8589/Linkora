import { getAboutUser } from "@/config/redux/action/authAction";
import { getAllPosts } from "@/config/redux/action/postAction";
import { getAllUsers } from "@/config/redux/action/authAction";
import { BASE_URL } from "@/config";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Styles from "./index.module.css";
import { useState } from "react";
import { createPost, deletePost } from "@/config/redux/action/postAction";

function Dashboard() {
  const router = useRouter();

  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth);

  const postState = useSelector((state) => state.postReducer);

  useEffect(() => {
    if (authState.isTokenThere) {
      const token = localStorage.getItem("token");
      dispatch(getAllPosts());
      dispatch(getAboutUser({ token }));
    }
    if(!authState.all_profiles_fetched) {
      dispatch(getAllUsers());
    }
  }, [authState.isTokenThere]);

  const [postContent, setPostContent] = useState("");
  const [filContent, setFilContent] = useState();

  const handleUpload = async () => {
    await dispatch(createPost({ file: filContent, body: postContent }));
    setPostContent("");
    setFilContent(null);
    dispatch(getAllPosts());
  }

  if (authState.user && authState.user.userId) {
  return (
    <UserLayout>

      <DashboardLayout>
        <div className={Styles.scrollComponent}>
          <div className={Styles.createPostContainer}>
            <img
              className={Styles.userProfile}
              width={100}
              src={
                authState.user?.userId?.profilePicture 
                  ? `${BASE_URL}/uploads/${authState.user.userId.profilePicture}` 
                  : "/images/default-avatar.jpg"
              }
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/images/default-avatar.jpg";
              }}
              alt="Profile"
            />
            <textarea onChange={(e) => setPostContent(e.target.value)} value={postContent} placeholder={"What's on your mind?"} className={Styles.textAreaOfContent} name="" id=""></textarea>
            <label htmlFor="fileUpload">
              <div className={Styles.fab}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={Styles.icon}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </div>
            </label>
            <input onChange={(e) => setFilContent(e.target.files[0])} type="file" hidden id="fileUpload" />
            {postContent.length > 0 && (
              <div className={Styles.uploadButton} onClick={handleUpload}>Post</div>
            )}
          </div>

            <div className={Styles.postsContainer}>
              {postState.posts && postState.posts.length > 0 ? (
                postState.posts.map((post) => {
                  console.log("Rendering post:", post._id, "Media:", post.media, "FileType:", post.fileType);
                  return(
                    <div key={post._id} className={Styles.postContainer}>
                      <div className={Styles.postHeader}>
                        <img
                          className={Styles.userProfile}
                          width={100}
                          src={
                            post.userId?.profilePicture 
                              ? `${BASE_URL}/uploads/${post.userId.profilePicture}` 
                              : "/images/default-avatar.jpg"
                          }
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/images/default-avatar.jpg";
                          }}
                          alt="Profile"
                        />
                        <div className={Styles.postHeaderInfo}>
                          <h2>{post.userId?.name}</h2>
                          <p>@{post.userId?.username}</p>
                        </div>
                        
                        {/* Delete button */}
                        <div className={Styles.deleteButton} onClick={async () => {
                          if (window.confirm("Are you sure you want to delete this post?")) {
                            await dispatch(deletePost({ post_id: post._id }));
                          }
                        }}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={Styles.deleteIcon}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>
                        </div>
                      </div>
                      <p>{post.body}</p>
                      {post.media && (
                        <div className={Styles.postMedia}>
                          {post.fileType && (post.fileType === 'jpg' || post.fileType === 'jpeg' || post.fileType === 'png' || post.fileType === 'gif' || post.fileType === 'webp') ? (
                            <img 
                              src={`${BASE_URL}/uploads/${post.media}`} 
                              alt="Post media"
                              className={Styles.postImage}
                              onError={(e) => {
                                console.error("Failed to load image:", `${BASE_URL}/uploads/${post.media}`);
                                e.target.style.display = 'none';
                              }}
                            />
                          ) : post.fileType && (post.fileType === 'mp4' || post.fileType === 'webm' || post.fileType === 'ogg') ? (
                            <video 
                              src={`${BASE_URL}/uploads/${post.media}`} 
                              controls
                              className={Styles.postVideo}
                              onError={(e) => {
                                console.error("Failed to load video:", `${BASE_URL}/uploads/${post.media}`);
                                e.target.style.display = 'none';
                              }}
                            />
                          ) : null}
                        </div>
                      )}
                    </div>
                  )
                })
              ) : (
                <p>No posts yet. Create your first post!</p>
              )}
            </div>
          
        </div>
      </DashboardLayout>

    </UserLayout>
  );
  } else {
    return (
      <UserLayout>

        <DashboardLayout>
          <h2>Loading...</h2>
        </DashboardLayout>

      </UserLayout>
    )
  }
}

export default Dashboard;
