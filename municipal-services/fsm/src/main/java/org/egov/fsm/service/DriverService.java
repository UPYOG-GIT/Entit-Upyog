package org.egov.fsm.service;

import java.util.Collections;

import org.egov.common.contract.request.RequestInfo;
import org.egov.fsm.config.FSMConfiguration;
import org.egov.fsm.web.model.driver.DriverResponse;
import org.egov.tracer.model.ServiceCallException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class DriverService {

	@Autowired
	private FSMConfiguration config;

//	@Autowired
//	private ServiceRequestRepository serviceRequestRepository;
//
//	@Autowired
//	private ObjectMapper mapper;

	@Autowired
	private RestTemplate restTemplate;

	public DriverResponse driverSearch(String tenantId, String driverId, RequestInfo requestInfo) {

//		StringBuilder uri = new StringBuilder(config.getDriverHost()).append(config.getDriverContextPath())
//				.append(config.getDriverSearchEndpoint()).append("?tenantId=" + tenantId).append("&ids=" + driverId);

		UriComponentsBuilder uriBuilder = UriComponentsBuilder
				.fromHttpUrl(config.getDriverHost() + config.getDriverContextPath() + config.getDriverSearchEndpoint())
				.queryParam("tenantId", tenantId).queryParam("ids", driverId);

		String uri = uriBuilder.toUriString();

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

		HttpEntity<RequestInfo> requestEntity = new HttpEntity<>(requestInfo, headers);

		try {
			ResponseEntity<DriverResponse> responseEntity = restTemplate.exchange(uri, HttpMethod.POST, requestEntity,
					DriverResponse.class);

			if (responseEntity.getStatusCode().is2xxSuccessful() && responseEntity.getBody() != null) {
				return responseEntity.getBody();
			} else {
				throw new ServiceCallException(
						"External service returned non-success status: " + responseEntity.getStatusCode());
			}
		} catch (HttpClientErrorException e) {
			log.error("HTTP error when calling driver search API: {}", e.getResponseBodyAsString(), e);
			throw new ServiceCallException(e.getResponseBodyAsString());
		} catch (Exception e) {
			log.error("Unexpected error calling driver search API", e);
			throw new ServiceCallException(e.toString());
		}
//		return null;

	}
}
