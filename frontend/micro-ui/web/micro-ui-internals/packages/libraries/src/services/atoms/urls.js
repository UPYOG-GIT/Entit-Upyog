const Urls = {
  MDMS: `/egov-mdms-service/v1/_search`,
  WorkFlow: `/egov-workflow-v2/egov-wf/businessservice/_search`,
  WorkFlowProcessSearch: `/egov-workflow-v2/egov-wf/process/_search`,
  localization: `/localization/messages/v1/_search`,
  location: {
    localities: `/egov-location/location/v11/boundarys/_search?hierarchyTypeCode=ADMIN&boundaryType=Locality`,
    revenue_localities: `/egov-location/location/v11/boundarys/_search?hierarchyTypeCode=REVENUE&boundaryType=Locality`,
  },

  pgr_search: `/pgr-services/v2/request/_search`,
  pgr_update: `/pgr-services/v2/request/_update`,
  filter_data: `https://run.mocky.io/v3/597a50a0-90e5-4a45-b82e-8a2186b760bd`,
  FileStore: "/filestore/v1/files",

  FileFetch: "/filestore/v1/files/url",
  PGR_Create: `/pgr-services/v2/request/_create`,
  pgr_count: `/pgr-services/v2/request/_count`,

  OTP_Send: "/user-otp/v1/_send",
  Authenticate: "/user/oauth/token",
  RegisterUser: "/user/citizen/_create",
  ChangePassword: "/user/password/nologin/_update",
  ChangePassword1: "/user/password/_update", 
  UserProfileUpdate: "/user/profile/_update",
  EmployeeSearch: "/egov-hrms/employees/_search",
  ArchitectDetailsSearch : "/user/_stackholdersearch",
  ArchitectValidityUpdate : "/user/validity/_update",

  InboxSearch: "/inbox/v1/_search",

  UserSearch: "/user/_search",
  UserLogout : "/user/_logout",

  // DecryptForSWS: "/egov-enc-service/crypto/v1/_swsdecrypt",
  DecryptForSWS: "/user/crypto/_swsdecrypt",

  Shortener: "/egov-url-shortening/shortener",

  fsm: {
    search: "/fsm/v1/_search",
    create: "/fsm/v1/_create",
    update: "/fsm/v1/_update",
    vendorSearch: "/vendor/v1/_search",
    vehicleSearch: "/vehicle/v1/_search",
    audit: "/fsm/v1/_audit",
    vehicleTripSearch: "/vehicle/trip/v1/_search",
    billingSlabSearch: "/fsm-calculator/v1/billingSlab/_search",
    vehilceUpdate: "/vehicle/trip/v1/_update",
    createVendor: "/vendor/v1/_create",
    updateVendor: "/vendor/v1/_update",
    createVehicle: "/vehicle/v1/_create",
    updateVehicle: "/vehicle/v1/_update",
    driverSearch: "/vendor/driver/v1/_search",
    createDriver: "/vendor/driver/v1/_create",
    updateDriver: "/vendor/driver/v1/_update",
    vehicleTripCreate: "/vehicle/trip/v1/_create",
    advanceBalanceCalculate: "/fsm-calculator/v1/_advancebalancecalculate",
    workerSearch: "/individual/v1/_search",
    rmcPtSearchbyId: "https://mcraipur.in/api/getPropertyDetails",
    rmcPtSearchbyMoNo: "",
  },

  payment: {
    fetch_bill: "/billing-service/bill/v2/_fetchbill",
    demandSearch: "/billing-service/demand/_search",
    demandCreate: "/billing-service/demand/_create",
    create_reciept: "/collection-services/payments/_create",
    print_reciept: "/collection-services/payments",
    generate_pdf: "/pdf-service/v1/_create",
    create_citizen_reciept: "/pg-service/transaction/v1/_create",
    update_citizen_reciept: "/pg-service/transaction/v1/_update",
    search_bill: "/billing-service/bill/v2/_search",
    reciept_search: "/collection-services/payments/:buisnessService/_search",
    obps_Reciept_Search: "/collection-services/payments/_search",
    get_receipt: "/collection-services/receipts/v2/_getReceipt"
  },

  pt: {
    fectch_property: "/property-services/property/_search",
    fetch_payment_details: "/billing-service/bill/v2/_fetchbill",
    create: "/property-services/property/_create",
    search: "/property-services/property/_search",
    update: "/property-services/property/_update",
    pt_calculation_estimate: "/pt-calculator-v2/propertytax/v2/_estimate",
    assessment_create: "/property-services/assessment/_create",
    assessment_search: "/property-services/assessment/_search",
    payment_search: "/collection-services/payments/PT/_search",
    pt_calculate_mutation: "/pt-calculator-v2/propertytax/mutation/_calculate"
  },

  dss: {
    dashboardConfig: "/dashboard-analytics/dashboard/getDashboardConfig",
    getCharts: "/dashboard-analytics/dashboard/getChartV2",
  },

  mcollect: {
    search: "/echallan-services/eChallan/v1/_search",
    create: "/echallan-services/eChallan/v1/_create?",
    fetch_bill: "/billing-service/bill/v2/_fetchbill?",
    search_bill: "/egov-searcher/bill-genie/mcollectbills/_get",
    search_bill_pt: "/egov-searcher/bill-genie/billswithaddranduser/_get",
    update: "/echallan-services/eChallan/v1/_update",
    download_pdf: "/egov-pdf/download/UC/mcollect-challan",
    receipt_download: "/egov-pdf/download/PAYMENT/consolidatedreceipt",
    bill_download: "/egov-pdf/download/bills/consolidatedbill",
    count: "/echallan-services/eChallan/v1/_count",
  },
  hrms: {
    search: "/egov-hrms/employees/_search",
    count: "/egov-hrms/employees/_count",
    create: "/egov-hrms/employees/_create",
    update: "/egov-hrms/employees/_update",
  },
  tl: {
    create: "/tl-services/v1/_create",
    search: "/tl-services/v1/_search",
    fetch_payment_details: "/billing-service/bill/v2/_fetchbill",
    download_pdf: "/egov-pdf/download/TL/",
    update: "/tl-services/v1/_update",
    billingslab: "/tl-calculator/billingslab/_search",
  },
  receipts: {
    receipt_download: "/egov-pdf/download/PAYMENT/consolidatedreceipt",
    payments: "/collection-services/payments",
    count: "/egov-hrms/employees/_count",
  },
  obps: {
    scrutinyDetails: "/edcr/rest/dcr/scrutinydetails",
    comparisionReport: "/edcr/rest/dcr/occomparison",
    createEdcrRule: "/edcr/rest/dcr/createEdcrRule",
    create: "/bpa-services/v1/bpa/_create",
    nocSearch: "/noc-services/v1/noc/_search",
    updateNOC: "/noc-services/v1/noc/_update",
    update: "/bpa-services/v1/bpa/_update",
    bpaSearch: "/bpa-services/v1/bpa/_search",
    bpaRegSearch: "/tl-services/v1/BPAREG/_search",
    bpaRenSearch: "/tl-services/v1/BPAREN/_search",
    bpaRegCreate: "/tl-services/v1/BPAREG/_create",
    bpaRenCreate: "/tl-services/v1/BPAREN/_create",
    bpaRegGetBill: "/tl-calculator/v1/BPAREG/_getbill",
    bpaRenGetBill: "/tl-calculator/v1/BPAREN/_getbill",
    bpaRegUpdate: "/tl-services/v1/BPAREG/_update",
    receipt_download: "/egov-pdf/download/PAYMENT/consolidatedreceipt",
    edcrreportdownload: "/bpa-services/v1/bpa/_permitorderedcr",
    // add a url for getting post fee rule type list
    getPaytype:"/bpa-services/v1/bpa/_paytype",
    createPaytype:"/bpa-services/v1/bpa/_createpaytype",
    getProptype:"/bpa-services/v1/bpa/_searchproposaltype",
    createProptype:"/bpa-services/v1/bpa/_createproposaltype",
    getBcategory:"/bpa-services/v1/bpa/_searchbcategory",
    createBcate:"/bpa-services/v1/bpa/_createbcategory",
    getBScategory:"/bpa-services/v1/bpa/_searchbscategory",
    createBScate:"/bpa-services/v1/bpa/_createbscategory",
    getpaytprate:"/bpa-services/v1/bpa/_searchpaytprate",
    createpayrate:"/bpa-services/v1/bpa/_createpaytprate",
    getslab:"/bpa-services/v1/bpa/_searchslab",
    createSlab:"/bpa-services/v1/bpa/_createslab",
    getfeedetails:"/bpa-services/v1/bpa/_searchfeedetails",
    createFeedetail:"/bpa-services/v1/bpa/_createfeedetail",
    verifyFeedetail:"/bpa-services/v1/bpa/_verifyfeedetail",
    deleteFeedetail:"/bpa-services/v1/bpa/_deletefeedetail",
    deleteSlab:"/bpa-services/v1/bpa/_deleteslab",
    deletePaytpRate:"/bpa-services/v1/bpa/_deletepaytprate",
    getDashboardCount:"/bpa-services/v1/bpa/dashboard/count",
    //for searching application details by application number from dashboard
    searchByApplicationNo: "/bpa-services/v1/bpa/application/_search",
    updateBillAmount: "/bpa-services/v1/bpa/_updatebillamount"
  },

  edcr: {
    create: "/edcr/rest/dcr/scrutinize",
    rgacreate: "/edcr/rest/dcr/rgascrutinize",
    createEdcrRule: "/edcr/rest/dcr/createEdcrRule",
    getEdcrRule: "/edcr/rest/dcr/getEdcrRule",
    getEdcrRuleList: "/edcr/rest/dcr/getEdcrRuleList",
    getOccupancy: "/edcr/rest/dcr/getOccupancy",
    getSubOccupancy: "/edcr/rest/dcr/getSubOccupancy",
    getFeatureName: "/edcr/rest/dcr/getFeatureName",
  },

  events: {
    search: "/egov-user-event/v1/events/_search",
    update: "/egov-user-event/v1/events/lat/_update",
    updateEvent: "/egov-user-event/v1/events/_update",
    updateEventCDG: "/egov-user-event/v1/events/lat/_update",
    count: "/egov-user-event/v1/events/notifications/_count",
    create: "/egov-user-event/v1/events/_create",
  },

  ws: {
    water_search: "/ws-services/wc/_search",
    sewarage_search : "/sw-services/swc/_search",
  },

  engagement: {
    document: {
      search: "/egov-document-uploader/egov-du/document/_search",
      create: "/egov-document-uploader/egov-du/document/_create",
      delete: "/egov-document-uploader/egov-du/document/_delete",
      update: "/egov-document-uploader/egov-du/document/_update",
    },
    surveys: {
      create: "/egov-survey-services/egov-ss/survey/_create",
      update: "/egov-survey-services/egov-ss/survey/_update",
      search: "/egov-survey-services/egov-ss/survey/_search",
      delete: "/egov-survey-services/egov-ss/survey/_delete",
      submitResponse: "/egov-survey-services/egov-ss/survey/response/_submit",
      showResults: "/egov-survey-services/egov-ss/survey/response/_results"
    }
  },

  noc: {
    nocSearch: "/noc-services/v1/noc/_search"
  },
};

export default Urls;
