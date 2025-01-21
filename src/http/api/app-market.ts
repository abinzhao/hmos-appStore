import { httpFront } from "../instance"

async function getApplist(data: any) {
    /*return [{
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
    }]*/
    const response = await httpFront.post("/api/get-apps", data)
    return response.data
}

async function getAdminApps(data: any) {
    const response = await httpFront.post("/api/admin/apps", data)
    return response.data
}

async function getUserApps(data: any) {
    const response = await httpFront.post("/api/user/apps", data)
    return response.data
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

async function setApp(data: any) {
    const response = await httpFront.post("/api/add-app", data)
    return response
}

async function updateApp(data: any) {
    const response = await httpFront.post("/api/admin/update-app", data)
    return response
}

async function updateUserApp(data: any) {
    const response = await httpFront.post("/api/user/update-app", data)
    return response
}

async function removeApp(id: any) {
    const response = await httpFront.post("/api/delete-app", { id })
    return response
}

async function getAppDetail(id: any) {
    const response = await httpFront.get("/api/get-app", id)
    return response
}

async function getAppTotal() {
    const response = await httpFront.get("/api/get-app-total")
    return response
}
async function getAppInstallTotal() {
    const response = await httpFront.get("/api/get-app-install-total")
    return response
}


async function downloadFile(type, packageName, filename, id) {
    try {
      const response = await httpFront.get(`/api/download/${id}/${type}/${packageName}/${filename}`);
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename); // set the download attribute
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading the file:', error);
    }
}

async function getAppInfolist(data: any) {
    const response = await httpFront.post("/api/get-app-infos", data)
    return response.data
}

export default {
    getApplist,
    getMessageList,
    setApp,
    updateApp,
    removeApp,
    getAppDetail,
    downloadFile,
    getAppTotal,
    getAppInstallTotal,
    getAdminApps,
    getAppInfolist,
    getUserApps,
    updateUserApp
}
