
const Koa = require('koa');
const Router = require('koa-router');
const router = new Router();
const app = new Koa();
const CrawlServer = require("./Crawl")
const DBUtils = require("./DB")
const uploadFile2S3 = require("./S3Server")
const Queue = require("./ArrayQueue")
const mapLimit = require("./Multi")

app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  if (ctx.method == 'OPTIONS') {
    ctx.body = 200;
  } else {
    await next(); 
  }
});



router.get('/web_results_checker', async ctx => {
  let name = ctx.query.name.toLowerCase();

  let info = await DBUtils.getSocialInfo(name)
  if (!info) {
    try {
      info = await CrawlServer.crawl(name)
      console.log(info);
      DBUtils.updateSocialInfo(info, name)
    } catch (error) {
      //todo  上報異常 
    }
  }

  ctx.response.body = JSON.stringify(info)
})

app.use(router.routes());

// 监听端口
app.listen(3001, () => {
  console.log("服务器已启动，http://localhost:3001");
})

