type SearchResultCardProps = {
    title: string;
    description: string;
  }
  
  const SearchResultCard: React.FC<SearchResultCardProps> = ({ title, description }) => {
    return (
      <div className="bg-white rounded-md p-4 mb-4 shadow-sm">
        <h4 className="text-xl text-black font-semibold mb-2">{title}</h4>
        <p className="text-gray-600">{description}</p>
      </div>
    );
  }
  export default SearchResultCard;
