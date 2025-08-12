package org.egov.web.notification.sms.controller;

import org.egov.web.notification.sms.models.Category;
import org.egov.web.notification.sms.models.Sms;
import org.egov.web.notification.sms.service.impl.WeblintoSMSServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/fsm/otp")
public class SmsController {

	@Autowired
	WeblintoSMSServiceImpl weblintoSMSServiceImpl;
	
	@GetMapping("/login")
	public ResponseEntity<?> fsmSend(@RequestParam(value = "number", required = true) String number,
			@RequestParam(value = "msg", required = true) String msg,
			@RequestParam(value = "category", required = true) Category category,
			@RequestParam(value = "expirytime", required = true) Long expirytime
	) throws Exception {

		Sms sms = new Sms(number, msg, category, expirytime, "");
		weblintoSMSServiceImpl.submitToExternalSmsService(sms);

		return null;
	}
}
