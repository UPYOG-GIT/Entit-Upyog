import {
  BPAHomeIcon,
  BPAIcon,
  CitizenHomeCard,
  EDCRIcon,
  EmployeeModuleCard,
  Loader,
  Toast,
  SubmitBar,
  Card,
  CardText,
} from "@upyog/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, Link } from "react-router-dom";

const BPACitizenHomeScreen = ({ parentRoute }) => {
  const userInfo = Digit.UserService.getUser();
  const userRoles = userInfo?.info?.roles?.map((roleData) => roleData.code);
  const validityDate = userInfo?.info?.validityDate;
  const stateCode = Digit.ULBService.getStateId();
  const [stakeHolderRoles, setStakeholderRoles] = useState(false);
  const { data: stakeHolderDetails, isLoading: stakeHolderDetailsLoading } = Digit.Hooks.obps.useMDMS(
    stateCode,
    "StakeholderRegistraition",
    "TradeTypetoRoleMapping"
  );
  const [bpaLinks, setBpaLinks] = useState([]);
  const state = Digit.ULBService.getStateId();
  const { t } = useTranslation();
  const location = useLocation();
  const [params, setParams, clearParams] = Digit.Hooks.useSessionStorage("BPA_HOME_CREATE", {});
  const { data: homePageUrlLinks, isLoading: homePageUrlLinksLoading } = Digit.Hooks.obps.useMDMS(state, "BPA", ["homePageUrlLinks"]);
  const [showToast, setShowToast] = useState(null);
  const [totalCount, setTotalCount] = useState("-");
  const [bpaCount, setBpaCount] = useState("-");
  const [bpaLowCount, setBpaLowCount] = useState("-");
  const [approvedCount, setApprovedCount] = useState("-");
  // console.log("userinfo: "+JSON.stringify(userInfo));

  const currentDate = new Date();
  // console.log("date: " + currentDate.getTime());
  // console.log("validityDate: " + validityDate);
  // console.log("userRoles: " + userRoles);
  let tradeType = null;
  if (userRoles.includes("BPA_ARCHITECT")) {
    tradeType = "ARCHITECT.CLASSA";
  } else if (userRoles.includes("BPA_BUILDER")) {
    tradeType = "BUILDER.CLASSA";
  } else if (userRoles.includes("BPA_ENGINEER")) {
    tradeType = "ENGINEER.CLASSA";
  } else if (userRoles.includes("BPA_STRUCTURALENGINEER")) {
    tradeType = "STRUCTURALENGINEER.CLASSA";
  } else if (userRoles.includes("BPA_SUPERVISOR")) {
    tradeType = "SUPERVISOR.CLASSA";
  } else if (userRoles.includes("BPA_TOWNPLANNER")) {
    tradeType = "TOWNPLANNER.CLASSA";
  }

  // if (false) {
  // if (userRoles && (userRoles.includes("BPA_ARCHITECT") || userRoles.includes("BPA_BUILDER") || userRoles.includes("BPA_ENGINEER") || userRoles.includes("BPA_STRUCTURALENGINEER") || userRoles.includes("BPA_SUPERVISOR") || userRoles.includes("BPA_TOWNPLANNER")) && validityDate < currentDate.getTime()) {
  if (userRoles && tradeType !== null && validityDate < currentDate.getTime()) {
    // console.log("Hiiiiii");
    // console.log("validityDate: " + validityDate);

    let payload = {
      Licenses: [
        {
          tradeLicenseDetail: {
            owners: [
              {
                id: userInfo?.info?.id,
                uuid: userInfo?.info?.uuid,
                userName: userInfo?.info?.userName,
                gender: "",
                mobileNumber: userInfo?.info?.mobileNumber,
                emailId: userInfo?.info?.email,
                name: userInfo?.info?.name,
                roles: userInfo?.info?.roles,
                permanentAddress: "",
                correspondenceAddress: "",
                pan: "",
                dob: null,
                // "permanentPinCode": "143001"
              },
            ],
            subOwnerShipCategory: "INDIVIDUAL",
            tradeUnits: [
              {
                tradeType: tradeType,
              },
            ],
            address: {
              city: "",
              landmark: "",
              pincode: "",
            },
            institution: null,
            applicationDocuments: null,
          },
          licenseType: "PERMANENT",
          businessService: "BPAREN",
          tenantId: userInfo?.info?.tenantId,
          action: "NOWORKFLOW",
        },
      ],
    };

    // console.log("payload: " + JSON.stringify(payload));
    const [responseData, setResponseData] = useState(null);
    const [renewalSearch, setRenewalSearch] = useState(null);
    const [paymentDetailsResponse, setPaymentDetailsResponse] = useState(null);
    const [isRenewalSearchDone, setIsRenewalSearchDone] = useState(false);
    // useEffect(async () => {
    //   // const response = await Digit.OBPSService.BPARENCreate(payload, userInfo?.info?.tenantId);
    //   const { Licenses } = await Digit.OBPSService.BPARENSearch(userInfo?.info?.tenantId, userInfo, 'BPAREN');
    //   // console.log("object "+JSON.stringify(ResponseInfo));
    //   // console.log("Licenses "+JSON.stringify(Licenses));
    //   // const data = await Licenses.json();
    //   setRenewalSearch(Licenses[0]);
    //   setIsRenewalSearchDone(true);
    // }, []);
    // console.log("renewalSearch : "+JSON.stringify(renewalSearch));
    // useEffect(async () => {
      // if(isRenewalSearchDone && renewalSearch===null){
        // console.log("inside create ren")
      useEffect(async () => {
        // const response = await Digit.OBPSService.BPARENCreate(payload, userInfo?.info?.tenantId);
        const { Licenses } = await Digit.OBPSService.BPARENCreate(payload, userInfo?.info?.tenantId);
        // console.log("object "+JSON.stringify(ResponseInfo));
        // console.log("Licenses "+JSON.stringify(Licenses));
        // const data = await Licenses.json();
        setResponseData(Licenses[0]);
      }, []);
    // }[isRenewalSearchDone, renewalSearch]
    // console.log("Response111 :"+JSON.stringify(responseData));
    // let consumerCode = renewalSearch ? renewalSearch.applicationNumber : responseData?.applicationNumber;
    let consumerCode = responseData?.applicationNumber;

    const fetchBillParams = { consumerCode };
    const { data: paymentDetails } = Digit.Hooks.obps.useBPAREGgetbill(
      { businessService: "BPAREN", ...fetchBillParams, tenantId: userInfo?.info?.tenantId.split(".")[0] },
      {
        enabled: consumerCode ? true : false,
        retry: false,
      }
    );
    // console.log("paymentDetails: "+JSON.stringify(paymentDetails?.billResponse));
    const homeScreen = (
      <div className="mainContent citizenAllServiceGrid">
        <Card>
          <CardText>{"Please Pay Renewal Fee for Renew your Registration, Application Number : " + consumerCode}</CardText>
          {
            <Link
              to={{
                pathname: `/digit-ui/citizen/payment/collect/BPAREN/${consumerCode}/${userInfo?.info?.tenantId}?tenantId=${userInfo?.info?.tenantId}`,
              }}
            >
              <SubmitBar label={t("COMMON_MAKE_PAYMENT")} />
            </Link>
          }
        </Card>
      </div>
    );
    return homeScreen;
  } else {
    // console.log("Hiiiiii2222");

    const closeToast = () => {
      window.location.replace("/digit-ui/citizen/all-services");
      setShowToast(null);
    };

    const [searchParams, setSearchParams] = useState({
      applicationStatus: [],
    });
    let isMobile = window.Digit.Utils.browser.isMobile();
    const [pageOffset, setPageOffset] = useState(0);
    const [pageSize, setPageSize] = useState(window.Digit.Utils.browser.isMobile() ? 50 : 10);
    const [sortParams, setSortParams] = useState([{ id: "createdTime", sortOrder: "DESC" }]);
    const paginationParams = isMobile
      ? { limit: 10, offset: 0, sortBy: sortParams?.[0]?.id, sortOrder: sortParams?.[0]?.sortOrder }
      : { limit: pageSize, offset: pageOffset, sortBy: sortParams?.[0]?.id, sortOrder: sortParams?.[0]?.sortOrder };
    const inboxSearchParams = { limit: 10, offset: 0, mobileNumber: userInfo?.info?.mobileNumber };
    const { isLoading: bpaLoading, data: bpaInboxData } = Digit.Hooks.obps.useArchitectInbox({
      //tenantId: stateCode,
      tenantId: userInfo?.info?.tenantId,
      moduleName: "bpa-services",
      businessService: ["BPA_LOW", "BPA", "BPA_OC"],
      filters: {
        searchForm: {
          ...searchParams,
        },
        tableForm: {
          sortBy: sortParams?.[0]?.id,
          limit: pageSize,
          offset: pageOffset,
          sortOrder: sortParams?.[0]?.sortOrder,
        },
        filterForm: {
          moduleName: "bpa-services",
          businessService: [],
          applicationStatus: searchParams?.applicationStatus,
          locality: [],
          assignee: "ASSIGNED_TO_ALL",
        },
      },
      config: {},
      withEDCRData: false,
    });
    const { isLoading: isEDCRInboxLoading, data: { totalCount: edcrCount } = {} } = Digit.Hooks.obps.useEDCRInbox({
      tenantId: stateCode,
      filters: { filterForm: {}, searchForm: {}, tableForm: { limit: 10, offset: 0 } },
    });

    useEffect(() => {
      if (location.pathname === "/digit-ui/citizen/obps/home") {
        Digit.SessionStorage.del("OBPS.INBOX");
        Digit.SessionStorage.del("STAKEHOLDER.INBOX");
      }
    }, [location.pathname]);

    useEffect(() => {
      if (!bpaLoading) {
        const totalCountofBoth = bpaInboxData?.totalCount || 0;
        setTotalCount(totalCountofBoth);
      }
    }, [bpaInboxData]);

    // console.log("bpaInboxData?.statusMap: " + JSON.stringify(bpaInboxData?.statuses));
    // console.log("bpaInboxData?: " + JSON.stringify(bpaInboxData));
    useEffect(() => {
      if (!bpaLoading && bpaInboxData) {
        // Initialize counts for BPA and BPA_LOW
        let bpaMapCount = 0;
        let bpaLowMapCount = 0;
        let approvedMapCount = 0;

        // Iterate through the statusMap array
        bpaInboxData?.statuses.forEach((status) => {
          // Check the businessservice value and increment the corresponding count
          if (status.businessservice === "BPA") {
            bpaMapCount += status.count;
          } else if (status.businessservice === "BPA_LOW") {
            bpaLowMapCount += status.count;
          }

          if (status.applicationstatus === "APPROVED") {
            approvedMapCount += status.count;
          }
        });

        // Update state with the counts
        setBpaCount(bpaMapCount);
        setBpaLowCount(bpaLowMapCount);
        setApprovedCount(approvedMapCount);
      }
    }, [bpaInboxData]);

    useEffect(() => {
      if (!stakeHolderDetailsLoading) {
        let roles = [];
        stakeHolderDetails?.StakeholderRegistraition?.TradeTypetoRoleMapping?.map((type) => {
          type?.role?.map((role) => {
            roles.push(role);
          });
        });
        const uniqueRoles = roles?.filter((item, i, ar) => ar.indexOf(item) === i);
        // console.log("roles "+roles);
        // console.log("uniqueRoles "+uniqueRoles);
        let isRoute = false;
        uniqueRoles?.map((unRole) => {
          if (userRoles?.includes(unRole) && !isRoute) {
            isRoute = true;
          }
        });
        if (!isRoute) {
          setStakeholderRoles(false);
          setShowToast({ key: "true", message: t("BPA_LOGIN_HOME_VALIDATION_MESSAGE_LABEL") });
        } else {
          setStakeholderRoles(true);
        }
      }
    }, [stakeHolderDetailsLoading]);

    useEffect(() => {
      if (!homePageUrlLinksLoading && homePageUrlLinks?.BPA?.homePageUrlLinks?.length > 0) {
        let uniqueLinks = [];
        homePageUrlLinks?.BPA?.homePageUrlLinks?.map((linkData) => {
          uniqueLinks.push({
            link: `${linkData?.flow?.toLowerCase()}/${linkData?.applicationType?.toLowerCase()}/${linkData?.serviceType?.toLowerCase()}/docs-required`,
            i18nKey: t(`BPA_HOME_${linkData?.applicationType}_${linkData?.serviceType}_LABEL`),
            state: { linkData },
            linkState: true,
          });
        });
        setBpaLinks(uniqueLinks);
      }
    }, [!homePageUrlLinksLoading]);

    useEffect(() => {
      clearParams();
    }, []);

    Digit.SessionStorage.set("EDCR_BACK", "IS_EDCR_BACK");

    if (showToast) return <Toast error={true} label={t(showToast?.message)} isDleteBtn={true} onClose={closeToast} />;

    if (stakeHolderDetailsLoading || !stakeHolderRoles || bpaLoading) {
      return <Loader />;
    } // || bparegLoading
    // console.log("BPACount : " + bpaCount + ", " + "BPALowCount: " + bpaLowCount);
    const homeDetails = [
      {
        Icon: <BPAHomeIcon />,
        moduleName: t("ACTION_TEST_BPA_STAKE_HOLDER_HOME"),
        name: "employeeCard",
        isCitizen: true,
        // kpis: [
        //   {
        //     count: !(bpaLoading || isEDCRInboxLoading) && totalCount && edcrCount ? totalCount + edcrCount : "-",
        //     label: t("BPA_PDF_TOTAL"),
        //     link: `/digit-ui/citizen/obps/bpa/inbox`,
        //   },
        // ],
        kpis: [
          {
            label: t("Approved Applications"),
            count: !bpaLoading && approvedCount ? approvedCount : "-",
            link: `#`,
            // i18nKey: t("High/Medium: " + bpaCount),
          },
          {
            label: t("High/Medium Risk Applications"),
            count: !bpaLoading && bpaCount ? bpaCount : "-",
            link: `#`,
            // i18nKey: t("High/Medium: " + bpaCount),
          },
          {
            label: t("Low Risk Applications"),
            count: !bpaLoading && bpaLowCount ? bpaLowCount : "-",
            link: `#`,
          },
        ],
        links: [
          {
            count: !bpaLoading ? totalCount : "-",
            label: t("ES_COMMON_OBPS_INBOX_LABEL"),
            link: `/digit-ui/citizen/obps/bpa/inbox`,
          },
          {
            count: !isEDCRInboxLoading ? edcrCount : "-",
            label: t("ES_COMMON_EDCR_INBOX_LABEL"),
            link: `/digit-ui/citizen/obps/edcr/inbox`,
          },
        ],
        className: "CitizenHomeCard",
        styles: { padding: "0px", minWidth: "90%", minHeight: "90%" },
      },
      {
        title: t("ACTION_TEST_EDCR_SCRUTINY"),
        Icon: <EDCRIcon className="fill-path-primary-main" />,
        links: [
          {
            link: `edcrscrutiny/apply`,
            i18nKey: t("BPA_PLAN_SCRUTINY_FOR_NEW_CONSTRUCTION_LABEL"),
          },
          {
            link: `edcrscrutiny/oc-apply`,
            i18nKey: t("BPA_OC_PLAN_SCRUTINY_FOR_NEW_CONSTRUCTION_LABEL"),
          },
        ],
        styles: { minWidth: "90%", minHeight: "90%" },
      },
      {
        title: t("ACTION_TEST_BPA_STAKE_HOLDER_HOME"),
        Icon: <BPAIcon className="fill-path-primary-main" />,
        links: bpaLinks,
        styles: { minWidth: "90%", minHeight: "90%" },
      },
      // {
      //   Icon: <BPAHomeIcon />,
      //   moduleName: t("Applications"),
      //   name: "employeeCard",
      //   isCitizen: true,
      //   kpis: [
      //     {
      //       label: t("Total Applications"),
      //       count: !(bpaLoading) && totalCount ? totalCount : "-",
      //       link: `#`,
      //       // i18nKey: t("High/Medium: " + bpaCount),
      //     },
      //     {
      //       label: t("Approved Applications"),
      //       count: !(bpaLoading) && approvedCount ? approvedCount : "-",
      //       link: `#`,
      //       // i18nKey: t("High/Medium: " + bpaCount),
      //     },
      //     {
      //       label: t("High/Medium Risk"),
      //       count: !(bpaLoading) && bpaCount ? bpaCount : "-",
      //       link: `#`,
      //       // i18nKey: t("High/Medium: " + bpaCount),
      //     },
      //     {
      //       label: t("Low Risk"),
      //       count: !(bpaLoading) && bpaLowCount ? bpaLowCount : "-",
      //       link: `#`,
      //     },
      //   ],
      //   className: "CitizenHomeCard",
      //   styles: { padding: "0px", minWidth: "90%", minHeight: "90%" }
      // },
      // {
      //   title: t("Applications"),
      //   Icon: <EDCRIcon className="fill-path-primary-main" />,
      //   // kpis: [
      //   //   {
      //   //     count: !bpaLoading ? bpaLowCount : "-",
      //   //     label: t("Low Risk"),
      //   //     link: `#`,
      //   //   },
      //   //   {
      //   //     count: !bpaLoading ? bpaCount : "-",
      //   //     label: t("Medium/High Risk"),
      //   //     link: `#`,
      //   //   },
      //   // ],
      //   links: [
      //     {
      //       link: `#`,
      //       i18nKey: t("High/Medium: " + bpaCount),
      //     },
      //     {
      //       link: `#`,
      //       i18nKey: t("Low Risk : " + bpaLowCount),
      //     },
      //   ],
      //   styles: { minWidth: "90%", minHeight: "90%" }
      // },
    ];

    const homeScreen = (
      <div className="mainContent citizenAllServiceGrid">
        {homeDetails.map((data) => {
          return (
            <div>
              {data.name === "employeeCard" ? (
                <EmployeeModuleCard {...data} />
              ) : (
                <CitizenHomeCard header={data.title} links={data.links} Icon={() => data.Icon} styles={data?.styles} />
              )}
            </div>
          );
        })}
      </div>
    );
    sessionStorage.setItem("isPermitApplication", true);
    sessionStorage.setItem("isEDCRDisable", JSON.stringify(false));
    return homeScreen;
  }
};

export default BPACitizenHomeScreen;
