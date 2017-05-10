(function () {
  var async = require('async');
  var fs = require('fs');

  var nbaApi = require('../src/apis/nba.api');

  var outputFolderIndex = process.argv.indexOf('-o') + 1;
  var outputFolder = null;
  if (outputFolderIndex !== 0) {
    outputFolder = process.argv[outputFolderIndex];
    if (!fs.existsSync(outputFolder)){
      fs.mkdirSync(outputFolder);
    }
    console.log('Output Folder: ' + outputFolder);
  }

  var numSeasonsIndex = process.argv.indexOf('-s') + 1;
  var numSeasons = 20;
  if (numSeasonsIndex !== 0) {
    numSeasons = process.argv[numSeasonsIndex];
    console.log('Number of Seasons to Collect: ' + numSeasons);
  }

  var startYearIndex = process.argv.indexOf('-y') + 1;
  var startYear = new Date(Date.now()).getFullYear();
  if (startYearIndex !== 0) {
    startYear = process.argv[startYearIndex];
    console.log('Start year: ' + startYear);
  }

  var ids = [];
  var seasons = [];
  var data = {
    abbreviationToIdMap: {}
  };
  var numRequestsSent = 0;

  setup().then(function () {
    async.eachSeries(seasons, function (s, nextSeason) {
      console.log('Season: ' + s);
      data.season = s;

      async.eachSeries(ids, function (id, nextId) {
        console.log('\tTeam: ' + id);
        data[id] = {};

        var seasonTypes = [
          'Regular Season',
          'Playoffs'
        ];

        async.eachSeries(seasonTypes, function (type, nextSeasonType) {
          console.log('\t\t' + type);
          var typeKey = type.charAt(0).toLowerCase() + type.replace(' ','').substring(1);
          data[id][typeKey] = {};

          var gameLogParams = {
            TeamID: id,
            Season: s,
            SeasonType: type
          };

          var gameLogHeaders = [
            'TEAM_ABBREVIATION',
            'GAME_DATE',
            'MATCHUP',
            'WL',
            'FGM',
            'FGA',
            'FG3M',
            'FG3A',
            'FTM',
            'FTA',
            'PTS',
            'OREB',
            'DREB',
            'AST',
            'STL',
            'BLK',
            'BLKA',
            'PF',
            'PFD',
            'TOV'
          ];

          nbaApi.getGameLogs(gameLogParams, gameLogHeaders)
            .then(function (gameLogs) {
              numRequestsSent++;
              if (!gameLogs) {
                console.log('\t\t\tNo game log data for ' + type);
                return nextSeasonType();
              }

              console.log('\t\t\tGot ' + gameLogs.length + ' game logs!');
              if (!data.abbreviationToIdMap[gameLogs[0].teamAbbreviation]) {
                data.abbreviationToIdMap[gameLogs[0].teamAbbreviation] = id;
              }

              gameLogs.forEach(function (l) {
                delete l.teamAbbreviation;
              });

              data[id][typeKey].games = gameLogs;

              return nextSeasonType();
            })
            .catch(nextSeasonType);
        }, function (seasonTypeErr) {
          return nextId(seasonTypeErr);
        });
      }, function (idErr) {
        if (idErr) return nextSeason(idErr);
        if (!outputFolder) return nextSeason(idErr);

        var outputFile = outputFolder + '/nba_games_' + s + '.json';
        fs.writeFile(outputFile, JSON.stringify(data, null, '\t'), function(err) {
          if(err) {
            console.error('Error occurred when writing data to file!');
            return console.error(err);
          }

          console.log(outputFile + ' was saved!');
          data = {
            abbreviationToIdMap: {}
          };

          return nextSeason(idErr);
        });
      });
    }, function (seasonErr) {
      console.log('Number of requests sent: ' + numRequestsSent);
      if (seasonErr) {
        console.error(seasonErr);
      }
    });
  }).catch(console.error);

  function setup() {
    return new Promise(function(resolve, reject) {
      console.log('Start setup');
      nbaApi.getTeamStats(null, ['TEAM_ID'])
        .then(function (statsObj) {
          numRequestsSent++;
          ids = statsObj.map(function (s) { return s.teamId; });
          console.log('Got Team Ids');
          console.log(ids);

          seasons = buildSeasonsArray();
          console.log('Got Seasons');
          console.log(seasons);

          return resolve();
        })
        .catch(reject);
    });

    function buildSeasonsArray() {
      var ret = [];

      for (var i = 0; i < numSeasons; i++) {
        var key = (startYear - 1).toString() + '-' + startYear.toString().substring(2);
        ret.push(key);
        startYear--;
      }

      return ret;
    }
  }
}());