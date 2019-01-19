<span></span>
## Easy Usage
No Build steps!, No Frameworks!, Just copy the below script in an html, and open it in a browser !!!
```html
<html>
  <head>
    <meta charset="utf-8"> <!-- Important: The Custom element uses utf8 charecters -->
    <script src="https://unpkg.com/rapidoc@1.0.2/dist/rapidoc-min.js"></script>
  </head>
  <body>
    <rapi-doc 
      spec-url="https://api.apis.guru/v2/specs/bitbucket.org/2.0/swagger.json" 
    ></rapi-doc>
  </body>  
</html>
```

## Branding, Styling and Personalization
Style the element using standard `css`. You can apply borders, padding, width, height etc in accordance to your brand requierment. You can also use many attributes 

## Attributes
<table>
    <tr><th>Attribute</th> <th>Description </th> <th>Default</th></tr>
    <tr><td>spec-url     </td> <td>url of the OpenAPI spec to view </td> <td>(empty)</td></tr>
    <tr><td>heading-text </td> <td>Heading Text on top-left corner </td> <td>(empty)</td></tr>
    <tr><td>primary-color</td> <td>Hex color code on various controls such as buttons, tabs </td> <td>#FF791A</td></tr>
    <tr><td>theme        </td> <td>Hex color code for the Header </td> <td>#444444</td></tr>
    <tr><td>show-header  </td> <td>light, dark </td> <td>light</td></tr>
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

- [Change Attributes using JavaScript](example5.html)

