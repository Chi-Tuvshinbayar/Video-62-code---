var uiController = (function(){
    console.log('uiController-ын function');
})();

var financeController = (function(){
    console.log('financeController-ын function');
})();

var appController = (function(uiController, financeController){
    u
    console.log('appController-ын function');
})(uiController, financeController);