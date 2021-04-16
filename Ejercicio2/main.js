// GLOBAL VARIABLES
var line_chart;
var pie_chart;

var main_data = {};
var date_list = new Array;

var urls_ref = {
    0: {"url": "http://s3.amazonaws.com/logtrust-static/test/test/data1.json", "type": "firstSerie"},
    1: {"url": "http://s3.amazonaws.com/logtrust-static/test/test/data2.json", "type": "secondSerie"},
    2: {"url": "http://s3.amazonaws.com/logtrust-static/test/test/data3.json", "type": "thirdSerie"}
};

var xmlhttp = new XMLHttpRequest();


// UTILS
function convertDate(inputFormat) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date(inputFormat)
    return [d.getFullYear(), pad(d.getMonth()+1), pad(d.getDate()) ].join('/')
}


function sortOnKeys(dict) {

    var sorted = [];
    for(var key in dict) {
        sorted[sorted.length] = key;
    }
    sorted.sort();

    var tempDict = {};
    for(var i = 0; i < sorted.length; i++) {
        tempDict[sorted[i]] = dict[sorted[i]];
    }
    return tempDict;
}


function CheckUrlRef(url) {
    var urlType;
    for (ref in urls_ref) {
        if (urls_ref[ref]["url"] == url) {
            return urls_ref[ref]["type"];
        }
        
    };
}


// JSON DATA PARSING AND HANDLING
handleFirstSerie = function(myObj) {
    for (x in myObj) {
        var mydate = new Date(myObj[x]["d"]);
        mydate = convertDate(mydate);
        if (!(date_list.includes(mydate))) {
            date_list.push(mydate);
        }; 
    
        if (myObj[x]["cat"].toUpperCase() in main_data) {
            main_data[myObj[x]["cat"].toUpperCase()][mydate] = myObj[x]["value"];
        }
        else {
            main_data[myObj[x]["cat"].toUpperCase()] = {};
            for (date in date_list) {
                main_data[myObj[x]["cat"].toUpperCase()][date_list[date]] = null;
            };
            main_data[myObj[x]["cat"].toUpperCase()][mydate] = myObj[x]["value"]
        };
        for (cat in main_data) {
            if (!(mydate in main_data[cat])) {
                main_data[cat][mydate] = null;
            }
        };
    };
}

handleSecondSerie = function(myObj) {
    for (x in myObj) {
        var mydate = new Date(myObj[x]["myDate"]);
        mydate = convertDate(mydate);
        if (!(date_list.includes(mydate))) {
            date_list.push(mydate);
        }; 
        var myCategory = myObj[x]["categ"].toUpperCase();
        if (myCategory in main_data) {
            if (main_data[myCategory][mydate] == null) {
                main_data[myCategory][mydate] = myObj[x]["val"];
            } else {
                main_data[myCategory][mydate] = main_data[myCategory][mydate] + myObj[x]["val"];
            }
        }
        else {
            main_data[myCategory] = {};
            for (date in date_list) {
                main_data[myCategory][date_list[date]] = null;
            };
            main_data[myCategory][mydate] = myObj[x]["val"]
        };
        for (cat in main_data) {
            if (!(mydate in main_data[cat])) {
                main_data[cat][mydate] = null;
            }
        };
    };
}

handleThirdSerie = function(myObj) {
    const regexDate = /(19|20)\d\d(-)(0[1-9]|1[012])(-)(0[1-9]|[12][0-9]|3[01])/;
    const regexCat = /#([a-zA-Z]{1,3})( )([1-9_])#/;
    for (x in myObj) {
        var rawText = myObj[x]["raw"];
        findRegexDate = rawText.match(regexDate)[0];
        var mydate = new Date(findRegexDate);
        mydate = convertDate(mydate);
        if (!(date_list.includes(mydate))) {
            date_list.push(mydate);
        }; 
        var myCategory = rawText.match(regexCat)[0];
        myCategory = myCategory.replaceAll("#", "");
        //console.log(myCategory);
        if (myCategory in main_data) {
            if (main_data[myCategory][mydate] == null) {
                main_data[myCategory][mydate] = myObj[x]["val"];
            } else {
                main_data[myCategory][mydate] = main_data[myCategory][mydate] + myObj[x]["val"];
            }            
        }
        else {
            main_data[myCategory] = {};
            for (date in date_list) {
                main_data[myCategory][date_list[date]] = null;
            };
            main_data[myCategory][mydate] = myObj[x]["val"]
        };
        for (cat in main_data) {
            if (!(mydate in main_data[cat])) {
                main_data[cat][mydate] = null;
            }
        };
    };
}

// FUNCTIONS TO GENERATE GRAPHS
function generateLineGraph(mydata) {

    var data_series = [];
    for (x in mydata) {
        var values = Object.keys(mydata[x]).map(function(key){
            return mydata[x][key];
        });
        data_series.push({name: x, data: values});
    };
        
    line_chart = Highcharts.chart('container', {
        chart: {
            type: 'line'
        },
        title: {
            text: 'Test'
        },
        xAxis: {
            categories: date_list.sort(),
        },
        series: data_series
    });
}


function generatePieGraph(myData) {

    var dataSeries = [];
    var total = 0;
    for (cat in myData) {
        sum = 0;
        for (date in myData[cat]) {
            //console.log(myData[cat][date]);
            sum += myData[cat][date];
        };
        dataSeries.push({name: cat, y:sum});
        total += sum;
    };
    for (var i = 0; i < dataSeries.length; i++) {
        dataSeries[i]["y"] = dataSeries[i]["y"] / total * 100;
    };
        
    pieChart = Highcharts.chart('container2', {
        chart: {
            type: 'pie'
        },
        title: {
            text: 'Test'
        },
        
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                }
            }
        },
        xAxis: {
            categories: Object.keys(myData),
        },
        series: [{data: dataSeries}]
    });

}

// MAIN REQUEST FUNCTION TO RETREIVE JSON
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var myObj = JSON.parse(this.responseText);
      var testType = CheckUrlRef(this.responseURL);
      if (testType == "firstSerie") {
          handleFirstSerie(myObj);
      } else if (testType == "secondSerie") {
          handleSecondSerie(myObj);
      } else if (testType == "thirdSerie") {
          handleThirdSerie(myObj);
      }
    }
  };
  
  
// MAIN Loop over the urls
for (ref in urls_ref) {
    xmlhttp.open("GET", urls_ref[ref]["url"], false);
    xmlhttp.send();      
}
for (x in main_data) {
    main_data[x] = sortOnKeys(main_data[x]);
};

generateLineGraph(main_data);
generatePieGraph(main_data);

