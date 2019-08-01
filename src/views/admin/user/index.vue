<template>
    <div>
        <basic-container>
            <avue-crud :option="tableOption"
                       :data="tableData"
                       :table-loading="tableLoading"
                       :page="page"
                       ref="crud"
                       @refresh-change="handleRefresh"
                       @row-save="save"
                       @row-update="upd"
                       @row-del="del"
                       @search-change="handleList">
                <template slot="state" slot-scope="scope">
                    <el-tag>{{scope.row.state=='0'?'锁定':'有效'}}</el-tag>
                </template>
                <template slot="roles" slot-scope="scope">
          <span v-for="(role,index) in scope.row.roles">
            <el-tag>{{role}}</el-tag>
          </span>
                </template>
                <template slot="rolesForm" slot-scope="scope">
                    <el-select
                            v-model="scope.row.roles"
                            multiple
                            filterable
                            placeholder="请输入角色">
                        <el-option
                                v-for="item in selectOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </template>
                <template slot="menuLeft">
                    <el-button v-if="permission.user_add"
                               class="filter-item"
                               @click="handleCreate"
                               size="small"
                               type="primary"
                               icon="el-icon-edit">新增
                    </el-button>
                </template>
                <template slot="menu"
                          slot-scope="scope">
                    <el-button size="mini"
                               type="text"
                               icon="el-icon-edit"
                               v-if="permission.user_update"
                               @click="handleUpdate(scope.row,scope.index)">编辑
                    </el-button>
                    <el-button size="mini"
                               type="text"
                               icon="el-icon-delete"
                               v-if="permission.user_del"
                               @click="handleDelete(scope.row,scope.index)">删除
                    </el-button>
                    <el-button size="mini"
                               type="text"
                               icon="el-icon-plus"
                               plain
                               @click="handleRole(scope.row,scope.index)"
                               v-if="permission.user_update">角色
                    </el-button>
                </template>
            </avue-crud>
        </basic-container>
        <el-dialog title="分配角色"
                   :visible.sync="dialogRoleVisible">
            <el-select
                    v-model="roles"
                    multiple
                    filterable
                    placeholder="请输入角色">
                <el-option
                        v-for="item in selectOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
            <div slot="footer"
                 class="dialog-footer">
                <el-button type="primary"
                           @click="updateRole()">更 新
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import {getUserInfoAll,postOne,putOne,deleteOne,putUserRole} from '@/api/user'
    import {userOption} from "@/const/admin/user";
    import {getRoleAll} from "@/api/role"
    export default {
        name: "user",
        components: {},
        data() {
            return {
                tableOption: userOption, //表格设置属性
                tableData: [], //表格的数据
                tablePage: 1,
                tableLoading: false,
                selectLoading:false,
                tabelObj: {},
                roles:[],
                uid:'',
                page: {
                    total: 0, //总页数
                    currentPage: 1, //当前页数
                    pageSize: 10 //每页显示多少条
                },
                selectOptions: [],
                selectList:[],
                dialogRoleVisible:false
            };
        },
        created() {
            this.handleList();
        },
        watch: {},
        mounted() {
            getRoleAll().then(res=>{
                this.selectOptions=res.data.data.map(role=>{
                    return{
                        label:role.role,
                        value:role.id
                    }
                })
            })
        },
        computed: {
            ...mapGetters(["permission"])
        },
        props: [],
        methods: {
            /**
             * @title 获取数据
             * @detail 赋值为tableData表格即可
             *
             **/
            handleList(param) {
                console.log(param)
                this.tableLoading = true;
                let obj = {
                    size: this.page.pageSize,
                    current: this.page.currentPage
                }
                getUserInfoAll({...obj,...param}).then(res => {
                    this.tableData = res.data.data.records;
                    this.tableLoading = false;
                    this.page.total = res.data.data.total;
                })
            },
            handleRefresh(){
                this.handleList();
            },
            /**
             * @title 数据添加
             * @param row 为当前的数据
             * @param done 为表单关闭函数
             *
             **/
            save(row, done) {
                postOne(row).then(res=>{//此处参数务必要对应正确
                    if(res.data.code==200)
                    this.$message({
                        showClose: true,
                        message: res.data.msg,
                        type: "success"
                    });
                    done();
                    this.handleList();
                    console.log("user.methods.save()")
                });
            },
            upd(row, index, done){//此处参数务必要对应正确
                //另已有的创建时间和修改时间为空，因为会在后端设值.
                row.createTime='';
                row.updateTime='';
                row.roles='';
                putOne(row).then(res=>{
                    if(res.data.code==200)
                        this.$message({
                            showClose: true,
                            message: res.data.msg,
                            type: "success"
                        });
                    done();
                    this.handleList();
                    console.log("user.methods.upd()")
                });
            },
            del(row,index){//此处参数务必要对应正确
                this.$confirm(`是否确认删除昵称为${row.name}的用户`, "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                        deleteOne(row.uid).then(res=>{
                            if(res.data.code==200)
                                this.$message({
                                    showClose: true,
                                    message: res.data.msg,
                                    type: "success"
                                });
                            this.handleList();
                            console.log("user.methods.del()")
                        });
                    }).catch(() => {
                    });
            },
            //调用crud的rowAdd方法打开新增窗口
            handleCreate() {
                this.$refs.crud.rowAdd();
            },
            //调用crud的rowEdit方法打开编辑窗口
            handleUpdate(row, index) {
                this.$refs.crud.rowEdit(row, index);
            },
            //调用crud的rowDel方法触发删除事件
            handleDelete(row, index) {
               this.$refs.crud.rowDel(row,index);
            },
            //查看并选择权限
            handleRole(row,index){
                this.dialogRoleVisible=true;
                //赋值前清空以前有的值，使不累积。
                this.roles=[];
                //以下循环是将row.roles数组里的角色名称转换成对应的角色id
                for(let i=0;i<row.roles.length;i++){
                    for(let j=0;j<this.selectOptions.length;j++){
                        if(row.roles[i]==this.selectOptions[j].label){
                            this.roles.push(this.selectOptions[j].value);
                            break;
                        }
                    }
                }
                this.uid=row.uid;
            },
            //更新角色
            updateRole(){
                let rIds='';
                let obj={
                    uid:this.uid,
                    roleIds:(()=>{
                        this.roles.forEach(roleid=>{rIds+=','+roleid})
                        return rIds;
                    })()
                }
                putUserRole(obj).then(res=>{
                    if(res.data.code==200)
                        this.$message({
                            showClose: true,
                            message: res.data.msg,
                            type: "success"
                        });
                    this.dialogRoleVisible=false;
                    this.handleList();
                })
            }
        }
    };
</script>

<style lang="scss" scoped>
    .table-container {
        padding: 8px 10px;
    }
</style>
