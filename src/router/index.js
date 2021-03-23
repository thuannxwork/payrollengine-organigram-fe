import Vue from 'vue'
import VueRouter from 'vue-router'

import Configuration from "../components/Configuration/Configuration";
import OrgChart from "../components/OrgChart/OrgChart";

Vue.use(VueRouter);

export default new VueRouter({
    routes: [
        {
            path: '/configuration',
            name: 'Configuration',
            component: Configuration
        },
        {
            path: '/orgchart',
            name: 'OrgChart',
            component: OrgChart
        },
    ]
})
