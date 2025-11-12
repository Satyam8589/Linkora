import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'

function index() {

    const router = useRouter();

    const [ isTokenThere, setIsTokenThere ] = useState(false);

    useEffect(() => {
        if(localStorage.getItem("token") === null) {
            router.push("/login");
        }

        setIsTokenThere(true);
    });

    useEffect(() => {

    });

  return (
    <div>
      <p>Welcome to the@Dashboard</p>
    </div>
  )
}

export default index
