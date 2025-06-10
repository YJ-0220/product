import { useEffect } from "react";

export default function Buyer() {
  useEffect(() => {
    document.title = "어서오세요 - 홈페이지 입니다.";
  }, []);

  return (
    <div className="p-6">
      구매자 홈페이지입니다.
    </div>
  );
}
