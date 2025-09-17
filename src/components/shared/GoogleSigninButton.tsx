import { useGoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { googleSignIn } from "../../redux/services/userAuthServices";
import { setLearner } from "../../redux/slices/learnerSlice";
import { setInstructor } from "../../redux/slices/instructorSlice";
import { setBusiness } from "../../redux/slices/businessSlice";

const GoogleSigninButton: React.FC<{ role: string }> = ({ role }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const login = useGoogleLogin({
    flow: "implicit", 
    onSuccess: async (tokenResponse) => {
      console.log("Full token response:", tokenResponse);

      const result = await dispatch(
        googleSignIn({
          token: tokenResponse.access_token as string, 
          role: role.toLowerCase(),
        })
      ).unwrap();

      const user = result.user;
      if (role === "Learner") {
        dispatch(setLearner(user));
      } else if (role === "Instructor") {
        dispatch(setInstructor(user));
      } else {
        dispatch(setBusiness(user));
      }
      navigate(`/${role.toLowerCase()}/dashboard`);
    },
    onError: () => console.log("Login Failed"),
    scope: "openid profile email",
  });

  return (
    <button
      onClick={() => login()}
      className="w-full max-w-sm flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 font-medium shadow-sm hover:bg-gray-50 transition-colors"
    >
      <img
        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
        alt="Google Logo"
        className="w-5 h-5"
      />
      <span>Sign in with Google as {role}</span>
    </button>
  );
};

export default GoogleSigninButton;
