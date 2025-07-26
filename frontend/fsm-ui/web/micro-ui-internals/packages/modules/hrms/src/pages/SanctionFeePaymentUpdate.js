import { StatusTable,BackButton, SearchField, TextInput, SubmitBar, Header, Toast, Card, CardHeader, Row, PDFSvg, CardSectionHeader,MultiLink, Loader } from "@upyog/digit-ui-react-components";


import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";



const SanctionFeePaymentUpdate = ({}) => {
  const { t } = useTranslation();
  const [applicationNo, setApplicationNo] = useState("");
  const [applicationData, setApplicationData] = useState([]);
  const [showToast, setShowToast] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const data = await Digit.OBPSAdminService.searchByApplicationNo('cg', applicationNo);
    //   console.log("searchByApplicationNo Response:", data.BPA);
      setApplicationData(data.BPA);
    } catch (error) {
      console.error("Search Error:", error);
    }
  };

  useEffect(() => {
    // Function to fetch scrutiny details when 'tableData' changes
    const updatePayment = async () => {
      try {
        if (applicationData.length > 0) {

            const updateResponse = await Digit.OBPSAdminService.updateBillAmount(applicationData[0].applicationNo, "BPA.NC_SAN_FEE", "Post");

            if(updateResponse.includes("Updated Successfully ")){
                setShowToast({ key: false, label: "Payment Successfully Updated", bgcolor: "#4BB543" });
              }
              else{
                setShowToast({ key: true, label: "Payment not Updated", bgcolor: "red" });
              }
        
              console.log("showToast"+JSON.stringify(showToast));
  
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    // Call the function to fetch data whenever 'tableData' changes
    updatePayment();
  }, [applicationData]);

  const tableContainerStyle = {
    marginTop: "20px", 
  };
  


 
  return (

    <>
    <form onSubmit={handleSubmit}>
       <BackButton>{t("CS_COMMON_BACK")}</BackButton>
       <div className="cardHeaderWithOptions" style={{ marginRight: "auto", maxWidth: "960px" , marginTop: 20}}>
      <Header styles={{ fontSize: "32px" }}>{t("Application Search ")}</Header>
  
    </div>
 
      <SearchField>
        <label>Enter Application Number </label>
        <TextInput
          name="applicationNo"
          value={applicationNo}
          onChange={(event) => setApplicationNo(event.target.value)}
        />
      </SearchField>
      <SearchField className="submit">
        <SubmitBar label="Search" submit onClick={handleSubmit} />
      
      </SearchField>
        
  
    </form>
    {showToast && (
      <div
        style={{
          backgroundColor: showToast.bgcolor,
          color: "white",
          padding: "10px",
          borderRadius: "5px",
          textAlign: "center",
          marginTop: "20px",
          maxWidth: "960px",
          margin: "20px auto 0"
        }}
      >
        {showToast.label}
      </div>
    )}
    
    </>
  );
};

export default SanctionFeePaymentUpdate;
