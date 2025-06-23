import React, { useEffect, useState, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Card, Header, Modal, Dropdown, CardLabel, TextInput, SubmitBar, Toast, CloseSvg, EditPencilIcon, DeleteIcon, LabelFieldPair, Loader, Row, Table, BackButton, KeyNote
} from "@upyog/digit-ui-react-components";

const ArchitectDetailsInbox2 = () => {
  
  const { t } = useTranslation();
 
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [architectDetails, setArchitectDetails] = useState();
  const [architectDetailsLoaded, setArchitectDetailsLoaded] = useState(false);


  const selectedRows=[];
  const [rowid, setRowid] = useState([]);

  // const { isLoading: hookLoading, isError, error, data, ...rest } = Digit.Hooks.hrms.useArchitectDetailsSearch(
    
  //   tenantId
  // );

  //  useEffect(async () => {
  //   // const tenant = Digit.ULBService.getCurrentTenantId();
    
  //     const usersResponse = await Digit.HRMSService.architectdetailssearch(tenantId, { tenantId: tenantId }, {});
  //     console.log("Architect : "+JSON.stringify(usersResponse));
  //     setArchitectDetails(usersResponse);
  //     setArchitectDetailsLoaded(true);
      
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await Digit.HRMSService.architectdetailssearch(tenantId, { tenantId: tenantId }, {});
        console.log("Architect : "+JSON.stringify(usersResponse));
        setArchitectDetails(usersResponse);
        setArchitectDetailsLoaded(true);
      } catch (error) {
        // Handle error
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  
    // No cleanup required, so no return statement needed
  }, []);

  console.log("architectDetails "+JSON.stringify(architectDetails));
  
  // if (hookLoading) {
  //   return <Loader />;
  // }

  if (!architectDetailsLoaded) {
    return <Loader />;
  }

  const GetCell = (value) => <span className="cell-text">{t(value)}</span>;


  
  const GetCell1 = (value) => <input type="checkbox" id="checkbox2" onChange={(e) => getRowId(e)}  name="checkbox2" value={value}/>;
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
        t={t}
        data={architectDetails}
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
  
      




    </Card>
  );
}
export default ArchitectDetailsInbox2;