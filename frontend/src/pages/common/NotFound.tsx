import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div>
      <h1>존재하지 않는 페이지입니다.</h1>
      <button
        onClick={() => navigate("/")}
      >
        홈으로 가기
      </button>
    </div>
  );
}
