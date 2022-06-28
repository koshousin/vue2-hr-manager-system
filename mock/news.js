const Mock = require('mock');

module.exports = [
  {
    url: "/vue-admin-template/table/list",
    type: "get",
    response: (config) => {
      return {
        code: 20000,
        data: ['news 1','news 2','news 3']
      }
    },
  },
];