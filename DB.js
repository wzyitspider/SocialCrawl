
const MongoClient = require('mongodb').MongoClient;
var MG_URL = 'mongodb://localhost:27017/finder';
const fs = require("fs");
let dbConfig = null;

class DBUtils {

    static getInstance() {
        if (!DBUtils.instance) {
            DBUtils.instance = new DBUtils()
        }
        return DBUtils.instance
    }

    constructor() {
        this.connect()
    }

    connect() {
        return new Promise(async (resolve, reject) => {
            if (!this.dbClient) {
                console.log("db starting!")
                if (process.env.DOCKER_ENV === 'prod' || process.env.DOCKER_ENV === 'test') {
                    const tarsConfig = new TarsConfig()

                    dbConfig = await tarsConfig.loadConfig("env.json", { format: tarsConfig.FORMAT.JSON }).catch(err => {
                        console.log("load tarsConfig:" + err)
                    })

                    if (!dbConfig) {
                        dbConfig = await tarsConfig.loadConfig("env.json", { format: tarsConfig.FORMAT.JSON }).catch(err => {
                            console.log("load tarsConfig:" + err)
                        })
                    }


                    console.log("load remote config succ")

                } else {
                    dbConfig = await JSON.parse(fs.readFileSync('../env.json', 'utf-8'))
                    console.log("load local config succ")
                }

                MongoClient.connect(dbConfig.DBURL, { useUnifiedTopology: true }, async (err, client) => {
                    if (err) {
                        console.log("db err!")
                        reject(err)
                    } else {
                        var db = client.db(dbConfig.DBNAME)
                        this.dbClient = db
                        console.log("db started!")
                        //这里可以进行远程一些调试
                        // db.collection("page_pdf_info").createIndexes({link:1}).then(re=>{
                        //     console.log("创建索引完成");
                        //  })
                        resolve(this.dbClient)
                    }
                })

            } else {
                resolve(this.dbClient)
            }
        })
    }

    getSocialInfo(name) {
        return this.connect().then(async db => db.collection("short_name_social_info").findOne({ short_name: name }))
    }

    updateSocialInfo(info,name) {
        return new Promise((resolve, reject) => {
            this.connect().then((db) => {
                db.collection("short_name_social_info").updateOne({ short_name: name },{$set:info}, { upsert: true }, function (err, result) {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(result)
                    }
                })
            })
        })
    }

}

module.exports = DBUtils.getInstance()