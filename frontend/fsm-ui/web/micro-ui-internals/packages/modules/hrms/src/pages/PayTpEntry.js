import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useHistory } from "react-router-dom";
import {
  Card, Header, Modal, Dropdown, CardLabel, TextInput, SubmitBar, Table, CloseSvg, Toast, DeleteIcon, LabelFieldPair, Loader, Row, StatusTable, BackButton, CheckBox
} from "@upyog/digit-ui-react-components";


const getDatafromLS = (id) => {
  const data = localStorage.getItem('modalList' + id);
  if (data) {
    return JSON.parse(data);
  }
  else {
    return []
  }
}

const PayTpEntry = () => {
  const { id } = useParams();

  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const PayTypeData = [{ code: "Post Approval", value: "Post" }, { code: "Pre Approval", value: "Pre" }];
  const HeightData = [{ code: "NH NEW", value: "NN" }, { code: "NH REVISED", value: "NR" }, { code: "HR-NEW", value: "HN" }];
  const [refundable, setRefundable] = useState(false);
  const [optional, setOptional] = useState(false);
  const [defunct, setDefunct] = useState(false);
  const [modalDes, setModalDes] = useState("");
 
  const [modalData, setModalData] = useState(false);
  const [modalId, setModalId] = useState(1);
  const [modalList, setModalList] = useState(getDatafromLS(id));
  const [modalPyType, setModalPyType] = useState("");

  const [heightCategory, setHeightCategory] = useState("");

  const [showToast, setShowToast] = useState(null);
  const setPayRule = (value) => setModalPyType(value.value);
  const setHeightRule = (value) => setHeightCategory(value);

  const [Paytptblval,setPaytptblval]= useState([]);

  useEffect( async ()=>{
    let paytypeRule = await Digit.OBPSAdminService.getPaytype(tenantId);
    setPaytptblval(paytypeRule);
  },[modalData])

  let { uuid } = Digit.UserService.getUser()?.info || {};

  function refundableCheck(event) {
    setRefundable(event.target.checked);
  }

  function optionalCheck(event) {
    setOptional(event.target.checked);
  }

  function defunctCheck(event) {
    const isDefunct = event.target.checked;
    setDefunct(isDefunct);
  }
  function handleSelect(selectedOption) {
    setModalPyType(selectedOption.value);
  }

const addPayType =async (e)=>{
  e.preventDefault();
  
  if(!modalDes){
    alert("Description is required");
    return;
  }
  else if(!modalPyType){
    alert("Payment Type is required");
    return;
  }
  else if(!heightCategory){
    alert("Height Category is required");
    return;
  }

  const PayTypeRequest = {
    tenantId:tenantId, 
    chargesTypeName:modalDes,
    paymentType:modalPyType,
    createdBy:uuid,
    defunt:defunct==true?"Y":"N",
    optflag:optional==true?"Y":"N",
    hrnh:heightCategory.value,
    depflag:refundable==true?"Y":"N",
    fdrflg:"N",
    zdaflg:"N"
  };

  closeModal();  
  setModalDes("");
  setModalPyType("");
  setHeightCategory("");
  setRefundable(false);
  setOptional(false);
  setDefunct(false);

  const PayTypeResp = await Digit.OBPSAdminService.createPayType({PayTypeRequest});
 
  if(PayTypeResp>0){
    setShowToast({ key: false, label: "Successfully Added ", bgcolor: "#4BB543" });
  }
  else{
    setShowToast({ key: true, label: "Fail To Add", bgcolor: "red" });
  }

  // console.log("demandCreateres-----"+JSON.stringify(PayTypeResp));

}





  const handleAddAmountSubmit = (e) => {
    e.preventDefault();
    setModalId(modalId + 1);
    //console.log(modalId);
    let list = {
      modalId,
      modalDes,
      defunct,
      modalPyType

    }
    setModalList([...modalList, list]);

    setModalDes("");

  }

  useEffect(() => {
    localStorage.setItem('modalList' + id, JSON.stringify(modalList));
  }, [modalList]);


  const closeModal = () => {
    setModalData(false);
  };


  const GetCell = (value) =><span  className="cell-text">{t(value)}</span>;
  const columns = React.useMemo(() => {
    return [
      {
        Header: t("Type id"),
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
  
      <Header styles={{ marginLeft: "0px", paddingTop: "10px", fontSize: "32px" }}>{t("Pay Type Entry")}</Header>
      <ul style={{ listStyleType: 'disc' }}>
        <li style={{ marginBottom: '0.5rem', marginLeft: '1.0rem' }}>Click on Add Button To Add New Payment Type</li>
      </ul>
      <br />
      <Table
        t={t}
        data={Paytptblval}
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

      {modalData ? (
        <Modal
          hideSubmit={true}
          isDisabled={false}
          popupStyles={{ width: "700px", height: "700px", margin: "auto" }}
          formId="modal-action"
        >
          <div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h2></h2>
              <span onClick={closeModal}>
                <CloseSvg/>
              </span>
            </div>
            <form onSubmit={handleAddAmountSubmit}>
              <div>
                <Header styles={{ marginLeft: "0px", paddingTop: "10px", fontSize: "32px" }}>{t("Pay Type Entry")}</Header>
                <LabelFieldPair>
                  <CardLabel style={{ color: "#000" }}>{`${t("Description*")}`}</CardLabel>
                  <TextInput
                    isMandatory={true}
                    name="description"
                    onChange={(e) => setModalDes(e.target.value)}
                    value={modalDes}
                    type="text"
                  />
                </LabelFieldPair>
                <LabelFieldPair>
                  <CardLabel style={{ color: "#000" }}>{`${t("Payment Type*")}`}</CardLabel>
                  <Dropdown
                    style={{ width: "100%" }}
                    className="form-field"
                    selected={modalPyType}
                    option={PayTypeData}
                    select={setPayRule}
                    value={modalPyType}
                    optionKey="code"
                    name="modalPyType"
                  />
                </LabelFieldPair>
                <br />
                <LabelFieldPair>
                  <CardLabel style={{ color: "#000" }}>{`${t("Height Category")}`}</CardLabel>
                  <Dropdown
                    style={{ width: "100%" }}
                    className="form-field"
                    selected={heightCategory}
                    //disable={gender?.length === 1 || editScreen}
                    option={HeightData}
                    select={setHeightRule}
                    value={heightCategory}
                    optionKey="code"
                    // t={t}
                    name="heightCategory"
                  />
                </LabelFieldPair>


                <br />
                <LabelFieldPair>
                  <CardLabel style={{ color: "#000" }}>{`${t("Refundable")}`}</CardLabel>
                  <CheckBox
                    onChange={refundableCheck}
                    checked={refundable}
                    //  label={Refundable}
                    pageType={'employee'}
                  />
                </LabelFieldPair>
                <br />

                <LabelFieldPair>
                  <CardLabel style={{ color: "#000" }}>{`${t("Optional")}`}</CardLabel>
                  <CheckBox
                    onChange={optionalCheck}
                    checked={optional}
                    // label={optional}
                    pageType={'employee'}
                  />
                </LabelFieldPair>
                <br />

                <LabelFieldPair>
                  <CardLabel style={{ color: "#000" }}>{`${t("Defuct")}`}</CardLabel>
                  <CheckBox
                    onChange={defunctCheck}
                    checked={defunct}
                    //label={Refundable}
                    pageType={'employee'}
                    value={defunct}
                  />
                </LabelFieldPair>
                <br />
                <div style={{display:"flex",justifyContent:"center"}}>
     
                <button
                  onClick={addPayType}
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

      <br />

      <React.Fragment >
        <SubmitBar label={t("Add")} onSubmit={() => setModalData(true)} />
      </React.Fragment>



    </Card>


  );
};

export default PayTpEntry;
