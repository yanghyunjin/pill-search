"use client";
import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import SearchResultCard from "../../components/SearchResultCard";
import RecommendedKeyword from "../../components/RecommendedKeyword";
import { db, app } from "../../firebase"; // Firebase 설정 파일
import {
  ref,
  get,
  set,
  push,
  child,
  remove,
  update,
  serverTimestamp,
} from "firebase/database";

function SearchResults() {
  const searchParams = useSearchParams();
  const datas = require("/public/itemname-itemseq.json");
  const [isLoading, setIsLoading] = useState(true);
  const productName = Object.keys(datas);
  const [query, setQuery] = useState(searchParams.get("query"));
  const router = useRouter();
  const [searchNameResult, setSearchNameResult] = useState<string[]>([]);
  const [searchResultArray, setSearchResultArray] = useState([]);

  useEffect(() => {
    search();
  }, []);

  useEffect(() => {
    getData();
  }, [searchNameResult]);

  const search = async () => {
    if (query) {
      const filteredProducts = productName.filter((product) =>
        product.includes(query ? query : "")
      );
      await setSearchNameResult(filteredProducts);
    }
  };
  const getData = async () => {
    setIsLoading(true);
    const newArray = searchNameResult
      .map((key) => datas[key])
      .filter((value) => value !== undefined);
    let result: any = [];
    for (let i = 0; i < searchNameResult.length; i++) {
      const temp = await get(child(ref(db), `/MergedDrugInfo3/${newArray[i]}`));
      result.push(temp.val());
    }
    setSearchResultArray(result);
    setIsLoading(false);
  };
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지
    search();
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
        <div
          className="rounded-md inline-block"
          onClick={() => router.push("/")}
        >
          <img
            src="/images/logo.jpg"
            alt="MEDI PRETER Logo"
            className="rounded h-16 w-64 object-cover "
          />{" "}
          {/* h-16은 예시로 넣은 이미지 높이입니다. 필요에 따라 조절하세요. */}
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
        {/* <div className="w-full max-w-3xl mb-12">
          <h3 className="text-xl text-black font-semibold mb-4">추천 검색어</h3>
          <ul className="flex flex-wrap gap-2">
            
            {["감기약", "소화제", "진통제", "비타민"].map((keyword, idx) => (
              <RecommendedKeyword
                key={keyword}
                keyword={keyword}
                onClickKeyword={handleKeywordClick}
              />
            ))}
          </ul>
        </div> */}
        {isLoading ? (
          <div className="flex items-center justify-center ">
            <div
              className="inline-block h-20 w-20 animate-spin rounded-full border-8 border-solid border-blue-500 border-r-transparent"
              role="status"
            >
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                Loading...
              </span>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-3xl">
            <h3 className="text-xl text-black font-semibold mb-4">
              {`검색 결과 (${searchResultArray.length})`}
            </h3>
            {searchResultArray.map((item: any) => (
              <SearchResultCard
                key={item.itemseq}
                id={item.itemseq}
                title={item.itemname}
                description={item.company}
                query={item.itemname}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default SearchResults;
