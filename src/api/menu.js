import request from '@/router/axios';
export const getMenu = (type = 0) => request({
    url: '/menu/getMenu',
    method: 'get'
});
export const getMenuAll = () => request({
    url: '/menu/getMenuAll',
    method: 'get'
});
export const getMenuByRoleId = (id) => request({
    url: '/menu/getMenuByRoleId/'+id,
    method: 'get'
});
export const postOne = (obj) => request({
    url: '/menu',
    method: 'post',
    //headers: {'serialize':true},
    data:obj
});
export const putOne = (obj) => request({
    url: '/menu',
    method: 'put',
    //headers: {'serialize':true},
    data:obj
});
//delete请求参数不能序列化
export const deleteOne = (id) => request({
    url: '/menu/'+id,
    method: 'delete',
});
