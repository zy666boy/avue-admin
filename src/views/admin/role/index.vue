<template>
    <div>
        <basic-container>
            <avue-crud :option="tableOption"
                       :data="tableData"
                       :table-loading="tableLoading"
                       :page="page"
                       ref="crud"
                       @refresh-change="handleList"
                       @row-save="save"
                       @row-update="upd"
                       @row-del="del">
                <template slot="menuLeft">
                    <el-button v-if="permission.role_add"
                               class="filter-item"
                               @click="handleCreate"
                               size="small"
                               type="primary"
                               icon="el-icon-edit">新增
                    </el-button>
                </template>
                <template slot-scope="scope"
                          slot="menu">
                    <el-button size="mini"
                               type="text"
                               icon="el-icon-edit"
                               v-if="permission.role_update"
                               @click="handleUpdate(scope.row,scope.index)">编辑
                    </el-button>
                    <el-button size="mini"
                               type="text"
                               icon="el-icon-delete"
                               v-if="permission.role_del"
                               @click="handleDelete(scope.row,scope.index)">删除
                    </el-button>
                    <el-button icon="el-icon-check"
                               type="text"
                               size="small"
                               v-if="permission.role_update"
                               @click="handlePermission(scope.row,scope.index)">权限
                    </el-button>
                </template>
            </avue-crud>
            <el-dialog title="权限分配"
                       :visible.sync="permissionDialogVisible">
                <el-tree class="filter-tree"
                         :data="treeData"
                         :default-checked-keys="checkedKeys"
                         :check-strictly="false"
                         node-key="id"
                         highlight-current
                         :props="defaultProps"
                         show-checkbox
                         ref="menuTree"
                         default-expand-all>
                </el-tree>
                <span slot="footer"
                      class="dialog-footer">
          <el-button type="primary"
                     @click="updatePermission">更新</el-button>
        </span>
            </el-dialog>
        </basic-container>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import {pageRole, postOne, putOne, deleteOne,putRoleMenuByRoleId} from '@/api/role'
    import {roleOption} from "@/const/admin/role.js";
    import {getMenuByRoleId,getMenuAll,} from '@/api/menu'
    export default {
        name: "role",
        components: {},
        data() {
            return {
                tableOption: roleOption, //表格设置属性
                tableData: [], //表格的数据
                tablePage: 1,
                tableLoading: false,
                tabelObj: {},
                checkedKeys: [],
                defaultProps: {
                    label: "name",
                    value: 'id'
                },
                permissionDialogVisible: false,
                page: {
                    total: 0, //总页数
                    currentPage: 1, //当前页数
                    pageSize: 10 //每页显示多少条
                },
                checkAll: false,//多选框相关
                checkedPermissions: [],//多选框相关
                permissions: [],//多选框相关
                isIndeterminate: true,//多选框相关
                roleId:'',
                treeData:[]
            };
        },
        created() {
            this.handleList();
        },
        watch: {},
        mounted() {
        },
        computed: {
            ...mapGetters(["permission"])
        },
        props: [],
        methods: {
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
                this.$refs.crud.rowDel(row, index);
            },
            /**
             * @title 获取数据
             * @detail 赋值为tableData表格即可
             *
             **/
            handleList() {
                this.tableLoading = true;
                pageRole(this.page).then(res => {
                    this.tableData = res.data.data.records;
                    this.tableLoading = false;
                });
            },
            /**
             * @title 数据添加
             * @param row 为当前的数据
             * @param done 为表单关闭函数
             *
             **/
            save(row, done) {
                postOne(row).then(res => {//此处参数务必要对应正确
                    if (res.data.code == 200)
                        this.$message({
                            showClose: true,
                            message: res.data.msg,
                            type: "success"
                        });
                    done();
                    this.handleList();
                });
            },
            upd(row, index, done) {//此处参数务必要对应正确
                //另已有的创建时间和修改时间为空，因为会在后端设值.
                row.createTime = '';
                row.updateTime = '';
                putOne(row).then(res => {
                    if (res.data.code == 200)
                        this.$message({
                            showClose: true,
                            message: res.data.msg,
                            type: "success"
                        });
                    done();
                    this.handleList();
                });
            },
            del(row, index) {//此处参数务必要对应正确
                this.$confirm(`是否确认角色:${row.role}`, "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    deleteOne(row.id).then(res => {
                        if (res.data.code == 200)
                            this.$message({
                                showClose: true,
                                message: res.data.msg,
                                type: "success"
                            });
                        this.handleList();
                    });
                }).catch(() => {
                });
            },
            //多选框相关
            handleCheckAllChange(val) {
                this.checkedPermissions = val ? this.permissions : [];
                this.isIndeterminate = false;
            },
            //多选框相关
            handleCheckedPermissionsChange(value) {
                let checkedCount = value.length;
                this.checkAll = checkedCount === this.permissions.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.permissions.length;
            },
            //打开权限分配
            handlePermission(row,index) {
                getMenuByRoleId(row.id)
                    .then(response => {
                        this.checkedKeys = response.data.data
                        return getMenuAll()//返回的值是第二个then的参数
                    })
                    .then(response => {
                        this.treeData = response.data.data
                        // 解析出所有的太监节点,因为节点状态分为被选中(对号),半选中(减号),和未选中,从接口获得的菜单id包括了半选中和选中的，如果都赋值给checkedKeys，
                        // 那么所有半选中将变成选中，半选中下的所有结点也将被选中
                        this.checkedKeys = this.resolveAllEunuchNodeId(this.treeData,this.checkedKeys,[]);
                        console.log(this.checkedKeys);
                        this.permissionDialogVisible = true;
                        this.roleId = row.id;
                    })
            },
            /**
             * 解析出所有的太监节点id，因为节点状态分为被选中(对号),半选中(减号),和未选中
             * @param json 待解析的json串
             * @param idArr 原始节点数组
             * @param temp 临时存放节点id的数组
             * @return 太监节点id数组
             */
            resolveAllEunuchNodeId(json, idArr, temp) {
                for (let i = 0; i < json.length; i++) {
                    const item = json[i]
                    // 存在子节点，递归遍历;不存在子节点，将json的id添加到临时数组中
                    if (item.children && item.children.length !== 0) {
                        this.resolveAllEunuchNodeId(item.children, idArr, temp)
                    } else {
                        if(idArr.some(id => id === item.id))
                            temp.push(item.id);
                    }
                }
                return temp
            },
            //更新权限
            updatePermission() {
                //获取选中的太监id，和半选中的有子id
              let menuIds = this.$refs.menuTree.getCheckedKeys().join(',').concat(',').concat(this.$refs.menuTree.getHalfCheckedKeys().join(','))
                let obj={
                    id:this.roleId,
                    menuIds:menuIds
                }
                putRoleMenuByRoleId(obj).then((res) => {
                    if (res.data.code == 200)
                        this.$message({
                            showClose: true,
                            message: res.data.msg,
                            type: "success"
                        });
                    this.permissionDialogVisible = false;
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
