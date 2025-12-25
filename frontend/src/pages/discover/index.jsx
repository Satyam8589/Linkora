import React, { useEffect } from "react";
import UserLayout from "@/layout/UserLayout";
import DashboardLayout from "@/layout/DashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "@/config/redux/action/authAction";
import { BASE_URL } from "@/config";
import Styles from "./index.module.css";
import { useRouter } from "next/navigation";

export default function Discover() {

    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);
    const router = useRouter();

    useEffect(() => {
        if(!authState.all_profiles_fetched) {
            dispatch(getAllUsers());
        }
    }, []);

    return (
    <UserLayout>

      <DashboardLayout>
        <div>
          <h2>Discover</h2>

          <div className={Styles.allUserProfile}>
            {authState.all_profiles_fetched && authState.all_users && authState.all_users.length > 0 ? (
              authState.all_users.map((user) => (
                <div onClick={() => {
                  router.push(`/view_profile/${user.userId?.username}`);
                }} key={user._id} className={Styles.userProfile}>
                  <img 
                    src={user.userId?.profilePicture ? `${BASE_URL}/uploads/${user.userId.profilePicture}` : "/images/default-avatar.jpg"}
                    alt={user.userId?.name || "User"}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/default-avatar.jpg";
                    }}
                  />
                  <h3>{user.userId?.name || "Unknown User"}</h3>
                  <p>@{user.userId?.username || "unknown"}</p>
                  <button>Follow</button>
                </div>
              ))
            ) : (
              <p>No users found</p>
            )}
          </div>
        </div>
      </DashboardLayout>

    </UserLayout>
    );
}