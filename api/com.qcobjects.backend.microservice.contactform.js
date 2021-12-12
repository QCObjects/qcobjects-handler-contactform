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

Package("com.qcobjects.backend.microservice.contactform", [
  Class("ContactFormMicroservice", BackendMicroservice, {
    body: null,
    tempFileName: "",
    error(code, e) {
      let microservice = this;
      let stream = microservice.stream;
      if (typeof stream.respond !== "undefined") {
        stream.respond({
          ":status": code,
          "content-type": "text/html"
        });
      } else if (stream.writeHeader !== "undefined") {
        stream.writeHeader(code, {
          "content-type": "text/html"
        });
      }
      stream.on("error", () => {});
      stream.write(`<h1>${code.toString()} - ${e}</h1>`);
      stream.end();
    },
    registerClient(formData) {
      var microservice = this;
      return new Promise((resolve, reject) => { 
        try {
          logger.debugEnabled = true;
          let emailNotification = New(EmailNotification, {
            microservice: microservice
          });
          let mailchimpApi = New(MailchimpAPI, {
            microservice: microservice
          });
  
          Promise.all([
            mailchimpApi.subscribeToAll(formData),
            emailNotification.sendEmailUser(formData),
            emailNotification.sendEmailBackoffice(formData)
          ]).then((response) => {
            logger.debug(_DataStringify(response));
            resolve({
              message: "Thank you for your message, we will contact you as soon as possible.",
              status: "OK"
            });
          }).catch(e => {
            logger.debug(e.toString());
            reject(e.toString());
          });
        } catch (e) {
          logger.debug(e.toString());
          reject(e.toString());
        }
  
      });

    },
    get(formData) {
      logger.info("[ContactFormMicroservice] A call to get method is not allowed...");
      let microservice = this;
      let e = "Method not allowed";
      logger.debug(e.toString());
      microservice.error(405, e.toString());
    },
    post(formData) {
      logger.info("[ContactFormMicroservice] executing post to send email notification...");
      let microservice = this;
      microservice.registerClient(formData).then((body) => {
        microservice.body = body;
        microservice.done();
      }).catch(e => {
        microservice.error(500, e.toString());
      });
    }
  }),
  Class("Microservice", ContactFormMicroservice)
]);