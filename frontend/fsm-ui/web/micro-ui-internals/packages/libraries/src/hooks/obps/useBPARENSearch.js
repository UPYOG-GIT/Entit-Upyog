import { useQuery,useQueryClient } from "react-query";

const useBPARENSearch = (tenantId, filters, params, config = {}) => {
  const client = useQueryClient();

  return {...useQuery(['BPA_REN_SEARCH', tenantId, filters], () => Digit.OBPSService.BPARENSearch(tenantId, filters, params), config),revalidate: () => client.removeQueries(['BPA_REN_SEARCH', tenantId, filters])}
}

export default useBPARENSearch;