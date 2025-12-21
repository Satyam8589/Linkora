import { getAboutUser } from "@/config/redux/action/authAction";
import { getAllPosts } from "@/config/redux/action/postAction";
import UserLayout from "@/layout/UserLayout";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function Dashboard() {
  const router = useRouter();

  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth);

  const [isTokenThere, setIsTokenThere] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token === null) {
      router.push("/login");
    } else {
      setIsTokenThere(true);
    }
  }, []);

  useEffect(() => {
    if (isTokenThere) {
      const token = localStorage.getItem("token");
      dispatch(getAllPosts());
      dispatch(getAboutUser({ token }));
    }
  }, [isTokenThere, dispatch]);

  return (
    <UserLayout>
      {authState?.user?.userId && <div>Hey {authState.user.userId.name}</div>}
    </UserLayout>
  );
}

export default Dashboard;
