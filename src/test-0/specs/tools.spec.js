var requirejs = require('requirejs');
var rc = require('../modules/requireConfig.js');
requirejs.config(rc.init());
var tools = requirejs('tools');
//var $ = require('../node_modules/jasmine-node/lib/jasmine-node/jquery-1.11.2.min.js');

describe("Unit Test zum Testen der properties-Tools", function() {
    it("Die benötigten Konfigurationen sollten definiert sein", function() {
        $(document.body).append($('<form></form>'));
    });
});

// http://evanhahn.com/how-do-i-jasmine/
// http://www.htmlgoodies.com/beyond/javascript/js-ref/testing-dom-events-using-jquery-and-jasmine-2.0.html
// http://testdrivenwebsites.com/2010/07/29/html-fixtures-in-jasmine-using-jasmine-jquery/
// http://www.bennadel.com/blog/2393-writing-my-first-unit-tests-with-jasmine-and-requirejs.htm

/**
beforeEach(function(){
    form = $('<form>');
    $(document.body).append(form);
});*/
