"use client";
import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import SearchResultCard from "../../../components/SearchResultCard";
import RecommendedKeyword from "../../../components/RecommendedKeyword";
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
import { collapseTextChangeRangesAcrossMultipleVersions } from "../../../../node_modules/typescript/lib/typescript";

function ResultDetail({ params }: { params: { id: string } }) {
  const [showDetail, setShowDetail] = useState(false);
  const searchParams = useSearchParams();
  const [name, setName] = useState(searchParams.get("name"));
  const [query, setQuery] = useState(searchParams.get("query"));
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState<any>();
  const [result2, setResult2] = useState<any>();
  const [sameGroup, setSameGroup] = useState<any[]>([]);
  const [sameGroupResult, setSameGroupResult] = useState<any[]>([]);
  const router = useRouter();
  const grouped = require(`/public/group.json`);
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지
    router.push(`/search?query=${query}`);
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    getGroupData();
  }, [sameGroup]);

  const getGroupData = async () => {
    setIsLoading(true);
    let arr: any = [];
    if (sameGroup) {
      for (let i = 0; i < sameGroup.length; i++) {
        const temp = await get(
          child(ref(db), `/MergedDrugInfoByGnlNmCd/${sameGroup[i]}`)
        );
        arr.push(...temp.val());
      }
      if (arr) {
        await setSameGroupResult(arr);
      }
    }
    setIsLoading(false);
  };

  const getData = async () => {
    setIsLoading(true);
    const temp = await get(child(ref(db), `/MergedDrugInfo/${params.id}`));
    setResult(temp.val());
    const temp2 = await get(child(ref(db), `/MajorCmpnNmCdList/${params.id}`));
    setResult2(temp2.val());
    const groupKey = findGroupForText(temp.val().gnlnmcd, grouped);
    if (groupKey) {
      await setSameGroup(grouped[groupKey]);
    }

    setIsLoading(false);
  };

  function findGroupForText(text: any, grouped: any) {
    for (let key in grouped) {
      if (grouped[key].includes(text)) {
        return key;
      }
    }
    return null;
  }

  // 상세 정보 카드
  const DetailInfoCard: React.FC = () => {
    return (
      <div className="bg-white p-4 rounded-md shadow-sm mb-6">
        <h4 className="font-semibold mb-4">상세 정보</h4>
        <table className="min-w-full divide-y divide-gray-200">
          <tbody>
            <tr>
              <td className="py-2  w-1/2">성분명</td>
              <td className="py-2 font-semibold">
                {
                  //@ts-ignore
                  result2?.gnlNm ? result2?.gnlNm : ""
                }
              </td>
            </tr>
            <tr>
              <td className="py-2 ">함량</td>
              <td className="py-2 font-semibold">
                {
                  //@ts-ignore
                  result2?.iqtyTxt ? result2?.iqtyTxt : ""
                }
              </td>
            </tr>
            <tr>
              <td className="py-2 ">업체명</td>

              <td className="py-2 font-semibold">
                {
                  //@ts-ignore
                  result?.entpname ? result?.entpname : ""
                }
              </td>
            </tr>
            <tr>
              <td className="py-2">전문/일반</td>
              <td className="py-2 font-semibold">
                {" "}
                {
                  //@ts-ignore
                  result?.etcotcname ? result?.etcotcname : ""
                }
              </td>
            </tr>
            <tr>
              <td className="py-2">효능(복지부분류코드)</td>
              <td className="py-2 font-semibold">
                {" "}
                {
                  //@ts-ignore
                  result?.classname ? result?.classname : ""
                }
              </td>
            </tr>
            <tr>
              <td className="py-2">성상</td>
              <td className="py-2 font-semibold">
                {
                  //@ts-ignore
                  result?.chart ? result?.chart : ""
                }{" "}
              </td>
            </tr>
            <tr>
              <td className="py-2">약가/급여</td>
              <td className="py-2 font-semibold">
                {
                  //@ts-ignore
                  result?.maxprice ? result?.maxprice : ""
                }{" "}
              </td>
            </tr>
            <tr>
              <td className="py-2">대조/생동</td>
              <td className="py-2 font-semibold">
                {
                  //@ts-ignore
                  result?.compdruggbkor ? result?.compdruggbkor : ""
                }{" "}
              </td>
            </tr>
            <tr>
              <td className="py-2">허가일</td>
              <td className="py-2 font-semibold">
                {" "}
                {
                  //@ts-ignore
                  result?.itempermitdate ? result?.itempermitdate : ""
                }{" "}
              </td>
            </tr>
            <tr>
              <td className="py-2">품목기준코드(허가코드)</td>
              <td className="py-2 font-semibold">
                {" "}
                {
                  //@ts-ignore
                  result?.itemseq ? result?.itemseq : ""
                }
              </td>
            </tr>
            <tr>
              <td className="py-2">일반명코드(주성분코드)</td>
              <td className="py-2 font-semibold">
                {" "}
                {
                  //@ts-ignore
                  result?.gnlnmcd ? result?.gnlnmcd : ""
                }
              </td>
            </tr>
            <tr>
              <td className="py-2">ATC코드(WHO코드)</td>
              <td className="py-2 font-semibold">
                {" "}
                {
                  //@ts-ignore
                  result?.atccode ? result?.atccode : ""
                }
              </td>
            </tr>
            <tr>
              <td className="py-2">EDI코드(보험코드)</td>
              <td className="py-2 font-semibold">
                {" "}
                {
                  //@ts-ignore
                  result?.edicode ? result?.edicode : ""
                }
              </td>
            </tr>
            <tr>
              <td className="py-2">대표코드(품목코드)</td>
              <td className="py-2 font-semibold">
                {" "}
                {
                  //@ts-ignore
                  result?.representativecode ? result?.representativecode : ""
                }
              </td>
            </tr>

            <tr>
              <td className="py-2 ">표준코드(유통 바코드)</td>
              <td className="py-2 font-semibold">
                {
                  //@ts-ignore
                  result?.standardcode ? result?.standardcode : ""
                }
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  // 제품 이미지 카드
  const ProductImageCard: React.FC = () => {
    return (
      <div className="bg-white p-4 rounded-md shadow-sm mb-6">
        <h4 className="font-semibold mb-4">제품 이미지</h4>
        <img
          src={
            //@ts-ignore
            result?.itemimage ? result?.itemimage : ""
          }
          alt="제품 이미지"
          className="w-full h-auto"
        />
        {/* <img
          src={result?.markcodefrontimg? result?.markcodefrontimg:''}
          alt="제품 이미지"
          className="w-full h-auto"
        />
        <img
          src={result?.markcodebackimg? result?.markcodebackimg:''}
          alt="제품 이미지"
          className="w-full h-auto"
        /> */}
        <p>
          {
            //@ts-ignore
            result?.printfront ? result?.printfront : ""
          }
        </p>

        <p>
          {
            //@ts-ignore
            result?.printback ? result?.printback : ""
          }
        </p>
      </div>
    );
  };

  // 동일 성분 의약품 카드
  const SimilarIngredientCard: React.FC = () => {
    return (
      <div className="bg-white p-4 rounded-md shadow-sm">
        <h4 className="font-semibold mb-4">
          {`동일 성분 의약품 (${
            sameGroupResult.length > 0 ? sameGroupResult.length - 1 : 0
          })`}
        </h4>

        {sameGroupResult
          ? sameGroupResult.map((item: any) => {
              if (item.itemseq != result.itemseq) {
                return (
                  <SearchResultCard
                    key={item.itemseq}
                    id={item.itemseq}
                    title={item.itemname}
                    description={item.company}
                    query={item.itemname}
                  />
                );
              }
            })
          : ""}
        {/* 기타 동일 성분 의약품들... */}
      </div>
    );
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
      <main className="flex-grow flex flex-col items-center text-black">
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
        {/* 약품 이름의 검색 결과 텍스트 */}
        <div className="w-full max-w-3xl mb-6">
          <h3 className="text-2xl">
            <span className="text-blue-500">{name}</span>
            <span className="text-black"> 검색 결과</span>
          </h3>
        </div>

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
          <>
            {!showDetail && (
              <div className="w-full max-w-3xl flex flex-wrap -mx-2">
                <div className="w-full md:w-1/2 px-2">
                  {" "}
                  {/* 모바일에서 전체, 중간 크기 화면에서 반반 */}
                  <DetailInfoCard />
                </div>
                <div className="w-full md:w-1/2 px-2">
                  {" "}
                  {/* 모바일에서 전체, 중간 크기 화면에서 반반 */}
                  <ProductImageCard />
                  <SimilarIngredientCard />
                </div>
              </div>
            )}

            {showDetail && (
              <div className="w-full max-w-3xl mt-2">
                <div className="bg-white p-4 rounded-md shadow-sm mb-4">
                  <h4 className="font-semibold mb-4">효능 효과</h4>
                  <p>
                    {
                      //@ts-ignore
                      result?.efcyQesitm ? result?.efcyQesitm : ""
                    }
                  </p>
                </div>

                <div className="bg-white p-4 rounded-md shadow-sm mb-4">
                  <h4 className="font-semibold mb-4">용법 용량</h4>
                  <p>
                    {
                      //@ts-ignore
                      result?.useMethodQesitm ? result?.useMethodQesitm : ""
                    }
                  </p>
                </div>

                <div className="bg-white p-4 rounded-md shadow-sm mb-4">
                  <h4 className="font-semibold mb-4">사용상의 주의사항</h4>
                  <p>
                    {
                      //@ts-ignore
                      result?.atpnQesitm ? result?.atpnQesitm : ""
                    }
                  </p>
                </div>

                <div className="bg-white p-4 rounded-md shadow-sm mb-4">
                  <h4 className="font-semibold mb-4">상호작용</h4>
                  <p>
                    {
                      //@ts-ignore
                      result?.intrcQesitm ? result?.intrcQesitm : ""
                    }
                  </p>
                </div>

                <div className="bg-white p-4 rounded-md shadow-sm">
                  <h4 className="font-semibold mb-4">부작용</h4>
                  <p>
                    {
                      //@ts-ignore
                      result?.seQesitm ? result?.seQesitm : ""
                    }
                  </p>
                </div>
              </div>
            )}
            {/* 자세히 보기 / 되돌아가기 버튼 */}
            <div className="mt-6">
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-md focus:outline-none"
                onClick={() => setShowDetail(!showDetail)}
              >
                {showDetail ? "되돌아가기" : "자세히 보기"}
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default ResultDetail;
