import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    document.title= "어서오세요 - 홈페이지 입니다."
  }, []);

  return (
    <>
      <h1>홈페이지 입니다.</h1>
      <button onClick={() => {
        localStorage.removeItem("token");
        navigate("/login");
      }}>
        로그아웃
      </button>
    </>
  )
}