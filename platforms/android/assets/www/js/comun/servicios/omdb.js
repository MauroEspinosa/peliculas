angular.module('omdb',['FilmsModel'])
.constant('filmsNames',["the martian","interstellar","jupiter ascending",
                        "batman v superman","moonwalkers",
                        "independence day Resurgence","star trek beyond",
                        "the space between us","rogue one: a star wars story"])

.constant('omdbApi',(function(){
  var namePlaceHolder='[namePlaceHolder]';
  return {url: "http://www.omdbapi.com/?t="+namePlaceHolder+"&y=&plot=short&r=json",
          namePlaceHolder:namePlaceHolder}
})())

.factory('FilmsService',function($http, $q, Film, omdbApi, filmsNames){
  var FilmsService={};

  FilmsService.films=[];
  FilmsService.selectedFilm=null;

  var selectFilmByTitle=function(title){
    for(i=0; i<FilmsService.films.length;i++){
      if(FilmsService.films[i].title===title){
        return FilmsService.films[i];
      }
      return null;
    }
  }

  var urlFromTitle=function(title){
    var queryString=title.split(" ").join("+");
    var url=omdbApi.url.replace(omdbApi.namePlaceHolder,queryString);
    return url;
  }

  FilmsService.getFilm=function(title){
    var deferred=$q.defer();
    if(FilmsService.films.length>0){
      FilmsService.selectedFilm=selectFilmByTitle(title);
      deferred.resolve(FilmsService.selectedFilm);
    }
    else{
      $http.get(urlFromTitle(title),{}).then(
                          function(response){
                            FilmsService.selectedFilm=Film.build(response.data);
                            deferred.resolve(FilmsService.selectedFilm)
                          },
                          function(error){
                            FilmsService.selectedFilm=null;
                            deferred.resolve(null);
                          }
      );
    }
    return deferred.promise;
  }

  FilmsService.getFilms=function(){
    var deferred=$q.defer();
    var nDownloads=0;
    var errorOcurred=false;

    var resolveIfFinished=function(succes){
      nDownloads++;
      if(!succes){
        errorOcurred=true;
      }

      if(nDownloads===filmsNames.length){
        if(!errorOcurred){
          deferred.resolve(FilmsService.films);
        }
        else{
          deferred.reject();
        }
      }
    }

    if(FilmsService.films.length>0){
      deferred.resolve(FilmsService.films);
    }
    else{
      for(i=0;i<filmsNames.length;i++){
        $http.get(urlFromTitle(filmsNames[i]),{}).then(
                                                    function(response){
                                                      FilmsService.films.push(Film.build(response.data));
                                                      resolveIfFinished(true);
                                                    },
                                                    function(error){
                                                      resolveIfFinished(false);
                                                    }
                                                  );
      }
    }
  return deferred.promise;
  }

  return FilmsService;
});
