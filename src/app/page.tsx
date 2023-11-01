"use client";
import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/navigation";

const categoriesOTC = [
  { name: "해열, 진통, 소염제", code: "114", image: "/images/0.png" },
  { name: "건위소화제", code: "233", image: "/images/1.png" },
  { name: "기타의 외피용약", code: "269", image: "/images/2.png" },
];

const categoriesETC = [
  { name: "혈압강하제", code: "214", image: "/images/3.png" },
  { name: "동맥경화제", code: "218", image: "/images/4.png" },
  { name: "항악성종양제", code: "421", image: "/images/5.png" },
];

export default function Home() {
  const datas = require("/public/itemname-itemseq.json");
  const productName = Object.keys(datas);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value) {
      const filteredProducts = productName.filter((product) =>
        product.includes(value)
      );
      setSuggestions(filteredProducts);
    } else {
      setSuggestions([]);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지
    router.push(`/search?query=${query}`);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setSuggestions([]); // 자동완성 목록 숨기기
    router.push(`/search?query=${suggestion}`); // 바로 검색 페이지로 이동
  };

  return (
    <div className="flex flex-col min-h-screen p-6 bg-gray-100">
      <Head>
        <title>MEDIPRETER</title>
        <meta name="description" content="의약품 검색 포털" />
      </Head>

      {/* Header / Logo */}
      {/* <header className="mb-12">
        <div className="bg-blue-200 p-4 rounded-md inline-block" onClick={()=>router.push("/")}>
          <h1 className="text-4xl font-bold inline">
            <span className="text-white">MEDI</span>
            <span className="text-black">PRETER</span>
          </h1>
        </div>
        
      </header> */}
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
      <main className="text-black flex-grow flex flex-col items-center">
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
              value={query}
              onChange={handleInputChange}
              placeholder="의약품 이름을 입력하세요..."
              className="w-full p-4 pl-12 text-lg text-black border rounded-md focus:outline-none focus:border-blue-500"
            />
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 mt-2 bg-white border rounded-md shadow-lg z-10">
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion}
                    className="p-2 hover:bg-gray-200 cursor-pointer"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </form>
        </div>

        <section className="w-full max-w-3xl">
          <div>
            {/* OTC Section */}
            <h3 className="text-2xl text-black font-semibold mb-4">
              Top 3 일반 의약품(OTC) 매출액
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {categoriesOTC.map((category) => (
                <div
                  key={category.code}
                  onClick={() => router.push(`/categories/${category.code}`)}
                  className="bg-white rounded-md shadow transition-transform transform hover:scale-105 hover:shadow-lg"
                >
                  <div className="flex flex-col items-center justify-center p-4">
                    <p className="text-gray-600">{category.code}</p>
                    <h4 className="text-lg text-black font-semibold">
                      {category.name}
                    </h4>
                  </div>
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-32 rounded-t-md object-scale-down object-center"
                  />
                </div>
              ))}
            </div>

            {/* ETC Section */}
            <h3 className="text-2xl text-black font-semibold mb-4">
              Top 3 전문의약품(ETC) 매출액
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {categoriesETC.map((category) => (
                <div
                  key={category.code}
                  onClick={() => router.push(`/categories/${category.code}`)}
                  className="bg-white rounded-md shadow transition-transform transform hover:scale-105 hover:shadow-lg"
                >
                  <div className="flex flex-col items-center justify-center p-4">
                    <p className="text-gray-600">{category.code}</p>
                    <h4 className="text-lg text-black font-semibold">
                      {category.name}
                    </h4>
                  </div>
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-32 rounded-t-md object-scale-down object-center"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
