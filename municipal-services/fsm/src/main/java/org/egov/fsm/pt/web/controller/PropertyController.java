package org.egov.fsm.pt.web.controller;

import java.util.List;

import javax.validation.Valid;

import org.egov.fsm.pt.web.model.Property;
import org.egov.fsm.pt.web.model.PropertyCriteria;
import org.egov.fsm.pt.web.model.PropertyResponse;
import org.egov.fsm.pt.web.service.PropertyService;
import org.egov.fsm.util.ResponseInfoFactory;
import org.egov.fsm.web.model.RequestInfoWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@RequestMapping("/rmcproperty")
public class PropertyController {

	@Autowired
	private PropertyService propertyService;

	@Autowired
	private ResponseInfoFactory responseInfoFactory;


	@RequestMapping(value = "/_rmcpropertybyid", method = RequestMethod.POST)
	public ResponseEntity<PropertyResponse> getPropertiesById(@Valid @RequestBody RequestInfoWrapper requestInfoWrapper,
			@Valid @ModelAttribute PropertyCriteria propertyCriteria) {
		List<Property> properties = propertyService.getPropertiesById(propertyCriteria);
		PropertyResponse response = PropertyResponse.builder().properties(properties).responseInfo(
				responseInfoFactory.createResponseInfoFromRequestInfo(requestInfoWrapper.getRequestInfo(), true))
				.build();
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

}
