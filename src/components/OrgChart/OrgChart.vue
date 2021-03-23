<template>
    <div>
        <b-row class="pl-4 pb-2">
            <b-button class="custom-button" size="sm">People/Org View</b-button>
            <b-button class="custom-button" size="sm">Display/Edit Mode</b-button>
            <b-button class="custom-button" size="sm">Center OrgChart</b-button>
            <b-button class="custom-button" size="sm">Full Screen</b-button>
            <b-button class="custom-button" size="sm">Expand/Collapse All</b-button>
            <b-button class="custom-button" size="sm">Export</b-button>
            <b-button class="custom-button" size="sm">Settings Layout</b-button>
        </b-row>
        <b-row>
            <b-col col :sm="!enableEdit ? 12 : 9">
                <OrgChart :datasource="ds" :pan="true"
                          :zoom="true"
                          @click.native="clickContainer($event)">
                    <!--       <template slot-scope="{ nodeData }">
                            <b @click="selectNode(nodeData)">{{ nodeData.name }}</b>
                          </template> -->
                    <template slot-scope="{nodeData}">
                        <b-card header-tag="header" footer-tag="footer">
                            <strong>{{nodeData.title}}</strong>
                            <div>
                                <b-dropdown size="sm" variant="link" toggle-class="text-decoration-none"
                                            no-caret>
                                    <template #button-content>
                                        <b-icon-three-dots/>
                                    </template>
                                    <b-dropdown-item @click="editNode(nodeData)">Edit</b-dropdown-item>
                                    <b-dropdown-item @click="deleteNode(nodeData)">Delete</b-dropdown-item>
                                </b-dropdown>
                            </div>
                            <h6>{{nodeData.name}}</h6>
                        </b-card>
                    </template>
                </OrgChart>
            </b-col>
            <b-col col :sm="enableEdit ? 3 : 0">
                <div id="edit-panel" v-if="enableEdit">
                    <div>
<!--                        <h3>New Node:</h3>-->
                        <b-form-input v-model="newNodeName" placeholder="name" width="100"/>
                        <b-form-input v-model="newNodeTitle" placeholder="title" width="100"/>
                    </div>
                    <br/>
                    <div>
                        <b-button @click="addChildNode" variant="outline-primary" size="sm" class="new-button">Add Child
                            Node
                        </b-button>
                        <b-button @click="addSiblingNode" variant="outline-primary" size="sm" class="new-button">Add
                            Sibing Node
                        </b-button>
                        <b-button @click="addRootNode" variant="outline-primary" size="sm" class="new-button">Add Root
                            Node
                        </b-button>
                        <b-button @click="removeNodes" variant="outline-primary" size="sm" class="new-button">Remove
                            Nodes
                        </b-button>
                        <b-button @click="updateNode" variant="outline-primary" size="sm" class="new-button">Update
                            Node
                        </b-button>
                    </div>
                </div>
            </b-col>
        </b-row>
        selected node: {{this.selectedNodes}}
    </div>
</template>

<script>
    import OrgChart from "vue-organization-chart";
    import "vue-organization-chart/dist/orgchart.css";
    import axios from 'axios';
    import $ from "jquery";

    export default {
        name: 'OrgChartComponent',
        components: {
            OrgChart
        },

        data() {
            return {
                ds: {
                    'id': '1',
                    'name': 'Lao Lao',
                    'title': 'general manager',
                    'children': [
                        {'id': '2', 'name': 'Bo Miao', 'title': 'department manager'},
                        {
                            'id': '3', 'name': 'Su Miao', 'title': 'department manager',
                            'children': [
                                {'id': '4', 'name': 'Tie Hua', 'title': 'senior engineer'},
                                {
                                    'id': '5', 'name': 'Hei Hei', 'title': 'senior engineer',
                                    'children': [
                                        {'id': '6', 'name': 'Pang Pang', 'title': 'engineer'},
                                        {'id': '7', 'name': 'Xiang Xiang', 'title': 'UE engineer'}
                                    ]
                                }
                            ]
                        },
                        {'id': '8', 'name': 'Hong Miao', 'title': 'department manager'},
                        {'id': '9', 'name': 'Chun Miao', 'title': 'department manager'}
                    ]
                },
                totalVuePackages: null,
                ocKey: 0,
                selectedNodes: {},
                newNodeName: "",
                newNodeTitle: "",
                enableEdit: false,

            }
        },
        mounted() {
            // GET request using axios with set headers
            const headers = {"Access-Control-Allow-Origin": "*", "Content-Type": "application/json"};
            axios.get("http://localhost:8081/payroll-organigram-service/1001", {headers})
                .then(response => this.ds = response.data);
        },
        methods: {
            selectNode(nodeData) {
                $(".node.selected").removeClass("selected");
                this.selectedNodes = {};

                let singleNode = Object.assign({}, nodeData);
                delete singleNode.children;
                $("#" + singleNode.id).toggleClass("selected");
                if ($("#" + singleNode.id).is(".selected")) {
                    this.$set(this.selectedNodes, singleNode.id, singleNode);
                } else {
                    this.$delete(this.selectedNodes, singleNode.id);
                }
                this.enableEdit = true;
            },
            clickContainer(event) {
                $(".node.selected").removeClass("selected");
                if (!$(event.target).closest(".node").length) {
                    this.selectedNodes = {};
                }
                this.enableEdit = false;
            },
            async addChildNode() {
                alert("add child node")
            },
            async addSiblingNode() {
                alert("add sibling node")
            },
            async addRootNode() {
                alert("add root node")
            },
            async removeNodes() {
                alert("remove node")
            },
            async updateNode() {
                alert("update node")
            },
            async editNode(nodeData) {
                this.selectNode(nodeData);
                console.log(nodeData)
            },
            async deleteNode(nodeData) {
                console.log(nodeData)
            }
        }
    }
</script>

<style scoped>
    #edit-panel {
        margin: 0.5rem;
        padding: 0.5rem;
        border: 1px solid #aaa;
    }

    .new-button {
        width: 100%;
        margin-bottom: 5px;
    }

    .custom-button {
        margin-right: 10px;
        color: black;
        background-color: orange;
    }

    .orgchart-container {
      font-family: Arial;
      height: 700px;
      width:90%;
      border-radius: 5px;
      overflow: auto;
      text-align: center;
    }


</style>
