const superagent = require("superagent")
const puppeteer = require("puppeteer");
var MongoClient = require('mongodb').MongoClient;
const { uploadBase6432S3, uploadUrl2S3, uploadFile2S3 } = require("./S3Server");
var MG_URL = 'mongodb://localhost:27017/finder';
const Queue = require("./ArrayQueue")
const mapLimit = require("./Multi")

let browser;
let short_name_count_social ;
class CrawlServer {
 

    static getInstance() {
        if (!CrawlServer.instance) {
            CrawlServer.instance = new CrawlServer()
        }
        return CrawlServer.instance
    }

    constructor() {
        //初始化处理器
        this.init()
    }

    crawl(name) {

        return this.getBrowser().then(async browser => {
            let page = await this.getPage(browser)

            await page.goto("https://peekyou.com/" + name.replace(" ", "_"), { timeout: 0 });
            await page.waitForSelector("#facebook_results_list");
            await page.waitForTimeout(3000)

            const re0 = page.$$("#facebook_results_list ul li")
            const re1 = page.$$("#instagram_results_list ul li")
            const re2 = page.$$("#myspace_results_list ul li")
            const re3 = page.$$("#tiktok_results_list ul li")
            const re4 = page.$$("#twitter_results_list ul li")
            const re5 = page.$$("#pinterest_results_list ul li")
            const re6 = page.$$("#myspace_results_list ul li")
            const re7 = page.$$("#flickr_results_list ul li")

            return await Promise.all([re0, re1, re2, re3, re4, re5, re6, re7])
                .then(async res => Promise.all(res.map((ele, i) => getResults(ele, i))))
                .then(re => {
                    //不需要等待页面关闭
                    page.close()
                    return {
                        short_name: name,
                        facebook_results: re[0],
                        instagram_results: re[1],
                        myspace_results: re[2],
                        tiktok_results: re[3],
                        twitter_results: re[4],
                        pinterest_results: re[5],
                        myspace_results: re[6],
                        flickr_results: re[7]
                    }
                })
        })

        async function getResults(elementsList, i) {
            console.log(elementsList.length);

            return await Promise.all(
                elementsList.map((element, j) => new Promise(async (resolve, reject) => {
                    try {
                        let nameElement = await element.$eval(".user_info .user_line1 a", ele => { return { href: ele.href, text: ele.text } })
                        // console.log(index + "----------------" + name.text.trim() + "::" + name.href);
                        let src = await element.$eval(".user_pic img", ele => ele.src)
                        let base64;
                        if (src.startsWith("https://") || src.startsWith("http://")) {
                            // url = await uploadUrl2S3(src,name+"-"+i+"-"+j+".png")
                            base64 = await img2Base64(src)
                        } else {
                            // url = await uploadBase6432S3(src,name+"-"+i+"-"+j+".png")
                            base64 = src;
                        }

                        // resolve({ href: nameElement.href, text: nameElement.text.trim(), url:url })
                        resolve({ href: nameElement.href, text: nameElement.text.trim(), base64 })
                    } catch (error) {

                        resolve()
                    }
                }))).then(eles => {

                    return eles.filter(ele => ele)
                })
        }
    }

    async getBrowser() {
        if (!browser) {
            browser = await puppeteer.launch({
                args: ['--lang=en-US'],
                headless: false,
                timeout: 40 * 1000,
            })
        }
        return browser;
    }

    async getPage(browser) {
        let page = await browser.newPage()
        page.setViewport({ width: 1920, height: 1280 }); //设置视窗大小
        page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');
        return page;
    }

    static async url2Base64(url) {
        return await new Promise(async function (resolve, reject) {
            await superagent.get(url).buffer(true).parse((res) => {
                let buffer = [];
                res.on('data', (chunk) => {
                    buffer.push(chunk);
                });
                res.on('end', () => {
                    const data = Buffer.concat(buffer);
                    const base64Img = data.toString('base64');
                    resolve(base64Img)
                });
            });
        })
    }

    async init() {
        await MongoClient
            .connect(MG_URL, { useNewUrlParser: true })
            .then(async db => {
                var dbo = db.db("finder");
        
                short_name_count_social = dbo.collection("short_name_count_social");
            })
    }
}


const img2Base64 =
   async url => await new Promise(async function (resolve, reject) {
        await superagent.get(url).buffer(true).parse((res) => {
            let buffer = [];
            res.on('data', (chunk) => {
                buffer.push(chunk);
            });
            res.on('end', () => {
                const data = Buffer.concat(buffer);
                const base64Img = data.toString('base64');
                resolve(base64Img)
            }
            );
        });
    })



module.exports = CrawlServer.getInstance()


