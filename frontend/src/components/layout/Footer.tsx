import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-gray-700 text-gray-400">
      <div className="flex justify-center items-center gap-2">
        <Link to="/" className="text-sm text-gray-400 hover:text-white">
          이용약관
        </Link>
        <Link to="/" className="text-sm text-gray-400 hover:text-white">
          개인정보처리방침
        </Link>
        <Link to="/" className="text-sm text-gray-400 hover:text-white">
          고객센터
        </Link>
      </div>
      <div className="px-4 py-2 text-[11px] leading-4 text-center">
        © 2025 마켓플레이스
      </div>
    </footer>
  );
}
