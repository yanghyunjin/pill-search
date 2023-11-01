"use client";
import Head from "next/head";
import { db, app } from "../../../firebase"; // Firebase 설정 파일
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
import { useState, useEffect, SetStateAction } from "react";
import { useRouter } from "next/navigation";

type CategoryKeys =
  | "code114"
  | "code233"
  | "code269"
  | "code214"
  | "code218"
  | "code421";

const categories: Record<CategoryKeys, string> = {
  code114: "해열, 진통, 소염제",
  code233: "건위소화제",
  code269: "기타의 외피용약",
  code214: "혈압강하제",
  code218: "동맥경화제",
  code421: "항악성종양제",
};

function CategoryPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [productsDetail, setProductsDetail] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const maxPageNumbersToShow = 10;
  const totalPages = products ? Math.ceil(products.length / itemsPerPage) : 0;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products
    ? products.slice(indexOfFirstItem, indexOfLastItem)
    : [];
  const items = products
    ? products.slice(indexOfFirstItem, indexOfLastItem)
    : [];
  const [startingPageNumber, setStartingPageNumber] = useState(1);
  const endingPageNumber = startingPageNumber + maxPageNumbersToShow - 1;
  const key = `code${params.id}` as CategoryKeys;
  const datas = require(`/public/products${params.id}.json`);

  const [searchFields, setSearchFields] = useState({
    entpname: "",
    etcotcname: "",
    itemname: "",
    edicode: "",
  });

  useEffect(() => {
    setIsLoading(true);
    setProducts(datas);
    setIsLoading(false);
    // getProductsData();
  }, []);

  const getProductsData = async () => {
    setIsLoading(true);
    const ret = await get(child(ref(db), `/BenefitDrugs/${params.id}`));
    // 데이터를 가져와서 unique한 GnlNmCd만을 가진 아이템들을 필터링
    const data = ret.val();
    console.log(data);
    const uniqueGnlNmCdItems: any = [];
    const seen = new Set();

    for (const item of data) {
      if (!seen.has(item.gnlnmcd)) {
        seen.add(item.gnlnmcd);
        uniqueGnlNmCdItems.push(item);
      }
    }
    let array: any = [];
    for (let i = 0; i < uniqueGnlNmCdItems.length; i++) {
      const snapshot = await get(
        child(
          ref(db),
          `/MergedDrugInfoByGnlNmCd2/${uniqueGnlNmCdItems[i].gnlnmcd}`
        )
      );
      console.log(i);
      console.log(snapshot.val());
      if (snapshot.val() != null) {
        array.push(...snapshot.val());
      }
    }
    console.log(array);
    await setProducts(array);
    setIsLoading(false);
  };

  const handleChange = (e: any) => {
    setSearchFields({
      ...searchFields,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = () => {
    // 원본 데이터 (예를 들어 products)를 필터링하여 일치하는 항목만 가져옵니다.
    const filteredProducts = datas.filter(
      (product: {
        entpname: string | string[];
        etcotcname: string | string[];
        itemname: string | string[];
        edicode: string | string[];
      }) => {
        // 각 필드에 대해 검색 조건을 확인합니다.
        if (
          searchFields.entpname &&
          !product.entpname.includes(searchFields.entpname)
        ) {
          return false;
        }
        if (
          searchFields.etcotcname &&
          !product.etcotcname.includes(searchFields.etcotcname)
        ) {
          return false;
        }
        if (
          searchFields.itemname &&
          !product.itemname.includes(searchFields.itemname)
        ) {
          return false;
        }
        if (
          searchFields.edicode &&
          !String(product.edicode).includes(searchFields.edicode)
        ) {
          return false;
        }
        // 위의 모든 조건을 만족하는 경우에만 결과에 포함시킵니다.
        return true;
      }
    );

    // 필터링된 결과를 상태로 설정합니다.
    setProducts(filteredProducts);
    setCurrentPage(1);
  };
  const handleDownload = () => {
    // products 배열을 문자열로 변환
    const jsonData = JSON.stringify(products, null, 2); // 두 번째와 세 번째 인수를 사용하여 JSON을 읽기 쉽게 포맷팅
    const blob = new Blob([jsonData], { type: "application/json" }); // Blob 생성
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "products.json"; // 다운로드될 파일 이름
    document.body.appendChild(a);
    a.click(); // 다운로드 링크를 클릭하여 파일 다운로드 시작
    a.remove(); // 링크 제거
    URL.revokeObjectURL(url); // URL을 해제하여 메모리를 해제합니다.
  };
  const renderItems = () => {
    return currentItems.map((item: any, idx) => (
      <tr
        key={`${item.GnlNmCd}${idx}`}
        className="hover:bg-gray-100"
        onClick={() =>
          router.push(
            `/result/${item.itemseq}?name=${item.itemname}&query=${item.itemname}`
          )
        }
      >
        <td className="border-b border-gray-200 px-4 py-2">
          <img src={item.itemimage} alt={item.GnlNmCd} className="w-20 h-20" />
        </td>
        <td className="border-b border-gray-200 px-4 py-2">{item.itemname}</td>
        <td className="border-b border-gray-200 px-4 py-2">
          {`${item.gnlnm} ${item.capacity}${item.unit}`}
        </td>
        <td className="border-b border-gray-200 px-4 py-2">{item.entpname}</td>
        <td className="border-b border-gray-200 px-4 py-2">
          {item.etcotcname}
        </td>
        <td className="border-b border-gray-200 px-4 py-2">{item.edicode}</td>
      </tr>
    ));
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
      <div className="text-black flex-grow flex flex-col items-center">
        <div className="w-full md:w-9/12 mb-12 relative">
          <h1 className="text-2xl mb-4">
            <span className="text-blue-500">{`${params.id} ${categories[key]}`}</span>
            <span className="text-black">{`검색결과 리스트 (${
              products ? products.length : 0
            }개)`}</span>
          </h1>

          <div className="mb-6 grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="entpname"
                className="block text-sm font-medium text-gray-700"
              >
                업체명
              </label>
              <input
                type="text"
                name="entpname"
                id="entpname"
                value={searchFields.entpname}
                onChange={handleChange}
                className="mt-1 block w-full text-lg p-2"
              />
            </div>

            <div>
              <label
                htmlFor="etcotcname"
                className="block text-sm font-medium text-gray-700"
              >
                구분
              </label>
              <input
                type="text"
                name="etcotcname"
                id="etcotcname"
                value={searchFields.etcotcname}
                onChange={handleChange}
                className="mt-1 block w-full text-lg p-2"
              />
            </div>

            <div>
              <label
                htmlFor="itemname"
                className="block text-sm font-medium text-gray-700"
              >
                제품명
              </label>
              <input
                type="text"
                name="itemname"
                id="itemname"
                value={searchFields.itemname}
                onChange={handleChange}
                className="mt-1 block w-full text-lg p-2"
              />
            </div>

            <div>
              <label
                htmlFor="edicode"
                className="block text-sm font-medium text-gray-700"
              >
                보험코드
              </label>
              <input
                type="text"
                name="edicode"
                id="edicode"
                value={searchFields.edicode}
                onChange={handleChange}
                className="mt-1 block w-full text-lg p-2"
              />
            </div>
          </div>

          <button
            className="w-full bg-blue-200 mb-6 px-4 py-2 rounded-md"
            onClick={handleSearch}
          >
            검색
          </button>
          {/* <button onClick={handleDownload}>다운로드</button> */}

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
            // 실제 콘텐츠
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className=" border-b border-gray-200 px-4 py-2 text-left text-sm font-semibold text-gray-600">
                    이미지
                  </th>
                  <th className="border-b w-60 border-gray-200 px-4 py-2 text-left text-sm font-semibold text-gray-600">
                    제품명
                  </th>
                  <th className="border-b border-gray-200 px-4 py-2 text-left text-sm font-semibold text-gray-600">
                    주성분 및 함량
                  </th>
                  <th className="border-b w-40 border-gray-200 px-4 py-2 text-left text-sm font-semibold text-gray-600">
                    업체명
                  </th>
                  <th className=" border-b border-gray-200 px-4 py-2 text-left text-sm font-semibold text-gray-600">
                    구분
                  </th>
                  <th className=" border-b border-gray-200 px-4 py-2 text-left text-sm font-semibold text-gray-600">
                    보험코드
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* 각 행에 대한 데이터를 매핑하는 부분 */}
                {renderItems()}
              </tbody>
            </table>
          )}

          {!isLoading && (
            <div className="mt-6 flex justify-center items-center">
              <button
                disabled={startingPageNumber === 1}
                onClick={() => {
                  setStartingPageNumber((prev) =>
                    Math.max(prev - maxPageNumbersToShow, 1)
                  );
                  setCurrentPage((prev) =>
                    Math.max(prev - maxPageNumbersToShow, 1)
                  );
                }}
              >
                &lt;
              </button>
              {
                // 페이지 번호를 매핑할 때 maxPageNumbersToShow와 totalPages 중 더 작은 값을 사용
                [...Array(Math.min(maxPageNumbersToShow, totalPages))].map(
                  (_, idx) => {
                    const pageNumber = startingPageNumber + idx;
                    return (
                      <span
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`cursor-pointer px-2 ${
                          currentPage === pageNumber
                            ? "text-blue-600 font-bold"
                            : "text-gray-500"
                        }`}
                      >
                        {pageNumber}
                      </span>
                    );
                  }
                )
              }
              <button
                // endingPageNumber의 조건을 수정하여 totalPages를 고려
                disabled={
                  endingPageNumber >= totalPages ||
                  startingPageNumber + maxPageNumbersToShow > totalPages
                }
                onClick={() => {
                  setStartingPageNumber((prev) =>
                    Math.min(
                      prev + maxPageNumbersToShow,
                      totalPages - maxPageNumbersToShow + 1
                    )
                  );
                  setCurrentPage((prev) =>
                    Math.min(prev + maxPageNumbersToShow, totalPages)
                  );
                }}
              >
                &gt;
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CategoryPage;
