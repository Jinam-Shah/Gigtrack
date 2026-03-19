import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm/LoginForm.jsx";

export default function LoginPage() {
  const navigate = useNavigate();

  function handleSuccess() {
    navigate("/gigs");
  }

  return <LoginForm onSuccess={handleSuccess} />;
}