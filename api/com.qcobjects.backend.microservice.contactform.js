/**
 * QCObjects ContactForm 0.1.x
 * ________________
 *
 * Author: Jean Machuca <correojean@gmail.com>
 *
 * Cross Browser Javascript Framework for MVC Patterns
 * QuickCorp/QCObjects is licensed under the
 * GNU Lesser General Public License v3.0
 * [LICENSE] (https://github.com/QuickCorp/QCObjects/blob/master/LICENSE.txt)
 *
 * Permissions of this copyleft license are conditioned on making available
 * complete source code of licensed works and modifications under the same
 * license or the GNU GPLv3. Copyright and license notices must be preserved.
 * Contributors provide an express grant of patent rights. However, a larger
 * work using the licensed work through interfaces provided by the licensed
 * work may be distributed under different terms and without source code for
 * the larger work.
 *
 * Copyright (C) 2015 Jean Machuca,<correojean@gmail.com>
 *
 * Everyone is permitted to copy and distribute verbatim copies of this
 * license document, but changing it is not allowed.
*/
/*eslint no-unused-vars: "off"*/
/*eslint no-redeclare: "off"*/
/*eslint no-empty: "off"*/
/*eslint strict: "off"*/
/*eslint no-mixed-operators: "off"*/
/*eslint no-undef: "off"*/
"use strict";

(function loadContactFormRoutes(){
  if (!loadContactFormRoutes.loaded){
    let backend = CONFIG.get("backend");
    backend.routes.push({
      "name": "ContactForm Url",
      "description": "It handles the contactform url",
      "path": "^/rest/contactform$",
      "microservice": "qcobjects-handler-contactform",
      "supported_methods": ["POST"],
      "responseHeaders": {
        "Content-Type": "application/json"
      }
    });
    CONFIG.set("backend", backend);
    loadContactFormRoutes.loaded = true;
  }
})();

Package("com.qcobjects.backend.microservice.contactform",[
  Class("ContactFormMicroservice",BackendMicroservice,{
    body:null,
    tempFileName: "",
    registerClient (formData) {
      try {
        logger.debugEnabled = true;
        var microservice = this;
        let emailNotification = New (EmailNotification, {
          microservice: microservice
        });
        let mailchimpApi = New (MailchimpAPI, {
          microservice: microservice
        });

        Promise.all([
          mailchimpApi.subscribeToAll(formData),
          emailNotification.sendEmailUser(formData),
          emailNotification.sendEmailBackoffice(formData)
        ]).then ((response)=> {
          logger.debug (_DataStringify(response));
          microservice.body = response;
          microservice.done();
        }).catch(e => {
          logger.debug(e.toString());
          microservice.body = {
            status: e.toString()
          };
          microservice.done();
        });
      } catch (e){
        logger.debug(e.toString());
        microservice.body = {
          status: e.toString()
        };
        microservice.done();
      }

    },
    get (formData){
      console.log("call to get method...");
      let microservice = this;
      microservice.body = {
        status: "Method not allowed"
      };
      microservice.done();
//      microservice.registerClient();
    },
    post (formData){
      console.log("executing post register send email...");
      let microservice = this;
      microservice.registerClient(formData);
    }
  }),
  Class("Microservice",ContactFormMicroservice)
]);