# Dinder
Rhythm with binder.
Binding DOMs to remote JSON api.

## Preparation
1. Prepare /static/route.json

```json
{
    "create_post": {
        "path": "/posts",
        "method": "post"
    },
    "show_comment": {
        "path": "/comments/:pid/:id",
        "method": "get"
    }
}
```

2. Prepare template for each entry, put it under /static/tmpl/    
   Templates are ERB style.
3. The first page would be /static/tmpl/index.erb
4. That's it!

## Utilities
* D.genPath(PATH, PARAMS)    
  generating path by params

```javascript
D.genPath("show_comment", [1,2]) // "/comments/1/2"
```

* D.bindPath(PATH, PARAMS)
  bind a DOM to a PATH with PARAMS

```erb
<div class="comment" <%= D.bindPath("show_comment", [comment.post_id, comment.id]) %>
```

* D.formFor(PATH, PARAMS)    
  generate for attributes for PATH with PARAMS (similar to bindPath)
* D.domFor(PATH, PARAMS)    
  returning the jQuery object which bind with PATH and PARAMS
* D.render(PATH, PARAMS, [DATA])    
  rendering data of PATH, PARAMS. It would get DATA from the api if DATA is not presented.

## Ceveats
* DON'T END EXPRESSIONS WITH SEMICOLON IN <%= %> TAGS
* DO END WITH SEMICOLON IN <% %> TAGS
