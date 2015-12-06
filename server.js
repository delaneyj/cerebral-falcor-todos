/* eslint no-console: 0 */
import path from 'path';
import express from 'express';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import config from './webpack.config.js';

const isDeveloping  = process.env.NODE_ENV !== 'production';
const port          = isDeveloping ? 3000 : process.env.PORT;

const falcorExpress = require('falcor-express');
const Router        = require('falcor-router');
const _             = require('underscore');
let data            = require('./app/falcor_cache');

const app = express();

if (isDeveloping) {
  const compiler = webpack(config);
  const middleware = webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    contentBase: 'src',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  });

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));

  function buildPathSetResults(resource, index, attrs) {
    const attributes = _.isArray(attrs) ? attrs : [attrs];

    return _.reduce(attributes, (memo,attr) => {
      return memo.concat({
        path:  [resource, index, attr],
        value: data[resource][index][attr]
      });
    }, []);
  }

  app.use('/model.json', falcorExpress.dataSourceRoute(function (req, res) {
    return new Router([
      {
        route: "todos.length",
        get: function(pathSet) {
          const [resource, attrs] = pathSet;

          return {
            path: [resource], value: data[resource].length
          };
        }
      },
      {
        route: "todosById[{integers:indices}]['title']",
        get: function(pathSet) {
          const [resource, range, attrs] = pathSet;

          return _.flatten(_.map(pathSet.indices, (index) => {
            return buildPathSetResults(resource, index, attrs);
          }));
        }
      },
      // {
      //   route: "todos[{integers:todoIds}]['user']['first_name', 'last_name']",
      //   get: function(pathSet) {
      //     return {
      //     };
      //   }
      // }
    ]);
  }));

  app.get('*', function response(req, res) {
    res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'dist/index.html')));
    res.end();
  });
  
} else {
  app.use(express.static(__dirname + '/dist'));
  app.get('*', function response(req, res) {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
  });
}

app.listen(port, '127.0.0.1', function onStart(err) {
  if (err) {
    console.log(err);
  }
  console.info('==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
});
