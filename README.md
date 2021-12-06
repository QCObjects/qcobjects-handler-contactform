# QCObjects Handler for ContactForm Backend Services

QCObjects Handler for ContactForm requests. This handler will allow to handle ContactForm urls
like https://example.com/rest/contactform
and get a notification to email and mailchimp subscribers lists.

## Instructions

1. Install this dependency in your project using npm

```shell
npm i --save qcobjects-handler-contactform
```

2. In your config.json file, create the following paths

```shell
{
  "backend": {
    "routes": [
      {
        "name": "ContactForm Url",
        "description": "It handles the contactform url",
        "path": "^/rest/contactform$",
        "microservice": "qcobjects-handler-contactform",
        "supported_methods": ["POST"],
        "responseHeaders": {
          "Content-Type": "application/json"
        }
      }
    ]
  }
}
```

The contents of *response* is a dynamic object, you can specify any property here
or even use a meta processor.

3. Start the QCObjects HTTP2 Server

```shell
qcobjects-server
```

4. Peer Dependencies needed

- [qcobjects-lib-sendemail](https://www.npmjs.com/package/qcobjects-lib-sendemail)
- [qcobjects-lib-mailchimp-api](https://www.npmjs.com/package/qcobjects-lib-mailchimp-api)