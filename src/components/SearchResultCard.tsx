import Link from "next/link";

type SearchResultCardProps = {
  id: string;
  title: string;
  description: string;
  query: string;
};

const SearchResultCard: React.FC<SearchResultCardProps> = ({
  id,
  title,
  description,
  query,
}) => {
  return (
    <Link href={`/result/${id}?name=${title}&query=${query}`}>
      <div className="bg-white rounded-md p-4 mb-4 shadow-sm">
        <h4 className="text-xl text-black font-semibold mb-2">{title}</h4>
        <p className="text-gray-600">{description}</p>
      </div>
    </Link>
  );
};
export default SearchResultCard;
