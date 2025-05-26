import { useNavigate } from "react-router-dom";

export default function Seller() {
  const navigate = useNavigate();
  return (
    <>
      <div>Seller페이지입니다.</div>
      <button
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/login");
        }}
      >
        로그아웃
      </button>
    </>
  );
}
