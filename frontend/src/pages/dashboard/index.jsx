import { getAboutUser } from "@/config/redux/action/authAction";
import { getAllPosts } from "@/config/redux/action/postAction";
import UserLayout from "@/layout/UserLayout";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function index() {
  const router = useRouter();

  const dispath = useDispatch();

  const authState = useSelector((state) => state.auth);

  const [isTokenThere, setIsTokenThere] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token") === null) {
      router.push("/login");
    }

    setIsTokenThere(true);
  });

  useEffect(() => {
    if (isTokenThere) {
      dispath(getAllPosts());
      dispath(getAboutUser({ token: localStorage.getItem("token") }));
    }
  }, [isTokenThere]);

  return (
    <UserLayout>
      {authState.user.user && <div>Hey {authState.user.userId.name}</div>}
    </UserLayout>
  );
}

export default index;
