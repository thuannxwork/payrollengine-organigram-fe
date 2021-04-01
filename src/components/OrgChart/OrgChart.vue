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
            <b-col sm="1">
                <div>
                    <b-form-datepicker v-model="searchDate" class="mb-2 ml-2"
                                       style="width: 180px !important;"></b-form-datepicker>
                </div>
                <div>
                    <b-button class="custom-button" size="sm">Search</b-button>
                </div>
            </b-col>
            <b-col col :sm="!enableEdit ? 11 : 9">
                <!--                Org chart-->
                <OrgChart :datasource="ds"
                          @click.native="clickContainer($event)" v-if="viewMode === ORG_VIEW_MODE">
                    <!--       <template slot-scope="{ nodeData }">
                            <b @click="selectNode(nodeData)">{{ nodeData.name }}</b>
                          </template> -->
                    <template slot-scope="{nodeData}">
                        <b-card header-tag="header" footer-tag="footer" :id="`node` + nodeData.id">
                            <strong>{{nodeData.name}}</strong>
                            <div v-if="interactMode === EDIT_MODE">
                                <b-dropdown size="sm" variant="link" toggle-class="text-decoration-none"
                                            no-caret>
                                    <template #button-content>
                                        <b-icon-three-dots/>
                                    </template>
                                    <b-dropdown-item @click="editNode(nodeData)">Edit</b-dropdown-item>
                                    <b-dropdown-item @click="addNode(nodeData)">Add child node</b-dropdown-item>
                                    <b-dropdown-item v-if="nodeData.id !== -1" @click="deleteNode(nodeData)">
                                        Delete
                                    </b-dropdown-item>
                                </b-dropdown>
                            </div>
                            <!--                            <h6>{{nodeData.name}}</h6>-->
                        </b-card>
                    </template>
                </OrgChart>

                <!--                People chart-->
                <OrgChart :datasource="dsPeople"
                          @click.native="clickContainer($event)" v-if="viewMode === PEOPLE_VIEW_MODE">
                    <!--       <template slot-scope="{ nodeData }">
                            <b @click="selectNode(nodeData)">{{ nodeData.name }}</b>
                          </template> -->
                    <template slot-scope="{nodeData}">
                        <b-card header-tag="header" footer-tag="footer" :id="`node-people` + nodeData.id">
                            <div>
                                <b-img v-bind="mainProps" rounded="circle" alt="User profile"
                                       src="http://quanlyhoivien.hoinhabaohatinh.org.vn/upload/anhtrong.jpeg">
                                </b-img>
                            </div>
                            <strong>{{nodeData.employeeId}}</strong>
                            <div v-if="interactMode === EDIT_MODE">
                                <b-dropdown size="sm" variant="link" toggle-class="text-decoration-none"
                                            no-caret>
                                    <template #button-content>
                                        <b-icon-three-dots/>
                                    </template>
                                    <b-dropdown-item @click="editPeopleNode(nodeData)">Edit</b-dropdown-item>
                                    <b-dropdown-item @click="addChildPeopleNode(nodeData)">Add child node
                                    </b-dropdown-item>
                                    <b-dropdown-item v-if="nodeData.id !== 1" @click="deletePeopleNode(nodeData)">
                                        Delete
                                    </b-dropdown-item>
                                </b-dropdown>
                            </div>

                            <h6><i>{{nodeData.orgUnitName}}</i></h6>
                            <h6><i>{{nodeData.postion && nodeData.postion.name ? nodeData.postion.name : ""}}</i></h6>
                            <h6>{{nodeData.name}}</h6>
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
                        <!--                        <vue-typeahead-bootstrap-->
                        <!--                                :data="['type_1', 'type_2', 'type_3', 'type_4', 'type_5']"-->
                        <!--                                v-model="newNodeTitle"-->
                        <!--                                placeholder="entry"-->
                        <!--                                :show-all-results="true"-->
                        <!--                        />-->
                        <b-form-input v-model="newNodeName" placeholder="name" width="100"
                                      v-if="viewMode === ORG_VIEW_MODE"/>
                        <div v-if="viewMode === PEOPLE_VIEW_MODE">
                            <!--                            child org unit-->
                            <b-form-select v-model="peopleAddObject.selectedOrgUnit"
                                           :options="lstOrgUnit"></b-form-select>
                            <b-form-select v-model="peopleAddObject.selectedOrgPos"
                                           :options="lstPosition"></b-form-select>
                            <b-form-input v-model="peopleAddObject.name" placeholder="name" width="100"/>
                        </div>

                    </div>
                    <br/>
                    <div>
                        <b-button @click="addChildNode" variant="outline-primary" size="sm" class="new-button"
                                  v-if="isAdded">Add Child
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
                        <b-button @click="updateNode" variant="outline-primary" size="sm" class="new-button"
                                  v-if="!isAdded">Update
                            Node
                        </b-button>
                    </div>
                </div>
            </b-col>
        </b-row>
        <b-row>
            <b-col sm="10"></b-col>
            <b-col sm="1">
                <!--                <b-form-input id="range-1" v-model="zoomValueNew" type="range" min="0" max="10" step="1"-->
                <!--                              @update="zoomHandler"></b-form-input>-->
                <b-button-group style="background-color: white; color: black">
                    <b-button class="custom-zoom-button" @click="zoomOutHandler">
                        <b-icon-zoom-out></b-icon-zoom-out>
                    </b-button>
<!--                    <div class="zoom-text">-->
<!--                        <span>{{zoomLevel}}%</span>-->
<!--                    </div>-->
                    <b-button class="custom-zoom-button" @click="zoomInHandler">
                        <b-icon-zoom-in></b-icon-zoom-in>
                    </b-button>
                </b-button-group>

                <!--                zoom in/zoom out-->
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
    // import VueTypeaheadBootstrap from 'vue-typeahead-bootstrap';
    import Constants from '../../constant/Constants.js';

    export default {
        name: 'OrgChartComponent',
        components: {
            OrgChart,
            // VueTypeaheadBootstrap
        },
        props: {
            zoomoutLimit: {
                type: Number,
                required: false,
                default: 0.5
            },
            zoominLimit: {
                type: Number,
                required: false,
                default: 7
            }
        },
        data() {
            return {
                dsPeople: {},
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
                mainProps: {width: 50, height: 50, class: 'm1'},
                isAdded: false,
                nodePeopleSelect: {},
                peopleAddObject: {
                    selectedOrgUnit: {},
                    selectedOrgPos: {},
                    name: ""
                },
                lstPosition: [],
                lstOrgUnit: [],
                searchDate: '',
                zoomValueNew: "3.5",
                zoomValueOld: "",
                zoomLevel: 100,
                transformVal: "",
                cursorVal: 'default',
                panning: false,
                startX: 0,
                startY: 0,
            }
        },
        created() {
            this.zoomValueOld = this.zoomValueNew;
            this.transformValOld = this.transformVal;
        },
        mounted() {
            // GET request using axios with set headers
            // const headers = {"Access-Control-Allow-Origin": "*", "Content-Type": "application/json"};
            this.getOrgUnitNodes();
            $('.orgchart').mousedown(e => {
                // console.log(e);
                this.panStartHandler(e);
            })

            $('.orgchart').mousemove(e => {
                // console.log(e);
                if (this.panning) {
                    this.panHandler(e);
                }
            })
            $('.orgchart-container').mouseup(e => {
                if (this.panning) {
                    this.panEndHandler(e)
                }
            })

        },
        methods: {
            getOrgUnitNodes() {
                axios.get(Constants.URI.HOST_PAYROLL_ORG_SERVICE + Constants.URI.UNIT + Constants.URI.ROOT_ID, this.headers)
                    .then(response => this.ds = response.data);
            },
            getEmployeeUnit() {
                axios.get(Constants.URI.HOST_PAYROLL_ORG_SERVICE + Constants.URI.UNIT_EMPLOYEE + Constants.URI.ROOT_ID, this.headers)
                    .then(response => this.dsPeople = response.data);
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
                        rootId: Constants.APP.ROOT_ID,
                        parentOrgUnitId: [
                            this.nodeSelect.id
                        ]
                    };

                    console.log(nodeRequest);

                    axios.post(Constants.URI.HOST_PAYROLL_ORG_SERVICE + Constants.URI.UNIT, nodeRequest, this.headers).then(this.getOrgUnitNodes).catch(console.error);

                    this.afterAddOrUpdate();
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

                    axios.post(Constants.URI.HOST_PAYROLL_ORG_SERVICE + Constants.URI.UNIT + Constants.URI.UPDATE,
                        nodeRequest, this.headers).then(this.getOrgUnitNodes).catch(console.error);

                    this.afterAddOrUpdate();
                } else {
                    alert("update node people");
                }
            },
            async editNode(nodeData) {
                this.nodeSelect = nodeData;
                // this.newNodeTitle = no;
                this.newNodeName = nodeData.name;
                this.isAdded = false;
                this.selectNode(nodeData);
            },
            async addNode(nodeData) {
                this.newNodeTitle = "";
                this.newNodeName = "";
                this.nodeSelect = nodeData;

                this.enableEdit = true;
                this.isAdded = true;
            },
            async deleteNode(nodeData) {
                this.boxOne = ''
                this.$bvModal.msgBoxConfirm('Are you sure?')
                    .then(value => {
                        this.boxOne = value
                        console.log(value)
                        if (value) {
                            if (this.viewMode === this.ORG_VIEW_MODE) {
                                axios.delete(Constants.URI.HOST_PAYROLL_ORG_SERVICE +
                                    Constants.URI.UNIT + Constants.URI.ROOT_ID + `/${nodeData.id}`, this.headers).then(this.getOrgUnitNodes).catch(console.error);
                            }
                        }
                    })
                    .catch(console.error)
                console.log(nodeData)
            },
            changeViewMode() {
                if (this.viewMode === this.ORG_VIEW_MODE) {
                    this.getEmployeeUnit();
                    this.viewMode = this.PEOPLE_VIEW_MODE;
                } else {
                    this.getOrgUnitNodes();
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
            },
            afterAddOrUpdate() {
                this.nodeSelect = {};
                this.newNodeName = "";
                this.enableEdit = false;
            },
            async editPeopleNode(peopleNode) {
                this.nodePeopleSelect = peopleNode;
                this.isAdded = false;
                this.selectNode(peopleNode);

                // load list option

            },
            async addChildPeopleNode(peopleNode) {
                console.log(peopleNode)
            },
            async deletePeopleNode(peopleNode) {
                console.log(peopleNode)

            },
            setChartScale(newScale) {
                let matrix = ''
                let targetScale = 1
                if (this.transformVal === '') {
                    this.transformVal = 'matrix(' + newScale + ', 0, 0, ' + newScale + ', 0, 0)'
                } else {
                    matrix = this.transformVal.split(',')
                    if (this.transformVal.indexOf('3d') === -1) {
                        targetScale = Math.abs(window.parseFloat(matrix[3]) * newScale)
                        if (targetScale > this.zoomoutLimit && targetScale < this.zoominLimit) {
                            matrix[0] = 'matrix(' + targetScale
                            matrix[3] = targetScale
                            this.transformVal = matrix.join(',')
                        }
                    } else {
                        targetScale = Math.abs(window.parseFloat(matrix[5]) * newScale)
                        if (targetScale > this.zoomoutLimit && targetScale < this.zoominLimit) {
                            matrix[0] = 'matrix3d(' + targetScale
                            matrix[5] = targetScale
                            this.transformVal = matrix.join(',')
                        }
                    }
                }

                // console.log(this.transformVal)
                // this.applyCss();
            },
            zoomHandler() {
                // console.log(+this.zoomValue)
                let zoomValue = 0;
                if (+this.zoomValueOld > +this.zoomValueNew) {
                    zoomValue = 1;
                } else {
                    zoomValue = -1;
                }
                this.zoomValueOld = this.zoomValueNew;

                let newScale = 1 + (zoomValue > 0 ? -0.2 : 0.2)
                console.log('newScale', newScale);
                this.setChartScale(newScale)
            },
            zoomInHandler() {
                let newScale = 1.2
                this.setChartScale(newScale)
            },
            zoomOutHandler() {
                let newScale = 0.8
                this.setChartScale(newScale)
            },
            panEndHandler() {
                // console.log(`panEndHandler`)
                this.panning = false
                this.cursorVal = 'default'
                this.applyCss();
            },
            panHandler(e) {
                // console.log(`panHandler`)
                let newX = 0
                let newY = 0
                if (!e.targetTouches) { // pand on desktop
                    newX = e.pageX - this.startX
                    newY = e.pageY - this.startY
                } else if (e.targetTouches.length === 1) { // pan on mobile device
                    newX = e.targetTouches[0].pageX - this.startX
                    newY = e.targetTouches[0].pageY - this.startY
                } else if (e.targetTouches.length > 1) {
                    return;
                }
                if (this.transformVal === '') {
                    if (this.transformVal.indexOf('3d') === -1) {
                        this.transformVal = 'matrix(1,0,0,1,' + newX + ',' + newY + ')'
                    } else {
                        this.transformVal = 'matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,' + newX + ', ' + newY + ',0,1)'
                    }
                } else {
                    let matrix = this.transformVal.split(',')
                    if (this.transformVal.indexOf('3d') === -1) {
                        matrix[4] = newX
                        matrix[5] = newY + ')'
                    } else {
                        matrix[12] = newX
                        matrix[13] = newY
                    }
                    this.transformVal = matrix.join(',')
                }
                // this.applyCss();
            },
            panStartHandler(e) {
                // console.log(`panStartHandler`)
                if ($(e.target).closest('.node').length) {
                    this.panning = false
                    return
                } else {
                    this.cursorVal = 'move'
                    this.panning = true
                }
                let lastX = 0
                let lastY = 0
                if (this.transformVal !== '') {
                    let matrix = this.transformVal.split(',')
                    if (this.transformVal.indexOf('3d') === -1) {
                        lastX = parseInt(matrix[4])
                        lastY = parseInt(matrix[5])
                    } else {
                        lastX = parseInt(matrix[12])
                        lastY = parseInt(matrix[13])
                    }
                }
                if (!e.targetTouches) { // pand on desktop
                    this.startX = e.pageX - lastX
                    this.startY = e.pageY - lastY
                } else if (e.targetTouches.length === 1) { // pan on mobile device
                    this.startX = e.targetTouches[0].pageX - lastX
                    this.startY = e.targetTouches[0].pageY - lastY
                } else if (e.targetTouches.length > 1) {
                    return
                }
            },
            applyCss() {
                $('.orgchart').css({
                    "transform": this.transformVal,
                    "cursor": this.cursorVal
                });
            }
        },
        watch: {
            transformVal: function () {
                this.applyCss();
            },
            viewMode: function () {
                this.transformVal = Constants.APP.DEFAULT_TRANSFORM
                this.applyCss();
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
        height: 500px;
        width: 90%;
        border-radius: 5px;
        overflow: auto;
        text-align: center;
    }

    .custom-zoom-button {
        color: black;
        background-color: white;
    }

    .zoom-text {
        border: 1px solid black;
        border-left: 0px;
        padding-left: 10px;
        padding-right: 10px;
        text-align: center;
        padding-top: 0.4rem
    }

</style>
