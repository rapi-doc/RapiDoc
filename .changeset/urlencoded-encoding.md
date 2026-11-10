---
"rapidoc": patch
"@rapidoc/prerender": patch
---

Try It sends `application/x-www-form-urlencoded` bodies as the media type's `encoding` says, with the OpenAPI default (`style: form`, `explode: true`) when it says nothing: an array repeats its name (`tag=a&tag=b`, before `tag=a,b`), an object sends one field per property (`a=1`, before JSON), `explode: false` and the delimited and `deepObject` styles are followed, and `contentType: application/json` sends the field as JSON.
