import type { User } from "@/types/userTypes";

interface ProfileTabProps {
  user: User | null;
}

export default function ProfileTab({ user }: ProfileTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">기본 정보</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              사용자명
            </label>
            <p className="mt-1 text-sm text-gray-900">{user?.username}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              역할
            </label>
            <p className="mt-1 text-sm text-gray-900">
              {user?.role === "buyer"
                ? "구매자"
                : user?.role === "seller"
                ? "판매자"
                : "관리자"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              멤버십 등급
            </label>
            <p className="mt-1 text-sm text-gray-900">
              {user?.membershipLevel || "없음"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              보유 포인트
            </label>
            <p className="mt-1 text-sm text-gray-900 font-semibold">
              {user?.points?.toLocaleString() || 0}P
            </p>
          </div>
        </div>
      </div>

      <div className="flex space-x-4">
        {/* 프로필 수정 기능 추가 */}
      </div>
    </div>
  );
}