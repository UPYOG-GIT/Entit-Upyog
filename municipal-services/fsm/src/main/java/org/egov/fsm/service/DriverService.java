package org.egov.fsm.service;

import java.util.LinkedHashMap;

import org.egov.common.contract.request.RequestInfo;
import org.egov.fsm.config.FSMConfiguration;
import org.egov.fsm.repository.ServiceRequestRepository;
import org.egov.fsm.web.model.driver.DriverResponse;
import org.egov.fsm.web.model.driver.DriverSearchCriteria;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class DriverService {

	@Autowired
	private FSMConfiguration config;

	@Autowired
	private ServiceRequestRepository serviceRequestRepository;

	@Autowired
	private ObjectMapper mapper;

	public DriverResponse driverSearch(String tenantId, String driverId, RequestInfo requestInfo) {

		StringBuilder uri = new StringBuilder(config.getDriverHost()).append(config.getDriverContextPath())
				.append(config.getDriverSearchEndpoint()).append("?tenantId=" + tenantId).append("&ids=" + driverId);

		try {
			LinkedHashMap responseMap = (LinkedHashMap) serviceRequestRepository.fetchResult(uri, requestInfo);
			return mapper.convertValue(responseMap, DriverResponse.class);
		} catch (IllegalArgumentException e) {
			throw new CustomException("IllegalArgumentException", "ObjectMapper not able to convertValue in driverSearch");
		}
//		return null;

	}
}
