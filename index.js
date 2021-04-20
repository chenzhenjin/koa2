/*
 * @Author: chenzhenjin
 * @email: BrotherStudy@163.com
 * @Date: 2020-09-23 17:26:03
 * @LastEditTime: 2021-04-20 12:55:57
 * @Descripttion: 模块描述
 */
const Koa = require("koa");
const app = new Koa();
const path = require("path");
const static = require("koa-static");
const bodyParse = require("koa-bodyparser");
const router = require("./router");
const cross = require("koa2-cors");

app.use(
  cross({
    exposeHeaders: ["WWW-Authenticate", "Server-Authorization", "Date"],
    maxAge: 100,
    credentials: true,
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "X-Custom-Header",
      "anonymous",
      "os-type",
      "securitycode",
      "securityKey",
      "token",
      "source"
    ]
  })
);
app.use(bodyParse());
let staticPath = "./page";
app.use(static(path.join(__dirname, staticPath)));

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
  console.log("back-end running");
});
