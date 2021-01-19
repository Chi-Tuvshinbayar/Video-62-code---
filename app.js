// Дэлгцэтэй ажиллах контроллер
var uiController = (function(){
    console.log('uiController-ын function');
})();
// Санхүүтэй ажиллах контроллер
var financeController = (function(){
    console.log('financeController-ын function');
})();
// Программын холбогч контроллер
var appController = (function(uiController, financeController){
    var ctrlAddItem = function(){
        // 1. Оруулах өгөгдлийг дэлгэцээс олж авна.
        console.log('clicked ...');
        // 2. Олж авсан өгөгдлүүдээ санхүүгийн контроллерт дамжуулж тэнд хадгална.
        // 3. Олж авсан өгөгдлүүдээ вэб дээр тохирох хэсэгт гаргана.
        // 4. Төсвийг тооцоолно.
        // 5. Эцсийн үлдэгдэл, тооцоог дэлгэцэд гаргана.
    }
    document.querySelector('.add__btn').addEventListener('click', function(){
        ctrlAddItem();
    });
    console.log('appController-ын function');

    document.addEventListener("keypress", function(event){
        // Дээр үеийн browser-уудад event.which-ыг ашигладаг. Орчин үеийн browser-уудад event.keyCode-ыг ашигладаг
        if(event.keyCode === 13 || event.which === 13 ) {
            ctrlAddItem();
        }
    });
})(uiController, financeController);