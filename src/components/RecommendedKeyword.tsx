type RecommendedKeywordProps = {
  keyword: string;
  onClickKeyword: (keyword: string) => void;
};

const RecommendedKeyword: React.FC<RecommendedKeywordProps> = ({ keyword, onClickKeyword }) => {
  return (
    <button 
      onClick={() => onClickKeyword(keyword)}
      className="  text-black bg-blue-200 rounded-md px-4 py-2 cursor-pointer hover:bg-blue-300"
    >
      {keyword}
    </button>
  );
};

export default RecommendedKeyword;