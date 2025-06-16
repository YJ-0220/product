import { useNavigate } from "react-router-dom";

export default function OrderSuccess() {
  const navigate = useNavigate();

  return (
    <div className="p-4">
      <h2>주문이 성공적으로 완료되었습니다!</h2>
      <button onClick={() => navigate("/orders")}>주문 목록 보러가기</button>
      <button onClick={() => navigate("/order-request")}>주문 더하기</button>
    </div>
  );
}