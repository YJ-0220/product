export default function LoginForm() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="relative w-[400px] h-[500px] items-center border-2 border-[#00fcfc] rounded-2xl">
        <div className="flex flex-col items-center justify-center">
          <h1 className="items-center justify-center py-10 font-black text-2xl">
            홈페이지 제목이요
          </h1>
          <form className="flex flex-col items-center justify-center">
            <input
              type="text"
              placeholder="아이디를 입력해주세요"
              className="w-full"
            />
            <input type="password" placeholder="비밀번호를 입력해주세요" />
            <button type="submit">로그인</button>
            <div className="">
              <input type="checkbox" name="로그인 유지" />
              <label className="pl-2">
                <span className="font-normal">로그인 유지</span>
              </label>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
