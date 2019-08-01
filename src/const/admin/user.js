export const userOption = {
    border: true,
    index: true,
    indexLabel: '序号',
    selection: false,
    addBtn:false,
    delBtn:false,
    editBtn:false,
    menuType:"text",
    column: [
        {
            label: "用户id",
            prop: "uid",
            span:24,
            hide:true,
            addVisdiplay:false,
            editVisdiplay:false,
        },{
            label: "用户名",
            prop: "username",
            search:true,
            span:24,
            rules: [{
                required: true,
                message: "请输入用户名",
                trigger: "blur"
            }],
            editVisdiplay:false,
        },
        {
            label:"昵称",
            prop:"name",
            span:24,
            rules: [{
                required: true,
                message: "请输入昵称",
                trigger: "blur"
            }]
        },
        {
            label: "角色",
            prop: "roles",
            span:24,
            width:200,
            rules: [{
                required: true,
                message: "请输入角色",
                trigger: "blur"
            }],
            solt: true,
            formsolt:true,
            addVisdiplay:false,
            editVisdiplay:false,
        },
        {
            label:"密码",
            span:24,
            prop: "password",
            type: "password",
            hide:true,
            placeholder:"新增必填，修改选填，默认不修改"
        },
        {
            label: "状态",
            prop: "state",
            span:24,
            width:80,
            solt: true,
            type:"select",
            rules: [{
                required: true,
                message: "请选择状态",
                trigger: "blur"
            }],
            dicData: [{
                label: '锁定',
                value: '0'
            }, {
                label: '有效',
                value: '1'
            }]
        },
        {
            label: "创建时间",
            prop: "createTime",
            span:24,
            type: "datetime",
            format: "yyyy-MM-dd HH:mm:ss",
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            addVisdiplay:false,
            editVisdiplay:false,
        },
        {
            label: "创建时间",
            prop: "startCreateTime",
            span:24,
            type: "datetime",
            search:true,
            format: "yyyy-MM-dd HH:mm:ss",
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            hide:true,
            addVisdiplay:false,
            editVisdiplay:false,
        },
        {
            label: "--",
            prop: "endCreateTime",
            span:24,
            type: "datetime",
            search:true,
            format: "yyyy-MM-dd HH:mm:ss",
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            hide:true,
            addVisdiplay:false,
            editVisdiplay:false,
        },
        {
            label: "更新时间",
            prop: "updateTime",
            span:24,
            type: "datetime",
            format: "yyyy-MM-dd HH:mm:ss",
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            addVisdiplay:false,
            editVisdiplay:false,
        }
    ]
};