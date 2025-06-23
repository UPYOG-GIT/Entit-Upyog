import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ApplicationTable from "../inbox/ApplicationTable";
import { Card, Header, Loader, Modal, LabelFieldPair, Dropdown, CardLabel, TextInput, KeyNote, Toast } from "@upyog/digit-ui-react-components";
import InboxLinks from "../inbox/ApplicationLinks";
import SearchApplication from "./search";

const ArchitectDetailsDesktopInbox = ({ tableConfig, filterComponent, ...props }) => {
  const { t } = useTranslation();
  const tenantIds = Digit.SessionStorage.get("HRMS_TENANTS");
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const GetCell = (value) => <span className="cell-text">{t(value)}</span>;
  const [modalData, setModalData] = useState(false);
  const [showToast, setShowToast] = useState(null);
  const [archId, setArchId] = useState();
  const [architectId, setArchitectId] = useState();
  const [architectName, setArchitectName] = useState();
  const [architectMobNo, setArchitectMobNo] = useState();
  const [architectUuid, setArchitectUuid] = useState();
  const [architectValidity, setArchitectValidity] = useState();
  const [architectUpdateValidity, setArchitectUpdateValidity] = useState();

  // const handleDateChange = (date) => {
  //   setSelectedDate(date);
  // };

  // const formatValidityDate = (dateString) => {
  //   const date = new Date(dateString);
  //   const formattedDate = date.toISOString().slice(0, 16); // Extracting "yyyy-MM-ddThh:mm" from ISO string
  //   return formattedDate;

  // };

  const formattedUpdateValidityDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // January is 0!
    const year = date.getFullYear();
    // const hours = String(date.getHours()).padStart(2, "0");
    // const minutes = String(date.getMinutes()).padStart(2, "0");
    // const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${day}-${month}-${year} 23:59:59`;
  };

  const GetSlaCell = (value) => {
    return value == "INACTIVE" ? (
      <span className="sla-cell-error">{t(value) || ""}</span>
    ) : (
      <span className="sla-cell-success">{t(value) || ""}</span>
    );
  };

  const updateValidity = async (e) => {
    e.preventDefault();
    // console.log("Validity Update Date : " + architectUpdateValidity);

    const user = {
      uuid: architectUuid,
      mobileNumber: architectMobNo,
      id: architectId,
      validityDate: formattedUpdateValidityDate(architectUpdateValidity),
    };

    // console.log("User : " + JSON.stringify(user));
    closeModal();

    const updateResponse = await Digit.HRMSService.architectValidityUpdate(tenantId, { user: user }, {});
    // const responseObject = JSON.parse(updateResponse?.user);

    // console.log("updateResponse: "+ JSON.stringify(updateResponse));

    // if (updateResponse > 0) {
    if (updateResponse.user && updateResponse.user.length > 0) {
      setShowToast({ key: false, label: "Architect Validity Updated ", bgcolor: "#4BB543" });
      location.reload();
    } else {
      setShowToast({ key: true, label: "Fail To Update", bgcolor: "red" });
    }
  };

  const handleClick = (row) => {
    // console.log("Button clicked in row with data:", row.original.id);
    setArchitectId(row.original.id);
    setArchitectMobNo(row.original.mobileNumber);
    setArchitectName(row.original.name);
    setArchitectUuid(row.original.uuid);
    setArchitectValidity(row.original.validityDate);
    setModalData(true);
  };

  const closeModal = () => {
    setModalData(false);
  };

  const data = props?.data?.user;

  const [FilterComponent, setComp] = useState(() => Digit.ComponentRegistryService?.getComponent(filterComponent));

  const columns = React.useMemo(() => {
    return [
      {
        Header: t("Architect Name"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(`${row.original?.name}`);
        },
      },
      {
        Header: t("Mobile Number"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(`${row.original?.mobileNumber}`);
        },
      },
      {
        Header: t("Validity Date"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(`${row.original?.validityDate ? "" + (row.original?.validityDate).split(" ")[0] : null}`);
        },
      },
      {
        Header: "Actions",
        disableSortBy: true,
        Cell: ({ row }) => <button onClick={() => handleClick(row)} style={{margin: "24px",backgroundColor: "#F47738",height: "40px",color: "white",borderBottom: "1px solid black"}}>Update Validity Date</button>,
      },
      {
        Header: t("HR_STATUS_LABEL"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetSlaCell(`${row.original?.active ? "ACTIVE" : "INACTIVE"}`);
        },
      },
    ];
  }, []);

  let result;
  if (props.isLoading) {
    result = <Loader />;
  } else if (data?.length === 0) {
    result = (
      <Card style={{ marginTop: 20 }}>
        {/* TODO Change localization key */}
        {t("COMMON_TABLE_NO_RECORD_FOUND")
          .split("\\n")
          .map((text, index) => (
            <p key={index} style={{ textAlign: "center" }}>
              {text}
            </p>
          ))}
      </Card>
    );
  } else if (data?.length > 0) {
    result = (
      <ApplicationTable
        t={t}
        data={data}
        columns={columns}
        getCellProps={(cellInfo) => {
          return {
            style: {
              maxWidth: cellInfo.column.Header == t("HR_EMP_ID_LABEL") ? "150px" : "",
              padding: "20px 18px",
              fontSize: "16px",
              minWidth: "150px",
            },
          };
        }}
        onPageSizeChange={props.onPageSizeChange}
        currentPage={props.currentPage}
        onNextPage={props.onNextPage}
        onPrevPage={props.onPrevPage}
        pageSizeLimit={props.pageSizeLimit}
        onSort={props.onSort}
        disableSort={props.disableSort}
        // onPageSizeChange={props.onPageSizeChange}
        sortParams={props.sortParams}
        totalRecords={props.totalRecords}
      />
    );
  }

  return (
    <div className="inbox-container">
      {!props.isSearch && (
        <div className="filters-container">
          <InboxLinks
            parentRoute={props.parentRoute}
            allLinks={[
              {
                text: "HR_COMMON_CREATE_EMPLOYEE_HEAD",
                link: "/digit-ui/employee/hrms/create",
                businessService: "hrms",
                roles: ["HRMS_ADMIN"],
              },
            ]}
            headerText={"HRMS"}
            businessService={props.businessService}
          />
          <div>
            {
              <FilterComponent
                defaultSearchParams={props.defaultSearchParams}
                onFilterChange={props.onFilterChange}
                searchParams={props.searchParams}
                type="desktop"
                tenantIds={tenantIds}
              />
            }
          </div>
        </div>
      )}
      <div style={{ flex: 1 }}>
        <SearchApplication
          defaultSearchParams={props.defaultSearchParams}
          onSearch={props.onSearch}
          type="desktop"
          tenantIds={tenantIds}
          searchFields={props.searchFields}
          isInboxPage={!props?.isSearch}
          searchParams={props.searchParams}
        />
        <div className="result" style={{ marginLeft: !props?.isSearch ? "24px" : "", flex: 1 }}>
          {result}
        </div>
      </div>

      {modalData && (
        <Card style={{ position: "absolute" }} className={"employeeCard-override"}>
          <Modal
            hideSubmit={true}
            isDisabled={false}
            popupStyles={{ width: "800px", height: "auto", margin: "auto", padding: "auto" }}
            formId="modal-action"
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Header styles={{ marginLeft: "0px", paddingTop: "1px", fontSize: "25px" }}>{t("Architect Validity Date Update")}</Header>
                {/* <span onClick={closeModal}>
                <CloseSvg />
              </span> */}
              </div>
              <form>
                <div>
                  {/* <KeyNote
                    noteStyle={{ color: "red", fontSize: "15px", padding: "auto" }}
                    keyValue={t("Note")}
                    note={
                      "Information will not be updated if click other than ok button of this window. Press Tab button to field navigation.* - Required Fields"
                    }
                  /> */}
                  <LabelFieldPair>
                    <CardLabel style={{ color: "#000" }}>{`${t("Architect Name")}`}</CardLabel>
                    <TextInput
                      isMandatory={true}
                      name="architectId"
                      onChange={(e) => setArchitectName(e.target.value)}
                      value={architectName}
                      type="text"
                      disabled={true}
                    />
                  </LabelFieldPair>
                  <LabelFieldPair>
                    <CardLabel style={{ color: "#000" }}>{`${t("Mobile Number")}`}</CardLabel>
                    <TextInput
                      isMandatory={true}
                      name="architectMobNo"
                      onChange={(e) => setArchitectMobNo(e.target.value)}
                      value={architectMobNo}
                      type="number"
                      disabled={true}
                    />
                  </LabelFieldPair>
                  <LabelFieldPair>
                    <CardLabel style={{ color: "#000" }}>{`${t("Validity Date")}`}</CardLabel>
                    <TextInput
                      isMandatory={true}
                      name="architectValidity"
                      // onChange={(e) => setArchitectMobNo(e.target.value)}
                      value={architectValidity ? architectValidity.split(" ")[0] : null}
                      type="text"
                      disabled={true}
                    />
                  </LabelFieldPair>
                  <LabelFieldPair>
                    <CardLabel style={{ color: "#000" }}>{`${t("Select Validity Date")}`}</CardLabel>
                    <input
                      isMandatory={true}
                      name="architectValidity"
                      // onChange={(e) => setArchitectUpdateValidity(formatValidityDate(e.target.value))}
                      onChange={(e) => setArchitectUpdateValidity(e.target.value)}
                      // onChange={date => setArchitectValidity(date)}
                      dateFormat="dd-MM-yyyy"
                      value={architectUpdateValidity}
                      // selected={architectValidity}
                      type="date"
                      // type="datetime-local"
                    />
                  </LabelFieldPair>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <button
                      onClick={updateValidity}
                      //   () => {
                      //   // Handle update logic
                      //   // Close modal afterwards
                      //   setShowModal(false);
                      // }}
                      style={{
                        margin: "24px",
                        backgroundColor: "#F47738",
                        width: "20%",
                        height: "40px",
                        color: "white",
                        borderBottom: "1px solid black",
                      }}
                    >
                      {t("Update")}
                    </button>
                    <button
                      onClick={() => {
                        // Handle cancel logic
                        // Close modal afterwards
                        closeModal;
                      }}
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
                  </div>
                </div>
              </form>
            </div>
          </Modal>
        </Card>
      )}
       {showToast && (
        <Toast
          error={showToast.key}
          label={t(showToast.label)}
          onClose={() => {
            setShowToast(null);
          }}
          style={{ backgroundColor: showToast.bgcolor }}
        />
      )}
    </div>
  );
};

export default ArchitectDetailsDesktopInbox;
