import { useGoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { googleSignIn } from "../../services/userAuthServices";

const GoogleSigninButton: React.FC<{ role: string }> = ({ role }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const login = useGoogleLogin({
    flow: "implicit", 
    onSuccess: async (tokenResponse) => {
      console.log("Full token response:", tokenResponse);

      await dispatch(
        googleSignIn({
          token: tokenResponse.access_token as string, 
          role: role.toLowerCase() as 'learner'|'instructor'|'business',
        })
      ).unwrap();    
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
