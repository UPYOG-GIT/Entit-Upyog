import { Request, ServiceRequest } from "../atoms/Utils/Request";
import Urls from "../atoms/urls";
import { format } from "date-fns";
import { MdmsService } from "./MDMS";
import React from "react";
import { UploadServices } from "../atoms/UploadServices";


export const OBPSAdminService = {
    // add by manisha yadu for getting paytype rule list 
    getPaytype: (tenantId) =>
    Request({
      url: Urls.obps.getPaytype,
      params: {tenantId},
      auth: false,
      userService: false,
      method: "POST"
    }),
    getProptype: (tenantId) =>
    Request({
      url: Urls.obps.getProptype,
      params: {tenantId},
      auth: false,
      userService: false,
      method: "POST"
    }),
    getBCategory: (tenantId) =>
    Request({
      url: Urls.obps.getBcategory,
      params: {tenantId},
      auth: false,
      userService: false,
      method: "POST"
    }),
    getBSCategory: (tenantId,catId) =>
    Request({
      url: Urls.obps.getBScategory,
      params: {tenantId,catId},
      auth: false,
      userService: false,
      method: "POST"
    }),
    getPaytpRate: (tenantId,typeId) =>
    Request({
      url: Urls.obps.getpaytprate,
      params: {tenantId,typeId},
      auth: false,
      userService: false,
      method: "POST"
    }),
    getSlab: (tenantId,typeId) =>
    Request({
      url: Urls.obps.getslab,
      params: {tenantId,typeId},
      auth: false,
      userService: false,
      method: "POST"
    }),
    getFeeDetails: (applicationNo) =>
    Request({
      url: Urls.obps.getfeedetails,
      params: {applicationNo},
      auth: false,
      userService: false,
      method: "POST"
    }),
    createPayType: (data) =>
    ServiceRequest({
      serviceName: "bpa-services",
      url: Urls.obps.createPaytype,
      data: data,
      auth: false,
    })
    .then((d) => {
      return d;
    })
    .catch((err) => {
      return err;
    }),
    createPropType: (data) =>
    ServiceRequest({
      serviceName: "bpa-services",
      url: Urls.obps.createProptype,
      data: data,
      auth: false,
    })
    .then((d) => {
      return d;
    })
    .catch((err) => {
      return err;
    }),
    createBCate: (data) =>
    ServiceRequest({
      serviceName: "bpa-services",
      url: Urls.obps.createBcate,
      data: data,
      auth: false,
    })
    .then((d) => {
      return d;
    })
    .catch((err) => {
      return err;
    }),
    createBSCate: (data) =>
    ServiceRequest({
      serviceName: "bpa-services",
      url: Urls.obps.createBScate,
      data: data,
      auth: false,
    })
    .then((d) => {
      return d;
    })
    .catch((err) => {
      return err;
    }),
    createPayRate: (data) =>
    ServiceRequest({
      serviceName: "bpa-services",
      url: Urls.obps.createpayrate,
      data: data,
      auth: false,
    })
    .then((d) => {
      return d;
    })
    .catch((err) => {
      return err;
    }),
    createSLab: (data) =>
    ServiceRequest({
      serviceName: "bpa-services",
      url: Urls.obps.createSlab,
      data: data,
      auth: false,
    })
    .then((d) => {
      return d;
    })
    .catch((err) => {
      return err;
    }),
    createFeeDetail: (data) =>
    ServiceRequest({
      serviceName: "bpa-services",
      url: Urls.obps.createFeedetail,
      data: data,
      auth: false,
    })
    .then((d) => {
      return d;
    })
    .catch((err) => {
      return err;
    }),
    verifyFeeDetail: (applicationNo,isVerified,feeType,verifiedBy) =>
    ServiceRequest({
      serviceName: "bpa-services",
      url: Urls.obps.verifyFeedetail,
      params: {applicationNo,isVerified,feeType,verifiedBy},
      auth: false,
    })
    .then((d) => {
      return d;
    })
    .catch((err) => {
      return err;
    }),
    deleteFeeDetail: (PayTypeFeeDetailRequest) =>
    ServiceRequest({
      serviceName: "bpa-services",
      url: Urls.obps.deleteFeedetail,
      data: {PayTypeFeeDetailRequest},
      auth: false,
    })
    .then((d) => {
      return d;
    })
    .catch((err) => {
      return err;
    }),
    deleteSlabdata: (SlabMasterRequest) =>
    ServiceRequest({
      serviceName: "bpa-services",
      url: Urls.obps.deleteSlab,
      data: {SlabMasterRequest},
      auth: false,
    })
    .then((d) => {
      return d;
    })
    .catch((err) => {
      return err;
    }),
    deletePayTpRate: (PayTpRateRequest) =>
    ServiceRequest({
      serviceName: "bpa-services",
      url: Urls.obps.deletePaytpRate,
      data: {PayTpRateRequest},
      auth: false,
    })
    .then((d) => {
      return d;
    })
    .catch((err) => {
      return err;
    }),

    
    getDashboardCount: (tenantId) =>
    Request({
      url: Urls.obps.getDashboardCount,
      params: {tenantId},
      auth: false,
      userService: false,
      method: "POST"
    }),

    searchByApplicationNo:(tenantId, applicationNo)   =>
    Request({
      url: Urls.obps.searchByApplicationNo,
      params: { tenantId, applicationNo},
      auth: false,
      userService: true,
      method: "POST"
    }),

    updateBillAmount: (applicationNo, businessService, feeType) =>
    Request({
      url: Urls.obps.updateBillAmount,
      params: { applicationNo, businessService, feeType },
      auth: true,
      userService: true,
      method: "POST"
    }),
}
