import { responseSuccessFormat, responseErrorFormat } from "./utils";
import * as fs from 'fs';
import * as path from 'path';
//  读取文件初始化数据
const appData = JSON.parse(fs.readFileSync(path.resolve('./mock/data/app.json'), 'utf8'));
const pageData = JSON.parse(fs.readFileSync(path.resolve('./mock/data/page.json'), 'utf8'));
const moduleData = JSON.parse(fs.readFileSync(path.resolve('./mock/data/module.json'), 'utf8'));

// 创建模拟数据库
const mockDatabase = {
  app: appData,
  page: pageData,
  module: moduleData
};
// 定义API路由配置
export default {
  // GET，返回应用列表的数据
  "POST /web_bp_api/app/list": responseSuccessFormat(mockDatabase.app),
  // POST，添加一个新的应用，并将新数据写入app.json文件
  "POST /web_bp_api/app/add": (req: any) => {
    console.log(req.body)
    const model = mockDatabase.app.reduce((prev: { id: number; }, curr: { id: number; }) => {
      return prev.id > curr.id ? prev : curr
    })
    console.log(model.id)
    const newData = req.body; // 接收到的数据包含应用信息
    newData.id = parseInt(model.id) + 1;
    newData.createTime = new Date().toLocaleString();
    newData.updateTime = "";
    mockDatabase.app.push(newData); // 将新数据添加到应用列表
    fs.writeFileSync(path.resolve('./mock/data/app.json'), JSON.stringify(mockDatabase.app, null, 2), 'utf8');
    return responseSuccessFormat(newData); // 返回添加的应用数据
  },
  //DELETE,根据提供的ID删除一个应用，并更新app.json文件
  "POST /web_bp_api/app/delete": (req: any) => {
    console.log(req.body)
    const id = req.body.id;
    // 根据ID在应用列表中查找对应项
    const index = mockDatabase.app.findIndex((item: { id: number; }) => item.id === parseInt(id));
    if (index !== -1) {
      mockDatabase.app.splice(index, 1); // 从列表中删除该项
      fs.writeFileSync(path.resolve('./mock/data/app.json'), JSON.stringify(mockDatabase.app, null, 2), 'utf8');
      return responseSuccessFormat({ deletedId: id });
    } else {
      return { status: 404, message: '未找到指定ID的应用' };
    }
  },

  // PUT,根据提供的ID更新一个应用，并更新app.json文件
  "POST /web_bp_api/app/update": (req: any) => {
    console.log(req.body)
    const id = req.body.id;
    const newData = req.body.updatedData;
    newData.updateTime = new Date().toLocaleString();
    const index = mockDatabase.app.findIndex((item: { id: number; }) => item.id === parseInt(id));
    if (index !== -1) {
      mockDatabase.app[index] = { ...mockDatabase.app[index], ...newData };
      // 更新后，将更新后的数据写回文件
      fs.writeFileSync(path.resolve('./mock/data/app.json'), JSON.stringify(mockDatabase.app, null, 2), 'utf8');
      return responseSuccessFormat(mockDatabase.app[index]);
    } else {
      return { status: 404, message: '未找到指定ID的应用' };
    }
  },
  "POST /web_bp_api/page/list": responseSuccessFormat(mockDatabase.page),
  "POST /web_bp_api/page/add": (req: any) => {

   // const newData = req.body; // 接收到的数据包含页面信息

   console.log(req.body)
   const model = mockDatabase.page.reduce((prev: { id: number; }, curr: { id: number; }) => {
    return prev.id > curr.id ? prev : curr
   })
   console.log(model.id)
   const newData = req.body; // 接收到的数据包含应用信息
   newData.id = parseInt(model.id) + 1;
   newData.createTime = new Date().toLocaleString();
   newData.updateTime = "";

    mockDatabase.page.push(newData); // 将新数据添加到页面列表
    // 更新后，将更新后的数据写回文件
    fs.writeFileSync(path.resolve('./mock/data/page.json'), JSON.stringify(mockDatabase.page, null, 2), 'utf8');
    return responseSuccessFormat(newData); // 返回添加的页面数据
  },
  "POST /web_bp_api/page/delete": (req: any) => {
    //const { id } = req.params;//从请求体中获取页面ID
    console.log(req.body)
    const id = req.body.id;
    // 根据ID在页面列表中查找对应的项
    const index = mockDatabase.page.findIndex((item: { id: number; }) => item.id === parseInt(id));
    if (index !== -1) {
      mockDatabase.page.splice(index, 1); // 从列表中删除该项
      return responseSuccessFormat({ deletedId: id });
    } else {
      return { status: 404, message: '未找到指定ID的页面' };
    }
  },
  "POST /web_bp_api/page/update": (req: any) => {
    //const { id } = req.params;// 从请求体中获取页面ID
    console.log(req.body)
    const id = req.body.id;
    const newData = req.body.updatedData;// 接收到的数据包含页面更新信息
    newData.updateTime = new Date().toLocaleString();
    const index = mockDatabase.page.findIndex((item: { id: number; }) => item.id === parseInt(id));
    if (index !== -1) {
      mockDatabase.page[index] = { ...mockDatabase.page[index], ...newData };
      fs.writeFileSync(path.resolve('./mock/data/page.json'), JSON.stringify(mockDatabase.page, null, 2), 'utf8');
      return responseSuccessFormat(mockDatabase.page[index]);
    } else {
      return { status: 404, message: '未找到指定ID的页面' };
    }
  },
  "POST /web_bp_api/module/list": responseSuccessFormat(mockDatabase.module),
  "POST /web_bp_api/module/add": (req: any) => {
   // const newData = req.body; // 接收到的数据包含模块信息

    console.log(req.body)
    const model = mockDatabase.module.reduce((prev: { id: number; }, curr: { id: number; }) => {
      return prev.id > curr.id ? prev : curr
    })
    console.log(model.id)
    const newData = req.body; // 接收到的数据包含应用信息
    newData.id = parseInt(model.id) + 1;
    newData.createTime = new Date().toLocaleString();
    newData.updateTime = "";

    mockDatabase.module.push(newData); //将新数据添加到模块列表
    fs.writeFileSync(path.resolve('./mock/data/module.json'), JSON.stringify(mockDatabase.module, null, 2), 'utf8');
    return responseSuccessFormat(newData); // 返回添加的模块数据
  },
  "POST /web_bp_api/module/delete": (req: any) => {
    //const { id } = req.params;// 从请求体中获取模块ID
    console.log(req.body)
    const id = req.body.id;
    const index = mockDatabase.module.findIndex((item: { id: number; }) => item.id === parseInt(id));
    if (index !== -1) {
      mockDatabase.module.splice(index, 1);// 从列表中删除该项
      fs.writeFileSync(path.resolve('./mock/data/module.json'), JSON.stringify(mockDatabase.module, null, 2), 'utf8');
      return responseSuccessFormat({ deletedId: id });
    } else {
      return { status: 404, message: '未找到指定ID的模块' };
    }
  },
  "POST /web_bp_api/module/update": (req: any) => {
    //const { id } = req.params;// 从请求体中获取模块ID
    console.log(req.body)
    const id = req.body.id;
    const newData = req.body.updatedData;// 接收到的数据包含模块更新信息
    newData.updateTime = new Date().toLocaleString();
    const index = mockDatabase.module.findIndex((item: { id: number; }) => item.id === parseInt(id));
    if (index !== -1) {
      mockDatabase.module[index] = { ...mockDatabase.module[index], ...newData };
      fs.writeFileSync(path.resolve('./mock/data/module.json'), JSON.stringify(mockDatabase.module, null, 2), 'utf8');
      return responseSuccessFormat(mockDatabase.module[index]);
    } else {
      return { status: 404, message: '未找到指定ID的模块' };
    }
  },
};
