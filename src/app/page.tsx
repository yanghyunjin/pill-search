"use client"
import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const categories = [
  { name: '감기', image: '/images/cold.jpg' },
  { name: '소화질환', image: '/images/digestion.jpg' },
  { name: '천식', image: '/images/asthma.jpg' },
  { name: '근육통', image: '/images/muscle_pain.jpg' },
  { name: '눈병', image: '/images/eye_disease.jpg' },
  { name: '피부', image: '/images/skin.jpg' },
  { name: '심혈관', image: '/images/cardiovascular.jpg' },
  { name: '온열질환', image: '/images/thermal_disease.jpg' },
];

export default function Home() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지
    router.push(`/search?query=${query}`);
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
      <main className="flex-grow flex flex-col items-center">
        <div className="w-full max-w-3xl mb-12 relative">
          <h2 className="text-3xl text-black font-semibold mb-6">의약품검색</h2>
          <svg className="absolute top-1/2 left-3 mt-[20px] w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <form onSubmit={handleSearch}>
            <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="의약품 이름을 입력하세요..."
                className="w-full p-4 pl-12 text-lg text-black border rounded-md focus:outline-none focus:border-blue-500"
            />
           </form>
        </div>


        <section className='w-full max-w-3xl'>
        <h3 className="text-2xl text-black font-semibold mb-6">의약품 카테고리</h3>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {categories.map(category => (
              <div key={category.name} className="bg-white rounded-md shadow">
                
                <div className="p-4">
                  <h4 className="text-lg text-black font-semibold">{category.name}</h4>
                </div>
                <img src={category.image} alt={category.name} className="w-full h-32 m-4 rounded-t-md object-cover" />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}