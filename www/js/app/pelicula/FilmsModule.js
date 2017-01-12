angular.module("FilmsModule",["FilmsModel","omdb"])
.config(function($stateProvider){
  $stateProvider
  .state('app.films',{
    url: '/films',
    views: {'contenido':{
               templateUrl:'js/app/pelicula/films/films.html',
               controller: 'FilmsController',
               resolve:{films:function(FilmsService){
                                return FilmsService.getFilms();
                              }
                        }
             }
           }
  })
  .state('app.film-detalles',{
    url:'/film-detalles/:filmTitle',
    views:{'contenido':{
              controller: 'DetailsControler',
              templateUrl:'js/app/pelicula/detalles/detalles.html',
              resolve:{film:function(FilmsService,$stateParams){
                              return FilmsService.getFilm($stateParams.filmTitle);
                            }
                       }
            }
          }
  })


});
