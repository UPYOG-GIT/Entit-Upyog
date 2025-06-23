import { Header, Loader, CardLabel, Table, LabelFieldPair, Card } from "@upyog/digit-ui-react-components";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ArchitectDetailsDesktopInbox from "../components/inbox/ArchitectDetailsDesktopInbox";
import ArchitectDetailsMobileInbox from "../components/inbox/ArchitectDetailsMobileInbox";

const ArchitectDetailsInbox1 = ({ }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  // const { isLoading: isLoading, Errors, data: res } = Digit.Hooks.hrms.useHRMSCount(tenantId);

  // const { t } = useTranslation();
  // const [pageOffset, setPageOffset] = useState(initialStates.pageOffset || 0);
  // const [pageSize, setPageSize] = useState(initialStates.pageSize || 10);
  // const [sortParams, setSortParams] = useState(initialStates.sortParams || [{ id: "createdTime", desc: false }]);
  // const [totalRecords, setTotalReacords] = useState(undefined);
  

  // const [architectDetails, setArchitectDetails] = useState();

  
  // const [searchParams, setSearchParams] = useState(() => {
  //   return initialStates.searchParams || {};
  // });

  // let isMobile = window.Digit.Utils.browser.isMobile();
  // let paginationParams = isMobile
  //   ? { limit: 100, offset: pageOffset, sortOrder: sortParams?.[0]?.desc ? "DESC" : "ASC" }
  //   : { limit: pageSize, offset: pageOffset, sortOrder: sortParams?.[0]?.desc ? "DESC" : "ASC" };
  // const isupdate = Digit.SessionStorage.get("isupdate");
  // const { isLoading: hookLoading, isError, error, data, ...rest } = Digit.Hooks.hrms.useHRMSSearch(
  //   searchParams,
  //   tenantId,
  //   paginationParams,
  //   isupdate
  // );

  const { isLoading: hookLoading, isError, error, data, ...rest } = Digit.Hooks.hrms.useArchitectDetailsSearch(
    
    tenantId
  );

  // useEffect(async () => {
  //   // const tenant = Digit.ULBService.getCurrentTenantId();
    
  //     const usersResponse = await Digit.HRMSService.architectdetailssearch(tenantId, { tenantId: tenantId }, {});
  //     // console.log("Architect : "+JSON.stringify(usersResponse));
  //     setArchitectDetails(usersResponse);
      
  // }, []);

  console.log("architectDetails: "+JSON.stringify(data));
  // useEffect(() => {
  //   // setTotalReacords(res?.EmployeCount?.totalEmployee);
  // }, [res]);

  // useEffect(() => {}, [hookLoading, rest]);

  // useEffect(() => {
  //   setPageOffset(0);
  // }, [searchParams]);

  // const fetchNextPage = () => {
  //   setPageOffset((prevState) => prevState + pageSize);
  // };

  // const fetchPrevPage = () => {
  //   setPageOffset((prevState) => prevState - pageSize);
  // };

  // const handleFilterChange = (filterParam) => {
  //   let keys_to_delete = filterParam.delete;
  //   let _new = { ...searchParams, ...filterParam };
  //   if (keys_to_delete) keys_to_delete.forEach((key) => delete _new[key]);
  //   filterParam.delete;
  //   delete _new.delete;
  //   setSearchParams({ ..._new });
  // };

  // const handleSort = useCallback((args) => {
  //   if (args.length === 0) return;
  //   setSortParams(args);
  // }, []);

  // const handlePageSizeChange = (e) => {
  //   setPageSize(Number(e.target.value));
  // };

  // const getSearchFields = () => {
  //   return [
  //     {
  //       label: t("HR_NAME_LABEL"),
  //       name: "names",
  //     },
  //     {
  //       label: t("HR_MOB_NO_LABEL"),
  //       name: "phone",
  //       maxlength: 10,
  //       pattern: "[6-9][0-9]{9}",
  //       title: t("ES_SEARCH_APPLICATION_MOBILE_INVALID"),
  //       componentInFront: "+91",
  //     },
  //     {
  //       label: t("HR_EMPLOYEE_ID_LABEL"),
  //       name: "codes",
  //     },
  //   ];
  // };

  if (hookLoading) {
    return <Loader />;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

 
  const GetCell = (value) => <span className="cell-text">{value}</span>;
  const GetCell1 = (value) => <input type="checkbox" id="checkbox2"   name="checkbox2" value={value}/>;
  const columns = React.useMemo(() => {
    return [
      {
        Header: "Select",
        disableSortBy: true,
        Cell: ({row}) => {
          return (
            GetCell1(`${row.original?.id}`)
          );
        },
      },
      {
        Header: "Name",
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(`${row.original?.name}`);
        },
      },
      {
        Header: "Mobile Number",
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(`${row.original?.mobileNumber }`);
        },
      },
      {
        Header: "Validity Date",
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(`${row.original?.validityDate}`);
        },
      },
      
      
    ];
  }, []);

  return (
    <Card style={{ position: "relative" }} className={"employeeCard-override"}>
      <Header styles={{ marginLeft: "0px", paddingTop: "10px", fontSize: "32px" }}>{t("Slab Master")}</Header>
     
      {/* <LabelFieldPair>
        <CardLabel style={{ color: "#000" }}>{`${t("Pay Type")}`}</CardLabel>
        <Dropdown
          style={{ width: "100%" }}
          className="form-field"
          selected={SlabPyType}
          option={SlabPyTypedropval}
          select={setSlabPaytype}
          value={SlabPyType}
          optionKey="code"
          name="SlabPyType"
        />
      </LabelFieldPair> */}
      
      
      <Table
        // t={t}
        data={data}
        columns={columns}
        className="customTable table-border-style"       
        // manualPagination={false}
        // isPaginationRequired={false}
        getCellProps={(cellInfo) => {
          return {
            style: {
              padding: "20px 18px",
              fontSize: "16px",
              borderTop: "1px solid grey",
              textAlign: "left",
              verticalAlign: "middle",
            },
          };
        }}
      />
      
      {/* <button
        onClick={()=>setModalData(true)}
        style={{
          margin: "24px",
          backgroundColor: "#F47738",
          width: "20%",
          height: "40px",
          color: "white",
          borderBottom: "1px solid black",
        }}
      >
        {t("Add")}
      </button>
      <button
        onClick={deleteItem}
        style={{
          margin: "24px",
          backgroundColor: "#F47738",
          width: "20%",
          height: "40px",
          color: "white",
          borderBottom: "1px solid black",
        }}
      >
        {t("Delete")}
      </button>

      <div style={{display:"flex",justifyContent:"center"}}>
      <button
        // onClick={updateProfile}
        style={{
          margin: "24px",
          backgroundColor: "#F47738",
          width: "20%",
          height: "40px",
          color: "white",
          borderBottom: "1px solid black",
        }}
      >
        {t("Cancel")}
      </button>
      </div> */}
  
     




    </Card>
  );

  // if (architectDetails?.length !== null) {
  //   if (isMobile) {
  //     return (
  //       <ArchitectDetailsMobileInbox
  //         businessService={businessService}
  //         data={architectDetails}
  //         isLoading={hookLoading}
  //         defaultSearchParams={initialStates.searchParams}
  //         isSearch={!isInbox}
  //         onFilterChange={handleFilterChange}
  //         searchFields={getSearchFields()}
  //         onSearch={handleFilterChange}
  //         onSort={handleSort}
  //         onNextPage={fetchNextPage}
  //         tableConfig={rest?.tableConfig}
  //         onPrevPage={fetchPrevPage}
  //         currentPage={Math.floor(pageOffset / pageSize)}
  //         pageSizeLimit={pageSize}
  //         disableSort={false}
  //         onPageSizeChange={handlePageSizeChange}
  //         parentRoute={parentRoute}
  //         searchParams={searchParams}
  //         sortParams={sortParams}
  //         totalRecords={totalRecords}
  //         linkPrefix={'/digit-ui/employee/hrms/details/'}
  //         filterComponent={filterComponent}
  //       />
  //       // <div></div>
  //     );
  //   } else {
  //     return (
  //       <div>
  //         {isInbox && <Header>{t("HR_HOME_SEARCH_RESULTS_HEADING")}</Header>}
  //         <ArchitectDetailsDesktopInbox
  //           businessService={businessService}
  //           data={architectDetails}
  //           // isLoading={hookLoading}
  //           defaultSearchParams={initialStates.searchParams}
  //           isSearch={!isInbox}
  //           onFilterChange={handleFilterChange}
  //           searchFields={getSearchFields()}
  //           onSearch={handleFilterChange}
  //           onSort={handleSort}
  //           onNextPage={fetchNextPage}
  //           onPrevPage={fetchPrevPage}
  //           currentPage={Math.floor(pageOffset / pageSize)}
  //           pageSizeLimit={pageSize}
  //           disableSort={false}
  //           onPageSizeChange={handlePageSizeChange}
  //           parentRoute={parentRoute}
  //           searchParams={searchParams}
  //           sortParams={sortParams}
  //           totalRecords={totalRecords}
  //           filterComponent={filterComponent}
  //         />
  //       </div>
  //     );
  //   }
  // }
};

export default ArchitectDetailsInbox1;
