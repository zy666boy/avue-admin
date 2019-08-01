export const roleOption = {
    border: true,
    index: true,
    selection: false,
    calcHeight: 320,
    addBtn:false,
    delBtn:false,
    editBtn:false,
    column: [
        {
            label:"id",
            hide:true,
            addVisdiplay:false,
            editVisdiplay:false,
        },
        {
            label: "角色名称",
            prop: "role",
            span:24,
            rules: [{
                required: true,
                message: "请输入角色名称",
                trigger: "blur"
            }]
        },
        {
            label: "角色描述",
            prop: "description",
            span:24,
            rules: [{
                required: true,
                message: "请输入角色描述",
                trigger: "blur"
            }]
        },
        {
            label: "创建时间",
            prop: "createTime",
            format: "yyyy-MM-dd HH:mm:ss",
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            type: "datetime",
            addVisdiplay:false,
            editVisdiplay:false,
        }
        ,
        {
            label: "修改时间",
            prop: "updateTime",
            format: "yyyy-MM-dd HH:mm:ss",
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            type: "datetime",
            addVisdiplay:false,
            editVisdiplay:false,
        }
    ]
};