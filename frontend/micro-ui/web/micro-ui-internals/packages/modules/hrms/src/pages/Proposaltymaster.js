import React, { useEffect, useState, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useHistory } from "react-router-dom";
import {
  Card, Header, Modal, CheckBox, CardLabel, TextInput, SubmitBar, Toast, CloseSvg, EditPencilIcon, DeleteIcon, LabelFieldPair, Loader, Row, Table, BackButton, KeyNote
} from "@upyog/digit-ui-react-components";


const Proposaltymaster = () =>{

    const { t } = useTranslation();
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const [modalData, setModalData] = useState(false);
    const [modalName, setModalName] = useState("");
    const [modalDef, setModalDef] = useState(false);
    const [showToast, setShowToast] = useState(null);
    const [Proptptblval,setProptptblval]= useState([]);

    let { uuid } = Digit.UserService.getUser()?.info || {};
    let validation = {};
  
    useEffect( async ()=>{
      let proptype = await Digit.OBPSAdminService.getProptype(tenantId);
      setProptptblval(proptype);
    },[modalData])


    function DefCheck(event) {
      setModalDef(event.target.checked);
    }

    const addProptype = async(e)=>{
      e.preventDefault();

      const ProposalTypeRequest = {
        tenantId:tenantId,
        desc:modalName,
        createdBy:uuid,
        defunt:modalDef==true?"Y":"N"
      };

      closeModal();  
      setModalName("");
      setModalDef(false);
       
      const PropTyResp = await Digit.OBPSAdminService.createPropType({ProposalTypeRequest});
     
      if(PropTyResp>0){
        setShowToast({ key: false, label: "Successfully Added ", bgcolor: "#4BB543" });
      }
      else{
        setShowToast({ key: true, label: "Fail To Add", bgcolor: "red" });
      }

    }


    const GetCell = (value) => <span className="cell-text">{t(value)}</span>;

    const closeModal = () => {
      setModalData(false);
    };
  
    const columns = React.useMemo(() => {
      return [
        {
          Header: t("Id"),
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
        <Header styles={{ marginLeft: "0px", paddingTop: "10px", fontSize: "32px" }}>{t("Proposal Type Master")}</Header>
          
        <Table
          t={t}
          data={Proptptblval}
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
       
        {modalData ? (
            
          <Modal
            hideSubmit={true}
            isDisabled={false}
            popupStyles={{ width: "700px", height: "auto", margin: "auto" }}
            formId="modal-action"
          >
            <div>
              <div style={{display: "flex",justifyContent: "space-between"}}>
              <Header styles={{ marginLeft: "0px", paddingTop: "0px", fontSize: "25px" }}>{t("Proposal Type Master")}</Header>
                <span onClick={closeModal}>
                  <CloseSvg />
                </span>
              </div>
              {/* onSubmit={handleAddAmountSubmit} */}
           <form>
              <div>
                <LabelFieldPair>
                <CardLabel style={{ color: "#000" }}>{`${t("Name*")}`}</CardLabel>
                 <TextInput
                          isMandatory={true}
                          name="Name"
                          onChange={(e)=>setModalName(e.target.value)}
                          value={modalName}
                          type="text"
                        />
                </LabelFieldPair>
                <LabelFieldPair>
                  <CardLabel style={{ color: "#000" }}>{`${t("Defunct")}`}</CardLabel>
                  <CheckBox
                    onChange={DefCheck}
                    checked={modalDef}
                    // label={optional}
                    // pageType={'employee'}
                  />
                </LabelFieldPair>
                <br />
                
                <div style={{display:"flex",justifyContent:"center"}}>
                <button
                  onClick={addProptype}
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
export default Proposaltymaster;