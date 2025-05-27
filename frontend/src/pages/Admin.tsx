import { useNavigate } from "react-router-dom";

export default function Admin() {
  const navigate = useNavigate();
  return (
    <>
      <h1>관리자 페이지 입니다.</h1>
      <button onClick={() => {
        localStorage.removeItem("token");
        navigate("/login");
      }}>
        로그아웃
      </button>
    </>
  )
}
