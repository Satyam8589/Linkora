import { getAboutUser } from "@/config/redux/action/authAction";
import { getAllPosts } from "@/config/redux/action/postAction";
import { getAllUsers } from "@/config/redux/action/authAction";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

function Dashboard() {
  const router = useRouter();

  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth);

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

  return (
    <UserLayout>

      <DashboardLayout>
        <h2>Dashboard</h2>
      </DashboardLayout>

    </UserLayout>
  );
}

export default Dashboard;
