## Easy Usage
No Build steps!, No Frameworks!, Just copy the below script in an html, and open it in a browser !!!

### Use from CDN
```html
<html>
  <head>
    <meta charset="utf-8"> <!-- Important: The Custom element uses utf8 charecters -->
    <script src="https://unpkg.com/rapidoc/dist/rapidoc-min.js"></script>
  </head>
  <body>
    <rapi-doc 
      spec-url="https://api.apis.guru/v2/specs/bitbucket.org/2.0/swagger.json" 
    ></rapi-doc>
  </body>  
</html>
```

### Use in a HTML/JS based project 

- In your project folder, install rapidoc from npm.
```bash
npm install --save rapidoc 

#only needed you dont have a local webserver
npm install http-server -g 
```  

- create an `index.html` file
```html
<html>
<head>
    <meta charset="utf-8">
    <script type="module" src="./node_modules/rapidoc/dist/rapidoc-min.js"></script>
</head>
<body>
    <rapi-doc 
      spec-url="https://api.apis.guru/v2/specs/bitbucket.org/2.0/swagger.json" 
    ></rapi-doc>
</body>
</html>
```

- serve the file in a local web server 
```bash
  http-server -p 9000
```

- in your browser visit ```http://localhost:9000/index.html```


## Branding, Styling and Personalization
Style the element using standard `css`. Apply borders, padding, width, height etc in accordance to your brand requierment. You can also use many attributes to effect the interface.

## Attributes
<table>
    <tr><th>Attribute</th> <th>Description </th> <th>Default</th></tr>
    <tr><td>spec-url     </td> <td>url of the OpenAPI spec to view </td> <td>(empty)</td></tr>
    <tr>
      <td>server</td> 
      <td>API Server URL which will be used while trying out the APIs. This can be changed later using the UI</td> 
      <td>(empty)</td>
    </tr>
    <tr>
      <td>api-key-name</td>
      <td>Name of the API key that will be send while trying out the APIs</td> 
      <td>(empty)</td>
    </tr>
    <tr>
      <td>api-key-value</td>
      <td>Value of the API key that will be send while trying out the APIs</td> 
      <td>Authorization</td>
    </tr>
    <tr>
      <td>api-key-location</td>
      <td>determines where you want to place the key. allowed values are 'header' or 'query'</td> 
      <td>header</td>
    </tr>
    <tr>
      <td>show-try</td> 
      <td>'TRY' feature allows you to make REST request to the API server. To disable this feature set it to false </td> 
      <td>true</td>
    </tr>
    <tr>
      <td>show-authentication</td> 
      <td>Authentication feature allows the user to set http(basic & bearer) or api-key which is typically a token(or JWT) sent using the request-header or query-string. You may supply this information using api--key-???? attributes too. To hide the authentication section set it to false</td> 
      <td>true</td>
    </tr>
    <tr>
      <td>show-info</td> 
      <td>show/hide the documents info section</td> 
      <td>true</td>
    </tr>
    <tr><td>show-header  </td> <td>true, false </td> <td>true</td></tr>
    <tr><td>heading-text </td> <td>Heading Text on top-left corner </td> <td>(empty)</td></tr>
    <tr><td>header-color </td> <td>Hex color code on various controls such as buttons, tabs </td>  <td>#444444</td></tr>
    <tr><td>primary-color</td> <td>Hex color code on various controls such as buttons, tabs </td> <td>#FF791A</td></tr>
    <tr><td>regular-font </td> <td>Font Name(s) to be used for regular text </td> <td>rapidoc, Helvetica, Arial</td></tr>
    <tr><td>mono-font    </td> <td>Font Name(s) to be used for monospaced text </td> <td>Monaco, 'Andale Mono', 'Roboto Mono'</td></tr>
    <tr><td>theme        </td> <td>light, dark </td> <td>light</td></tr>
    <tr><td>layout       </td> <td>request/response placement (row, column)</td> <td>row</td></tr>
</table>

## Examples

- [Basic Example](example1.html)
```html
  <rapi-doc 
    spec-url="https://api.apis.guru/v2/specs/bitbucket.org/2.0/swagger.json"
  > </rapi-doc>
```

- [Dark Theme](example2.html)
```html
  <rapi-doc 
    spec-url="https://api.apis.guru/v2/specs/bitbucket.org/2.0/swagger.json"
    theme="dark"
  > </rapi-doc>
```

- [Change Header Color with Dark Theme](example3.html)
```html
  <rapi-doc 
    spec-url="https://api.apis.guru/v2/specs/bitbucket.org/2.0/swagger.json"
    header-color="#2d87e2"
    theme="dark"
  > </rapi-doc>
```

- [Compact Mode (Request/Response one below the other)](example4.html)
```html
  <rapi-doc 
    spec-url="https://api.apis.guru/v2/specs/bitbucket.org/2.0/swagger.json"
    theme='dark' 
    show-header='false'
    layout="column"
  > </rapi-doc>
```

- [Change Font (you may use local fonts or define your own font)](example5.html)
```html
  <head>
    <link href="https://fonts.googleapis.com/css?family=Varela+Round" rel="stylesheet">
  </head>
  <body>  
    <rapi-doc 
      spec-url="https://api.apis.guru/v2/specs/bitbucket.org/2.0/swagger.json"
      regular-font="'Varela Round', 'Arial Rounded MT Bold', 'Helvetica Rounded' "
    > </rapi-doc>
  </body>  
```

- [Change Attributes using JavaScript](example6.html)

