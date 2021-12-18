#!/usr/bin/env node
/* eslint-disable no-undef */

if (process.env.ENABLE_EMAIL_TEST !== "false") {
  describe("QCObjects Main Test", function () {
    require("qcobjects");
    logger.debugEnabled = true;
    // eslint-disable-next-line no-unused-vars
    var originalTimeout;
  
    beforeEach(function() {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;
    });
  
  
    it("Contact Form Microservice Spec", function (done) {
      const path = require("path");
      const absolutePath = path.resolve(__dirname, "./");
  
      // set up the test
      // you can use the config.json file instead of the following
      CONFIG.set(  "mailchimp_api", [
        "$MAILCHIMP_API(MAILCHIMP_API_KEY,MAILCHIMP_API_SERVER,MAILCHIMP_API_LIST)"
      ]);
      /*
      CONFIG.set("sendemail_transport", "gmail_2lo");
      CONFIG.set("gmail_service_client", "$ENV(GMAIL_SERVICE_CLIENT)");
      CONFIG.set("gmail_service_account_private_key", "$ENV(GMAIL_SERVICE_ACCOUNT_PRIVATE_KEY)");
      CONFIG.set("gmail_access_token", "$ENV(GMAIL_ACCESS_TOKEN)");
      CONFIG.set("gmail_access_token_expires", "$ENV(GMAIL_ACCESS_TOKEN_EXPIRES)");
      CONFIG.set("gmail_refresh_token", "$ENV(GMAIL_REFRESH_TOKEN)");
      */
  
      CONFIG.set("sendemail_transport", "gmail_3lo");
      CONFIG.set("gmail_client_id", "$ENV(GMAIL_CLIENT_ID)");
      CONFIG.set("gmail_client_secret", "$ENV(GMAIL_CLIENT_SECRET)");
      CONFIG.set("gmail_refresh_token", "$ENV(GMAIL_REFRESH_TOKEN)");
      CONFIG.set("gmail_access_token", "$ENV(GMAIL_ACCESS_TOKEN)");
      CONFIG.set("gmail_access_token_expires", "$ENV(GMAIL_ACCESS_TOKEN_EXPIRES)");
  
      CONFIG.set("gmail_user", "$ENV(GMAIL_USER)");
      CONFIG.set("gmail_password", "$ENV(GMAIL_PASSWORD)");
      CONFIG.set("gmail_from", "$ENV(GMAIL_FROM)");
      CONFIG.set("gmail_to", "$ENV(GMAIL_TO)");
      CONFIG.set("gmail_subject", "$ENV(GMAIL_SUBJECT)");
      CONFIG.set("sendemail_subject_user", "$ENV(SENDEMAIL_SUBJECT_USER)");
      CONFIG.set("sendemail_subject_backoffice", "$ENV(SENDEMAIL_SUBJECT_BACKOFFICE)");
      CONFIG.set("sendemail_user_template_file", "./email-template-example.tpl.html");
      CONFIG.set("sendemail_backoffice_template_file", "./email-template-example.tpl.html");
  
      Import ("qcobjects-lib-mailchimp-api");
      Import ("qcobjects-lib-sendemail");
    
      Import (`${absolutePath}/../api/com.qcobjects.backend.microservice.contactform.js`);
      
      // fake a microservice request
      let microservice = New(Microservice, {
        name: "Contact Form Microservice",
        description: "Contact Form Microservice",
        route: {cors:{}},
        headers:{},
        _new_ (){}
      });
  
      // run the test
      microservice.registerClient(_DataStringify({
        name: process.env.EMAIL_TEST_NAME,
        email: process.env.EMAIL_TEST,
      }))
      .then ((body)=> { expect(body.status).toEqual("OK");done();})
      .catch(error => {
        console.error (`Completed with error ${JSON.stringify(error)}`);
        done(new Error (`Completed with error ${JSON.stringify(error)}`));
      });
      
      logger.debug("Contact Form Microservice Test Spec... OK");
    });
  
  });
  

}

