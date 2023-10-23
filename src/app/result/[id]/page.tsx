"use client"
import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import SearchResultCard from '../../../components/SearchResultCard';
import RecommendedKeyword from '../../../components/RecommendedKeyword';


function ResultDetail() {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지
    router.push(`/search?query=${query}`);
  }

  // 상세 정보 카드
  const DetailInfoCard: React.FC = () => {
    return (
      <div className="bg-white p-4 rounded-md shadow-sm mb-6">
        <h4 className="font-semibold mb-4">상세 정보</h4>
        <p><strong>제조업체:</strong> 예시 제조업체</p>
        <p><strong>성분:</strong> 예시 성분</p>
        <p><strong>이름:</strong> 예시 이름</p>
        <p><strong>제약사:</strong> 예시 제약사</p>
        {/* 기타 정보들... */}
      </div>
    );
  }

  // 제품 이미지 카드
  const ProductImageCard: React.FC = () => {
    return (
      <div className="bg-white p-4 rounded-md shadow-sm mb-6">
        <img src="/path/to/image.jpg" alt="제품 이미지" className="w-full h-auto" />
      </div>
    );
  }

  // 동일 성분 의약품 카드
  const SimilarIngredientCard: React.FC = () => {
    return (
      <div className="bg-white p-4 rounded-md shadow-sm">
        <h4 className="font-semibold mb-4">동일 성분 의약품</h4>
        <p>예시 의약품1</p>
        <p>예시 의약품2</p>
        {/* 기타 동일 성분 의약품들... */}
      </div>
    );
  }


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
      <main className="flex-grow flex flex-col items-center text-black">
        <div className="w-full max-w-3xl mb-12 relative">
          <h2 className="text-3xl text-black font-semibold mb-6">의약품검색</h2>
          <svg className="absolute top-1/2 left-3 mt-[20px] w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
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
        {/* 상세 결과 섹션 */}
        <div className="w-full max-w-3xl flex flex-wrap -mx-2">
          <div className="w-1/2 px-2">
            <DetailInfoCard />
          </div>
          <div className="w-1/2 px-2">
            <ProductImageCard />
            <SimilarIngredientCard />
          </div>
        </div>
      </main>
    </div>
  );
}

export default ResultDetail;