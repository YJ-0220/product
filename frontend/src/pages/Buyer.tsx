import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    document.title = "어서오세요 - 홈페이지 입니다.";
  }, []);

  return (
    <>
      <h1>구매자 홈페이지 입니다.</h1>
    </>
  );
}
