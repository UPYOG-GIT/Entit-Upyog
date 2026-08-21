import React, { useEffect, useState } from "react";
import { Banner, Card, CardText, SubmitBar, ActionBar, DownloadPrefixIcon, Loader } from "@upyog/digit-ui-react-components";
import { useHistory, useParams, Link, LinkLabel } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import Urls from "../../../../../../libraries/src/services/atoms/urls";

export const SuccessfulPayment = (props) => {
  const { addParams, clearParams } = props;
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  props.setLink(t("PAYMENT_LOCALIZATION_RESPONSE"));
  let { consumerCode, receiptNumber, businessService } = useParams();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  receiptNumber = receiptNumber.replace(/%2F/g, "/");
  const { data = {}, isLoading: isBpaSearchLoading, isSuccess: isBpaSuccess, error: bpaerror } = Digit.Hooks.obps.useOBPSSearch(
    "", {}, tenantId, { applicationNo: consumerCode }, {}, {enabled : businessService?.includes("BPA") ? true : false}
  );

  useEffect(() => {
    return () => {
      queryClient.clear();
    };
  }, []);

  const getMessage = () => t("ES_PAYMENT_COLLECTED");
  const getCardText = () => {
    if (businessService?.includes("BPA")) {
      let nameOfAchitect = sessionStorage.getItem("BPA_ARCHITECT_NAME");
      let parsedArchitectName = nameOfAchitect ? JSON.parse(nameOfAchitect) : "ARCHITECT";
      return t(`ES_PAYMENT_${businessService}_${parsedArchitectName}_SUCCESSFUL_DESCRIPTION`);
    } else {
      return t("ES_PAYMENT_SUCCESSFUL_DESCRIPTION")
    }
  }

  const { data: generatePdfKey } = Digit.Hooks.useCommonMDMS(tenantId, "common-masters", "ReceiptKey", {
    select: (data) =>
      data["common-masters"]?.uiCommonPay?.filter(({ code }) => businessService?.includes(code))[0]?.receiptKey || "consolidatedreceipt",
  });

  const printCertificate = async () => {
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const state = Digit.ULBService.getStateId();
    const applicationDetails = await Digit.TLService.search({ applicationNumber: consumerCode, tenantId });
    const generatePdfKeyForTL = "tlcertificate";

    if (applicationDetails) {
      let response = await Digit.PaymentService.generatePdf(state, { Licenses: applicationDetails?.Licenses }, generatePdfKeyForTL);
      const fileStore = await Digit.PaymentService.printReciept(state, { fileStoreIds: response.filestoreIds[0] });
      window.open(fileStore[response.filestoreIds[0]], "_blank");
    }
  };

  const convertDateToEpoch = (dateString, dayStartOrEnd = "dayend") => {
    //example input format : "2018-10-02"
    try {
      const parts = dateString.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
      const DateObj = new Date(Date.UTC(parts[1], parts[2] - 1, parts[3]));
      DateObj.setMinutes(DateObj.getMinutes() + DateObj.getTimezoneOffset());
      if (dayStartOrEnd === "dayend") {
        DateObj.setHours(DateObj.getHours() + 24);
        DateObj.setSeconds(DateObj.getSeconds() - 1);
      }
      return DateObj.getTime();
    } catch (e) {
      return dateString;
    }
  };

  const downloadPdf = (blob, fileName) => {
    if (window.mSewaApp && window.mSewaApp.isMsewaApp() && window.mSewaApp.downloadBase64File) {
      var reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = function () {
        var base64data = reader.result;
        mSewaApp.downloadBase64File(base64data, fileName);
      };
    } else {
      const link = document.createElement("a");
      // create a blobURI pointing to our Blob
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      // some browser needs the anchor to be in the doc
      document.body.append(link);
      link.click();
      link.remove();
      // in case the Blob uses a lot of memory
      setTimeout(() => URL.revokeObjectURL(link.href), 7000);
    }
  };
  
  const printPdf = (blob) => {
    const fileURL = URL.createObjectURL(blob);
    var myWindow = window.open(fileURL);
    if (myWindow != undefined) {
      myWindow.addEventListener("load", (event) => {
        myWindow.focus();
        myWindow.print();
      });
    }
  };

  const getPermitOccupancyOrderSearch = async(order, mode="download") => {
    let queryObj = { applicationNo: data?.[0]?.applicationNo };
    let bpaResponse = await Digit.OBPSService.BPASearch(data?.[0]?.tenantId, queryObj);
    const edcrResponse = await Digit.OBPSService.scrutinyDetails(data?.[0]?.tenantId, { edcrNumber: data?.[0]?.edcrNumber });
    let bpaData = bpaResponse?.BPA?.[0], edcrData = edcrResponse?.edcrDetail?.[0];
    let currentDate = new Date();
    bpaData.additionalDetails.runDate = convertDateToEpoch(currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate());
    let reqData = {...bpaData, edcrDetail: [{...edcrData}]};
    let response = await Digit.PaymentService.generatePdf(bpaData?.tenantId, { Bpa: [reqData] }, order);
    const fileStore = await Digit.PaymentService.printReciept(bpaData?.tenantId, { fileStoreIds: response.filestoreIds[0] });
    window.open(fileStore[response?.filestoreIds[0]], "_blank");
    reqData["applicationType"] = data?.[0]?.additionalDetails?.applicationType;
    let edcrResponseData = await Digit.OBPSService.edcr_report_download({BPA: {...reqData}});
    const responseStatus = parseInt(edcrResponseData.status, 10);
    if (responseStatus === 201 || responseStatus === 200) {
      mode == "print"
        ? printPdf(new Blob([edcrResponseData.data], { type: "application/pdf" }))
        : downloadPdf(new Blob([edcrResponseData.data], { type: "application/pdf" }), `edcrReport.pdf`);
    }

  }


 const printReciept = async () => {
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const paymentsHistory = await Digit.PaymentService.getReciept(
      tenantId,
      businessService,
      { receiptNumbers: receiptNumber }
    );
    if (!paymentsHistory?.Payments?.length) {
      console.error("No payments found");
      return;
    }
    const paymentIndex = paymentsHistory.Payments.length === 1 ? 0 : 1;
    const response = await fetch(Urls.payment.get_fsm_receipt, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Payments: [paymentsHistory.Payments[paymentIndex]] }),
    });
    if (!response.ok) {
      console.error("Failed:", response.status);
      return;
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Receipt_${receiptNumber}.pdf`;  // ← filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
};

  if (businessService?.includes("BPA") && isBpaSearchLoading) return <Loader />

   return (
    <React.Fragment>
      <Card>
        <Banner 
          message={getMessage()} 
          info={t("PAYMENT_LOCALIZATION_RECIEPT_NO")} 
          applicationNumber={receiptNumber} 
          successful={true} 
        />
        <CardText>{getCardText()}</CardText>
        {/* ✅ No generatePdfKey condition - always show for FSM */}
        <div style={{ display: "flex" }}>
          <div
            className="primary-label-btn d-grid"
            style={{ marginLeft: "unset", marginRight: "20px" }}
            onClick={printReciept}
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z" />
            </svg>
            {t("CS_COMMON_PRINT_RECEIPT")}
          </div>
        </div>
      </Card>
      <ActionBar style={{ display: "flex", justifyContent: "flex-end", alignItems: "baseline" }}>
        <Link to="/fsm-ui/employee">
          <SubmitBar label={t("CORE_COMMON_GO_TO_HOME")} />
        </Link>
      </ActionBar>
    </React.Fragment>
  );
};

export const FailedPayment = (props) => {
  props.setLink("Response");
  const { addParams, clearParams } = props;
  const { t } = useTranslation();
  const { consumerCode } = useParams();

  const getMessage = () => t("ES_PAYMENT_COLLECTED_ERROR");
  return (
    <React.Fragment>
      <Card>
        <Banner message={getMessage()} complaintNumber={consumerCode} successful={false} />
        <CardText>{t("ES_PAYMENT_FAILED_DETAILS")}</CardText>
      </Card>
      <ActionBar style={{ display: "flex", justifyContent: "flex-end", alignItems: "baseline" }}>
        <Link to="/fsm-ui/employee">
          <SubmitBar label={t("CORE_COMMON_GO_TO_HOME")} />
        </Link>
      </ActionBar>
    </React.Fragment>
  );
};
