import forOwn = require("lodash/forOwn");
import https = require("https");
import http  = require("http");

export const getRequest = function (path : string, data : any = {}, params: any = { port: 80, parseJson: false}) {
  let method = (path.indexOf('https') == 0) && https || http;
  let pathMap = path.split('?');
  let queryBuffer = pathMap.splice(1,1);
  let pathChunks = pathMap[0].split('/');

  forOwn(data, (v,k) => {
    queryBuffer.push(`${k}=${encodeURIComponent(v)}`);
  });

  let request = {
    host  : pathChunks[2],
    port  : params.port,
    path  : `/${pathChunks.slice(3).join('/')}?${queryBuffer.join('&')}`,
    method: 'GET'
  };

  return new Promise((resolve, reject) => {
    try {
      let req = method.request(request, resp => {
        let output = [];
        resp.setEncoding('utf8');

        resp.on('data', function (chunk) {
          output.push(chunk);
        });

        resp.on('end', function () {

          if (params.parseJson) {
            try {
              resolve(JSON.parse(output.join('')));
            } catch(err) {
              reject(err);
            }
          } else {
            resolve(output.join(''));
          }

        });


      }).end();
    } catch(err) {
      reject(err);
    }
  });
};
