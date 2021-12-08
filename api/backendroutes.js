(function loadContactFormRoutes(){
    if (!loadContactFormRoutes.loaded){
      let backend = CONFIG.get("backend");
      if (typeof backend === "undefined"){
        backend = {};
      }
      if (typeof backend.routes === "undefined"){
        backend.routes = [];
      }
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
  