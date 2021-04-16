// GLOBAL VARIABLES
var mainData = {};
var dateList = new Array;

var urlsRef = {
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
    for (ref in urlsRef) {
        if (urlsRef[ref]["url"] == url) {
            return urlsRef[ref]["type"];
        }
        
    };
}


// JSON DATA PARSING AND HANDLING
handleFirstSerie = function(myObj) {
    for (x in myObj) {
        var mydate = new Date(myObj[x]["d"]);
        mydate = convertDate(mydate);
        if (!(dateList.includes(mydate))) {
            dateList.push(mydate);
        }; 
    
        if (myObj[x]["cat"].toUpperCase() in mainData) {
            mainData[myObj[x]["cat"].toUpperCase()][mydate] = myObj[x]["value"];
        }
        else {
            mainData[myObj[x]["cat"].toUpperCase()] = {};
            for (date in dateList) {
                mainData[myObj[x]["cat"].toUpperCase()][dateList[date]] = null;
            };
            mainData[myObj[x]["cat"].toUpperCase()][mydate] = myObj[x]["value"]
        };
        for (cat in mainData) {
            if (!(mydate in mainData[cat])) {
                mainData[cat][mydate] = null;
            }
        };
    };
}

handleSecondSerie = function(myObj) {
    for (x in myObj) {
        var mydate = new Date(myObj[x]["myDate"]);
        mydate = convertDate(mydate);
        if (!(dateList.includes(mydate))) {
            dateList.push(mydate);
        }; 
        var myCategory = myObj[x]["categ"].toUpperCase();
        if (myCategory in mainData) {
            if (mainData[myCategory][mydate] == null) {
                mainData[myCategory][mydate] = myObj[x]["val"];
            } else {
                mainData[myCategory][mydate] = mainData[myCategory][mydate] + myObj[x]["val"];
            }
        }
        else {
            mainData[myCategory] = {};
            for (date in dateList) {
                mainData[myCategory][dateList[date]] = null;
            };
            mainData[myCategory][mydate] = myObj[x]["val"]
        };
        for (cat in mainData) {
            if (!(mydate in mainData[cat])) {
                mainData[cat][mydate] = null;
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
        if (!(dateList.includes(mydate))) {
            dateList.push(mydate);
        }; 
        var myCategory = rawText.match(regexCat)[0];
        myCategory = myCategory.replaceAll("#", "");
        //console.log(myCategory);
        if (myCategory in mainData) {
            if (mainData[myCategory][mydate] == null) {
                mainData[myCategory][mydate] = myObj[x]["val"];
            } else {
                mainData[myCategory][mydate] = mainData[myCategory][mydate] + myObj[x]["val"];
            }            
        }
        else {
            mainData[myCategory] = {};
            for (date in dateList) {
                mainData[myCategory][dateList[date]] = null;
            };
            mainData[myCategory][mydate] = myObj[x]["val"]
        };
        for (cat in mainData) {
            if (!(mydate in mainData[cat])) {
                mainData[cat][mydate] = null;
            }
        };
    };
}

// FUNCTIONS TO GENERATE GRAPHS
function generateLineGraph(mydata) {

    var dataSeries = [];
    for (x in mydata) {
        var values = Object.keys(mydata[x]).map(function(key){
            return mydata[x][key];
        });
        dataSeries.push({name: x, data: values});
    };
        
    lineChart = Highcharts.chart('container', {
        chart: {
            type: 'line'
        },
        title: {
            text: 'Test'
        },
        xAxis: {
            categories: dateList.sort(),
        },
        series: dataSeries
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
for (ref in urlsRef) {
    xmlhttp.open("GET", urlsRef[ref]["url"], false);
    xmlhttp.send();      
}
for (x in mainData) {
    mainData[x] = sortOnKeys(mainData[x]);
};

generateLineGraph(mainData);
generatePieGraph(mainData);

