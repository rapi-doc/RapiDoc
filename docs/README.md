## OpenAPI Spec Viewer

### Features
- Supports swagger 2.0 and OpenAPI 3.0 
- Works with any framework
- Programmatically control using JavaScript - change its attributes, and it will react to those changes
- Integrated console to make API calls from the spec
- Allows to load JSON spec from URL and from Local Disk
- Better Usability, 
  - All models and examples are expanded by default, eliminates the need to click and reveal.
  - Requests and Responses are pre-populated with sample data
  - Takes only one click to make an API call
- Row and Column layout supported
  - Row: request and response placed side-by-side for easy comparison
  - Column: request and response placed one below the other for narrow screens such as tablets
- Branding and Personalization features makes it easy to follow any style guide
  - Comes with 2 Themes (Dark and Light)
  - Replace default logo with yours
  - Allows changing fonts (Regular and monspaced)
  - Allows changing text-color, button-color, header-color and color of other UI elements
- Plenty of customization options 
  - Add external contents at the top and bottom of the document, you may add tables, images, link, text, forms etc
  - You can disable API calling feature
  - Stop user to load any other API spec by hiding Header
  - Hide Authentication and provide your own pre-generated api-key 
  - Embed it inside another HTML document (no iframes)
  - Use it inside another framework (react, vue, angular, lit-element)
  - Style the element with standard css (change padding, position, border, margin)
- Lightweight and fast (under 125 KB gzipped)

### Quickstart (Use from CDN)
Just copy the below script in an html, and open it in a browser !!!
```html
<!doctype html> <!-- Important: must specify, else rendering will be effected -->
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

### Demo & Examples

- Basic Example ([Demo](example1.html))
```html
  <rapi-doc 
    spec-url="https://api.apis.guru/v2/specs/bitbucket.org/2.0/swagger.json"
  > </rapi-doc>
```

- Dark Theme ([Demo](example2.html))
```html
  <rapi-doc 
    spec-url="https://api.apis.guru/v2/specs/bitbucket.org/2.0/swagger.json"
    theme="dark"
  > </rapi-doc>
```

- Change Header Color with Dark Theme ([Demo](example3.html))
```html
  <rapi-doc 
    spec-url="https://api.apis.guru/v2/specs/bitbucket.org/2.0/swagger.json"
    header-color="#2d87e2"
    theme="dark"
  > </rapi-doc>
```

- Integrate with any HTML document (Request/Response one below the other) ([Demo](example4.html))
```html
  <rapi-doc 
    spec-url="https://api.apis.guru/v2/specs/bitbucket.org/2.0/swagger.json"
    theme='dark' 
    show-header='false'
    show-info='false'
    show-authentication='false'
    theme='dark' 
    layout="column"
  > </rapi-doc>
```

- Change Font (you may use local fonts or define your own font) ([Demo](example5.html))
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

- Change Logo ([Demo](example6.html))
```html
  <body>  
    <rapi-doc spec-url="https://api.apis.guru/v2/specs/googleapis.com/youtube/v3/swagger.json"> 
      <img slot="logo" src="https://img.icons8.com/color/48/000000/youtube-play.png">
    </rapi-doc>
  </body>  
```

- Add HTML content inside the spec ([Demo](example7.html))
```html
  <body>  
    <rapi-doc spec-url="https://api.apis.guru/v2/specs/googleapis.com/youtube/v3/swagger.json"> 

      <!-- content at the top -->
      <p>This is an example to add external html content </li>
      <p>Ypu may add </li>
      <ul>
        <li> Table </li>
        <li> Text </li>
        <li> Images </li>
        <li> Links </li>
        <li> any HTML content </li>
      </ul>  

      <!-- content at the bottom -->
      <p slot="footer"> This content will apear at the bottom </p>
    </rapi-doc>
  </body>  
```



- Change Attributes using JavaScript ([Demo](example100.html))
  use javascript `Element.setAttribute()` to change the elements attributes and see it reacts to those changes

### Use in a HTML/JS based project 

- In your project folder, install rapidoc from npm.

```bash
npm install --save rapidoc 

#only needed you dont have a local webserver
npm install http-server -g 
```  

- create an `index.html` file

```html
<!doctype html>
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

## Slots
<table>
  <tr><th>Slot Name</th> <th>Description </th></tr>
  <tr><td>(default)</td> <td>any content placed inside <`rapi-doc`> will be shown under the header </td> </tr>
  <tr><td>logo</td> <td>use this slot to replace the logo </td> </tr>
  <tr><td>footer</td> <td> The conents of this slot will appear at the bottom of the spec</td> </tr>
</table>  