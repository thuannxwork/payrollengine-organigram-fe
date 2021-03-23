<template>
    <div>
        {{type}}
        <b-form-input v-model="text" placeholder="Search department" style="width: 25%"></b-form-input>
        <br/>
        <b-row>
            <b-col sm="3">
                <b-list-group v-for="(department, index) in departments" :key="index">
                    <b-list-group-item @click="selectItem(department)" :active="department.id === selectedItem">{{department.name}}</b-list-group-item>
                </b-list-group>
                <b-list-group-item v-if="toggleAdd">
                    <b-form-input v-model="newDepartmentName" v-on:keypress="submitItem($event)">
                    </b-form-input>
                </b-list-group-item>
            </b-col>

            <b-col sm="2">
                <b-button class="custom-button" @click="addItem()">+</b-button>
                <br/>
                <b-button class="custom-button" @click="removeItem()">-</b-button>
            </b-col>
        </b-row>
    </div>
</template>

<script>
    export default {
        name: "ConfigurationDetail",
        data: function () {
            return {
                text: "",
                departments: [
                    {id: 1, name: "IT"},
                    {id: 2, name: "Human Resource"}
                ],
                selectedItem: 0,
                toggleAdd: false,
                newDepartmentName: "",
                idKey: 2,
            }
        },
        props: {
            type: String
        },
        methods: {
            selectItem(department) {
                if(this.selectedItem === department.id) {
                    this.selectedItem = 0;
                } else {
                    this.selectedItem = department.id;
                }
                console.log(department.id);
            },
            removeItem() {
                if (this.selectedItem === 0) {
                    return;
                } else {
                    let deps = [...this.departments];
                    this.departments = deps.filter(dep => dep.id !== this.selectedItem);
                    this.selectedItem = 0;
                }
            },
            addItem() {
                this.toggleAdd = true;
            },
            submitItem(event) {
                if(event.charCode === 13) {
                    this.idKey += 1;
                    this.departments.push({
                        name: this.newDepartmentName,
                        id: this.idKey
                    })
                    this.newDepartmentName = "";
                    this.toggleAdd = false;
                    console.log(event);
                }
            }
        }
    }
</script>

<style scoped>
    .custom-button {
        width: 40px;
        background-color: #226fd1;
    }
</style>
