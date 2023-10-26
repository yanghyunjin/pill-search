"use client";
import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/navigation";


function CategoryPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();

  type CategoryKeys = 'code114' | 'code233' | 'code269' | 'code214' | 'code218' | 'code421';

  const categories: Record<CategoryKeys, string> = {
    code114: '해열, 진통, 소염제',
    code233: '건위소화제',
    code269: '기타의 외피용약',
    code214: '혈압강하제',
    code218: '동맥경화제',
    code421: '항악성종양제',
  };

  const key = `code${params.id}` as CategoryKeys;
  
  const [searchFields, setSearchFields] = useState({
    companyName: '',
    division: '',
    productName: '',
    insuranceCode: '',
  });

  // 예시 데이터 (실제 서버에서 가져와야 할 데이터)
  const products = [
    {
      image: '/path/to/image1.jpg',
      productName: '약품1',
      ingredient: '주성분1',
      companyName: '업체1',
      division: '구분1',
      insuranceCode: '보험코드1',
    },
    {
      image: '/path/to/image1.jpg',
      productName: '약품1',
      ingredient: '주성분1',
      companyName: '업체1',
      division: '구분1',
      insuranceCode: '보험코드1',
    },
    {
      image: '/path/to/image1.jpg',
      productName: '약품1',
      ingredient: '주성분1',
      companyName: '업체1',
      division: '구분1',
      insuranceCode: '보험코드1',
    },
    {
      image: '/path/to/image1.jpg',
      productName: '약품1',
      ingredient: '주성분1',
      companyName: '업체1',
      division: '구분1',
      insuranceCode: '보험코드1',
    },
    // ... (더 많은 제품 데이터)
  ];

  const handleChange = (e:any) => {
    setSearchFields({
      ...searchFields,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = () => {
    // 검색 로직 구현
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
      <div className="text-black flex-grow flex flex-col items-center">
        <div className="w-full max-w-3xl mb-12 relative">
          <h1 className="text-2xl mb-4">
            <span className="text-blue-500">{`${params.id} ${categories[key]}`}</span>
            <span className="text-black">검색결과 리스트 (33개)</span>
          </h1>

          <div className="mb-6 grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">업체명</label>
              <input type="text" name="companyName" id="companyName" value={searchFields.companyName} onChange={handleChange} className="mt-1 block w-full text-lg p-2"/>
            </div>

            <div>
              <label htmlFor="division" className="block text-sm font-medium text-gray-700">구분</label>
              <input type="text" name="division" id="division" value={searchFields.division} onChange={handleChange} className="mt-1 block w-full text-lg p-2"/>
            </div>

            <div>
              <label htmlFor="productName" className="block text-sm font-medium text-gray-700">제품명</label>
              <input type="text" name="productName" id="productName" value={searchFields.productName} onChange={handleChange} className="mt-1 block w-full text-lg p-2"/>
            </div>

            <div>
              <label htmlFor="insuranceCode" className="block text-sm font-medium text-gray-700">보험코드</label>
              <input type="text" name="insuranceCode" id="insuranceCode" value={searchFields.insuranceCode} onChange={handleChange} className="mt-1 block w-full text-lg p-2"/>
            </div>
          </div>

          <button className="w-full bg-blue-200 mb-6 px-4 py-2 rounded-md" onClick={handleSearch} >검색</button>

          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="border-b border-gray-200 px-4 py-2 text-left text-sm font-semibold text-gray-600">이미지</th>
                <th className="border-b border-gray-200 px-4 py-2 text-left text-sm font-semibold text-gray-600">제품명</th>
                <th className="border-b border-gray-200 px-4 py-2 text-left text-sm font-semibold text-gray-600">주성분 및 함량</th>
                <th className="border-b border-gray-200 px-4 py-2 text-left text-sm font-semibold text-gray-600">업체명</th>
                <th className="border-b border-gray-200 px-4 py-2 text-left text-sm font-semibold text-gray-600">구분</th>
                <th className="border-b border-gray-200 px-4 py-2 text-left text-sm font-semibold text-gray-600">보험코드</th>
              </tr>
            </thead>
            <tbody>
              {/* 각 행에 대한 데이터를 매핑하는 부분 */}
              {products.map((item) => (
                <tr key={item.productName} className="hover:bg-gray-100" onClick={()=>router.push(`/result/${item.productName}`)}>
                  <td className="border-b border-gray-200 px-4 py-2"><img src={item.image} alt={item.productName} className="w-10 h-10"/></td>
                  <td className="border-b border-gray-200 px-4 py-2">{item.productName}</td>
                  <td className="border-b border-gray-200 px-4 py-2">{item.ingredient}</td>
                  <td className="border-b border-gray-200 px-4 py-2">{item.companyName}</td>
                  <td className="border-b border-gray-200 px-4 py-2">{item.division}</td>
                  <td className="border-b border-gray-200 px-4 py-2">{item.insuranceCode}</td>
                </tr>
              ))}
            </tbody>
          </table>


          <div className="mt-6">
            {/* 페이지 네비게이션 구현 */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryPage;

