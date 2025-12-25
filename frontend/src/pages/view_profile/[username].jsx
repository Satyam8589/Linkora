import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import React from "react";

export default function ViewProfilePage() {

    const searchParams = useSearchParams();
    return (
        <div>
            <h1>View Profile</h1>
        </div>
    );
}