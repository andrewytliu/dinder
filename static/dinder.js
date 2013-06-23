var D = Dinder = new function() {
    var route = {},
    init = function() {
        compileRoute();
        $.get('/static/tmpl/index.erb', function(index) {
            var compiled = _.template(index);
            $('body').append($(compiled()));
        });
        $('body').on('ajax:success', function(e, data, s, xhr, path, params, method) {
            data.params = params;
            var result = render(path, params, data);
            var dom = domFor(path, params);
            // TODO: maybe bind for post?
            if (method == 'get' && dom) {
                dom.replaceWith($(result));
            }
        });
    },
    compileRoute = function() {
        // TODO: different path of route and 404
        $.ajax({url: '/static/route.json', 
                success: function(r) {
                            route = r;
                },
                async: false});
    },
    genPath = function(path, params) {
        var r = route[path].path;
        if (params) {
            for (var i = 0; i < params.length; ++i) {
                r = r.replace(/:\w+/, params[i]);
            }
        }
        return r;
    },
    genParams = function(raw, path) {
        var reg = route[path].path;
        reg = new Regexp(reg.replace(/:\w+/, "(\\w+)"));
        return reg.exec(raw);
    },
    bindPath = function(path, params) {
        return " data-bind='"+genPath(path, params)+"'"+
               "  data-path='"+path+"' "+
               " data-params='"+params+"' ";
    },
    domFor = function(path, params) {
        return $("[data-bind='"+genPath(path, params)+"']");
    }
    formFor = function(path, params) {
        return " action='"+genPath(path, params)+"' "+
               " method='"+route[path].method+"' "+
               " data-path='"+path+"' "+
               " data-params='"+params+"' "+
               " data-remote='true' ";
    },
    render = function(path, params, data) {
        var tmpl;
        $.ajax({url: '/static/tmpl/'+path+'.erb',
                success: function(t) {
                            tmpl = t;
                         },
                async: false});
        if (!data) {
            $.ajax({url: genPath(path, params), 
                    success: function(d) {
                                data = d;
                             },
                    type: route[path].method,
                    dataType: 'json',
                    async: false});
        }
        data.params = params;
        var compiled = _.template(tmpl)
        return compiled(data);
    },
    csrfTag = function() {
        // TODO
    }
    // exporting
    this.init = init;
    this.genPath = genPath;
    this.bindPath = bindPath;
    this.domFor = domFor;
    this.formFor = formFor;
    this.render = render;
    this.csrfTag = csrfTag;
}
