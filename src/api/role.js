import request from '@/router/axios';
export const postOne = (obj) => request({
    url: '/role',
    data:obj,
    method: 'post'
});
export const deleteOne = (id) => request({
    url: '/role/'+id,
    method: 'delete'
});
export const putOne = (obj) => request({
    url: '/role',
    data:obj,
    method: 'put'
});
export const putRoleMenuByRoleId = (obj) => request({
    url: '/role/putRoleMenuByRoleId',
    data:obj,
    method: 'put'
});
export const pageRole = (obj) => request({
    url: '/role/pageRole',
    params:obj,
    method: 'get'
});
export const getRoleAll = (obj) => request({
    url: '/role/getRoleAll',
    method: 'get'
});