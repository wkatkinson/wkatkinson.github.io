(function () {
  var myConnector = tableau.makeConnector();

  $.ajaxSetup({
    headers: {'Authorization': "Basic " + btoa("da9c882d363a5f884e6bd7bb8f5cae5f" + ":" + "")},
  })

  myConnector.getSchema = function (schemaCallback) {
    var cols = [{
        id: "Date",
        dataType: tableau.dataTypeEnum.datetime
    }, {
        id: "Sponsor",
        dataType: tableau.dataTypeEnum.string
    }, {
        id: "Pageviews",
        dataType: tableau.dataTypeEnum.int
    }];

    var tableSchema = {
      id: "Sponsor Pageviews Mixpanel",
      columns: cols
    };

    schemaCallback([tableSchema]);
  };

  myConnector.getData = function(table, doneCallback) {
    // var startDate = prompt('What start date (YYYY-MM-DD)?');
    // var endDate = prompt('What end date (YYY-MM-DD)?');
    // var eventType = prompt('What event type do you want to query? (Pageview, Click, Impression)');
    // var eventProperty = prompt('What Property do you want to group by? ()' );

    var yesterday = new Date();
    var dd = yesterday.getDate() -1;
    var mm = yesterday.getMonth() + 1; //January is 0!
    var yyyy = yesterday.getFullYear();

    if (dd < 10) {
      dd = '0' + dd;
    }

    if (mm < 10) {
      mm = '0' + mm;
    }

    yesterday = yyyy + '-' + mm + '-' + dd;

    // $.get('https://mixpanel.com/api/2.0/segmentation/?from_date=' + startDate + '&to_date=' + endDate + '&event=' + eventType + '&on=properties%5B"' + eventProperty + '"%5D&limit=2000',

    $.get('https://mixpanel.com/api/2.0/segmentation/?from_date=2019-01-01&to_date=' + yesterday + '&event=Pageview&on=properties%5B"Article Sponsor"%5D&limit=2000',
     function(resp) {
      console.log(resp);
      var feat = resp,
        tableData = [];
        window.resp=resp;


      for (var i = 0; i < Object.keys(feat.data.values).length; i++) {

        console.log(Object.keys(feat.data.values)[i]);

        var sponsor = Object.keys(feat.data.values)[i];

        for (var j=0; j < Object.keys(Object.values(feat.data.series)).length; j++) {

          console.log(Object.keys(Object.values(feat.data.values)[i])[j] + ":" + Object.values(Object.values(feat.data.values)[i])[j]);
          
          var date = Object.keys(Object.values(feat.data.values)[i])[j];
          var viewcnt = Object.values(Object.values(feat.data.values)[i])[j];
          console.log(viewcnt);

          tableData.push({
          "Date":date,
          "Sponsor":sponsor,
          "Pageviews":viewcnt
        });

        }

      }

      table.appendRows(tableData);
      doneCallback();
      }, "json");
  }

  tableau.registerConnector(myConnector);

  $(document).ready(function () {
    $("#submitButton").click(function () {
      tableau.connectionName = "Mixpanel";
      tableau.submit();
    });
  });
})();
