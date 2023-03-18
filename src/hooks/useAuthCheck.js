import { size } from "lodash";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { userLoggedIn } from "../features/auth/authSlice";

const useAuthCheck = () => {
  const [authChecked, setAuthChecked] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("auth")) || "";

    if (auth) {
      const userInfo = {
        accessToken: auth?.accessToken,
        user: auth?.user,
      };

      if (size(userInfo) && auth?.accessToken) {
        dispatch(userLoggedIn(userInfo));
      }
    }
    setAuthChecked(true);
  }, [dispatch]);

  return authChecked;
};

export default useAuthCheck;
