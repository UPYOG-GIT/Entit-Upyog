import { useQuery, useQueryClient } from "react-query";
import HrmsService from "../../services/elements/HRMS";

export const useArchitectDetailsSearch = ( tenantId, config = {}) => {
  return useQuery(["HRMS_SEARCH", tenantId, ], () => HrmsService.architectdetailssearch(tenantId, { tenantId: tenantId }, {}));
};

export default useArchitectDetailsSearch;
