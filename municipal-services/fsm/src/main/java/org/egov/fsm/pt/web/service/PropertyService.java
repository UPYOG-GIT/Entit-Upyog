package org.egov.fsm.pt.web.service;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.fsm.pt.web.enums.Channel;
import org.egov.fsm.pt.web.enums.Source;
import org.egov.fsm.pt.web.enums.Status;
import org.egov.fsm.pt.web.model.Address;
import org.egov.fsm.pt.web.model.Locality;
import org.egov.fsm.pt.web.model.OwnerInfo;
import org.egov.fsm.pt.web.model.Property;
import org.egov.fsm.pt.web.model.PropertyCriteria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class PropertyService {

	@Autowired
	private RestTemplate restTemplate;

	public List<Property> getPropertiesById(PropertyCriteria criteria) {
		String propertyId = criteria.getPropertyIds().isEmpty() ? null : criteria.getPropertyIds().iterator().next();

		String propertyUrl = "https://mcraipur.in/api/getPropertyDetails?PROP_UID=" + propertyId;
		
		List<Property> properties = null;

		try {
			Map<String, Object> propertySearchResponse = restTemplate.getForObject(propertyUrl, Map.class);
			log.info("RMC propertySearchResponse : " + propertySearchResponse.toString());

			Map<String, Object> propertyDetails = ((List<Map<String, Object>>) propertySearchResponse
					.get("GETPROPDETAILSResult")).get(0);

			log.info("RMC propertyDetails: " + propertyDetails.toString());
//			Property currentProperty = new Property();

			String area = propertyDetails.get("TOTAL_PLOT_AREA").toString();
			Double landArea = 0.0;
			if (area == null) {
				landArea = null;
			} else {
				landArea = Double.valueOf(area);
			}
			Locality locality = Locality.builder().code("RMCLC" + propertyDetails.get("WARD_NO"))
					.name(propertyDetails.get("WARD_NAME").toString()).label("Locality").build();

			Map<String, Object> addressAdditional = new HashMap<>();

			addressAdditional.put("colonyName", propertyDetails.get("COLONY_NAME"));
			addressAdditional.put("houseNo", propertyDetails.get("HOUSE_NO"));
			addressAdditional.put("wardNo", propertyDetails.get("WARD_NO"));
			addressAdditional.put("address", propertyDetails.get("ADDRESS"));
			addressAdditional.put("zoneNo", propertyDetails.get("ZONE_NO"));

			Address address = Address.builder().city("Raipur").tenantId("cg.raipur")
					.wardNo(propertyDetails.get("WARD_NO").toString()).zoneNo(propertyDetails.get("ZONE_NO").toString())
					.locality(locality).build();

			List<String> owners = Arrays.asList(propertyDetails.get("PROPERTY_OWNER").toString().split(","));
			String ownershipcategory = owners.size() == 1 ? "INDIVIDUAL.SINGLEOWNER" : "INDIVIDUAL.MULTIPLEOWNERS";

			Property currentProperty = Property.builder().source(Source.fromValue("MUNICIPAL_RECORDS"))
					.ownershipCategory(ownershipcategory).channel(Channel.fromValue("SYSTEM"))
					.superBuiltUpArea((BigDecimal) propertyDetails.get("TOTAL_COVERED_AREA"))
					.usageCategory(propertyDetails.get("PROPERTY_USE").toString())
//					.propertyType(rs.getString("propertytype"))
					.noOfFloors((Long) propertyDetails.get("TOTAL_FLOORS"))
//					.auditDetails(auditdetails)
					.landArea(landArea).address(address).propertyId(propertyDetails.get("PROP_UID").toString())
					.tenantId("cg.raipur").status(Status.fromValue("ACTIVE"))
					.dueAmount(propertyDetails.get("DUE_AMOUNT").toString()).build();

			OwnerInfo owner = OwnerInfo.builder().status(Status.fromValue("ACTIVE")).tenantId("cg.raipur")
					.mobileNumber(propertyDetails.get("MOBILE").toString()).build();

			currentProperty.addOwnersItem(owner);

			properties.add(currentProperty);

		} catch (Exception ex) {
			log.error("Error : " + ex.toString());
		}
//		Property properties = new Property();
//		= getPropertiesPlainSearch(criteria, requestInfo);
		// enrichmentService.enrichBoundary(new PropertyRequest(requestInfo,
		// properties));
		return properties;
	}

}