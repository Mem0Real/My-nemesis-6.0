import { useRouter, useSearchParams } from "next/navigation";

// TODO have to decode multiple filters from url
const useCustomRouter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = {};

  let search = searchParams.get("search");
  let sort = searchParams.get("sort");
  let filter = searchParams.get("filter");
  let page = searchParams.get("page");

  if (search) query.search = search;

  if (sort) query.sort = sort;

  if (filter) {
    let decodedFilter = decodeURIComponent(filter);
    query.filter = decodedFilter;
  }

  if (page) query.page = parseInt(page);

  const pushQuery = ({ search, sort, filter, page }) => {
    if (search !== undefined) {
      if (search === "") delete query.search;
      else {
        query.search = search;
        query.page = 1;
      }
    }
    if (sort !== undefined) {
      if (sort === "") delete query.sort;
      else {
        query.sort = sort;
        query.page = 1;
      }
    }

    if (filter !== undefined) {
      if (filter === "") delete query.filter;
      else {
        query.filter = filter;
        query.page = 1;
      }
    }

    if (page !== undefined) {
      page === 1 ? delete query.page : (query.page = page);
    }

    const newQuery = new URLSearchParams(query).toString();
    router.push(`?${newQuery}`);
  };
  return { pushQuery, query };
};

export default useCustomRouter;
