import { request } from "@/utils"

export const queryApp = () => request("/web_bp_api/app/list");
export const addApp = (newData: any) => request('/web_bp_api/app/add', newData);
export const updateApp = (id: number | string, updatedData: any) => request(`/web_bp_api/app/update`, { id, updatedData });
export const deleteApp = (id: number | string) => request(`/web_bp_api/app/delete`, { id });
export const queryPage = () => request("/web_bp_api/page/list");
export const addPage = (newPageData: any) => request('/web_bp_api/page/add', newPageData);
export const updatePage = (pageId: string | number, updatedPageData: any) => request(`/web_bp_api/page/update`, { pageId, updatedPageData });
export const deletePage = (pageId: string | number) => request(`/web_bp_api/page/delete`, { pageId });
export const queryModule = () => request("/web_bp_api/module/list");
export const addModule = (newModuleData: any) => request('/web_bp_api/module/add', newModuleData);
export const updateModule = (moduleId: string | number, updatedModuleData: any) => request(`/web_bp_api/module/update`, { moduleId, updatedModuleData });
export const deleteModule = (moduleId: string | number) => request(`/web_bp_api/module/delete`, { moduleId }); 