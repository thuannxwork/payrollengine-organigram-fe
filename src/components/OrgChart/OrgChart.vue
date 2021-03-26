<template>
    <div>
        <b-row class="pl-4 pb-2">
            <b-button class="custom-button" size="sm" @click="changeViewMode">{{viewMode !== ORG_VIEW_MODE ?
                `Organization View` : `People View`}}
            </b-button>
            <b-button class="custom-button" size="sm" @click="changeInteractMode">{{interactMode !== DISPLAY_MODE ?
                `Display Mode` : `Edit Mode`}}
            </b-button>
            <b-button class="custom-button" size="sm">Center OrgChart</b-button>
            <b-button class="custom-button" size="sm">Full Screen</b-button>
            <b-button class="custom-button" size="sm">Expand/Collapse All</b-button>
            <b-button class="custom-button" size="sm">Export</b-button>
            <b-button class="custom-button" size="sm">Settings Layout</b-button>
        </b-row>
        <b-row>
            <b-col col :sm="!enableEdit ? 12 : 10">
                <!--                Org chart-->
                <OrgChart :datasource="ds" :pan="true"
                          :zoom="true"
                          @click.native="clickContainer($event)" v-if="viewMode === ORG_VIEW_MODE">
                    <!--       <template slot-scope="{ nodeData }">
                            <b @click="selectNode(nodeData)">{{ nodeData.name }}</b>
                          </template> -->
                    <template slot-scope="{nodeData}">
                        <b-card header-tag="header" footer-tag="footer" :id="`node` + nodeData.orgUnitId">
                            <strong>{{nodeData.entityType}}</strong>
                            <div v-if="interactMode === EDIT_MODE">
                                <b-dropdown size="sm" variant="link" toggle-class="text-decoration-none"
                                            no-caret>
                                    <template #button-content>
                                        <b-icon-three-dots/>
                                    </template>
                                    <b-dropdown-item @click="editNode(nodeData)">Edit</b-dropdown-item>
                                    <b-dropdown-item v-if="nodeData.orgUnitId !== -1" @click="deleteNode(nodeData)">
                                        Delete
                                    </b-dropdown-item>
                                </b-dropdown>
                            </div>
                            <h6>{{nodeData.name}}</h6>
                        </b-card>
                    </template>
                </OrgChart>

                <!--                People chart-->
                <OrgChart :datasource="dsPeople" :pan="true"
                          :zoom="true"
                          @click.native="clickContainer($event)" v-if="viewMode === PEOPLE_VIEW_MODE">
                    <!--       <template slot-scope="{ nodeData }">
                            <b @click="selectNode(nodeData)">{{ nodeData.name }}</b>
                          </template> -->
                    <template slot-scope="{nodeData}">
                        <b-card header-tag="header" footer-tag="footer" :id="`node-people` + nodeData.id">
                            <div>
                                <b-img v-bind="mainProps" rounded="circle" alt="User profile" src="http://quanlyhoivien.hoinhabaohatinh.org.vn/upload/anhtrong.jpeg">
                                </b-img>
                            </div>
                            <strong>{{nodeData.id}}</strong>
                            <div v-if="interactMode === EDIT_MODE">
                                <b-dropdown size="sm" variant="link" toggle-class="text-decoration-none"
                                            no-caret>
                                    <template #button-content>
                                        <b-icon-three-dots/>
                                    </template>
                                    <b-dropdown-item @click="editNode(nodeData)">Edit</b-dropdown-item>
                                    <b-dropdown-item v-if="nodeData.id !== 1" @click="deleteNode(nodeData)">
                                        Delete
                                    </b-dropdown-item>
                                </b-dropdown>
                            </div>
                            <h6><i>{{nodeData.name}}</i></h6>
                            <h6>{{nodeData.title}}</h6>
                        </b-card>
                    </template>
                </OrgChart>
<!--                <div v-if="viewMode === PEOPLE_VIEW_MODE">PEOPLE</div>-->

            </b-col>
            <b-col col :sm="enableEdit ? 2 : 0" v-if="enableEdit">
                <div id="edit-panel">
                    <div>
                        <!--                        <h3>New Node:</h3>-->
                        <!--                        <b-form-input v-model="newNodeTitle" placeholder="entryType" width="100"/>-->
                        <vue-typeahead-bootstrap
                                :data="['type_1', 'type_2', 'type_3', 'type_4', 'type_5']"
                                v-model="newNodeTitle"
                                placeholder="entry"
                                :show-all-results="true"
                        />
                        <b-form-input v-model="newNodeName" placeholder="name" width="100"/>
                    </div>
                    <br/>
                    <div>
                        <b-button @click="addChildNode" variant="outline-primary" size="sm" class="new-button">Add Child
                            Node
                        </b-button>
                        <!--                        <b-button @click="addSiblingNode" variant="outline-primary" size="sm" class="new-button">Add-->
                        <!--                            Sibing Node-->
                        <!--                        </b-button>-->
                        <!--                        <b-button @click="addRootNode" variant="outline-primary" size="sm" class="new-button">Add Root-->
                        <!--                            Node-->
                        <!--                        </b-button>-->
                        <!--                        <b-button @click="removeNodes" variant="outline-primary" size="sm" class="new-button">Remove-->
                        <!--                            Nodes-->
                        <!--                        </b-button>-->
                        <b-button @click="updateNode" variant="outline-primary" size="sm" class="new-button">Update
                            Node
                        </b-button>
                    </div>
                </div>
            </b-col>
        </b-row>
        <!--        selected node: {{this.selectedNodes}}-->
    </div>
</template>

<script>
    import OrgChart from "vue-organization-chart";
    import "vue-organization-chart/dist/orgchart.css";
    import axios from 'axios';
    import $ from "jquery";
    import VueTypeaheadBootstrap from 'vue-typeahead-bootstrap';
    import Constants from '../../constant/Constants.js';

    export default {
        name: 'OrgChartComponent',
        components: {
            OrgChart,
            VueTypeaheadBootstrap
        },

        data() {
            return {
                dsPeople: {
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
                ds: {},
                totalVuePackages: null,
                ocKey: 0,
                selectedNodes: {},
                newNodeName: "",
                newNodeTitle: "",
                enableEdit: false,
                nodeSelect: {},
                boxOne: '',
                headers: Constants.HTTP_CONFIG.HEADERS,
                viewMode: Constants.APP.VIEW_MODE_ORG,
                interactMode: Constants.APP.DISPLAY_MODE,
                PEOPLE_VIEW_MODE: Constants.APP.VIEW_MODE_PEOPLE,
                ORG_VIEW_MODE: Constants.APP.VIEW_MODE_ORG,
                DISPLAY_MODE: Constants.APP.DISPLAY_MODE,
                EDIT_MODE: Constants.APP.EDIT_MODE,
                mainProps: { width: 50, height: 50, class: 'm1' }
            }
        },
        mounted() {
            // GET request using axios with set headers
            // const headers = {"Access-Control-Allow-Origin": "*", "Content-Type": "application/json"};
            this.getNode();
        },
        methods: {
            getNode() {
                axios.get("http://localhost:8081/payroll-organigram-service/unit/1001", this.headers)
                    .then(response => this.ds = response.data);
            },
            selectNode(nodeData) {
                $(".card.selected").removeClass("selected");
                this.selectedNodes = {};

                let singleNode = Object.assign({}, nodeData);
                delete singleNode.children;
                if (this.viewMode === this.ORG_VIEW_MODE) {
                    $("#node" + singleNode.orgUnitId).toggleClass("selected");
                    if ($("#node" + singleNode.orgUnitId).is(".selected")) {
                        this.$set(this.selectedNodes, singleNode.orgUnitId, singleNode);
                    } else {
                        this.$delete(this.selectedNodes, singleNode.orgUnitId);
                    }
                } else {
                    $("#node-people" + singleNode.id).toggleClass("selected");
                    if ($("#node" + singleNode.id).is(".selected")) {
                        this.$set(this.selectedNodes, singleNode.id, singleNode);
                    } else {
                        this.$delete(this.selectedNodes, singleNode.id);
                    }
                }
                this.enableEdit = true;
            },
            clickContainer(event) {
                $(".card.selected").removeClass("selected");
                if (!$(event.target).closest(".node").length) {
                    this.selectedNodes = {};
                    this.nodeSelect = {};
                }
                this.enableEdit = false;
            },
            async addChildNode() {
                if (this.viewMode === this.ORG_VIEW_MODE) {
                    // alert("add child node")
                    let nodeRequest = {
                        name: this.newNodeName,
                        entityType: this.newNodeTitle,
                        rootId: this.nodeSelect.rootId,
                        parentOrgUnitId: [
                            this.nodeSelect.orgUnitId
                        ]
                    };

                    console.log(nodeRequest);

                    axios.post("http://localhost:8081/payroll-organigram-service", nodeRequest, this.headers).then(this.getNode).catch(console.error);
                    this.newNodeTitle = "";
                    this.newNodeName = "";
                } else {
                    alert("Add child node people");
                }
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
                // alert("update node")
                if (this.viewMode === this.ORG_VIEW_MODE) {
                    // alert("add child node")
                    let nodeRequest = {...this.nodeSelect}
                    nodeRequest.name = this.newNodeName;
                    nodeRequest.entityType = this.newNodeTitle;

                    console.log(nodeRequest);

                    axios.post("http://localhost:8081/payroll-organigram-service/update", nodeRequest, this.headers).then(this.getNode).catch(console.error);
                    this.newNodeTitle = "";
                    this.newNodeName = "";
                } else {
                    alert("update node people");
                }
            },
            async editNode(nodeData) {
                this.nodeSelect = nodeData;
                this.selectNode(nodeData);
            },
            async deleteNode(nodeData) {
                this.boxOne = ''
                this.$bvModal.msgBoxConfirm('Are you sure?')
                    .then(value => {
                        this.boxOne = value
                        console.log(value)
                        if (value) {
                            if (this.viewMode === this.ORG_VIEW_MODE) {
                                axios.delete(`http://localhost:8081/payroll-organigram-service/1001/${nodeData.orgUnitId}`, this.headers).then(this.getNode).catch(console.error);
                            }
                        }
                    })
                    .catch(console.error)
                console.log(nodeData)
            },
            changeViewMode() {
                if (this.viewMode === this.ORG_VIEW_MODE){
                    this.viewMode = this.PEOPLE_VIEW_MODE;
                } else {
                    this.viewMode = this.ORG_VIEW_MODE;
                }
                this.enableEdit = false;
            },
            changeInteractMode() {
                if (this.interactMode === this.DISPLAY_MODE) {
                    this.interactMode = this.EDIT_MODE;
                } else {
                    this.interactMode = this.DISPLAY_MODE;
                }
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
        width: 90%;
        border-radius: 5px;
        overflow: auto;
        text-align: center;
    }

</style>
