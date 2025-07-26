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
                link: `/fsm-ui/employee/hrms/inbox`
            },
            {
              count:  isLoading ? "-" : data?.EmployeCount?.activeEmployee,
                label: t("ACTIVE_EMPLOYEES"),
                link: `/fsm-ui/employee/hrms/inbox`
            }  
        ],
        links: [
            {
                label: t("HR_HOME_SEARCH_RESULTS_HEADING"),
                link: `/fsm-ui/employee/hrms/inbox`
            },
            {
                label: t("Architect Details Search"),
                link: `/fsm-ui/employee/hrms/architectdetailsinbox`
            },
            {
                label: t("HR_COMMON_CREATE_EMPLOYEE_HEADER"),
                link: `/fsm-ui/employee/hrms/create`
            },
            {
                label: t("Pay Type Entry"),
                link: `/fsm-ui/employee/hrms/paytyEntry`
            },   
            {
                label: t("Pay Type Rate Entry"),
                link: `/fsm-ui/employee/hrms/rateEntry`
            },
            {
                label: t("Slab Entry"),
                link: `/fsm-ui/employee/hrms/slabEntry`
            },  
            {
                label: t("Proposal Type Master"),
                link: `/fsm-ui/employee/hrms/proptymaster`
            },  
            {
                label: t("Category Entry"),
                link: `/fsm-ui/employee/hrms/cateEntry`
            },
            {
                label: t("Sub Category Entry"),
                link: `/fsm-ui/employee/hrms/subcateEntry`
            },  
            {
                label: t("EDCR Rule Entry"),
                link: `/fsm-ui/employee/hrms/edcrRuleEntry`
            }, 
            ,  
            {
                label: t("Update Total Bill Amount"),
                link: `/fsm-ui/employee/hrms/paymentAmountUpdate`
            },      
        ]
    }

    return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default HRMSCard;

