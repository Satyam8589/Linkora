import React from "react";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";

export default function Profile() {
    return (
        <UserLayout>
            <DashboardLayout>
                <div>
                    <h2>Profile</h2>
                </div>
            </DashboardLayout>
        </UserLayout>
    );
}