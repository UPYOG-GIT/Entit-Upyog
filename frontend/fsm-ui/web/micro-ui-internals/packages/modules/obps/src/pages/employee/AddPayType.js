import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useHistory } from "react-router-dom";
import {
  Card, Header, Modal, Dropdown, CardLabel, TextInput, SubmitBar, Toast, CloseSvg, Table, DeleteIcon, LabelFieldPair, Loader, Row, CheckBox, BackButton
} from "@upyog/digit-ui-react-components";


const AddPayType = () => {

  const [showToast, setShowToast] = useState(null);
  const [modalData, setModalData] = useState(false);

  const [modalPyType, setModalPyType] = useState({ code: "", value: "null" });
  const [modalDes, setModalDes] = useState("");
  const [modalUnit, setModalUnit] = useState("per Sq. Meter");
  const [modalRate, setModalRate] = useState(0);
  const [modalValue, setModalValue] = useState(0);
  const [dropDownData, setDropDownData] = useState([]);
  const [VerifyDropdown, setVerifyDropdown] = useState({ code: "Yes", value: "Y" });
  const { id } = useParams();
  // const [verifyNote,setverifyNote] = useState();

  const setPayRule = (value) => setModalPyType(value);

  const setVerifDropdown = (value) => setVerifyDropdown(value);

  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const verifdDdata = [{ code: "Yes", value: "Y" }, { code: "No", value: "N" }];
  const [totalAmount, setTotalAmount] = useState(0);

  const [rowid, setRowid] = useState([]);
  const [feeDetailtblval, setfeeDetailtblval] = useState([]);
  let { uuid } = Digit.UserService.getUser()?.info || {};

  
  const selectedRows = [];
  // const billId = feeDetailtblval[0]?.bill_id;
  // console.log("billId : " + billId);
  // this is for add new row in table
  const insertNewRow = async (e) => {
    e.preventDefault();

    const fetchBillRes = await Digit.PaymentService.fetchBill(tenantId, { consumerCode: id, businessService: "BPA.NC_SAN_FEE" });
    let billId = "";
    if (fetchBillRes?.Bill?.length > 0) {
      billId = fetchBillRes?.Bill?.[0]?.id;
    }
    const PayTypeFeeDetailRequest = {
      tenantId: tenantId,
      billId: billId ? billId : "",
      applicationNo: id,
      unit: modalUnit,
      payTypeId: modalPyType.value,
      chargesTypeName: modalPyType.code,
      amount: modalValue,
      rate: modalRate,
      propPlotArea: "",
      type: "",
      feeType: "Post",
      createdBy: uuid
    };

    closeModal();
    setModalDes("");
    setModalPyType("");
    setModalRate(0);
    setModalValue(0);

    const FeeDetailResp = await Digit.OBPSAdminService.createFeeDetail({ PayTypeFeeDetailRequest });
    if (FeeDetailResp > 0) {
      setShowToast({ key: false, label: "Successfully Added ", bgcolor: "#4BB543" });
      location.reload();
    }
    else {
      setShowToast({ key: true, label: "Fail To Add", bgcolor: "red" });
    }
  }

  //this is for getting table data and totalamount
  let sumofAmount = 0;
  useEffect(async () => {
    let feeDetails = await Digit.OBPSAdminService.getFeeDetails(id);
    setfeeDetailtblval(feeDetails);
    // console.log(feeDetails);
    feeDetails.map(item => {
      // if(item.verify == "Y"){
      //   setverifyNote(true);
      // }
      // else{
      //   setverifyNote(false);
      // }
      if (item.feetype == "Post" && item.is_fdr == "N") {
        sumofAmount += item.amount;

      }
      setTotalAmount(sumofAmount);
    })
  }, [modalData])

  //this is for table
  const GetCell = (value) => <span className="cell-text">{t(value)}</span>;
  const GetCell1 = (value) => <input type="checkbox" id="vehicle1" onChange={(e) => getRowId(e)} name="vehicle1" value={value} />;
  const columns = React.useMemo(() => {
    return [
      {
        Header: t("Select"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return (
            GetCell1(`${row.original?.id}`)
          );
        },
      },
      {
        Header: t("Sno"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(`${row.original?.id}`);
        },
      },
      {
        Header: t("Description"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(`${row.original?.charges_type_name}`);
        },
      },
      {
        Header: t("Proposed Area"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(`${row.original?.prop_plot_area}`);
        },
      },
      {
        Header: t("Measurement Unit"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(`${row.original?.unit}`);
        },
      },
      {
        Header: t("Rate"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(`${row.original?.rate}`);
        },
      },
      {
        Header: t("Value"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(`${row.original?.amount}`);
        },
      },
    ];
  }, []);

  //this is for storing final data in array for delete
  function getRowId(e) {
    const { value, checked } = e.target;
    if (checked) {
      selectedRows.push(value);
      // console.log("selectedRows value "+selectedRows);
    }
    else {
      const index = selectedRows.indexOf(value);
      if (index > -1) {
        selectedRows.splice(index, 1);
      }
    }
    if (selectedRows.length > 0) {
      setRowid(selectedRows);
    }
  }

  //this is for delete rows selected in checkBox
  const deleteItem = async () => {
    const PayTypeFeeDetailRequest = {
      ids: rowid,
      applicationNo: id,
      feeType: "Post"
    }

    if (rowid.length > 0) {
      const DeleterowResp = await Digit.OBPSAdminService.deleteFeeDetail(PayTypeFeeDetailRequest);

      if (DeleterowResp > 0) {
        setShowToast({ key: false, label: "Successfully Deleted ", bgcolor: "#4BB543" });
        location.reload();
      }
      else {
        setShowToast({ key: true, label: "Fail To Delete", bgcolor: "red" });
      }

    }
  }

  //this is for submitting verify status
  const verifySubmit = async (e) => {
    e.preventDefault();

    const verifyFeeResp = await Digit.OBPSAdminService.verifyFeeDetail(id, VerifyDropdown.value, "Post", uuid);

    if (verifyFeeResp > 0) {
      setShowToast({ key: false, label: "Successfully Verified ", bgcolor: "#4BB543" });
      location.reload();
    }
    else {
      setShowToast({ key: true, label: "Fail To Verify", bgcolor: "red" });
    }

  }

  //this gives application  details
  const { data = {}, isLoading } = Digit.Hooks.obps.useBPADetailsPage(tenantId, { applicationNo: id });

  //this gives dropdown value for payType rule entry in modal form
  useEffect(async () => {
    let paytypeRule = await Digit.OBPSAdminService.getPaytype(tenantId);
    let PyTydrop = [];
    paytypeRule.map(item => {
      if (item.defunt === "N") {
        PyTydrop.push({
          code: item.charges_type_name,
          value: item.id
        })
      }
    });
    setDropDownData(PyTydrop);
  }, [])

  if (isLoading) {
    return <Loader />;
  }

  const plotarea = data?.edcrDetails?.planDetail?.planInformation?.plotArea;
  const totalBuitUpArea = data?.edcrDetails?.planDetail?.virtualBuilding?.totalBuitUpArea;

  const closeModal = () => {
    setModalData(false);
  };


  const errorhandel = () => {
    // setShowToast({ key: true, label: "No Data in table", bgcolor: "red" });
    alert("No Data in table");
    // location.reload();
  }




  return (

    <Card style={{ position: "relative" }} className={"employeeCard-override"}>

      {/* {verifyNote?
      <div className="flex-center" style={{width: "40%",height:"3rem",borderRadius:"4%",backgroundColor:"#14A731",margin: "auto"}}>
				<p style={{textAlign: "center", paddingTop:"3%"}}>This Application Number is already verified by status   
				</p>
      </div>
      :""} */}

      <Header styles={{ marginLeft: "0px", paddingTop: "10px", fontSize: "32px" }}>{t("Payment Verification")}</Header>
      {data?.applicationDetails?.map((detail, index) => (

        <React.Fragment key={index} >
          <div style={{ marginLeft: "20rem", }}>
            {
              detail?.title == "BPA_BASIC_DETAILS_TITLE" ? (
                <React.Fragment>

                  <table style={{ marginLeft: "50px", justifyContent: "space-between", fontSize: "16px", lineHeight: "19px", color: "rgb(11, 12, 12)", }}>
                    <tr><td style={{ padding: "15px" }}>{t("Application No")}</td><td style={{ paddingLeft: "5rem" }}>{t(id)}</td></tr>
                    {detail?.values?.map((value, index) => (
                      <tr><td style={{ padding: "15px" }}>{t(value.title)}</td><td style={{ paddingLeft: "5rem" }}>{t(value.value)}</td></tr>

                    ))}
                    <tr><td style={{ padding: "15px" }}>{t("Plot Area")}</td><td style={{ paddingLeft: "5rem" }}>{t(plotarea)}</td></tr>
                    <tr><td style={{ padding: "15px" }}>{t("Total BuitUp Area")}</td><td style={{ paddingLeft: "5rem" }}>{t(totalBuitUpArea)}</td></tr>

                  </table>

                </React.Fragment>
              ) : ""}

          </div>
        </React.Fragment>
      ))}

      {/* <React.Fragment></React.Fragment> */}

      <Table
        t={t}
        data={feeDetailtblval}
        columns={columns}
        className="customTable table-border-style"
        manualPagination={false}
        isPaginationRequired={false}
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
      {feeDetailtblval.length < 1 ? <div>No rows are added yet</div> : ""}
      <h1 className="flex-right">Gross Amount :{totalAmount.toFixed(2)}</h1>
      <h1 className="flex-right">Net Amount :{totalAmount.toFixed(2)}</h1>
      {feeDetailtblval.length < 1 ?
        <React.Fragment>
          <button type="button" className="button-sub-text" onClick={() => setModalData(true)} style={{ margin: "10px", backgroundColor: "#008CBA" }}>Add New Row</button>
          <button type="button" className="button-sub-text" onClick={errorhandel} style={{ margin: "10px", backgroundColor: "#008CBA" }}>Delete</button>
        </React.Fragment>
        :
        <React.Fragment>
          <button type="button" className="button-sub-text" onClick={() => setModalData(true)} style={{ margin: "10px", backgroundColor: "#008CBA" }}>Add New Row</button>
          <button type="button" className="button-sub-text" onClick={deleteItem} style={{ margin: "10px", backgroundColor: "#008CBA" }}>Delete</button>
        </React.Fragment>
      }

      {/* <button type="button" className="button-sub-text" onClick={()=>setModalData(true)} style={{margin:"10px",backgroundColor: "#008CBA"}}>Add New Row</button>
      <button type="button" className="button-sub-text" onClick={deleteItem} style={{margin:"10px",backgroundColor: "#008CBA"}}>Delete</button>
      */}
      <form>
        <Dropdown
          style={{ width: "10%", margin: "auto" }}
          className="form-field"
          selected={VerifyDropdown}
          // disable={gender?.length === 1 || editScreen}
          option={verifdDdata}
          select={setVerifDropdown}
          value={VerifyDropdown}
          optionKey="code"
          // t={t}
          name="VerifyDropdown"
        />
        <button type="submit" style={{ border: "3px solid green", backgroundColor: "green", fontWeight: "bold", margin: "auto", width: "10%" }} onClick={verifySubmit}>Submit</button>
      </form>

      {modalData ? (
        <Modal
          hideSubmit={true}
          isDisabled={false}
          popupStyles={{ width: "700px", height: "700px", margin: "auto" }}
          formId="modal-action"
        >
          <div>
            {/* <button onClick={closeModal}>close</button> */}
            {/* <button onClick={closeModal}><CloseSvg/></button> */}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h2></h2>
              <span onClick={closeModal}>
                <CloseSvg />
              </span>
            </div>
            <form >
              <div>
                <Header styles={{ marginLeft: "0px", paddingTop: "10px", fontSize: "32px" }}>{t("FORM")}</Header>

                <LabelFieldPair>
                  <CardLabel style={{ color: "#B1B4B6" }}>{`${t("Payment Type")}`}</CardLabel>
                  <Dropdown
                    style={{ width: "100%" }}
                    className="form-field"
                    selected={modalPyType}
                    // disable={gender?.length === 1 || editScreen}
                    option={dropDownData}
                    select={setPayRule}
                    value={modalPyType}
                    optionKey="code"
                    // t={t}
                    name="modalPyType"
                  />
                </LabelFieldPair>

                <LabelFieldPair>
                  <CardLabel style={{ color: "#B1B4B6" }}>{`${t("Payment Description")}`}</CardLabel>
                  <TextInput
                    isMandatory={true}
                    name="description"
                    onChange={(e) => setModalDes(e.target.value)}
                    value={modalDes}
                    type="text"
                  />
                </LabelFieldPair>
                <LabelFieldPair>
                  <CardLabel style={{ color: "#B1B4B6" }}>{`${t("Measurement Unit")}`}</CardLabel>
                  <TextInput
                    isMandatory={true}
                    name="unit"
                    onChange={(e) => setModalUnit(e.target.value)}
                    value={modalUnit}
                    type="text"
                    disabled
                  />
                </LabelFieldPair>
                <LabelFieldPair>
                  <CardLabel style={{ color: "#B1B4B6" }}>{`${t("Rate")}`}</CardLabel>
                  <TextInput
                    isMandatory={true}
                    name="rate"
                    onChange={(e) => setModalRate(e.target.value)}
                    value={modalRate}
                    type="number"
                  />
                </LabelFieldPair>
                <LabelFieldPair>
                  <CardLabel style={{ color: "#B1B4B6" }}>{`${t("Value")}`}</CardLabel>
                  <TextInput
                    isMandatory={true}
                    name="value"
                    onChange={(e) => setModalValue(e.target.value)}
                    value={modalValue}
                    type="number"
                  />
                </LabelFieldPair>
                <button
                  onClick={insertNewRow}
                  style={{
                    marginTop: "24px",
                    backgroundColor: "#F47738",
                    width: "100%",
                    height: "40px",
                    color: "white",
                    borderBottom: "1px solid black",
                  }}
                >
                  {t("OK")}
                </button>
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
};

export default AddPayType;