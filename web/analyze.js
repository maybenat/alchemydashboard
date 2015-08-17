function constructPage(query) {

    var json = $.getJSON("https://api.stackexchange.com/2.2/search?order=desc&sort=creation&tagged=" + query + "&site=stackoverflow&filter=!0XMmcqR_jvgPugN2xyvxzlLdy&key=wAaCCVnUr8E)MkHlSesT5A((", function() {})
    var twitt = $.get("api/" + encodeURIComponent(query)).success(function(data) {});

    console.log(json);
    var allStackData;
    var allTwittData, twAvg, sOAvg, joinedTweets, joinedStacks;
    var allTweets = [];
    var allArticles = [];
    var allLinks = [];
    var sendIn;
    var allSentiments = [];
    var textAnalyzed = [];
    var textAnalyzed2 = [];
    var taxonomy = [];
    var taxonomy2 = [];
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
                    allArticles[i].push(allStackData[i].title);
                    allLinks[i] = [];
                    allLinks[i].push(allStackData[i].link);
                })(i);
            }
            for (var j = 0; j < allArticles.length; j++) {
                (function(j) {
                    handleJsonRequests(j, allArticles[j], allLinks[j]);
                })(j);
            }


        });

    });





    function handleJsonRequests(index, id, id2) {
        var alchemized = $.getJSON("http://access.alchemyapi.com/calls/text/TextGetTextSentiment?text=" + id + "&apikey=85e62ad889b1b15314bb96cf6387592215231fc5&outputMode=json", function() {

        })


        alchemized.success(function() {
            if (isNaN(Number(alchemized.responseJSON.docSentiment.score))) {
                allSentiments.push({
                    id: id,
                    id2: id2,
                    sentiment: 0.01
                })
            } else {
                allSentiments.push({
                    id: id,
                    id2: id2,
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
                            newHTML2.push('<li class="list-group-item list-group-item"><h5><span>' + '<i class="fa fa-stack-overflow"></i><font color="black">&nbsp&nbsp' + allSentiments[i].id + '</font></span><br><a href=' + allSentiments[i].id2 + ' target="_blank"><center>View full text</a></center></br></div></h5></li>');
                            // sentColor2 = "info";
                        }
                        if (vally > 0.01) {
                            newHTML2.push('<li class="list-group-item list-group-item-success"><h5><span>' + '<i class="fa fa-stack-overflow"></i><font color="black">&nbsp&nbsp' + allSentiments[i].id + '</font></span><br><a href=' + allSentiments[i].id2 + ' target="_blank"><center>View full text</a></center></br></div></h5></li>');

                            //   sentColor2 = "success";
                        }
                        if (vally < -0.01) {
                            newHTML2.push('<li class="list-group-item list-group-item-danger"><h5><span>' + '<i class="fa fa-stack-overflow"></i><font color="black">&nbsp&nbsp' + allSentiments[i].id + '</font></span><br><a href=' + allSentiments[i].id2 + ' target="_blank"><center>View full text</a></center></br></div></h5></li>');

                            // sentColor2 = "danger";
                        }
                        joinedStacks = allSentiments[i].id.join();

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
                    backgroundColor: '#ffffff',

                    type: 'bubble',
                    zoomType: 'xy'
                },
                title: {
                    text: 'Radius = Sentiment'
                },
                credits: {
                    enabled: false
                },
                series: [{
                    name: 'Stack Overflow',
                    color: '#af8dc3',
                    data: dataCleaner2
                }, {
                    name: 'Twitter',
                    color: '#3d78dd',
                    data: dataCleaner
                }]
            });
            // $('#container3').highcharts({
            //     chart: {
            //         type: 'column',
            //         zoomType: 'xy'
            //     },
            //     title: {
            //         text: 'Area chart with negative values'
            //     },
            //     credits: {
            //         enabled: false
            //     },
            //     series: [{
            //         name: 'Stack Overflow',
            //         color: '#af8dc3',
            //         data: visualSentiments
            //     }, {
            //         name: 'Twitter',
            //         color: '#7fbf7b',
            //         data: visualSentimentsT
            //     }]
            // });
            $('#container3').highcharts({
                chart: {
                    backgroundColor: '#ffffff',

                    zoomType: 'xy'
                },
                title: {
                    text: 'Sentiment Spline'
                },
                credits: {
                    enabled: false
                },
                series: [{
                    name: 'Stack Overflow',
                    type: 'spline',
                    color: '#af8dc3',
                    data: visualSentiments
                }, {
                    name: 'Twitter',
                    type: 'spline',
                    color: '#3d78dd',
                    data: visualSentimentsT
                }]
            });
            twAvg = average(visualSentimentsT);
            sOAvg = average(visualSentiments);

            // $(function() {
            //     $('#container2').highcharts({
            //         chart: {
            //             type: 'column'
            //         },
            //         title: {
            //             text: 'Average Sentiment'
            //         },
            //         xAxis: {},
            //         credits: {
            //             enabled: false
            //         },
            //         series: [{
            //             name: 'Twitter',
            //             color: '#7fbf7b',
            //             data: [twAvg]
            //         }, {
            //             name: 'Stack Overflow',
            //             color: '#af8dc3',
            //             data: [sOAvg]
            //         }]
            //     });
            // });


            $('#container2').highcharts({
                chart: {

                    backgroundColor: '#ffffff',
                    type: 'column',
                    zoomType: 'xy'
                },
                title: {
                    text: 'Average Sentiment'
                },

                legend: {
                    enabled: false
                },
                xAxis: {
                    categories: true
                },

                plotOptions: {
                    series: {
                        borderWidth: 0,
                        dataLabels: {
                            enabled: false
                        }
                    }
                },

                series: [{
                    name: 'Average Sentiment:',
                    colorByPoint: true,
                    data: [{
                        name: 'Twitter',
                        color: '#af8dc3',
                        y: twAvg,
                        drilldown: 'twitter'
                    }, {
                        name: 'stackoverflow',
                        y: sOAvg,
                        color: '#3d78dd',
                        drilldown: 'stackoverflow'
                    }]
                }],
                drilldown: {
                    series: [{
                        id: 'twitter',
                        data: dataCleaner
                    }, {
                        id: 'stackoverflow',
                        data: dataCleaner2
                    }]
                }
            });

            if (flag === false) {
                var alchemizedEntities = $.getJSON("http://access.alchemyapi.com/calls/text/TextGetCombinedData?text=" + joinedTweets + "&apikey=85e62ad889b1b15314bb96cf6387592215231fc5&outputMode=json", function() {})
                alchemizedEntities.complete(function() {
                    flag = true;
                    if (textAnalyzed.length < 3) {

                        textAnalyzed.push('<li class="list-group-item list-group-item-warning"><font color="black"><h4>' + 'Keyword : <b><i>' + alchemizedEntities.responseJSON.keywords[0].text + '</b></i><br> Relevance=<b><i> ' + alchemizedEntities.responseJSON.keywords[0].relevance + '</i></b></div></font></h5></li>');
                        textAnalyzed.push('<li class="list-group-item list-group-item-warning"><font color="black"><h4>' + 'Keyword : <b><i>' + alchemizedEntities.responseJSON.keywords[1].text + '</b></i><br> Relevance=<b><i> ' + alchemizedEntities.responseJSON.keywords[1].relevance + '</i></b></div></font></h5></li>');
                        textAnalyzed.push('<li class="list-group-item list-group-item-warning"><font color="black"><h4>' + 'Keyword : <b><i>' + alchemizedEntities.responseJSON.keywords[2].text + '</b></i><br> Relevance=<b><i> ' + alchemizedEntities.responseJSON.keywords[2].relevance + '</i></b></div></font></h5></li>');

                        taxonomy.push('<li class="list-group-item list-group-item-warning"><font color="black"><h4>' + 'Grouping : <b><i>' + alchemizedEntities.responseJSON.taxonomy[0].label + '</b></i><br> Score=<b><i> ' + alchemizedEntities.responseJSON.taxonomy[0].score + '</i></b></div></font></h5></li>');
                        taxonomy.push('<li class="list-group-item list-group-item-warning"><font color="black"><h4>' + 'Grouping : <b><i>' + alchemizedEntities.responseJSON.taxonomy[1].label + '</b></i><br> Score=<b><i> ' + alchemizedEntities.responseJSON.taxonomy[1].score + '</i></b></div></font></h5></li>');
                        taxonomy.push('<li class="list-group-item list-group-item-warning"><font color="black"><h4>' + 'Grouping : <b><i>' + alchemizedEntities.responseJSON.taxonomy[2].label + '</b></i><br> Score=<b><i> ' + alchemizedEntities.responseJSON.taxonomy[2].score + '</i></b></div></font></h5></li>');


                    }
                    $("#ents1").html(textAnalyzed.join(""));
                    $("#ents2").html(taxonomy.join(""));
                })
            }
            var alchemizedEntities2 = $.getJSON("http://access.alchemyapi.com/calls/text/TextGetCombinedData?text=" + joinedStacks + "&apikey=85e62ad889b1b15314bb96cf6387592215231fc5&outputMode=json", function() {})
            alchemizedEntities2.complete(function() {
                if (textAnalyzed2.length < 3) {
                    textAnalyzed2.push('<li class="list-group-item list-group-item-info"><font color="black"><h4>' + 'Keyword : <b><i>' + alchemizedEntities2.responseJSON.keywords[0].text + '</b></i><br> Relevance=<b><i> ' + alchemizedEntities2.responseJSON.keywords[0].relevance + '</i></b></div></font></h5></li>');
                    textAnalyzed2.push('<li class="list-group-item list-group-item-info"><font color="black"><h4>' + 'Keyword : <b><i>' + alchemizedEntities2.responseJSON.keywords[1].text + '</b></i><br> Relevance=<b><i> ' + alchemizedEntities2.responseJSON.keywords[1].relevance + '</i></b></div></font></h5></li>');

                    taxonomy2.push('<li class="list-group-item list-group-item-info"><font color="black"><h4>' + 'Grouping : <b><i>' + alchemizedEntities2.responseJSON.taxonomy[0].label + '</b></i><br> Score=<b><i> ' + alchemizedEntities2.responseJSON.taxonomy[0].score + '</i></b></div></font></h5></li>');
                    taxonomy2.push('<li class="list-group-item list-group-item-info"><font color="black"><h4>' + 'Grouping : <b><i>' + alchemizedEntities2.responseJSON.taxonomy[1].label + '</b></i><br> Score=<b><i> ' + alchemizedEntities2.responseJSON.taxonomy[1].score + '</i></b></div></font></h5></li>');
                    taxonomy2.push('<li class="list-group-item list-group-item-info"><font color="black"><h4>' + 'Grouping : <b><i>' + alchemizedEntities2.responseJSON.taxonomy[2].label + '</b></i><br> Score=<b><i> ' + alchemizedEntities2.responseJSON.taxonomy[2].score + '</i></b></div></font></h5></li>');

                }
                $("#ents3").html(textAnalyzed2.join(""));
                $("#ents4").html(taxonomy2.join(""));
            })
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
                            newHTML.push('<li class="list-group-item list-group-item"><h5><span>' + '<i class="fa fa-twitter"></i><font color="black">&nbsp&nbsp' + allTweetSentiments[i].id + '</font></span><br></div></h5></li>');
                            // sentColor2 = "info";
                        }
                        if (vally2 > 0.01) {
                            newHTML.push('<li class="list-group-item list-group-item-success"><h5><span>' + '<i class="fa fa-twitter"></i><font color="black">&nbsp&nbsp' + allTweetSentiments[i].id + '</font></span><br></div></h5></li>');

                            //   sentColor2 = "success";
                        }
                        if (vally2 < -0.01) {
                            newHTML.push('<li class="list-group-item list-group-item-danger"><h5><span>' + '<i class="fa fa-twitter"></i><font color="black">&nbsp&nbsp' + allTweetSentiments[i].id + '</font></span><br></div></h5></li>');

                            // sentColor2 = "danger";
                        }
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