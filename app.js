// Дэлгцэтэй ажиллах контроллер
var uiController = (function(){
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        addBtn: '.add__btn',
        incomeList: '.income__list',
        expensesList: '.expenses__list',
        tusuvLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        containerDiv: '.container',
        expensePercentageLabel: '.item__percentage',
        dateLabel: '.budget__title--month'        
    };
    // Node-ын жагсаалтыг тооцох өөрсдөө зохион forEach-тэй ижилхэн үүрэгтэй функц
    var nodeListForEach = function(list, callback){
        for(var i = 0; i < list.length; i++){
            callback(list[i], i);
        }        
    };
    
    var formatMoney = function(too, type){
        too = '' + too;
        var x = too.split('').reverse().join('');
        var y = '';
        var count = 1;
        for (var i=0; i<x.length; i++){
            y = y + x[i];
            if(count % 3 === 0) y = y + ',';
            count++;
        }
        var z = y.split('').reverse().join('');
        if (z[0] === ',') z = z.substr(1, z.length - 1);

        if(type === 'inc') z = '+ ' + z;
        else z = '- ' + z;
        return z;
    }

    return{
        displayDate: function(){
            var unuudur = new Date();
            document.querySelector(DOMstrings.dateLabel).textContent = unuudur.getFullYear() + ' оны ' + unuudur.getMonth() + ' сарын ';
        },
        getInput: function(){
            return{
                type: document.querySelector(DOMstrings.inputType).value,   // exp, inc
                description: document.querySelector(DOMstrings.inputDescription).value, 
                value: parseInt(document.querySelector(DOMstrings.inputValue).value)                
            };
        },

        dipslayPercentages: function(allPercentages){
            // Зарлагын NodeList-ийг олох. Node гэж DOM-ын 1 tag-ыг хэлдэг.
            var elements = document.querySelectorAll(DOMstrings.expensePercentageLabel);
            // Элемент болгоны хувьд зарлагын хувийг массиваас авч шивж оруулах.
            nodeListForEach(elements, function(el, index){
                el.textContent = allPercentages[index];
            });
        },

        getDOMstrings: function(){
            return DOMstrings;
        },

        clearFields: function(){
            var fields = document.querySelectorAll(DOMstrings.inputDescription + ", " + DOMstrings.inputValue);
            // Convert List to Array
            var fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(function(el, index, array){
                el.value = '';
            });            
           /*  for(var i = 0; i < fieldsArr.length; i++){
                fieldsArr[i].value = '';
            } */
            fieldsArr[0].focus();
        },

        tusviigUzuuleh: function(tusuv){
            var type;
            if(tusuv.tusuv > 0) type = 'inc'; 
            else type = 'exp';
            document.querySelector(DOMstrings.tusuvLabel).textContent = formatMoney(tusuv.tusuv, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatMoney(tusuv.totalInc, 'inc');
            document.querySelector(DOMstrings.expenseLabel).textContent = formatMoney(tusuv.totalExp, 'exp');
            if(tusuv.huvi !== 0){
                document.querySelector(DOMstrings.percentageLabel).textContent = tusuv.huvi + ' %';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = tusuv.huvi;
            } 
            
        },

        deleteListItem: function(id){
            var el = document.getElementById(id);
            el.parentNode.removeChild(el);
        },

        addListItem: function(item, type){
            // 1. Орлого зарлагын элементийг агуулсан html-ыг бэлтгэнэ.
            var html, list;
            if (type === 'inc'){
                list = DOMstrings.incomeList;
                html = '<div class="item clearfix" id="inc-%ID%"><div class="item__description">$$DESCRIPTION$$</div><div class="right clearfix"><div class="item__value">$$VALUE$$</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else {
                list = DOMstrings.expensesList;
                html = '<div class="item clearfix" id="exp-%ID%"><div class="item__description">$$DESCRIPTION$$</div><div class="right clearfix"><div class="item__value">$$VALUE$$</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            // 2. Тэр HTML дотроо орлого зарлагын утгуудыг REPLACE ашиглаж өөрчилж өгнө
            html = html.replace('%ID%', item.id);
            html = html.replace('$$DESCRIPTION$$', item.description);
            html = html.replace('$$VALUE$$', formatMoney(item.value, type));
            // 3. Бэтлгэсэн HTML-ээ DOM руу хийж өгнө.
            document.querySelector(list).insertAdjacentHTML("beforeend", html);
            console.log('item.id : ' + item.id);
            console.log('item.description : ' + item.description);
            console.log('item.value : ' + item.value);
        }
    };
})();
// Санхүүтэй ажиллах контроллер
var financeController = (function(){
    // Income, Expense хадгалах байгууллагч функцыг үүсгэнэ.
    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;    
    }
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;  
    };
    Expense.prototype.calcPercentage = function(totalIncome){
        if(totalIncome > 0){
            this.percentage = Math.round((this.value / totalIncome)*100);
        } else {
            this.percentage = 0;
        }        
    };
    Expense.prototype.getPercentage = function(){
        return this.percentage;
    };
    var calculateTotal = function(type){
        var sum = 0;
        data.items[type].forEach(function(el){
            sum = sum + el.value;
        });
        data.totals[type] = sum;
    }
    var data = {
        items: {
            inc: [],
            exp: []
        },
        totals: {
            inc: 0,
            exp: 0
        },
        tusuv: 0,
        huvi: 0
    };
    // closure-тай public service
    return{
        tusuvTootsooloh: function(){
            // Нийт орлогын нийлбэрийг тооцоолно
            calculateTotal('inc');
            // Нийт зарлагын нийлбэрийг тооцоолно
            calculateTotal('exp');
            // Төсвийг шинээр тооцоолно.
            data.tusuv = data.totals.inc - data.totals.exp;
            // Орлого зарлагын хувийг тооцоолно
            if (data.totals.inc > 0){
                data.huvi = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.huvi = 0;
            }
            
        },
        calcPercentages: function(){
            data.items.exp.forEach(function(el){
                el.calcPercentage(data.totals.inc);
            });
        },
        getPercentages: function(){
            var allPercentages = data.items.exp.map(function(el){
                return el.getPercentage();
            });
            return allPercentages;
        },
        tusviigAvah: function(){
            return{
                tusuv: data.tusuv,
                huvi: data.huvi,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp
            }
        },
        // Устгах товч дарах үед устгах функц  
        deleteItem: function(type, id){
            // MAP-ыг ашиглаж inc, exp товч дарсан эсэхээс хамаарч тэдгээрийн id-аар massive үүсгэнэ.
            var ids = data.items[type].map(function(el){
                return el.id;
            });
            // console.log('ids: ' + ids);
            // товч дарсан id-ыг "-1"-ээс ялгаатай бол устгах үйлдэл хийнэ.
            // Учир нь id нь тухайн massive-т байхгүй бол INDEXOF нь -1 гэсэн утга буцаадаг.
            // SPLICE-д хэдэн хасах утга түүний тоогоор massive сүүлээс устгадаг.
            // Тиймээс SPLICE-д -1 утгатай index гэж дамжуулах юм бол хамгийн сүүлийн element-ыг устгана.
            // Иймээс буруу element-ыг устгахгүй нь тул -1-тэй тэнцэж байгаа эсэхийг шалгаж massive-аас element-ыг устгаж байна.
            var index = ids.indexOf(id);
            // console.log('index: ' + index);
            if(index !== -1){
                // console.log('Ustgakh gej bn!!!');
                data.items[type].splice(index, 1);
            }
        },

        addItem: function(type, desc, val){
            var item, id;
            // id буюу idenetification - тодорхойлдог хүчин зүйл
            if(data.items[type].length === 0 ) id = 1;
            else {
                id = data.items[type][data.items[type].length - 1].id + 1; 
            }
            if (type === 'inc'){
                item = new Income(id, desc, val);
            } else {    // type === 'exp'
            item = new Expense(id, desc, val);
            }
            data.items[type].push(item);
            return item;
        },
        seeData: function(){
            return data;
        }
    };
})();
// Программын холбогч контроллер
var appController = (function(uiController, financeController){
    
    var ctrlAddItem = function(){
        // 1. Оруулах өгөгдлийг дэлгэцээс олж авна.
        var input = uiController.getInput();
        if(input.description !== '' && input.value !== ''){
            // 2. Олж авсан өгөгдлүүдээ санхүүгийн контроллерт дамжуулж тэнд хадгална.
            var item = financeController.addItem(
                input.type, 
                input.description, 
                input.value
            );
            // 3. Олж авсан өгөгдлүүдээ вэб дээр тохирох хэсэгт гаргана.
            uiController.addListItem(item, input.type);
            uiController.clearFields();
            // Төсвийг шинээр тооцоолоод дэлгэцэнд үзүүлнэ.
            updateTusuv();
        }
    };

    var updateTusuv = function(){
        // 4. Төсвийг тооцоолно.
        financeController.tusuvTootsooloh();
        // 5. Эцсийн үлдэгдэл, тооцоог дэлгэцэд гаргана.
        var tusuv = financeController.tusviigAvah();
        // 6. Төсвийн тооцоог дэлгэцэд гаргана.
        uiController.tusviigUzuuleh(tusuv);
        // 7. Элементүүдийн хувийг тооцоолно.
        financeController.calcPercentages();
        // 8. Элементүүдийн хувийг хүлээж авна.
        var allPercentages = financeController.getPercentages();
        // 9. Эдгээр хувийг дэлгэцэнд гарган.
        // console.log(allPercentages);
        uiController.dipslayPercentages(allPercentages);
    };

    var setupEventListeners = function(){
        var DOM = uiController.getDOMstrings();
        document.querySelector(DOM.addBtn).addEventListener('click', function(){
            ctrlAddItem();
        });
        console.log('appController-ын function');
    
        document.addEventListener("keypress", function(event){
            // Дээр үеийн browser-уудад event.which-ыг ашигладаг. Орчин үеийн browser-уудад event.keyCode-ыг ашигладаг
            if(event.keyCode === 13 || event.which === 13 ) {
                ctrlAddItem();
            }
        });
        // Орлого, зарлага дээр дарах үеийн утгыг устгах
        document.querySelector(DOM.containerDiv).addEventListener('click', function(event){
            var id = event.target.parentNode.parentNode.parentNode.parentNode.id;
            // inc-2 -ыг ялгах
            if(id){
                var arr = id.split('-');
                var type = arr[0];
                var itemId = parseInt(arr[1]);
                // console.log(type + '--> ' + itemId);
                // 1. Санхүүгийн модулиас type, id ашиглаад устгана.
                financeController.deleteItem(type, itemId);
                // 2. Дэлгэц дээрээс энэ элементийг устгана.
                uiController.deleteListItem(id);
                // 3. Үлдэглдэл тооцоог шинэчилж харуулна.
                // Төсвийг шинээр тооцоолоод дэлгэцэнд үзүүлнэ.
                updateTusuv();
            }
            
        });
    }

    return {
        init: function(){
            console.log('Application started ...');
            uiController.displayDate();
            uiController.tusviigUzuuleh({
                tusuv: 0,
                huvi: 0,
                totalInc: 0,
                totalExp: 0
            });
            setupEventListeners();
        }
    }
})(uiController, financeController);

appController.init();