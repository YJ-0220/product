import { Link } from "react-router-dom";

export default function OrderBoard() {
  return (
    <div>
      <h1>Order 게시판 입니다.</h1>
      <Link to="/order/request">주문하기</Link>
    </div>
  );
}