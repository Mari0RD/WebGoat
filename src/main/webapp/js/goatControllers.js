//main goat application file
//TODO: reorg

/* ### GOAT CONTROLLERS ### */

/** Lesson Controller (includes menu stuff)
 *  prepares and updates menu topic items for the view
 */
goat.controller('goatLesson', function($scope, $http, $modal, $log, $templateCache) {
    $scope.cookies= [];
    $scope.params=[];
    //TODO: implement via separate promise and use config for menu (goat.data.loadMenuData())
    $http({method: 'GET', url: goatConstants.lessonService}).then(
	function(menuData) {
	    var menuItems = goat.utils.addMenuClasses(goatConstants.menuPrefix.concat(menuData.data));
	    $scope.menuTopics = menuItems;
	},
	function(error) {
	    // TODO - handle this some way other than an alert
	    console.error("Error rendering menu: " + error);
	}    
    );
    
    $scope.renderLesson = function(url) {
        //console.log(url + ' was passed in');
        // use jquery to render lesson content to div
	$scope.hintIndex = 0;
	
	var curScope = $scope;
	
	
	curScope.parameters = goat.utils.scrapeParams(url);
        goat.data.loadLessonContent(url).then(
		function(reply) {
		    $("#lesson_content").html(reply);
		    //hook forms
		    goat.utils.makeFormsAjax();
		    $('#hintsView').hide();
		    //render lesson title
		    $('#lessonTitle').text(goat.utils.extractLessonTitle($(reply)));
		    //@KLUGE to remove h1 after extracting and moving it to top
		    $('#lesson_content h1').remove()
		    // adjust menu to lessonContent size if necssary
		    //@TODO: this is still clunky ... needs some TLC
		    if ($('div.panel-body').height() > 400) {
			$('#leftside-navigation').height($(window).height());
		    }
		    //cookies
		    goat.data.loadCookies().then(
			function(resp) {
			    curScope.cookies = resp;
			}
		    );
		    //hints
		    curScope.hintIndex=0;
		    goat.data.loadHints().then(
			function (resp) {
			    curScope.hints = resp;
			    if (curScope.hints.length > 0 && curScope.hints[0].hint.indexOf(goatConstants.noHints) === -1) {
				goat.utils.displayButton('showHintsBtn',true);
                            } else {
                                goat.utils.displayButton('showHintsBtn',false);
                            }
			}
		    );
		    //source
		    goat.data.loadSource().then(
			function(resp) {
			    curScope.source = resp;
			}
		    );
		    //plan
		    goat.data.loadPlan().then(
			function(resp) {
			    curScope.plan = resp;
			}
		    );
		    //solution
		    goat.data.loadSolution().then(
			function(resp) {
			    curScope.solution = resp;
			}
		    );
		    goat.utils.scrollToTop();
		}
	    );
    };
    
    $scope.showLessonSource = function () {
	$('.lessonHelp').hide();
        $('#lesson_source_row').show();
        goat.utils.scrollToHelp();
    }
    
    $scope.showLessonPlan = function () {
	$('.lessonHelp').hide();
	$("#lesson_plan").html($scope.plan);
        $('#lesson_plan_row').show();
        goat.utils.scrollToHelp();
    }

    $scope.showLessonSolution = function () {
	$('.lessonHelp').hide();
	$("#lesson_solution").html($scope.solution);
        $('#lesson_solution_row').show();
        goat.utils.scrollToHelp();
    }

    $scope.manageHintButtons = function () {
	if ($scope.hintIndex === $scope.hints.length -1) {
	    $('#showNextHintBtn').css('visibility','hidden');
	} else if ($scope.hintIndex < $scope.hints.length - 1) {
	    $('#showNextHintBtn').css('visibility','visible');
	}
	//
	if ($scope.hintIndex === 0) {
	    $('#showPrevHintBtn').css('visibility','hidden');
	} else if ($scope.hintIndex > 0) {
	    $('#showPrevHintBtn').css('visibility','visible');
	}
    };
    
    $scope.viewHints = function() {
	if (!$scope.hints) {
	    return;
	}
	
	$('.lessonHelp').hide();
        $('#lesson_hint_row').show();
        goat.utils.scrollToHelp();
	$scope.curHint = $scope.hints[$scope.hintIndex].hint;
	$scope.manageHintButtons();
    };
    
    $scope.viewNextHint = function() {
	$scope.hintIndex++;
	$scope.curHint = $scope.hints[$scope.hintIndex].hint;
	$scope.manageHintButtons();
    };
    
    $scope.viewPrevHint = function () {
	$scope.hintIndex--;
	$scope.curHint = $scope.hints[$scope.hintIndex].hint;
	$scope.manageHintButtons();
    };
    
    $scope.hideHints = function () {
	
    };
    
    
    }).animation('.slideDown', function() {
	var NgHideClassName = 'ng-hide';
	return {
	    beforeAddClass: function(element, className, done) {
		if (className === NgHideClassName) {
		    $(element).slideUp(done);
		}
	    },
	    removeClass: function(element, className, done) {
		if (className === NgHideClassName) {
		    $(element).hide().slideDown(done);
		}
	    }
	};
	
	
    });
