"use client";
import Head from "next/head";
import { db, app } from '../../../firebase'; // Firebase 설정 파일
import { ref, get, set, push, child, remove, update, serverTimestamp } from 'firebase/database';
import { useState, useEffect, SetStateAction } from "react";
import { useRouter } from "next/navigation";

type CategoryKeys = 'code114' | 'code233' | 'code269' | 'code214' | 'code218' | 'code421';

const categories: Record<CategoryKeys, string> = {
  code114: '해열, 진통, 소염제',
  code233: '건위소화제',
  code269: '기타의 외피용약',
  code214: '혈압강하제',
  code218: '동맥경화제',
  code421: '항악성종양제',
};

type Product = {
  GnlNmCd: string;
  ItemName: string;
  ingredient: string;
  EntpName: string;
  EtcOtcName: string;
  insuranceCode: string;
};


function CategoryPage({
  params,
}: {
  params: { id: string };
}) {

  const router = useRouter();
  const [products,setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const maxPageNumbersToShow = 10;
  const totalPages = products? Math.ceil(products.length / itemsPerPage):0;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products? products.slice(indexOfFirstItem, indexOfLastItem):[];
  const [startingPageNumber, setStartingPageNumber] = useState(1);
  const endingPageNumber = startingPageNumber + maxPageNumbersToShow - 1;

  const key = `code${params.id}` as CategoryKeys;

  const [searchFields, setSearchFields] = useState({
    companyName: '',
    division: '',
    productName: '',
    insuranceCode: '',
  });

  
  
  useEffect(()=>{
    getProductsData();
  },[])

  useEffect(()=>{
    console.log(currentItems)
    getProductsDetail(currentItems)
  },[currentItems])

  const handlePageChange = (pageNumber: any) => {
    setCurrentPage(pageNumber);
  }
    
  const getProductsDetail= async(productCode:any)=>{
    setIsLoading(true);
    console.log(productCode)
    const promises = productCode.map(async (item: any) => {
      console.log(item.GnlNmCd)
      const snapshot = await get(child(ref(db), `/StandardCodeWithPriceByGnlNmCode/${item.GnlNmCd}`));
      const data = snapshot.val();
      console.log(data);
    });
  
    // const results = await Promise.all(promises); 
    setIsLoading(false); 
  };
  const getProductsData= async()=>{
    setIsLoading(true);
    const ret = await get(child(ref(db), `/BenefitDrugList/${params.id}`));
    await setProducts(ret.val());
    await getProductsDetail(currentItems);
    setIsLoading(false); 
  };

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
            <span className="text-black">{`검색결과 리스트 (${products?products.length:0}개)`}</span>
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
          {isLoading ? (
            
          <div className="flex items-center justify-center ">
            <div  
              className="inline-block h-20 w-20 animate-spin rounded-full border-8 border-solid border-blue-500 border-r-transparent"
              role="status">
              <span
                className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                >Loading...
              </span>
            </div>
          </div>
        ) : (
            // 실제 콘텐츠
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  {/* <th className="border-b border-gray-200 px-4 py-2 text-left text-sm font-semibold text-gray-600">이미지</th> */}
                  <th className="border-b w-60 border-gray-200 px-4 py-2 text-left text-sm font-semibold text-gray-600">제품명</th>
                  <th className="border-b border-gray-200 px-4 py-2 text-left text-sm font-semibold text-gray-600">주성분 및 함량</th>
                  <th className="border-b w-40 border-gray-200 px-4 py-2 text-left text-sm font-semibold text-gray-600">업체명</th>
                  <th className="border-b border-gray-200 px-4 py-2 text-left text-sm font-semibold text-gray-600">구분</th>
                  <th className="border-b border-gray-200 px-4 py-2 text-left text-sm font-semibold text-gray-600">보험코드</th>
                </tr>
              </thead>
              <tbody>
                {/* 각 행에 대한 데이터를 매핑하는 부분 */}
                {currentItems.map((item,idx) => (
                  <tr key={`${item.GnlNmCd}${idx}`} className="hover:bg-gray-100" onClick={()=>router.push(`/result/${item.GnlNmCd}`)}>
                    {/* <td className="border-b border-gray-200 px-4 py-2"><img src={item.image} alt={item.productName} className="w-10 h-10"/></td> */}
                    <td className="border-b border-gray-200 px-4 py-2">{item.ItemName}</td>
                    <td className="border-b border-gray-200 px-4 py-2">{item.ingredient}</td>
                    <td className="border-b border-gray-200 px-4 py-2">{item.EntpName}</td>
                    <td className="border-b border-gray-200 px-4 py-2">{item.EtcOtcName}</td>
                    <td className="border-b border-gray-200 px-4 py-2">{item.insuranceCode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
        )}
          
          {
            !isLoading && (
            <div className="mt-6 flex justify-center items-center">
              <button 
                disabled={startingPageNumber === 1} 
                onClick={() => {
                  setStartingPageNumber(prev => Math.max(prev - maxPageNumbersToShow, 1));
                  setCurrentPage(prev => Math.max(prev - maxPageNumbersToShow, 1));
                }}
              >
                &lt;
              </button>
              {[...Array(maxPageNumbersToShow)].map((_, idx) => {
                const pageNumber = startingPageNumber + idx;
                return (
                  <span 
                    key={pageNumber} 
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`cursor-pointer px-2 ${currentPage === pageNumber ? 'text-blue-600 font-bold' : 'text-gray-500'}`}
                  >
                    {pageNumber}
                  </span>
                );
              })}
              <button 
                disabled={endingPageNumber >= totalPages}
                onClick={() => {
                  setStartingPageNumber(prev => Math.min(prev + maxPageNumbersToShow, totalPages - maxPageNumbersToShow + 1));
                  setCurrentPage(prev => Math.min(prev + maxPageNumbersToShow, totalPages));
                }}
              >
                &gt;
              </button>
            </div>
            )
          }
        </div>
      </div>
    </div>
  );
}

export default CategoryPage;

