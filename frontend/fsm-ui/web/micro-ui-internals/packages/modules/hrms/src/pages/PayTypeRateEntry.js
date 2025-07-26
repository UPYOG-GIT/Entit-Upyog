import React, { useEffect, useState, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Card, Header, Modal, Dropdown, CardLabel, TextInput, SubmitBar, Toast, CloseSvg, EditPencilIcon, DeleteIcon, LabelFieldPair, Loader, Row, Table, BackButton, KeyNote
} from "@upyog/digit-ui-react-components";

const PayTypeRate = () => {

  
  const { t } = useTranslation();
  const [modalData, setModalData] = useState(false);
  const [PyType,setPyType] = useState({code: 'Building Permission Fee(nhnew)', value: 1});
  const [PyUnit,setPyUnit] = useState("per Sq. Meter");
  const [PyCalculatOn ,setPyCalculatOn] = useState("");
  const [PyOperation ,setPyOperation] = useState("");
  const [PyPropCategory ,setPyPropCategory] = useState("");
  const [PyBuildCategory ,setPyBuildCategory] = useState({code: "", value: "null"});
  // const [PyBuildCategory ,setPyBuildCategory] = useState("");
  const [PySubCategory ,setPySubCategory] = useState({code: "", value: "null"});
  const [resrate,setresrate] = useState(0);
  const [commrate,setcommrate] = useState(0);
  const [indrate,setindrate] = useState(0);
  const [percent,setpercent] = useState(0);

  const [rowid, setRowid] = useState([]);
  const selectedRows=[];

  const [PyTypedropval,setPyTypedropval] = useState([]);
  const [PropCategorydropdown,setPropCategorydropdown] = useState([]);
  const [BuildCategorydropdown,setBuildCategorydropdown] = useState([]);
  const [SubCategorydropdown,setSubCategorydropdown] = useState([]);

  const Unitdropdown = [{ code: "per Sq. Meter", value: "per Sq. Meter" }];
  const CalculatOndropdown = [{ code: "Buildup Area", value: "Buildup Area" },{ code: "Plot Area", value: "Plot Area" },{ code: "Buildup Area and Plot Area", value: "Buildup Area and Plot Area" },{ code: "Plot Area and No of Unit", value: "Plot Area and No of Unit" },{ code: "Net Plot Area", value: "Net Plot Area" }];
  const Operationdropdown = [{ code: "Multiple With Rate", value: "Multiple With Rate" },{ code: "Multiple With Percent", value: "Multiple With Percent" },{ code: "Slabwise", value: "Slabwise" },{ code: "Multiple With Rate & Percent", value: "Multiple With Rate & Percent" },{ code: "Fix", value: "Fix" }];

  const tenantId = Digit.ULBService.getCurrentTenantId();
  let validation = {};

  let typevalid = PyType.value;

  const setPaytype = (value) => setPyType(value);
  const setPayUnit = (value) => setPyUnit(value);
  const setPayCalculatOn = (value) => setPyCalculatOn(value);
  const setPayOperation = (value) => setPyOperation(value);
  const setPayPropCategory = (value) => setPyPropCategory(value);
  const setPayBuildCategory = (value) => setPyBuildCategory(value);
  const setPaySubCategory = (value) => setPySubCategory(value);

  const [showToast, setShowToast] = useState(null);
  const [PaytpRatetblval,setPaytpRatetblval]= useState([]);
  let { uuid } = Digit.UserService.getUser()?.info || {};
  const GetCell = (value) => <span className="cell-text">{t(value)}</span>;

  useEffect( async ()=>{
    let paytypeRule = await Digit.OBPSAdminService.getPaytype(tenantId);
    let PyTydrop=[];
    paytypeRule.map(item=>{
      if(item.defunt==="N"){
        PyTydrop.push({
          code: item.charges_type_name,
          value: item.id
        })
      }
    });
    setPyTypedropval(PyTydrop);
  },[])

  useEffect( async ()=>{
    let propType = await Digit.OBPSAdminService.getProptype(tenantId);
    let Proptydrop=[];
    propType.map(item=>{
      if(item.defunt==="N"){
        Proptydrop.push({
          code: item.description,
          value: item.srno
        })
      }
    });
    setPropCategorydropdown(Proptydrop);
  },[])

  useEffect( async ()=>{
    let BCatetype = await Digit.OBPSAdminService.getBCategory(tenantId);

    let BCatetydrop=[];
    BCatetype.map(item=>{
      if(item.defunt==="N"){
        BCatetydrop.push({
          code: item.description,
          value: item.id
        })
      }
    });
    // console.log(BCatetydrop);
    setBuildCategorydropdown(BCatetydrop);
  },[])

  useEffect( async ()=>{
    if(PyBuildCategory != "null"){

    let cateId = PyBuildCategory.value;
    let BStype = await Digit.OBPSAdminService.getBSCategory(tenantId, cateId);
    let BSCatetydrop=[];
    BStype.map(item=>{
      if(item.defunt==="N"){
        BSCatetydrop.push({
          code: item.description,
          value: item.id
        })
      }
    });
    setSubCategorydropdown(BSCatetydrop);
  }
  },[PyBuildCategory])

  useEffect( async ()=>{
    let paytyperate = await Digit.OBPSAdminService.getPaytpRate(tenantId,typevalid);
    setPaytpRatetblval(paytyperate);
  },[PyType])



  const addPaytyperate = async(e)=>{
    e.preventDefault();

    if(!PyUnit){
      alert("Unit is required");
      return;
    }
    else if(!PyCalculatOn){
      alert("Calculated On is required");
      return;
    }
    else if(!PyOperation){
      alert("Operation is required");
      return;
    }
    else if(!PyPropCategory){
      alert("Proposal Category is required");
      return;
    }

    const PayTpRateRequest = {
      tenantId:tenantId,
      typeId:PyType.value,
      unitId:PyUnit.value,
      calCon:PyCalculatOn.value,
      calCact:PyOperation.value,
      pCategory:PyPropCategory.value,
      bCategory:PyBuildCategory.value,
      sCategory:PySubCategory.value,
      rateRes:resrate,
      rateComm:commrate,
      rateInd:indrate,
      createdBy:uuid,
      perVal:percent,
    };

    closeModal();  
    setPyUnit("");
    setPyCalculatOn("");
    setPyOperation("");
    setPyPropCategory("");
    setPyBuildCategory({code: "", value: "null"});
    setPySubCategory("");
    setresrate("");
    setcommrate("");
    setindrate("");
    setpercent("");

    const PayTyrateResp = await Digit.OBPSAdminService.createPayRate({PayTpRateRequest});
   
    if(PayTyrateResp>0){
      setShowToast({ key: false, label: "Successfully Added ", bgcolor: "#4BB543" });
      location.reload();
    }
    else{
      setShowToast({ key: true, label: "Fail To Add", bgcolor: "red" });
    }

  }
  

  const closeModal = () => {
    setModalData(false);
  };

  const GetCell1 = (value) => <input type="checkbox" id="checkbox3" onChange={(e) => getRowId(e)}  name="checkbox3" value={value}/>;
  const columns = React.useMemo(() => {
    return [
      {
        Header: t("Select"),
        disableSortBy: true,
        Cell: ({row}) => {
          return (
            GetCell1(`${row.original?.id}`)
          );
        },
      },
      {
        Header: t("Sno."),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(`${row.original?.id}`);
        },
      },
      {
        Header: t("Unit"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(`${row.original?.unitid}`);
        },
      },
      {
        Header: t("Calculated On"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(`${row.original?.calcon}`);
        },
      },
      {
        Header: t("Operation"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(`${row.original?.calcact}`);
        },
      },
      {
        Header: t("Proposal Category"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(`${row.original?.p_category}`);
        },
      },
      {
        Header: t("Building Category"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(`${row.original?.b_category}`);
        },
      },
      {
        Header: t("Sub Category"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(`${row.original?.s_category}`);
        },
      },
      {
        Header: t("Res. Rate"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(`${row.original?.rate_res}`);
        },
      },
      {
        Header: t("Comm. Rate"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(`${row.original?.rate_comm}`);
        },
      },
      {
        Header: t("Ind. Rate"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(`${row.original?.rate_ind}`);
        },
      },
      {
        Header: t("Percent"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(`${row.original?.perval}`);
        },
      },
    ];
  }, []);


   //this is for storing final data in array for delete
   function getRowId(e) {   
    const {value,checked} = e.target;   
    if(checked){
      selectedRows.push(value);
      // console.log("selectedRows value "+selectedRows);
    }
    else{
      const index = selectedRows.indexOf(value);
      if (index > -1) { 
        selectedRows.splice(index, 1); 
      }
    }
    if(selectedRows.length>0){
      setRowid(selectedRows);
    }
  }

    //this is for delete rows selected in checkBox
    const deleteItem = async ()=>{
      const PayTpRateRequest={
        ids : rowid,
      }
  
      if(rowid.length>0){
        const DeleterowResp = await Digit.OBPSAdminService.deletePayTpRate(PayTpRateRequest);
        
        if(DeleterowResp>0){
          setShowToast({ key: false, label: "Successfully Deleted ", bgcolor: "#4BB543" });
          location.reload();
        }
        else{
          setShowToast({ key: true, label: "Fail To Delete", bgcolor: "red" });
        }
      
      }
    }




  return (
    <Card style={{ position: "relative" }} className={"employeeCard-override"}>
      <Header styles={{ marginLeft: "0px", paddingTop: "10px", fontSize: "32px" }}>{t("Pay Type Rate Entry")}</Header>
     
      <LabelFieldPair>
        <CardLabel style={{ color: "#000" }}>{`${t("Payment Type")}`}</CardLabel>
        <Dropdown
          style={{ width: "100%"}}
          className="form-field"
          selected={PyType}
          option={PyTypedropval}
          select={setPaytype}
          value={PyType}
          optionKey="code"
          name="PyType"
        />
      </LabelFieldPair>
      
      <Table
        t={t}
        data={PaytpRatetblval}
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
      </div>
  
      {modalData ? (
          
        <Modal
          hideSubmit={true}
          isDisabled={false}
          popupStyles={{ width: "700px", height: "auto", margin: "auto" }}
          formId="modal-action"
        >
          <div>
            <div style={{display: "flex",justifyContent: "space-between"}}>
            <Header styles={{ marginLeft: "0px", paddingTop: "0px", fontSize: "25px" }}>{t("Pay Rate Details")}</Header>
              <span onClick={closeModal}>
                <CloseSvg />
              </span>
            </div>

         <form >
            <div>
            <KeyNote noteStyle={{color:"red",fontSize:"15px",lineHight:"18px"}} keyValue={t("Note")} note={"Information will not be updated if click other than ok button of this window. Press Tab button to field navigation.* - Required Fields"} />
             <LabelFieldPair>
                <CardLabel style={{ color: "#000" }}>{`${t("Unit*")}`}</CardLabel>
                <Dropdown
                  style={{ width: "100%" }}
                  className="form-field"
                  selected={PyUnit}
                  option={Unitdropdown}
                  select={setPayUnit}
                  value={PyUnit}
                  optionKey="code"
                  name="PyUnit"
                  {...(validation = {
                    isRequired: true,
                    // pattern: "^[a-zA-Z-.`' ]*$",
                    // type: "tel",
                    title: t("CORE_COMMON_PROFILE_NAME_ERROR_MESSAGE"),
                  })}
                />
              </LabelFieldPair>

              <LabelFieldPair>
                <CardLabel style={{ color: "#000" }}>{`${t("Calculated On*")}`}</CardLabel>
                <Dropdown
                  style={{ width: "100%"}}
                  className="form-field"
                  selected={PyCalculatOn}
                  option={CalculatOndropdown}
                  select={setPayCalculatOn}
                  value={PyCalculatOn}
                  optionKey="code"
                  name="PyCalculatOn"
                />
              </LabelFieldPair>

              <LabelFieldPair>
                <CardLabel style={{ color: "#000" }}>{`${t("Operation*")}`}</CardLabel>
                <Dropdown
                  style={{ width: "100%" }}
                  className="form-field"
                  selected={PyOperation}
                  option={Operationdropdown}
                  select={setPayOperation}
                  value={PyOperation}
                  optionKey="code"
                  name="PyOperation"
                />
              </LabelFieldPair>

              <LabelFieldPair>
                <CardLabel style={{ color: "#000" }}>{`${t("Proposal Category*")}`}</CardLabel>
                <Dropdown
                  style={{ width: "100%" }}
                  className="form-field"
                  selected={PyPropCategory}
                  option={PropCategorydropdown}
                  select={setPayPropCategory}
                  value={PyPropCategory}
                  optionKey="code"
                  name="PyPropCategory"
                />
              </LabelFieldPair>

              <LabelFieldPair>
                <CardLabel style={{ color: "#000" }}>{`${t("Building Category")}`}</CardLabel>
                <Dropdown
                  style={{ width: "100%" }}
                  className="form-field"
                  selected={PyBuildCategory}
                  option={BuildCategorydropdown}
                  select={setPayBuildCategory}
                  value={PyBuildCategory}
                  optionKey="code"
                  name="PyBuildCategory"
                />
              </LabelFieldPair>

              <LabelFieldPair>
                <CardLabel style={{ color: "#000" }}>{`${t("Sub Category")}`}</CardLabel>
                <Dropdown
                  style={{ width: "100%" }}
                  className="form-field"
                  selected={PySubCategory}
                  option={SubCategorydropdown}
                  select={setPaySubCategory}
                  value={PySubCategory}
                  optionKey="code"
                  name="PySubCategory"
                />
              </LabelFieldPair>

              <LabelFieldPair>
              <CardLabel style={{ color: "#000" }}>{`${t("Res. Rate")}`}</CardLabel>
               <TextInput
                        isMandatory={true}
                        name="ResRate"
                        onChange={(e)=>setresrate(e.target.value)}
                        value={resrate}
                        type="number"
                      />
              </LabelFieldPair>
              <LabelFieldPair>        
              <CardLabel style={{ color: "#000" }}>{`${t("Comm. Rate")}`}</CardLabel> 
               <TextInput
                        isMandatory={true}
                        name="CommRate"
                        onChange={(e)=>setcommrate(e.target.value)}
                        value={commrate}
                        type="number"
                      /> 
               </LabelFieldPair>
               <LabelFieldPair>       
               <CardLabel style={{ color: "#000" }}>{`${t("Ind. Rate")}`}</CardLabel>
               <TextInput
                        isMandatory={true}
                        name="IndRate"
                        onChange={(e)=>setindrate(e.target.value)}
                        value={indrate}
                        type="number"
                      />
               </LabelFieldPair>  
              <LabelFieldPair>     
              <CardLabel style={{ color: "#000" }}>{`${t("Percent")}`}</CardLabel>
                <TextInput
                        isMandatory={true}
                        name="Percent"
                        onChange={(e)=>setpercent(e.target.value)}
                        value={percent}
                        type="number"
                      />
              </LabelFieldPair>
              <div style={{display:"flex",justifyContent:"center"}}>
              <button
                onClick={addPaytyperate}
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
export default PayTypeRate;