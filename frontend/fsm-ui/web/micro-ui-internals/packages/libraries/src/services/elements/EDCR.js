import Urls from "../atoms/urls";
import { Request } from "../atoms/Utils/Request";

export const EDCRService = {
  create: (data, tenantId) =>
    Request({
      url: Urls.edcr.create,
      // data: data,
      multipartData: data,
      useCache: false,
      setTimeParam: false,
      userService: true,
      method: "POST",
      params: { tenantId },
      auth: true,
      multipartFormData: true,
    }),

  rgacreate: (data, tenantId) =>
    Request({
      url: Urls.edcr.rgacreate,
      // data: data,
      multipartData: data,
      useCache: false,
      setTimeParam: false,
      userService: true,
      method: "POST",
      params: { tenantId },
      auth: true,
      multipartFormData: true,
    }),

  createEdcrRule: (edcrRule) =>
    Request({
      url: Urls.edcr.createEdcrRule,
      data: edcrRule,
      // multipartData: data,
      useCache: false,
      setTimeParam: false,
      userService: true,
      method: "POST",
      params: {},
      auth: false,
      // multipartFormData: true
    }),

  getEdcrRule: (tenantId, feature) =>
    Request({
      url: Urls.edcr.getEdcrRule,
      params: { tenantId, feature },
      auth: false,
      userService: false,
      method: "POST",
    }),

  getEdcrRuleList: (tenantId) =>
    Request({
      url: Urls.edcr.getEdcrRuleList,
      params: { tenantId },
      auth: false,
      userService: false,
      method: "POST",
    }),

  getOccupancy: () =>
    Request({
      url: Urls.edcr.getOccupancy,
      params: {},
      auth: false,
      userService: false,
      method: "POST",
    }),

  getSubOccupancy: (occupancyCode) =>
    Request({
      url: Urls.edcr.getSubOccupancy,
      params: { occupancyCode },
      auth: false,
      userService: false,
      method: "POST",
    }),

  getFeatureName: () =>
    Request({
      url: Urls.edcr.getFeatureName,
      params: {},
      auth: false,
      userService: false,
      method: "POST",
    }),
};
