import { db } from "@/lib/db";
import CategoriesList from "./_components/Categories";
import SearchBox from "../_components/SearchBox";
const Search = async () => {
  const items = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
  return (
    <div className="w-full p-6">
      <CategoriesList list={items} />
    </div>
  );
};

export default Search;
