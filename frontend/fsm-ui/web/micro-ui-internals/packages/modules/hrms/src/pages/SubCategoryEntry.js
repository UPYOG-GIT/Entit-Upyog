import React, { useEffect, useState, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Card, Header, Modal, Dropdown, CardLabel, TextInput, CheckBox, Toast, CloseSvg, EditPencilIcon, DeleteIcon, LabelFieldPair, Loader, Row, Table, BackButton, KeyNote
} from "@upyog/digit-ui-react-components";

const SubCategoryEntry = () => {

  const { t } = useTranslation();
  const [modalData, setModalData] = useState(false);
  const [SubCate, setSubCate] = useState({ code: 'RESIDENTIAL', value: 1 });
  const [showToast, setShowToast] = useState(null);
  const [modalSubCat, setmodalSubCat] = useState("");
  const [Subcatedes, setSubcatedes] = useState("");

  const [defunct, setDefunct] = useState(false);
  const [modalSubCatdpdown, setmodalSubCatdpdown] = useState([]);
  const [Subcatedropval, setSubcatedropval] = useState([]);
  const [Subcattblval, setSubcattblval] = useState([]);

  const tenantId = Digit.ULBService.getCurrentTenantId();
  let validation = {};

  const setSubCategory = (value) => setSubCate(value);
  const setmodalSubCategory = (value) => setmodalSubCat(value);

  let catid = SubCate.value;
  const GetCell = (value) => <span className="cell-text">{t(value)}</span>;
  let { uuid } = Digit.UserService.getUser()?.info || {};

  useEffect(async () => {
    let BCatedrop = await Digit.OBPSAdminService.getBCategory(tenantId);
    let bcatedrop = [];
    BCatedrop.map(item => {
      if (item.defunt === "N") {
        bcatedrop.push({
          code: item.description,
          value: item.id
        })
      }
    });
    setSubcatedropval(bcatedrop);
    setmodalSubCatdpdown(bcatedrop);
  }, [])


  useEffect(async () => {
    let proptype = await Digit.OBPSAdminService.getBSCategory(tenantId, catid);
    setSubcattblval(proptype);

  }, [SubCate])


  const closeModal = () => {
    setModalData(false);
  };
  function DefCheck(event) {
    setDefunct(event.target.checked);
  }

  const addSubcate = async (e) => {
    e.preventDefault();

    const BSCategoryRequest = {
      tenantId: tenantId,
      desc: Subcatedes,
      createdBy: uuid,
      defunt: defunct == true ? "Y" : "N",
      catid: modalSubCat.value
    };

    closeModal();
    setSubcatedes("");
    setDefunct(false);
    setmodalSubCat("");

    const BSCateResp = await Digit.OBPSAdminService.createBSCate({ BSCategoryRequest });

    if (BSCateResp > 0) {
      setShowToast({ key: false, label: "Successfully Added ", bgcolor: "#4BB543" });
    }
    else {
      setShowToast({ key: true, label: "Fail To Add", bgcolor: "red" });
    }

  }

  const columns = React.useMemo(() => {
    return [
      {
        Header: t("Sub Category Id"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(`${row.original?.id}`);
        },
      },
      {
        Header: t("Description"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(`${row.original?.description}`);
        },
      },
      {
        Header: t("Defunct"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(`${row.original?.defunt}`);
        },
      },

    ];
  }, []);


  return (
    <Card style={{ position: "relative" }} className={"employeeCard-override"}>
      <Header styles={{ marginLeft: "0px", paddingTop: "10px", fontSize: "32px" }}>{t("Sub Category Entry")}</Header>

      <LabelFieldPair>
        <CardLabel style={{ color: "#000" }}>{`${t("Category ")}`}</CardLabel>
        <Dropdown
          style={{ width: "100%" }}
          className="form-field"
          selected={SubCate}
          option={Subcatedropval}
          select={setSubCategory}
          value={SubCate}
          optionKey="code"
          name="SubCate"
        />
      </LabelFieldPair>

      <Table
        t={t}
        data={Subcattblval}
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

      <button
        onClick={() => setModalData(true)}
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

      {modalData ? (

        <Modal
          hideSubmit={true}
          isDisabled={false}
          popupStyles={{ width: "800px", height: "auto", margin: "auto", padding: "auto" }}
          formId="modal-action"
        >
          <div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Header styles={{ marginLeft: "0px", paddingTop: "1px", fontSize: "25px" }}>{t("Sub Category Entry")}</Header>
              <span onClick={closeModal}>
                <CloseSvg />
              </span>
            </div>
            <form >
              <div>
                <LabelFieldPair>
                  <CardLabel style={{ color: "#000" }}>{`${t("Description *")}`}</CardLabel>
                  <TextInput
                    isMandatory={true}
                    name="description"
                    onChange={(e) => setSubcatedes(e.target.value)}
                    value={Subcatedes}
                    placeholder="Enter Description"
                    type="text"
                  />
                </LabelFieldPair>

                <LabelFieldPair>
                  <CardLabel style={{ color: "#000" }}>{`${t("Category ")}`}</CardLabel>
                  <Dropdown
                    style={{ width: "100%", height: "2rem" }}
                    className="form-field"
                    selected={modalSubCat}
                    option={modalSubCatdpdown}
                    select={setmodalSubCategory}
                    value={modalSubCat}
                    optionKey="code"
                    placeholder="Select Category"
                    name="modalSubCat"
                  />
                </LabelFieldPair>

                <LabelFieldPair>
                  <CardLabel style={{ color: "#000" }}>{`${t("Defunct")}`}</CardLabel>
                  <CheckBox
                    onChange={DefCheck}
                    checked={defunct}
                  />
                </LabelFieldPair>

                <div style={{ display: "flex", justifyContent: "center" }}>
                  <button
                    onClick={addSubcate}
                    style={{
                      margin: "24px",
                      backgroundColor: "#F47738",
                      width: "20%",
                      height: "40px",
                      color: "white",
                      borderBottom: "1px solid black",
                    }}
                  >
                    {t("OK")}
                  </button>
                  <button
                    onClick={closeModal}
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
      ) : null}

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

    </Card>
  );


}
export default SubCategoryEntry;