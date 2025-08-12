package org.egov.web.notification.sms.service.impl;

import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.StringTokenizer;

import javax.net.ssl.SSLContext;

import org.apache.http.conn.ssl.NoopHostnameVerifier;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.ssl.SSLContextBuilder;
import org.egov.web.notification.sms.config.SMSConstants;
import org.egov.web.notification.sms.config.SMSProperties;
import org.egov.web.notification.sms.models.Sms;
import org.egov.web.notification.sms.service.SMSBodyBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
//@ConditionalOnProperty(value = "sms.provider.class", matchIfMissing = true, havingValue = "WEBLINTO")
public class WeblintoSMSServiceImpl {

    @Autowired
    private SMSProperties smsProperties;

    @Autowired
    private SMSBodyBuilder bodyBuilder;

	/*
	 * @Autowired protected RestTemplate restTemplate;
	 */

    /**
     * MD5 encryption algorithm
     *
     * @param text
     * @return
     */
    private static String MD5(String text) {
        MessageDigest md;
        byte[] md5 = new byte[64];
        try {
            md = MessageDigest.getInstance("SHA-256");
            md.update(text.getBytes("iso-8859-1"), 0, text.length());
            md5 = md.digest();
        } catch (Exception e) {
            log.error("Exception while encrypting the pwd: ", e);
        }
        return convertedToHex(md5);

    }

    private static String convertedToHex(byte[] data) {
        StringBuffer buf = new StringBuffer();

        for (int i = 0; i < data.length; i++) {
            int halfOfByte = (data[i] >>> 4) & 0x0F;
            int twoHalfBytes = 0;

            do {
                if (0 <= halfOfByte && halfOfByte <= 9)
                    buf.append((char) ('0' + halfOfByte));
                else
                    buf.append((char) ('a' + (halfOfByte - 10)));

                halfOfByte = data[i] & 0x0F;

            } while (twoHalfBytes++ < 1);
        }
        return buf.toString();
    }

	/*
	 * protected void submitToExternalSmsService(Sms sms) { // String finalmessage =
	 * ""; // for (int i = 0; i < sms.getMessage().length(); i++) { // char ch =
	 * sms.getMessage().charAt(i); // int j = (int) ch; // String sss = "&#" + j +
	 * ";"; // finalmessage = finalmessage + sss; // } String finalmessage =
	 * sms.getMessage(); sms.setMessage(finalmessage); String url =
	 * smsProperties.getUrl(); final MultiValueMap<String, String> requestBody =
	 * bodyBuilder.getSmsRequestBody(sms); // postProcessor(requestBody);
	 * HttpEntity<MultiValueMap<String, String>> request = new
	 * HttpEntity<>(requestBody, getHttpHeaders()); executeAPI(URI.create(url),
	 * HttpMethod.POST, request, String.class); }
	 */
    
    public void submitToExternalSmsService(Sms sms) throws Exception {
    	String finalmessage = sms.getMessage();
    	sms.setMessage(finalmessage);
    	String encodedMessage="";
		try {
			encodedMessage = URLEncoder.encode(sms.getMessage(), StandardCharsets.UTF_8.toString());
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		System.out.println(encodedMessage);
    	String url = "https://sms.weblinto.com/smsapi/index?key=567611BB38DDA3&campaign=894&routeid=6&type=text&contacts="+sms.getMobileNumber() +"&senderid=RPRMCN&msg="+encodedMessage;
//    	final MultiValueMap<String, String> requestBody = bodyBuilder.getSmsRequestBody(sms);
    	MultiValueMap<String, String> requestBody = new LinkedMultiValueMap<>();
//        postProcessor(requestBody);
    	HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
    	HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(requestBody, headers);
    	executeAPI(URI.create(url), HttpMethod.GET, request, String.class);
    }

    protected <T> ResponseEntity<T> executeAPI(URI uri, HttpMethod method, HttpEntity<?> requestEntity, Class<T> type) throws Exception {
		log.info("executeAPI() start");
		RestTemplate restTemplate = restTemplate();

		log.info("calling third party api with url: " + uri + "  method:" + method);
		@SuppressWarnings("unchecked")
		ResponseEntity<T> res = (ResponseEntity<T>) restTemplate.exchange(uri, method, requestEntity, String.class);

		log.info("third part api call done");

		String responseString = res.getBody().toString();
//		log.info(res.getStatusCode());
		log.info("Response: " + responseString);

		// String dummyResponse = "Message Accepted For Request
		// ID=1231457859641254687954~code=API00 & info=Sms platform accepted & Time =
		// 2007/10/04/09/58";

		/*
		 * if (!isResponseValidated(res)) { log.error("Response from API - " +
		 * responseString); throw new RuntimeException(SMS_RESPONSE_NOT_SUCCESSFUL); }
		 * 
		 * if (smsProperties.getSmsErrorCodes().size() > 0 &&
		 * isResponseCodeInKnownErrorCodeList(res)) { throw new
		 * RuntimeException(SMS_RESPONSE_NOT_SUCCESSFUL); }
		 * 
		 * if (smsProperties.getSmsSuccessCodes().size() > 0 &&
		 * !isResponseCodeInKnownSuccessCodeList(res)) { throw new
		 * RuntimeException(SMS_RESPONSE_NOT_SUCCESSFUL); }
		 */

		//
		StringTokenizer tokenizer = new StringTokenizer(responseString, "&");
		HashMap<String, String> responseMap = new HashMap<String, String>();
		String pair = null, pname = null, pvalue = null;
		while (tokenizer.hasMoreTokens()) {
			pair = (String) tokenizer.nextToken();
			if (pair != null) {
				StringTokenizer strTok = new StringTokenizer(pair, "=");
				pname = "";
				pvalue = "";
				if (strTok.hasMoreTokens()) {
					pname = (String) strTok.nextToken().trim();
					if (strTok.hasMoreTokens())
						pvalue = (String) strTok.nextToken().trim();
					responseMap.put(pname, pvalue);
				}

			}
		}
		boolean status = responseString.contains("API000");

//		if (!status) {
//			log.error("error response from third party api: info:" + responseMap.get("info"));
//			throw new RuntimeException(responseMap.get("info"));
//		}

		log.info("executeAPI() end");
		return res;
	}
    
    /**
     * Performs post processing on the default parameters
     *
     * @param requestBody
     */
    private void postProcessor(MultiValueMap<String, String> requestBody) {
        Map<String, String> configMap = getConfigMap();
        String password = requestBody.getFirst(configMap.get(SMSConstants.SENDER_PASSWORD_IDENTIFIER));
        String username = requestBody.getFirst(configMap.get(SMSConstants.SENDER_USERNAME_IDENTIFIER));
        String senderid = requestBody.getFirst(configMap.get(SMSConstants.SENDER_SENDERID_IDENTIFIER));
        String message = requestBody.getFirst(configMap.get(SMSConstants.SENDER_MESSAGE_IDENTIFIER));
        String secureKey = requestBody.getFirst(configMap.get(SMSConstants.SENDER_SECUREKEY_IDENTIFIER));
        String templateId = requestBody.getFirst(configMap.get(SMSConstants.TEMPLATE_ID));

//        String encryptedPwd = MD5(password);
        String encryptedPwd = password;
        String hashMsg = hashGenerator(username, senderid, message, secureKey);

        List<String> entriesToBeModified = new ArrayList<>();
        for (String key : requestBody.keySet()) {
            if (key.equals(configMap.get(SMSConstants.SENDER_PASSWORD_IDENTIFIER))) {
                entriesToBeModified.add(key);
            } else if (key.equals(configMap.get(SMSConstants.SENDER_SECUREKEY_IDENTIFIER))) {
                entriesToBeModified.add(key);
            }
        }
        if (!CollectionUtils.isEmpty(entriesToBeModified)) {
            for (String key : entriesToBeModified) {
                if (key.equals(configMap.get(SMSConstants.SENDER_PASSWORD_IDENTIFIER))) {
                    requestBody.remove(key);
                    requestBody.add(key, encryptedPwd);
                } else if (key.equals(configMap.get(SMSConstants.SENDER_SECUREKEY_IDENTIFIER))) {
                    requestBody.remove(key);
                    requestBody.add(key, hashMsg);
                }
            }
        }
    }

    /**
     * A map to fetch the configured keys for attributes.
     *
     * @return
     */
    public Map<String, String> getConfigMap() {
        Map<String, String> configMap = new HashMap<>();
        for (String key : smsProperties.getConfigMap().keySet()) {
            String value = smsProperties.getConfigMap().get(key);
            if (value.contains("$")) {
                if (value.equals("$username"))
                    configMap.put(SMSConstants.SENDER_USERNAME_IDENTIFIER, key);
                else if (value.equals("$password"))
                    configMap.put(SMSConstants.SENDER_PASSWORD_IDENTIFIER, key);
                else if (value.equals("$senderid"))
                    configMap.put(SMSConstants.SENDER_SENDERID_IDENTIFIER, key);
                else if (value.equals("$key"))
                    configMap.put(SMSConstants.SENDER_SECUREKEY_IDENTIFIER, key);
                else if (value.equals("$contacts"))
                    configMap.put(SMSConstants.SENDER_MOBNO_IDENTIFIER, key);
                else if (value.equals("$msg"))
                    configMap.put(SMSConstants.SENDER_MESSAGE_IDENTIFIER, key);
                else if (value.equals("$templateid"))
                	configMap.put(SMSConstants.TEMPLATE_ID, key);
            }
        }
//        configMap.put("smsservicetype", "singlemsg");
        return configMap;
    }

    /**
     * Hash generator
     *
     * @param userName
     * @param senderId
     * @param content
     * @param secureKey
     * @return
     */
    private String hashGenerator(String userName, String senderId, String content, String secureKey) {
        StringBuffer finalString = new StringBuffer();
        finalString.append(userName.trim()).append(senderId.trim()).append(content.trim()).append(secureKey.trim());
        String hashGen = finalString.toString();
        StringBuffer sb = null;
        MessageDigest md;
        try {
            md = MessageDigest.getInstance("SHA-512");
            md.update(hashGen.getBytes());
            byte byteData[] = md.digest();
            // convert the byte to hex format method 1
            sb = new StringBuffer();
            for (int i = 0; i < byteData.length; i++) {
                sb.append(Integer.toString((byteData[i] & 0xff) + 0x100, 16).substring(1));
            }

        } catch (Exception e) {
            log.error("Exception while generating the hash: ", e);
        }
        return sb.toString();
    }
    
    
    public RestTemplate restTemplate() throws Exception {
        SSLContext sslContext = SSLContextBuilder.create()
                .loadTrustMaterial((chain, authType) -> true)
                .build();

        CloseableHttpClient httpClient = HttpClients.custom()
                .setSSLContext(sslContext)
                .setSSLHostnameVerifier(NoopHostnameVerifier.INSTANCE)
                .build();

        return new RestTemplate(new HttpComponentsClientHttpRequestFactory(httpClient));
    }

}
