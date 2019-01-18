<span></span>
## Easy Usage
No Build steps!, No Frameworks!, Just include the script and use it in any html as an element
```html
<html>
  <head>
    <script type="text/javascript" src="rapidoc-min.js"></script>
  </head>
  <body>
    <rapi-doc spec-url="https://api.apis.guru/v2/specs/bitbucket.org/2.0/swagger.json" ></rapi-doc>
  </body>  
</html>
```

## Include from CDN
```html
<script src="https://unpkg.com/rapidoc@<version>/dist/rapidoc-min.js"></script>
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
    <tr><td>show-info    </td> <td>show/hide Header (true, false) </td> <td>true</td></tr>
    <tr><td>layout       </td> <td>request/response placement (row, column)</td> <td>row</td></tr>
    <tr><td>body-padding </td> <td>Padding arround content  </td> <td>true</td></tr>
</table>

## Examples
[Example1 ](example1.html)
[Example2 (Dark Theme)](example1.html)