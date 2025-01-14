import { httpFront } from "../instance"

async function getApplist(type: string) {
    return [{
        id: "1",
        icon: "https://gips3.baidu.com/it/u=3240403616,239190621&fm=3039&app=3039&f=PNG?w=1024&h=1024",
        name: "HM软件助手",
        version: "1.0.0",
        description: "软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍。",
        keywords: ["社交", "音乐"]
    }, {
        id: "2",
        icon: "https://gips3.baidu.com/it/u=3240403616,239190621&fm=3039&app=3039&f=PNG?w=1024&h=1024",
        name: "HM软件助手",
        version: "1.0.0",
        description: "软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍。",
        keywords: ["工具"]
    }, {
        id: "3",
        icon: "https://gips3.baidu.com/it/u=3240403616,239190621&fm=3039&app=3039&f=PNG?w=1024&h=1024",
        name: "HM软件助手",
        version: "1.0.0",
        description: "软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍。",
        keywords: ["社交"]
    }, {
        id: "4",
        icon: "https://gips3.baidu.com/it/u=3240403616,239190621&fm=3039&app=3039&f=PNG?w=1024&h=1024",
        name: "HM软件助手",
        version: "1.0.0",
        description: "软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍。",
        keywords: ["音乐"]
    }, {
        id: "5",
        icon: "https://gips3.baidu.com/it/u=3240403616,239190621&fm=3039&app=3039&f=PNG?w=1024&h=1024",
        name: "HM软件助手",
        version: "1.0.0",
        description: "软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍。",
        keywords: ["视频"]
    }]
    const response = await httpFront.post("/log/app/list", { type })
    return response
}

async function getMessageList(type: string) {
    return [{
        id: "1",
        icon: "https://gips3.baidu.com/it/u=3240403616,239190621&fm=3039&app=3039&f=PNG?w=1024&h=1024",
        name: "HM软件助手",
        version: "1.0.0",
        description: "软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍软件介绍。",
        keywords: ["社交", "音乐"]
    }]
    const response = await httpFront.post("/log/message/list", { type })
    return response
}

export default {
    getApplist,
    getMessageList,
}
