import React, { useEffect, useState } from "react";
import {
  Header,
  Card,
  RadioButtons,
  SubmitBar,
  BackButton,
  CardLabel,
  CardLabelDesc,
  CardSectionHeader,
  InfoBanner,
  Loader,
  Toast,
  CardText,
} from "@upyog/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import { useParams, useHistory, useLocation, Redirect } from "react-router-dom";
import { stringReplaceAll } from "../bills/routes/bill-details/utils";
import $ from "jquery";
import { makePayment } from "./payGov";
import { startHdfcPayment } from "./hdfcCollectNow";

export const SelectPaymentType = (props) => {
  const { state = {} } = useLocation();
  const userInfo = Digit.UserService.getUser();
  const [showToast, setShowToast] = useState(null);
  const { tenantId: __tenantId, authorization, workflow: wrkflow } = Digit.Hooks.useQueryParams();
  const paymentAmount = state?.paymentAmount;
  const { t } = useTranslation();
  const history = useHistory();

  const { pathname, search } = useLocation();
  // const menu = ["AXIS"];
  const { consumerCode, businessService } = useParams();
  const tenantId = state?.tenantId || __tenantId || Digit.ULBService.getCurrentTenantId();
  const stateTenant = Digit.ULBService.getStateId();
  const { control, handleSubmit } = useForm();
  const { data: menu, isLoading } = Digit.Hooks.useCommonMDMS(stateTenant, "DIGIT-UI", "PaymentGateway");
  const { data: paymentdetails, isLoading: paymentLoading } = Digit.Hooks.useFetchPayment(
    { tenantId: tenantId, consumerCode: wrkflow === "WNS" ? stringReplaceAll(consumerCode, "+", "/") : consumerCode, businessService },
    {}
  );

  // useEffect(() => {
  //   const script = document.createElement("script");
  //   script.src = "https://checkout.razorpay.com/v1/checkout.js";
  //   script.async = true;
  //   document.body.appendChild(script);
  // }, []);

  useEffect(() => {
    if (paymentdetails?.Bill && paymentdetails.Bill.length == 0) {
      setShowToast({ key: true, label: "CS_BILL_NOT_FOUND" });
    }
  }, [paymentdetails]);
  useEffect(() => {
    localStorage.setItem("BillPaymentEnabled", "true");
  }, []);
  const { name, mobileNumber } = state;

  const billDetails = paymentdetails?.Bill ? paymentdetails?.Bill[0] : {};

  const onSubmit = async (d) => {
    const filterData = {
      Transaction: {
        tenantId: tenantId,
        txnAmount: paymentAmount || billDetails.totalAmount,
        module: businessService,
        billId: billDetails.id,
        consumerCode: wrkflow === "WNS" ? stringReplaceAll(consumerCode, "+", "/") : consumerCode,
        productInfo: "Common Payment",
        gateway: d?.paymentType || "AXIS",
        taxAndPayments: [
          {
            billId: billDetails.id,
            amountPaid: paymentAmount || billDetails.totalAmount,
          },
        ],
        user: {
          name: name || userInfo?.info?.name,
          mobileNumber: mobileNumber || userInfo?.info?.mobileNumber,
          tenantId: tenantId,
        }, 
        // success below url generation is commented according to requirement if not worked then
        //  just uncommend the 87,88,89 line number and comment the 90 line number
        callbackUrl: window.location.href.includes("mcollect")
          ? `${window.location.protocol}//${window.location.host}/fsm-ui/citizen/payment/success/${businessService}/${consumerCode}/${tenantId}?workflow=mcollect`
          : `${window.location.protocol}//${window.location.host}/fsm-ui/citizen/payment/success/${businessService}/${consumerCode}/${tenantId}`,
        // callbackUrl: `${window.location.protocol}//${window.location.host}/fsm-ui/citizen/payment/success/${businessService}/${consumerCode}/${tenantId}?propertyId=${consumerCode}`,
          additionalDetails: {
          isWhatsapp: false,
        },
      },
    };
    
  //  const responsedata ;
    try {
      const data = await Digit.PaymentService.createCitizenReciept(tenantId, filterData);
      const redirectUrl = data?.Transaction?.redirectUrl;
      if (d?.paymentType == "AXIS") {
        window.location = redirectUrl;
      }
       else if (d?.paymentType == "RAZORPAY") {
              // console.log("data :" + JSON.stringify(data));
            try{
              console.log("calling payment method");
              startHdfcPayment(data);
            }catch(e){
                  console.log("Error in HDFC Payment Redirect ", e);
                  setShowToast({ key: true, label: "CS_PAYMENT_INIT_FAILED" });
            }
      } else {
        // new payment gatewayfor UPYOG pay
        try {
          // console.log(redirectUrl);
          const gatewayParam = redirectUrl
            ?.split("?")
            ?.slice(1)
            ?.join("?")
            ?.split("&")
            ?.reduce((curr, acc) => {
              var d = acc.split("=");
              curr[d[0]] = d[1];
              return curr;
            }, {});

          var newForm = $("<form>", {
            action: gatewayParam.txURL + "=" + gatewayParam.command,
            method: "POST",
            target: "_top",
          });

          const orderForNDSLPaymentSite = [
            "encRequest",
            "access_code",
            // "checksum",
            // "messageType",
            // "merchant_id",
            // "serviceId",
            // "order_id",
            // "customerId",
            // "amount",
            // "currency",
            // "requestDateTime",
            // "redirect_url",
            // "cancel_url",
            // "additionalField1",
            // "additionalField2",
            // "additionalField3",
            // "additionalField4",
            // "additionalField5",
          ];

          // override default date for UPYOG Custom pay
          gatewayParam["requestDateTime"] = gatewayParam["requestDateTime"]?.split(new Date().getFullYear()).join(`${new Date().getFullYear()} `);

          // gatewayParam["redirect_url"]= redirectUrl?.split("redirect_url=")?.[1]?.split("eg_pg_txnid=")?.[0]+'eg_pg_txnid=' +gatewayParam?.orderId;
          gatewayParam["redirect_url"] = redirectUrl;
          gatewayParam["cancel_url"] = redirectUrl?.split("cancel_url=")?.[1]?.split("eg_pg_txnid=")?.[0] + "eg_pg_txnid=" + gatewayParam?.orderId;
          // gatewayParam["successUrl"]= data?.Transaction?.callbackUrl;
          // gatewayParam["failUrl"]= data?.Transaction?.callbackUrl;

          // var formdata = new FormData();

          for (var key of orderForNDSLPaymentSite) {
            // formdata.append(key,gatewayParam[key]);

            newForm.append(
              $("<input>", {
                name: key,
                value: gatewayParam[key],
                // type: "hidden",
              })
            );
          }
          $(document.body).append(newForm);
          newForm.submit();

           makePayment(gatewayParam.txURL,formdata);
        } catch (e) {
          console.log("Error in payment redirect ", e);
          //window.location = redirectionUrl;
        }
      }
    } catch (error) {
      console.log("Error iin payment ",JSON.stringify(error));
      let messageToShow = "CS_PAYMENT_UNKNOWN_ERROR_ON_SERVER";
      // console.log("Error in the payment type ",JSON.stringify(messageToShow));
      if (error.response?.data?.Errors?.[0]) {
        const { code, message } = error.response?.data?.Errors?.[0];
        messageToShow = code;
      }
      setShowToast({ key: true, label: t(messageToShow) });
    }
  };

  if (authorization === "true" && !userInfo.access_token) {
    localStorage.clear();
    sessionStorage.clear();
    return <Redirect to={`/fsm-ui/citizen/login?from=${encodeURIComponent(pathname + search)}`} />;
  }

  if (isLoading || paymentLoading) {
    return <Loader />;
  }

  return (
    <React.Fragment>
      <BackButton>{t("CS_COMMON_BACK")}</BackButton>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Header>{t("PAYMENT_CS_HEADER")}</Header>
        <Card>
          <div className="payment-amount-info" style={{ marginBottom: "26px" }}>
            <CardLabel className="dark">{t("PAYMENT_CS_TOTAL_AMOUNT_DUE")}</CardLabel>
            <CardSectionHeader> ₹ {paymentAmount || billDetails?.totalAmount}</CardSectionHeader>
          </div>
          <CardLabel>{t("PAYMENT_CS_SELECT_METHOD")}</CardLabel>
          {menu?.length && (
            <Controller
              name="paymentType"
              defaultValue={menu[0]}
              control={control}
              render={(props) => <RadioButtons selectedOption={props.value} options={menu} onSelect={props.onChange} />}
            />
          )}
          {!showToast && <SubmitBar label={t("PAYMENT_CS_BUTTON_LABEL")} submit={true} />}
        </Card>
      </form>
      <InfoBanner label={t("CS_COMMON_INFO")} text={t("CS_PAYMENT_REDIRECT_NOTICE")} />
      {showToast && (
        <Toast
          error={showToast.key}
          label={t(showToast.label)}
          onClose={() => {
            setShowToast(null);
          }}
        />
      )}
    </React.Fragment>
  );
};
