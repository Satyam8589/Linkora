import React, { useEffect } from "react";
import UserLayout from "@/layout/UserLayout";
import DashboardLayout from "@/layout/DashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "@/config/redux/action/authAction";

export default function Discover() {

    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);

    useEffect(() => {
        if(!authState.all_profiles_fetched) {
            dispatch(getAllUsers());
        }
    }, []);

    return (
    <UserLayout>

      <DashboardLayout>
        <h2>Discovers</h2>
      </DashboardLayout>

    </UserLayout>
    );
}