import user from './user';
import menu from './menu';
import admin from './admin';

/**
 * 模拟数据mock
 * 
 * mock是否开启模拟数据拦截
 */

user({ mock: false });

menu({ mock: false });

admin({ mock: false });