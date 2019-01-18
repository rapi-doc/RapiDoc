## Easy Usage
No Build steps!, No Frameworks!, Just include the script and use it in any html as an element
```html
<!doctype html>
  <head>
    <script type="text/javascript" src="rapidoc-min.js"></script>
  </head>
  <body>
    <rapi-doc spec-url="https://api.apis.guru/v2/specs/bitbucket.org/2.0/swagger.json" ></rapi-doc>
  </body>  
</html>
```

## To include from CDN
```html
<script src="https://unpkg.com/rapidoc@<version>/dist/rapidoc-min.js"></script>
```
## Branding, Styling and Personalization
Style the element using standard `css`. You can apply borders, padding, width, height etc in accordance to your brand requierment. You can also use many attributes 


<table>
    <tr><th>Attribute</th> <th>Description </th> <td>Default</td></tr>
    <tr><td>`spec-url`</td> <td>url of the OpenAPI spec to view </td> <td>`''` (empty)</td></tr>
    <tr><td>hello</td> <td>test</td></tr>
</table>

## Attributes
| Attribute  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;| Purpose                     | Default      |
| -------------   |----------------------------------------------------------|------        |
| `spec-url`      | url of the OpenAPI spec to view                          | `''` (empty) |
| `heading-text`  | Heading Text on top-left corner                          | `''` (empty) |
| `primary-color` | Hex color code on various controls such as buttons, tabs | `#FF791A`    |
| `header-color`  | Hex color code for the Header                            | `#444444`    |
| `theme`         | `light` or `dark`                                        | `light`      |
| `show-header`   | `true` or `false` show/hide Header                       | `true`       |
| `show-info`     | `true` or `false` show/hide Specs Info section such as Title, Version | `true`|
| `layout`        | `row` or `column` request/response placement             | `row`      |
| `body-padding`  | `true` or `false` you may remove some padding to make it compact | `true`      |

