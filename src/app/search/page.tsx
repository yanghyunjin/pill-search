"use client";
import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import SearchResultCard from "../../components/SearchResultCard";
import RecommendedKeyword from "../../components/RecommendedKeyword";

function SearchResults() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("query"));
  const router = useRouter();
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지
    router.push(`/search?query=${query}`);
  };
  const handleKeywordClick = (keyword: string) => {
    // 추천 검색어 클릭시 검색 페이지로 이동하거나 해당 검색어로 검색 결과 갱신
    setQuery(keyword);
    router.push(`/search?query=${keyword}`);
  };

  return (
    <div className="flex flex-col min-h-screen p-6 bg-gray-100">
      <Head>
        <title>MEDIPRETER</title>
        <meta name="description" content="의약품 검색 포털" />
      </Head>

      {/* Header / Logo */}
      <header className="mb-12">
        <div className="bg-blue-200 p-4 rounded-md inline-block">
          <h1 className="text-4xl font-bold inline">
            <span className="text-white">MEDI</span>
            <span className="text-black">PRETER</span>
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center">
        <div className="w-full max-w-3xl mb-12 relative">
          <h2 className="text-3xl text-black font-semibold mb-6">의약품검색</h2>
          <svg
            className="absolute top-1/2 left-3 mt-[20px] w-5 h-5 text-gray-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <form onSubmit={handleSearch}>
            <input
              type="text"
              value={query?.toString()}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="의약품 이름을 입력하세요..."
              className="w-full p-4 pl-12 text-lg text-black border rounded-md focus:outline-none focus:border-blue-500"
            />
          </form>
        </div>
        {/* 추천 검색어 */}
        <div className="w-full max-w-3xl mb-12">
          <h3 className="text-xl text-black font-semibold mb-4">추천 검색어</h3>
          <ul className="flex flex-wrap gap-2">
            {/* 예시로 몇 개의 추천 검색어를 추가하였습니다. */}
            {["감기약", "소화제", "진통제", "비타민"].map((keyword, idx) => (
              <RecommendedKeyword
                key={keyword}
                keyword={keyword}
                onClickKeyword={handleKeywordClick}
              />
            ))}
          </ul>
        </div>

        {/* 검색 결과 목록 */}
        <div className="w-full max-w-3xl">
          <h3 className="text-xl text-black font-semibold mb-4">
            검색 결과 (333)
          </h3>
          {/* 예시로 검색 결과를 추가하였습니다. 실제로는 API 호출 결과나 상태 관리 로직을 사용하여 검색 결과를 렌더링하실 수 있습니다. */}
          <SearchResultCard
            id="1"
            title="검색 결과1"
            description="검색 결과1에 대한 설명입니다."
            query={query? query:''}
          />
          <SearchResultCard
            id="2"
            title="검색 결과2"
            description="검색 결과2에 대한 설명입니다."
            query={query? query:''}
          />
          <SearchResultCard
            id="3"
            title="검색 결과3"
            description="검색 결과3에 대한 설명입니다."
            query={query? query:''}
          />
        </div>
      </main>
    </div>
  );
}

export default SearchResults;
