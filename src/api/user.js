import request from '@/router/axios';
export const loginByUsername = (username, password, code, redomStr) => request({
    url: '/login',
    method: 'post',
    headers: {'serialize':true},
    data: {
        username:username,
        password:password,
        code:code,
        redomStr:redomStr
    }
})

export const getUserInfo = () => request({
    url: '/user/getUserInfo',
    method: 'get'
});
export const getUserInfoAll = (obj) => request({
    url: '/user/getUserInfoAll',
    method: 'get',
    params:obj
});
export const postOne = (obj) => request({
    url: '/user',
    method: 'post',
    data:obj
});
export const putOne = (obj) => request({
    url: '/user',
    method: 'put',
    data:obj
});
export const deleteOne = (id) => request({
    url: '/user/'+id,
    method: 'delete',
});
export const putUserRole = (obj) => request({
    url: '/user/putUserRole',
    method: 'put',
    data:obj
});
export const RefeshToken = () => request({
    url: '/user/refesh',
    method: 'post'
})
export const logout = () => request({
    url: '/user/logout',
    method: 'get'
})