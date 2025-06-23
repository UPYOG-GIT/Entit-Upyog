import { PersonIcon, EmployeeModuleCard } from "@upyog/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";

const HRMSCard = () => {
  const ADMIN = Digit.Utils.hrmsAccess();
  if (!ADMIN) {
    return null;
  }
    const { t } = useTranslation();
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const { isLoading, isError, error, data, ...rest } = Digit.Hooks.hrms.useHRMSCount(tenantId);

    const propsForModuleCard = {
        Icon : <PersonIcon/>,
        moduleName: t("ACTION_TEST_HRMS"),
        kpis: [
            {
                count:  isLoading ? "-" : data?.EmployeCount?.totalEmployee,
                label: t("TOTAL_EMPLOYEES"),
                link: `/digit-ui/employee/hrms/inbox`
            },
            {
              count:  isLoading ? "-" : data?.EmployeCount?.activeEmployee,
                label: t("ACTIVE_EMPLOYEES"),
                link: `/digit-ui/employee/hrms/inbox`
            }  
        ],
        links: [
            {
                label: t("HR_HOME_SEARCH_RESULTS_HEADING"),
                link: `/digit-ui/employee/hrms/inbox`
            },
            {
                label: t("Architect Details Search"),
                link: `/digit-ui/employee/hrms/architectdetailsinbox`
            },
            {
                label: t("HR_COMMON_CREATE_EMPLOYEE_HEADER"),
                link: `/digit-ui/employee/hrms/create`
            },
            {
                label: t("Pay Type Entry"),
                link: `/digit-ui/employee/hrms/paytyEntry`
            },   
            {
                label: t("Pay Type Rate Entry"),
                link: `/digit-ui/employee/hrms/rateEntry`
            },
            {
                label: t("Slab Entry"),
                link: `/digit-ui/employee/hrms/slabEntry`
            },  
            {
                label: t("Proposal Type Master"),
                link: `/digit-ui/employee/hrms/proptymaster`
            },  
            {
                label: t("Category Entry"),
                link: `/digit-ui/employee/hrms/cateEntry`
            },
            {
                label: t("Sub Category Entry"),
                link: `/digit-ui/employee/hrms/subcateEntry`
            },  
            {
                label: t("EDCR Rule Entry"),
                link: `/digit-ui/employee/hrms/edcrRuleEntry`
            }, 
            ,  
            {
                label: t("Update Total Bill Amount"),
                link: `/digit-ui/employee/hrms/paymentAmountUpdate`
            },      
        ]
    }

    return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default HRMSCard;

