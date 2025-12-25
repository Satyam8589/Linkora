import { store } from "@/config/redux/store";
import "@/styles/globals.css";
import { Provider } from "react-redux";
import { useEffect } from "react";
import { setTokenIsThere } from "@/config/redux/reducer/authReducer";

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // Check if token exists in localStorage on app load
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem("token");
      if (token) {
        store.dispatch(setTokenIsThere());
      }
    }
  }, []);

  return (
    <>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </>
  );
}
