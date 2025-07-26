import React, { useEffect, useState, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Card, Header, Modal, Dropdown, CardLabel, TextInput, SubmitBar, Toast, CloseSvg, EditPencilIcon, DeleteIcon, LabelFieldPair, Loader, Row, Table, BackButton, KeyNote
} from "@upyog/digit-ui-react-components";

const SlabEntry = () => {
  
  const { t } = useTranslation();
  const [modalData, setModalData] = useState(false);
  const [SlabPyType,setSlabPyType] = useState({code: 'Building Permission Fee(nhnew)', value: 1});
  const [PyPropCat,setPyPropCat] = useState("");
  const [PyBuildCat,setPyBuildCat] = useState({code: "", value: "null"});
  // const [PyBuildCat,setPyBuildCat] = useState("");
  const [PySubCat,setPySubCat] = useState({code: "", value: "null"});
  const [PyFromValue,setPyFromValue] = useState(0);
  const [PyToValue,setPyToValue] = useState(0);
  const [PyOperation ,setPyOperation] = useState("");
  const [PyResRate ,setPyResRate] = useState(0);
  const [PyCommRate ,setPyCommRate] = useState(0);
  const [PyIndRate ,setPyIndRate] = useState(0);
  const [PyMultiplyValue ,setPyMultiplyValue] = useState(0);
  const [PyMaxLimit ,setPyMaxLimit] = useState(0);
  const [PropCatdropdown,setPropCatdropdown] = useState([]);
  const [BuildCatdropdown,setBuildCatdropdown] = useState([]);
  const [SubCatdropdown,setSubCatdropdown] = useState([]);
  const [SlabPyTypedropval,setSlabPyTypedropval] = useState([]);
  const [Slabtblval,setSlabtblval]= useState([]);
  const [showToast, setShowToast] = useState(null);
  
  const Operationdropdown = [{ code: "Multiply", value: "Multiply" },{ code: "Fix", value: "Fix" },{ code: "Fix and Multiply", value: "Fix and Multiply" },{ code: "Multiply and Check Limit", value: "Multiply and Check Limit" }];

  const tenantId = Digit.ULBService.getCurrentTenantId();
  let validation = {};

  const selectedRows=[];
  const [rowid, setRowid] = useState([]);

  const setSlabPaytype = (value) => setSlabPyType(value);
  const setPayPropCat = (value) => setPyPropCat(value);
  const setPayBuildCat = (value) => setPyBuildCat(value);
  const setPaySubCat = (value) => setPySubCat(value);
  const setPayOperation = (value) => setPyOperation(value);


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
      setSlabPyTypedropval(PyTydrop);
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
    setPropCatdropdown(Proptydrop);
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
    setBuildCatdropdown(BCatetydrop);
  },[])

  useEffect( async ()=>{
    if(PyBuildCat.value != "null"){
    let cateId = PyBuildCat.value;
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
    setSubCatdropdown(BSCatetydrop);
  }
  },[PyBuildCat])

  
  let typevalid=SlabPyType.value;
  useEffect( async ()=>{
    let getslab = await Digit.OBPSAdminService.getSlab(tenantId,typevalid);
    setSlabtblval(getslab);
  },[SlabPyType])



  const addSlab = async(e)=>{
    e.preventDefault();

    const SlabMasterRequest = {
      tenantId:tenantId,
      payTypeId:SlabPyType.value,
      fromVal:PyFromValue,
      toVal:PyToValue,
      operation:PyOperation.value,
      pCategory:PyPropCat.value,
      bCategory:PyBuildCat.value,
      sCategory:PySubCat.value,
      rateRes:PyResRate,
      rateComm:PyCommRate,
      rateInd:PyIndRate,
      createdBy:uuid,
      multpVal:PyMultiplyValue,
      maxLimit:PyMaxLimit,
    };

    closeModal();  
    setPyFromValue(0);
    setPyToValue(0);
    setPyOperation("");
    setPyPropCat("");
    setPyBuildCat({code: "", value: "null"});
    setPySubCat("");
    setPyResRate(0);
    setPyCommRate(0);
    setPyIndRate(0);
    setPyMultiplyValue(0);
    setPyMaxLimit(0);

    const SlabMasterResp = await Digit.OBPSAdminService.createSLab({SlabMasterRequest});
   
    if(SlabMasterResp>0){
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


  const GetCell1 = (value) => <input type="checkbox" id="checkbox2" onChange={(e) => getRowId(e)}  name="checkbox2" value={value}/>;
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
        Header: t("Srno"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(`${row.original?.id}`);
        },
      },
      {
        Header: t("From Value"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(`${row.original?.from_val }`);
        },
      },
      {
        Header: t("To Value"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(`${row.original?.to_val}`);
        },
      },
      {
        Header: t("Operation"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(`${row.original?.operation  }`);
        },
      },
      {
        Header: t("Res. Rate"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(`${row.original?.rate_res  }`);
        },
      },
      {
        Header: t("Comm. Rate"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(`${row.original?.rate_comm  }`);
        },
      },
      {
        Header: t("Ind. Rate"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(`${row.original?.rate_ind  }`);
        },
      },
      {
        Header: t("Proposal Category"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(`${row.original?.p_category }`);
        },
      },
      {
        Header: t("Building Category"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(`${row.original?.b_category }`);
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
        Header: t("Multiply Value"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(`${row.original?.multp_val}`);
        },
      },
      {
        Header: t("Max Limit"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(`${row.original?.max_limit}`);
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
    const SlabMasterRequest={
      ids : rowid,
    }
    // console.log("rowid value "+rowid);
    if(rowid.length>0){
      const DeleterowResp = await Digit.OBPSAdminService.deleteSlabdata(SlabMasterRequest);
      
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
      <Header styles={{ marginLeft: "0px", paddingTop: "10px", fontSize: "32px" }}>{t("Slab Master")}</Header>
     
      <LabelFieldPair>
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
      </LabelFieldPair>
      
      <Table
        t={t}
        data={Slabtblval}
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
          popupStyles={{ width: "800px", height: "auto", margin: "auto",padding:"auto"}}
          formId="modal-action"
        >
          <div>
            <div style={{display: "flex",justifyContent: "space-between"}}>
            <Header styles={{ marginLeft: "0px", paddingTop: "1px", fontSize: "25px" }}>{t("Slab Details")}</Header>
              <span onClick={closeModal}>
                <CloseSvg />
              </span>
            </div>
         <form >
            <div>
            <KeyNote noteStyle={{color:"red",fontSize:"15px",padding:"auto"}} keyValue={t("Note")} note={"Information will not be updated if click other than ok button of this window. Press Tab button to field navigation.* - Required Fields"} />
             <LabelFieldPair>
                <CardLabel style={{ color: "#000" }}>{`${t("Proposal Category*")}`}</CardLabel>
                <Dropdown
                  style={{ width: "100%",height:"2rem"}}
                  className="form-field"
                  selected={PyPropCat}
                  option={PropCatdropdown}
                  select={setPayPropCat}
                  value={PyPropCat}
                  optionKey="code"
                  placeholder="Select Proposal Category"
                  name="PyPropCat"
                  {...(validation = {
                    isRequired: true,
                    // pattern: "^[a-zA-Z-.`' ]*$",
                    // type: "tel",
                    title: t("CORE_COMMON_PROFILE_NAME_ERROR_MESSAGE"),
                  })}
                />
              </LabelFieldPair>

              <LabelFieldPair>
                <CardLabel style={{ color: "#000" }}>{`${t("Building Category*")}`}</CardLabel>
                <Dropdown
                  style={{ width: "100%",height:"2rem" }}
                  className="form-field"
                  selected={PyBuildCat}
                  option={BuildCatdropdown}
                  select={setPayBuildCat}
                  value={PyBuildCat}
                  optionKey="code"
                  placeholder="Select Building Category"
                  name="PyBuildCat"
                />
              </LabelFieldPair>

              <LabelFieldPair>
                <CardLabel style={{ color: "#000" }}>{`${t("Sub Category*")}`}</CardLabel>
                <Dropdown
                  style={{ width: "100%",height:"2rem" }}
                  className="form-field"
                  selected={PySubCat}
                  option={SubCatdropdown}
                  select={setPaySubCat}
                  value={PySubCat}
                  optionKey="code"
                  placeholder="Select Sub Category"
                  name="PySubCat"
                />
              </LabelFieldPair>

              <LabelFieldPair>
              <CardLabel style={{ color: "#000" }}>{`${t("From Value*")}`}</CardLabel>
               <TextInput
                        isMandatory={true}
                        name="fromvalue"
                        onChange={(e)=>setPyFromValue(e.target.value)}
                        value={PyFromValue}
                        placeholder="Enter From Value"
                        type="number"
                      />
              </LabelFieldPair>
              <LabelFieldPair>
              <CardLabel style={{ color: "#000" }}>{`${t("To Value*")}`}</CardLabel>
               <TextInput
                        isMandatory={true}
                        name="tovalue"
                        placeholder="Enter To Value"
                        onChange={(e)=>setPyToValue(e.target.value)}
                        value={PyToValue}
                        type="number"
                      />
              </LabelFieldPair>

             

              <LabelFieldPair>
                <CardLabel style={{ color: "#000" }}>{`${t("Operation*")}`}</CardLabel>
                <Dropdown
                  style={{ width: "100%",height:"2rem" }}
                  className="form-field"
                  selected={PyOperation}
                  option={Operationdropdown}
                  select={setPayOperation}
                  value={PyOperation}
                  optionKey="code"
                  placeholder="Select Operation"
                  name="PyOperation"
                />
              </LabelFieldPair>

              <LabelFieldPair>
              <CardLabel style={{ color: "#000" }}>{`${t("Res. Rate*")}`}</CardLabel>
               <TextInput
                        isMandatory={true}
                        name="resrate"
                        placeholder="Enter Res. Rate"
                        onChange={(e)=>setPyResRate(e.target.value)}
                        value={PyResRate}
                        type="number"
                      />
              </LabelFieldPair>
              <LabelFieldPair>        
              <CardLabel style={{ color: "#000" }}>{`${t("Comm. Rate*")}`}</CardLabel> 
               <TextInput
                        isMandatory={true}
                        name="commrate"
                        placeholder="Enter Comm. Rate"
                        onChange={(e)=>setPyCommRate(e.target.value)}
                        value={PyCommRate}
                        type="number"
                      /> 
               </LabelFieldPair>
               <LabelFieldPair>       
               <CardLabel style={{ color: "#000" }}>{`${t("Ind. Rate*")}`}</CardLabel>
               <TextInput
                        isMandatory={true}
                        name="indrate"
                        placeholder="Enter Ind. Rate"
                        onChange={(e)=>setPyIndRate(e.target.value)}
                        value={PyIndRate}
                        type="number"
                      />
               </LabelFieldPair>  
              <LabelFieldPair>     
              <CardLabel style={{ color: "#000" }}>{`${t("Multiply Value*")}`}</CardLabel>
                <TextInput
                        isMandatory={true}
                        name="multiplyvalue"
                        placeholder="Enter Multiply Value"
                        onChange={(e)=>setPyMultiplyValue(e.target.value)}
                        value={PyMultiplyValue}
                        type="number"
                      />
              </LabelFieldPair>
              <LabelFieldPair>     
              <CardLabel style={{ color: "#000" }}>{`${t("Max Limit*")}`}</CardLabel>
                <TextInput
                        isMandatory={true}
                        name="maxlimit"
                        placeholder="Enter Max Limit"
                        onChange={(e)=>setPyMaxLimit(e.target.value)}
                        value={PyMaxLimit}
                        type="number"
                      />
              </LabelFieldPair>
              <div style={{display:"flex",justifyContent:"center"}}>
              <button
                onClick={addSlab}
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
export default SlabEntry;