import React, { useEffect } from "react";
import styles from "./index.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { setTokenIsThere } from "@/config/redux/reducer/authReducer";

function DashboardLayout({ children }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const authState = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token === null) {
      router.push("/login");
    } else {
      dispatch(setTokenIsThere());
    }
  }, []);

  return (
    <div>
      <div className="container">
        <div className={styles.homeContainer}>
          {/* LEFT SIDEBAR */}
          <div className={styles.homeContainer__leftBar}>
            <div>
              <div
                className={styles.sideBarOption}
                onClick={() => router.push("/dashboard")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                  />
                </svg>
                <p>Scroll</p>
              </div>

              <div
                className={styles.sideBarOption}
                onClick={() => router.push("/discover")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
                <p>Discover</p>
              </div>

              <div
                className={styles.sideBarOption}
                onClick={() => router.push("/my_connections")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
                <p>My Connections</p>
              </div>
            </div>
          </div>

          {/* FEED */}
          <div className={styles.homeContainer__feedContainer}>
            {children}
          </div>

          {/* RIGHT SIDEBAR */}
          <div className={styles.homeContainer__extraContainer}>
            <h3 className={styles.topProfilesTitle}>Top Profiles</h3>
            
            <div className={styles.profilesList}>
              {authState.all_profiles_fetched &&
                authState.all_users?.length > 0 &&
                authState.all_users
                  .filter((profile) => profile.userId !== null)
                  .filter((profile) => profile.userId?._id !== authState.user?.userId?._id)
                  .slice(0, 5)
                  .map((profile) => (
                    <div 
                      key={profile._id} 
                      className={styles.profileCard}
                      onClick={() => router.push(`/view_profile/${profile.userId?.username}`)}
                    >
                      <img
                        src={
                          profile.userId?.profilePicture
                            ? `http://localhost:9090/uploads/${profile.userId.profilePicture}`
                            : "/images/default-avatar.jpg"
                        }
                        alt={profile.userId?.name}
                        className={styles.profileAvatar}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/images/default-avatar.jpg";
                        }}
                      />
                      <div className={styles.profileInfo}>
                        <p className={styles.profileName}>{profile.userId?.name}</p>
                        <p className={styles.profileUsername}>@{profile.userId?.username}</p>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
