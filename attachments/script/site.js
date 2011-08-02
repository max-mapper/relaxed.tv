var app = {
	baseURL: util.getBaseURL(document.location.pathname),
	container: 'body'
};

app.handler = function(route) {
  if (route.params && route.params.route) {
    var path = route.params.route;
    app.routes[path](route.params.id);
  } else {
    app.routes['home']();
  }  
};

app.routes = {
  home: function() {
    relaxedtv.showVideos({showFirst: true});
  },
  video: function(id) {
    relaxedtv.showVideos();
    relaxedtv.showVideo(id);
  }
}

app.after = {
 
}

app.sammy = $.sammy(function () {
  this.get('', app.handler);
  this.get("#/", app.handler);
  this.get("#:route", app.handler);
  this.get("#:route/:id", app.handler);
});

$(function() {
  app.sammy.run();  
})