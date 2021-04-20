/*
 * @Author: chenzhenjin
 * @email: BrotherStudy@163.com
 * @Date: 2020-09-23 17:26:03
 * @LastEditTime: 2021-04-20 11:55:27
 * @Descripttion: 模块描述
 */
const Router = require("koa-router");
const exportList = require("../excel/index").exportList
let reactMovie = new Router();
let uniapp = new Router();
let router = new Router();
let trq = new Router();
let rqb = new Router();
const axios = require("axios");
reactMovie
  .get("history", async (ctx) => {
    let connect = await swichReactDB(ctx.url.split("/")[1]);
    let data = await findAll();
    console.log("findAll get", data);
    ctx.body = data;
  })
  .post("history/add", async (ctx) => {
    let connect = await swichReactDB(ctx.url.split("/")[1]);
    let data = ctx.request.body;
    let res = await insertOne(data);
    ctx.body = res;
  })
  .post("history/clean", async (ctx) => {
    let connect = await swichReactDB(ctx.url.split("/")[1]);
    let res = await cleanAll();
    ctx.body = res;
  })
  .get("movie/:type", async (ctx) => {
    let connect = await swichReactDB(ctx.url.split("/")[1]);
    let query = { count: +ctx.query.count, start: +ctx.query.start };
    let type = ctx.params.type;
    let res = {};
    if (type === "search_result") {
      res = await movieRegexFind(ctx.query.search, query);
    } else {
      res = await movieTypeFind(type, query);
    }
    // let url = ctx.url.split('/')[2] + '/' + ctx.url.split('/')[3]
    // let data = await moivesAxios(url, "get")
    // console.log("movie/in_theaters", data)
    // let res = await movieInsert(data.subjects)
    ctx.body = res;
  });

uniapp
  .get("list", async (ctx) => {
    console.log("uniapp query", JSON.stringify(ctx.query, null, 4));
    ctx.body = [{ home: "123", about: "456" }];
  })
  .post("add", async (ctx) => {
    console.log("uniapp add", JSON.stringify(ctx.request.body, null, 4));
    ctx.body = "已加入";
  });

trq.get("copyClickTask", async (ctx) => {
  console.log("有请求");
  ctx.body = {
    code: 200,
    data: {
      planParams: [
        {
          id: 3426,
          click: 10,
          incrementType: 7,
          keyword: "华为",
          executeType: 5,
          startDate: "2020-10-23",
          endDate: "2020-10-23",
          hourParams: [
            {
              hour: "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,2,2,1,1,0",
              date: "2020-10-23",
            },
          ],
          clickTotal: 10,
        },
      ],
      goodsTitle:
        "【限时享6期免息】Huawei/华为P40 Pro+ 5G 徕卡五摄 100倍变焦陶瓷工艺p40pro+ 5g华为手机华为官方旗舰店",
      shopId: "150920153",
      shopName: "华为官方旗舰店",
      skuUrl: "https://detail.tmall.com/item.htm?id=617308828648",
      wtUrl: "123",
      stayType: 2,
      compare: 0,
      pvUv: 1,
      visitOther: 0,
      visitComment: 1,
      pttqzType: 6,
      maleRatio: 30,
    },
    msg: null,
  };
});

rqb.post("exprotToExcel", async (ctx) => {
  console.log("导出excel有请求");
  const config = [
    {
      name: "userid",
      title: "用户ID",
    }
  ];
  const listData = [
    {
      userid: '1',
    },
    {
      userid: '2'
    }
  ]
  exportList(ctx, config, listData, 'test')
});

router.use("/react/", reactMovie.routes(), reactMovie.allowedMethods());
router.use("/uniapp/", uniapp.routes(), uniapp.allowedMethods());
router.use("/trq/", trq.routes(), trq.allowedMethods());
router.use("/rqb/", rqb.routes(), rqb.allowedMethods());

module.exports = router;
