<template>
    <div>
        <basic-container>
            <el-container>
                <el-header class="menu-header">
                    <el-button-group>
                        <el-button type="primary"
                                   icon="el-icon-plus"
                                   size="small"
                                   @click.native="handleAdd"
                                   v-if="permission.menu_add">新增
                        </el-button>
                        <el-button type="primary"
                                   icon="el-icon-edit"
                                   size="small"
                                   @click.native="handleEdit"
                                   v-if="permission.menu_update">编辑
                        </el-button>
                        <el-button type="primary"
                                   icon="el-icon-delete"
                                   size="small"
                                   @click.native="handleDel"
                                   v-if="permission.menu_del">删除
                        </el-button>
                    </el-button-group>
                </el-header>
            </el-container>
            <el-container>
                <el-aside width="300px">
                    <el-tree :data="treeData"
                             node-key="id"
                             highlight-current
                             default-expand-all
                             :expand-on-click-node="false"
                             @node-click="handleNodeClick" ref="tree"></el-tree>
                </el-aside>
                <el-main>
                    <el-form ref="form"
                             :model="form"
                             label-width="80px">
                        <el-form-item label="父节点ID">
                            <el-input v-model="form.parentId"
                                      :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="节点ID">
                            <el-input v-model="form.id"
                                      :disabled="formGrade"></el-input>
                        </el-form-item>
                        <el-form-item label="菜单名称">
                            <el-input v-model="form.label"
                                      :disabled="formGrade"></el-input>
                        </el-form-item>
                        <el-form-item label="类型"
                                      prop="type">
                            <el-select class="filter-item"
                                       v-model="form.type"
                                       :disabled="formGrade">
                                <el-option v-for="item in  typeOptions"
                                           :key="item"
                                           :label="item | typeFilter"
                                           :value="item"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="权限标识"
                                      prop="permission">
                            <el-input v-model="form.permission"
                                      :disabled="formGrade"></el-input>
                        </el-form-item>
                        <el-form-item label="菜单图标">
                            <el-input v-model="form.icon"
                                      :disabled="formGrade"></el-input>
                        </el-form-item>
                        <el-form-item label="排序">
                            <el-input type="number"
                                      v-model="form.sort"
                                      :disabled="formGrade"></el-input>
                        </el-form-item>
                        <el-form-item label="前端组件路径">
                            <el-input v-model="form.component"
                                      :disabled="formGrade"></el-input>
                        </el-form-item>
                        <el-form-item label="路由路径">
                            <el-input v-model="form.path"
                                      :disabled="formGrade"></el-input>
                        </el-form-item>
                        <el-form-item label="路由缓冲"
                                      prop="component">
                            <el-switch v-model="form.keepAlive"
                                       :disabled="formGrade"
                                       active-color="#13ce66"
                                       inactive-color="#ff4949"
                                       active-value='1'
                                       inactive-value='0'>
                            </el-switch>
                        </el-form-item>
                        <el-form-item v-if="formStatus=='add'">
                            <el-button type="primary"
                                       @click="handleSubmit"
                                       :disabled="formGrade">新增
                            </el-button>
                            <el-button @click="onCancel">取消</el-button>
                        </el-form-item>
                        <el-form-item v-if="formStatus=='edit'">
                            <el-button type="primary"
                                       @click="handleSubmit"
                                       :disabled="formGrade">修改
                            </el-button>
                            <el-button @click="onCancel">取消</el-button>
                        </el-form-item>
                    </el-form>
                </el-main>
            </el-container>
        </basic-container>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import {validatenull} from "@/util/validate";
    import {findParent} from "@/util/util";
    import {getMenuById,getMenuAll} from "@/api/menu";
    import {postOne,putOne,deleteOne} from "@/api/menu";
    import {deepClone} from "@/util/util"
    export default {
        name: "menu",
        data() {
            return {
                form: {
                    id:'',
                    label:'',
                    menuId: '',
                    parentId: '',
                    icon: '',
                    sort: '',
                    component: '',
                    type: '',
                    path: '',
                    keepAlive:''
                },
                obj: {},
                parentForm: {},
                formGrade: true,//是否只读
                formStatus: "",
                typeOptions: ['0', '1'],
                treeData:[]
            };
        },//
        created() {
           this.getList();
        },
        mounted() {
        },
        computed: {
            ...mapGetters(["permission", "menu"])
        },
        filters: {
            typeFilter(type) {
                const typeMap = {
                    0: '菜单',
                    1: '按钮'
                }
                return typeMap[type]
            }
        },
        props: [],
        methods: {
            handleNodeClick(data) {
                getMenuById(data.id).then(res=>{
                    this.form= res.data.data;
                });
                let p=findParent(this.menu, data.id);
                this.formGrade = true;
                this.formStatus = "";
                this.obj = data;
                console.log(this.form);
            },
            handleAdd() {
                this.resetForm();
                this.formGrade = false;
                this.formStatus = "add";
                this.form.parentId=this.obj.id||-1;
            },
            handleEdit() {
                if (validatenull(this.obj)) {
                    this.$message({
                        showClose: true,
                        message: "请选择菜单",
                        type: "warning"
                    });
                    return false;
                }
                this.formStatus = "edit";
                this.formGrade = false;
            },
            handleDel() {
                this.$confirm(`是否确认删除${this.form.label}`, "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    deleteOne(this.obj.id).then(res=>{
                        this.$message({
                            showClose: true,
                            message: "删除成功",
                            type: "success"
                        });
                        this.getList();
                    });
                    })
                    .catch(() => {
                    });
            },
            handleSubmit() {
                if(this.formStatus=='add'){
                    let obj=deepClone(this.form);
                    obj.name=obj.label;
                    postOne(obj).then(res=>{
                        if(res.data.code==200)
                        this.$message({
                            type:"success",
                            message:res.data.msg
                        })
                        this.getList();
                    });
                }
                else{
                    let obj=deepClone(this.form);
                    obj.name=obj.label;
                    putOne(obj).then(res=>{
                        if(res.data.code==200)
                            this.$message({
                                type:"success",
                                message:res.data.msg
                            })
                    });
                }
            },
            resetForm() {
                this.form = {
                    id:'',
                    label:'',
                    menuId: '',
                    parentId: '',
                    icon: '',
                    sort: '',
                    component: '',
                    type: '',
                    path: '',
                    keepAlive:0
                }
            },
            onCancel() {
                this.formGrade = true
                this.formStatus = ''
            },
            getList(){
                getMenuAll().then(res=>{
                    this.treeData=res.data.data;
                });
            }
        }
    };
</script>

<style lang="scss" scoped>
    .menu-container {
        padding: 0 20px;
    }

    .menu-header {
        padding: 8px 0;
    }
    el-input{
        padding-right: -20px;
    }
</style>
