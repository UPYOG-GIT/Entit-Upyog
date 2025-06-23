import React, { useMemo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { OBPSIconSolidBg, EmployeeModuleCard } from "@upyog/digit-ui-react-components";
import { showHidingLinksForStakeholder, showHidingLinksForBPA } from "../../utils";
import { useLocation } from "react-router-dom";



const OBPSEmployeeHomeCard = () => {
  // console.log("first")

  const [totalCount, setTotalCount] = useState(0);
  const { t } = useTranslation();
  const location = useLocation();
  const [initiatedCount, setInitiatedCount] = useState(null);
  const [citizenApprovalInProcessCount, setCitizenApprovalInProcessCount] = useState(null);
  const [approvedCount, setApprovedCount] = useState(null);
  const [rejectedCount, setRejectedCount] = useState(null);
  const [departmentInProcessCount, setDepartmentInProcessCount] = useState(null);
  const [reassignedCount, setReassignedCount] = useState(null);
  const [applFeePending, setApplFeePending] = useState(0);
  const [sancFeePending, setSancFeePending] = useState(0);
  const [inprogressCount, setInprogressCount] = useState(0);
  const [totalProposal, setTotalProposal] = useState(0);
  const [directBhawanAnugya, setDirectBhawanAnugya] = useState(0);



  // const tenantId1=Digit.ULBService.getCitizenCurrentTenant();
  const tenantId1 = Digit.ULBService.getCurrentUlb()?.code;
  const stateCode = Digit.ULBService.getStateId();
  //   const userType = window.sessionStorage.getItem("userType");

  const stakeholderEmployeeRoles = [{ code: "BPAREG_DOC_VERIFIER", tenantId: stateCode }, { code: "BPAREG_APPROVER", tenantId: stateCode }];
  const bpaEmployeeRoles = ["BPA_FIELD_INSPECTOR", "BPA_NOC_VERIFIER", "BPA_APPROVER", "BPA_VERIFIER", "CEMP", "BPA_COMMISSIONER", "BPA_EMP_SUBENGINEER"];

  const checkingForStakeholderRoles = showHidingLinksForStakeholder(stakeholderEmployeeRoles);
  const checkingForBPARoles = showHidingLinksForBPA(bpaEmployeeRoles);

  const searchFormDefaultValues = {}
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const filterFormDefaultValues = {
    moduleName: "bpa-services",
    applicationStatus: "",
    locality: [],
    assignee: "ASSIGNED_TO_ALL",
    applicationType: []
  }
  const tableOrderFormDefaultValues = {
    sortBy: "",
    limit: 10,
    offset: 0,
    sortOrder: "DESC"
  }

  const formInitValue = {
    filterForm: filterFormDefaultValues,
    searchForm: searchFormDefaultValues,
    tableForm: tableOrderFormDefaultValues
  }

  const searchFormDefaultValuesOfStakeholder = {}

  const filterFormDefaultValuesOfStakeholder = {
    moduleName: "BPAREG",
    // businessService: {code: "BPAREG", name:t("BPAREG")},
    applicationStatus: "",
    locality: [],
    assignee: "ASSIGNED_TO_ALL"
  }
  const tableOrderFormDefaultValuesOfStakeholder = {
    sortBy: "",
    limit: 10,
    offset: 0,
    sortOrder: "DESC"
  }

  const formInitValueOfStakeholder = {
    filterForm: filterFormDefaultValuesOfStakeholder,
    searchForm: searchFormDefaultValuesOfStakeholder,
    tableForm: tableOrderFormDefaultValuesOfStakeholder
  }

  const { isLoading: isInboxLoadingOfStakeholder, data: dataOfStakeholder } = Digit.Hooks.obps.useBPAInbox({
    tenantId,
    // tenantId1,
    filters: { ...formInitValueOfStakeholder },
    config: { enabled: !!checkingForStakeholderRoles }
  });

  const { isLoading: isInboxLoading, data: dataOfBPA } = Digit.Hooks.obps.useBPAInbox({
    tenantId,
    // tenantId1,
    filters: { ...formInitValue },
    config: { enabled: !!checkingForBPARoles }
  });

  useEffect(async () => {
    const getDashboardCount = await Digit.OBPSAdminService.getDashboardCount(tenantId);
    // console.log("getDashboardCount--" + JSON.stringify(getDashboardCount))

    getDashboardCount.forEach((dashboardData) => {
      if (dashboardData.initiated !== undefined) {
        const initiatedCount = dashboardData.initiated;
        setInitiatedCount(initiatedCount);
        // console.log("initiatedCount" + initiatedCount);
      }

      if (dashboardData.citizen_approval_inprocess !== undefined) {
        const citizenApprovalInProcessCount = dashboardData.citizen_approval_inprocess;
        setCitizenApprovalInProcessCount(citizenApprovalInProcessCount);
      }

      if (dashboardData.approved !== undefined) {
        const approvedCount = dashboardData.approved;
        setApprovedCount(approvedCount);
      }

      if (dashboardData.rejected !== undefined) {
        const rejectedCount = dashboardData.rejected;
        setRejectedCount(rejectedCount);
      }

      if (dashboardData.direct_bhawan_anugya !== undefined) {
        const directBhawanAnugya = dashboardData.direct_bhawan_anugya;
        setDirectBhawanAnugya(directBhawanAnugya);
      }

      if (dashboardData.department_inprocess !== undefined) {
        const departmentInProcessCount = dashboardData.department_inprocess;
        setDepartmentInProcessCount(departmentInProcessCount);
      }

      if (dashboardData.reassign !== undefined) {
        const reassignedCount = dashboardData.reassign;
        setReassignedCount(reassignedCount);
      }

      if (dashboardData.appl_fee !== undefined) {
        const applFeePending = dashboardData.appl_fee;
        setApplFeePending(applFeePending);
      }

      if (dashboardData.sanc_fee_pending !== undefined) {
        const sancFeePending = dashboardData.sanc_fee_pending;
        setSancFeePending(sancFeePending);
      }

      if (dashboardData.inprogress !== undefined) {
        const inprogressCount = dashboardData.inprogress;
        setInprogressCount(inprogressCount);
      }

      if (dashboardData.total !== undefined) {
        const totalProposal = dashboardData.total;
        setTotalProposal(totalProposal);
      }

    });

  }, []);
  useEffect(() => {
    if (!isInboxLoading && !isInboxLoadingOfStakeholder) {
      const bpaCount = dataOfBPA?.totalCount ? dataOfBPA?.totalCount : 0;
      const stakeHolderCount = dataOfStakeholder?.totalCount ? dataOfStakeholder?.totalCount : 0;
      setTotalCount(bpaCount + stakeHolderCount);
    }
  }, [dataOfBPA, dataOfStakeholder]);

  useEffect(() => {
    if (location.pathname === "/digit-ui/employee") {
      Digit.SessionStorage.del("OBPS.INBOX")
      Digit.SessionStorage.del("STAKEHOLDER.INBOX")
    }
  }, [location.pathname])
  const propsForModuleCard = useMemo(() => ({
    Icon: <OBPSIconSolidBg />,
    moduleName: t("MODULE_OBPS"),
    kpis: [
      {
        count: !isInboxLoading && !isInboxLoadingOfStakeholder ? totalCount : "",
        label: t("TOTAL_FSM"),
        link: `/digit-ui/employee/obps/inbox`
      },
      {
        count: "-",
        label: t("TOTAL_NEARING_SLA"),
        link: `/digit-ui/employee/obps/inbox`
      },
      // {
      //   count: !isInboxLoading && !isInboxLoadingOfStakeholder ? directBhawanAnugya:"",
      //   label: t("Direct Bhawan Anugya"),
      //   link: `#`
      // },
      // {
      //   count: !isInboxLoading && !isInboxLoadingOfStakeholder ? approvedCount:"",
      //   label: t("Approved Applications"),
      //   link: `#`
      // },
      // {
      //   count: !isInboxLoading && !isInboxLoadingOfStakeholder ? departmentInProcessCount:"",
      //   label: t("Department Inprocess"),
      //   link: `#`
      // },
      // {
      //   count: !isInboxLoading && !isInboxLoadingOfStakeholder ? sancFeePending:"",
      //   label: t("Post Fee Pending"),
      //   link: `#`
      // },
      // {
      //   count: !isInboxLoading && !isInboxLoadingOfStakeholder ? rejectedCount:"",
      //   label: t("Rejected Cases"),
      //   link: `#`
      // }
    ],
    links: [
      {
        count: isInboxLoadingOfStakeholder ? "" : dataOfStakeholder?.totalCount,
        label: t("ES_COMMON_STAKEHOLDER_INBOX_LABEL"),
        link: `/digit-ui/employee/obps/stakeholder-inbox`,
        field: "STAKEHOLDER"
      },
      {
        count: isInboxLoading ? "" : dataOfBPA?.totalCount,
        label: t("ES_COMMON_OBPS_INBOX_LABEL"),
        link: `/digit-ui/employee/obps/inbox`,
        field: "BPA"
      },
      {
        label: t("ES_COMMON_SEARCH_APPLICATION"),
        link: `/digit-ui/employee/obps/search/application`
      },
      {
        count: isInboxLoading && isInboxLoadingOfStakeholder ? "" : directBhawanAnugya,
        label: t("Direct Bhawan Anugya"),
        link: `#`,
        field: "BPA"
      },
      {
        count: isInboxLoading && isInboxLoadingOfStakeholder ? "" : approvedCount,
        label: t("Approved Applications"),
        link: `#`,
        field: "BPA"
      },
      {
        count: isInboxLoading && isInboxLoadingOfStakeholder ? "" : departmentInProcessCount,
        label: t("Department Inprocess"),
        link: `#`,
        field: "BPA"
      },
      {
        count: isInboxLoading && isInboxLoadingOfStakeholder ? "" : sancFeePending,
        label: t("Post Fee Pending"),
        link: `#`,
        field: "BPA"
      },
      {
        count: isInboxLoading && isInboxLoadingOfStakeholder ? "" : rejectedCount,
        label: t("Rejected Cases"),
        link: `#`,
        field: "BPA"
      },
    ]
  }), [isInboxLoading, isInboxLoadingOfStakeholder, dataOfStakeholder, dataOfBPA, totalCount]);

  if (!checkingForStakeholderRoles) {
    propsForModuleCard.links = propsForModuleCard.links.filter(obj => {
      return obj.field !== 'STAKEHOLDER';
    });
  }

  if (!checkingForBPARoles) {
    propsForModuleCard.links = propsForModuleCard.links.filter(obj => {
      return obj.field !== 'BPA';
    });
  }

  const homeDetails = [
    {
      Icon: <OBPSIconSolidBg />,
      moduleName: t("Applications Details"),

      kpis: [
        {
          count: !isInboxLoading && !isInboxLoadingOfStakeholder ? directBhawanAnugya : "",
          label: t("Direct Bhawan Anugya"),
          link: `#`
        },
        {
          count: !isInboxLoading && !isInboxLoadingOfStakeholder ? approvedCount : "",
          label: t("Approved Applications"),
          link: `#`
        },
        {
          count: !isInboxLoading && !isInboxLoadingOfStakeholder ? departmentInProcessCount : "",
          label: t("Department Inprocess"),
          link: `#`
        },
        {
          count: !isInboxLoading && !isInboxLoadingOfStakeholder ? sancFeePending : "",
          label: t("Post Fee Pending"),
          link: `#`
        },
        {
          count: !isInboxLoading && !isInboxLoadingOfStakeholder ? rejectedCount : "",
          label: t("Rejected Cases"),
          link: `#`
        }
      ],

      // links: [
      //   {
      //     count: isInboxLoading && isInboxLoadingOfStakeholder ? "" : directBhawanAnugya,
      //     label: t("Direct Bhawan Anugya"),
      //     link: `#`,
      //     field: "BPA"
      //   },
      //   {
      //     count: isInboxLoading && isInboxLoadingOfStakeholder ? "" : approvedCount,
      //     label: t("Approved Applications"),
      //     link: `#`,
      //     field: "BPA"
      //   },
      //   {
      //     count: isInboxLoading && isInboxLoadingOfStakeholder ? "" : departmentInProcessCount,
      //     label: t("Department Inprocess"),
      //     link: `#`,
      //     field: "BPA"
      //   },
      //   {
      //     count: isInboxLoading && isInboxLoadingOfStakeholder ? "" : sancFeePending,
      //     label: t("Post Fee Pending"),
      //     link: `#`,
      //     field: "BPA"
      //   },
      //   {
      //     count: isInboxLoading && isInboxLoadingOfStakeholder ? "" : rejectedCount,
      //     label: t("Rejected Cases"),
      //     link: `#`,
      //     field: "BPA"
      //   },
      // ],
      className: "CitizenHomeCard",
      styles: { padding: "0px", minWidth: "90%", minHeight: "90%" }
    },
    {
      Icon: <OBPSIconSolidBg />,
      moduleName: t("MODULE_OBPS"),
      kpis: [
        // {
        //   count: !isInboxLoading && !isInboxLoadingOfStakeholder ? totalCount : "",
        //   label: t("TOTAL_FSM"),
        //   link: `/digit-ui/employee/obps/inbox`
        // },
        {
          count: !isInboxLoading && !isInboxLoadingOfStakeholder ? totalProposal : "",
          label: t("Total Applications"),
          link: `#`
        },
        {
          count: "-",
          label: t("TOTAL_NEARING_SLA"),
          link: `/digit-ui/employee/obps/inbox`
        }
      ],
      links: [
        {
          count: isInboxLoadingOfStakeholder ? "" : dataOfStakeholder?.totalCount,
          label: t("ES_COMMON_STAKEHOLDER_INBOX_LABEL"),
          link: `/digit-ui/employee/obps/stakeholder-inbox`,
          field: "STAKEHOLDER"
        },
        {
          count: isInboxLoading ? "" : dataOfBPA?.totalCount,
          label: t("ES_COMMON_OBPS_INBOX_LABEL"),
          link: `/digit-ui/employee/obps/inbox`,
          field: "BPA"
        },
        {
          label: t("ES_COMMON_SEARCH_APPLICATION"),
          link: `/digit-ui/employee/obps/search/application`
        },
      ],
      // className: "CitizenHomeCard",
      // styles: { padding: "0px", minWidth: "90%", minHeight: "90%" }
    },
    

  ];

  if (!checkingForStakeholderRoles) {
    homeDetails[1].links = homeDetails[1].links.filter(obj => {
      return obj.field !== 'STAKEHOLDER';
    });
  }

  if (!checkingForBPARoles) {
    homeDetails[1].links = homeDetails[1].links.filter(obj => {
      return obj.field !== 'BPA';
    });
  }

  const homeScreen = (
    <div className="mainContent citizenAllServiceGrid">
      {homeDetails.map((data) => {
        return (
          <div>
            {checkingForBPARoles || checkingForStakeholderRoles ? <EmployeeModuleCard {...data} /> : null}
            
          </div>
        )
      })}
    </div>
  )

  return homeScreen;
  // return checkingForBPARoles || checkingForStakeholderRoles ? <EmployeeModuleCard {...propsForModuleCard} /> : null


}

export default OBPSEmployeeHomeCard