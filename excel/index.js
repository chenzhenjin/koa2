const nodeExcel = require('node-xlsx')
const urlencode = require('urlencode')
function exportList(ctx, config, listData, excelName) {
  let excelData = []; // [[th], [td], [td]]
  excelData.push(
    config.map((item) => {
      return item.title;
    })
  );

  listData.forEach((list) => {
    excelData.push(
      config.map((item) => {
        const value = list[item.name];
        // 不一定要有value， 因为可能是自由组合的value
        return (item.format && item.format(value, list)) || value;
      })
    );
  });

  let buffer = nodeExcel.build([{ name: excelName, data: excelData }]);
  ctx.set("Content-Type", "application/octet-stream");
  // ctx.request.headers['user-agent']
  let name = urlencode(excelName + "_人气宝" + +new Date() + ".xlsx", "utf-8");
  ctx.set("Content-Disposition", "attachment; filename="+ name);
  // ctx.set("Content-Disposition", "attachment; filename="+ (+new Date()) + '.xlsx');
  ctx.body = buffer;
}

module.exports = {
  exportList
}