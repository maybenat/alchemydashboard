function constructPage(query) {

    var json = $.getJSON("https://api.stackexchange.com/2.2/search/excerpts?order=desc&sort=creation&title=" + query + "&key=wAaCCVnUr8E)MkHlSesT5A((&site=stackoverflow", function() {})

    var twitt = $.get("api/" + encodeURIComponent(query)).success(function(data) {});

    var allStackData;
    var allTwittData, twAvg, sOAvg, joinedTweets, joinedStacks;
    var allTweets = [];
    var allArticles = [];
    var sendIn;
    var allSentiments = [];
    var textAnalyzed = [];
    var allTweetSentiments = [];
    var flag = false;
    var visualSentimentsT = [];
    var visualSentiments = [];
    json.success(function() {
        twitt.success(function() {
            allStackData = json.responseJSON.items;
            allTwittData = twitt.responseJSON.statuses;


            for (var i = 0; i < allTwittData.length; i++) {
                (function(i) {
                    allTweets[i] = [];
                    allTweets[i].push(allTwittData[i].text);
                })(i);
            }




            for (var j = 0; j < allTweets.length; j++) {
                (function(j) {
                    handleTwitterRequests(j, allTweets[j]);
                })(j);

            }

            for (var i = 0; i < allStackData.length; i++) {
                (function(i) {
                    allArticles[i] = [];
                    allArticles[i].push(allStackData[i].body);
                })(i);
            }
            for (var j = 0; j < allArticles.length; j++) {
                (function(j) {
                    handleJsonRequests(j, allArticles[j]);
                })(j);
            }


        });

    });





    function handleJsonRequests(index, id) {


        var alchemized = $.getJSON("http://access.alchemyapi.com/calls/text/TextGetTextSentiment?text=" + id + "&apikey=85e62ad889b1b15314bb96cf6387592215231fc5&outputMode=json", function() {

        })

        alchemized.success(function() {
            if (isNaN(Number(alchemized.responseJSON.docSentiment.score))) {
                allSentiments.push({
                    id: id,
                    sentiment: 0.01
                })
            } else {
                allSentiments.push({
                    id: id,
                    sentiment: parseFloat(alchemized.responseJSON.docSentiment.score)
                });
                visualSentiments.push(parseFloat(alchemized.responseJSON.docSentiment.score));

                var newHTML2 = [];
                for (var i = 0; i < allSentiments.length; i++) {
                    (function(i) {

                        var vally = allSentiments[i].sentiment;
                        var sentColor = "green";
                        if (vally === undefined || vally === null) {
                            vally = 0.001
                        }
                        if (vally <= 0.01 && vally >= -0.01) {
                            sentColor = "grey";
                        }
                        if (vally > 0.01) {
                            sentColor = "green";
                        }
                        if (vally < -0.01) {
                            sentColor = "red";
                        }
                        newHTML2.push('<p><span>' + '<i class="fa fa-stack-overflow"></i>+<font color =' + sentColor + '>' + allSentiments[i].id + '</font></span><br></p>');
                    })(i);

                }
                $("#MyEdit2").html(newHTML2.join(""));
            }
            var dataCleaner = [];
            visualSentimentsT = unique(visualSentimentsT);

            for (var i = 0; i < visualSentimentsT.length; i++) {
                var formatted = [visualSentimentsT[i], visualSentimentsT[i]];
                dataCleaner.push(formatted);
            }

            var dataCleaner2 = [];
            visualSentiments = unique(visualSentiments);

            for (var i = 0; i < visualSentiments.length; i++) {
                var formatted = [visualSentiments[i], visualSentiments[i]];
                dataCleaner2.push(formatted);
            }

            $('#container').highcharts({
                chart: {
                    type: 'bubble',
                    zoomType: 'xy'
                },
                title: {
                    text: 'Area chart with negative values'
                },
                credits: {
                    enabled: false
                },
                series: [{
                    name: 'Stack Overflow',
                    data: dataCleaner2
                }, {
                    name: 'Twitter',
                    data: dataCleaner
                }]
            });
            twAvg = average(visualSentimentsT);
            sOAvg = average(visualSentiments);
            $(function() {
                $('#container2').highcharts({
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: 'Average Sentiment'
                    },
                    xAxis: {},
                    credits: {
                        enabled: false
                    },
                    series: [{
                        name: 'Twitter',
                        data: [twAvg]
                    }, {
                        name: 'Stack Overflow',
                        data: [sOAvg]
                    }]
                });
            });
            if (flag === false) {
                var alchemizedEntities = $.getJSON("http://access.alchemyapi.com/calls/text/TextGetCombinedData?text=" + joinedTweets + "&apikey=85e62ad889b1b15314bb96cf6387592215231fc5&outputMode=json", function() {})
                alchemizedEntities.complete(function() {
                    flag = true;
                    textAnalyzed.push('<span>' + '<i class="fa fa-check"></i>+<font color =' + "green" + '>' + alchemizedEntities.responseJSON.keywords[0].text + '</font></span><br>');
                    textAnalyzed.push('<span>' + '<i class="fa fa-check"></i>+<font color =' + "green" + '>' + alchemizedEntities.responseJSON.keywords[1].text + '</font></span><br>');
                    textAnalyzed.push('<span>' + '<i class="fa fa-check"></i>+<font color =' + "green" + '>' + alchemizedEntities.responseJSON.keywords[2].text + '</font></span><br>');

                    $("#ents1").html(textAnalyzed.join(""));
                })
            }
        });

    };


    function handleTwitterRequests(index, id) {
        var alchemized2 = $.getJSON("http://access.alchemyapi.com/calls/text/TextGetTextSentiment?text=" + id + "&apikey=85e62ad889b1b15314bb96cf6387592215231fc5&outputMode=json", function() {

        })
        alchemized2.success(function() {
            if (isNaN(parseFloat(alchemized2.responseJSON.docSentiment.score))) {
                allTweetSentiments.push({
                    id: id,
                    sentiment: 0.0001
                })
            } else {
                allTweetSentiments.push({
                    id: id,
                    sentiment: parseFloat(alchemized2.responseJSON.docSentiment.score)
                });
                visualSentimentsT.push(parseFloat(alchemized2.responseJSON.docSentiment.score));

                var newHTML = [];
                for (var i = 0; i < allTweetSentiments.length; i++) {
                    (function(i) {
                        var vally2 = allTweetSentiments[i].sentiment;
                        var sentColor2 = "green";
                        if (vally2 === undefined || vally2 === null) {
                            vally2 = 0.001
                        }
                        if (vally2 <= 0.01 && vally2 >= -0.01) {
                            sentColor2 = "grey";
                        }
                        if (vally2 > 0.01) {
                            sentColor2 = "green";
                        }
                        if (vally2 < -0.01) {
                            sentColor2 = "red";
                        }
                        newHTML.push('<p><span>' + '<i class="fa fa-twitter"></i>+<font color =' + sentColor2 + '>' + allTweetSentiments[i].id + '</font></span><br></div></p>');
                        joinedTweets = allTweetSentiments[i].id.join();
                    })(i);
                }
                $("#MyEdit").html(newHTML.join(""));

            }
        })

    };

};


function average(array) {
    var total = 0;
    for (var i = 0; i < array.length; i++) {
        total += array[i];
    }
    return avg = total / array.length;
}

//When we have multiple tweets come in at a time. 
function unique(origArr) {
    var newArr = [],
        origLen = origArr.length,
        found, x, y;

    for (x = 0; x < origLen; x++) {
        found = undefined;
        for (y = 0; y < newArr.length; y++) {
            if (origArr[x] === newArr[y]) {
                found = true;
                break;
            }
        }
        if (!found) {
            newArr.push(origArr[x]);
        }
    }
    return newArr;
}