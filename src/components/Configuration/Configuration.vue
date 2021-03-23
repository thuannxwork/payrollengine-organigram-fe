<template>
    <div>
        <b-row>
            <b-tabs content-class="mt-3" style="margin-left: 30px; width: 100%" pills>
                <b-tab title="Department Managment" active @click="handleChangeTab('department')">
                    <ConfigurationDetail :type="type" />
                </b-tab>
                <b-tab title="Role Managment" @click="handleChangeTab('role')">
                    <ConfigurationDetail :type="type" />
                </b-tab>
                <b-tab title="Employee Managment" @click="handleChangeTab('employee')">
                    <ConfigurationDetail :type="type" />
                </b-tab>
            </b-tabs>
        </b-row>
    </div>
</template>

<script>
    import ConfigurationDetail from "./ConfigurationDetail";

    export default {
        name: "Configuration",
        components: {
            ConfigurationDetail
        },
        methods: {
            handleChangeTab(tab) {
                // eslint-disable-next-line no-console
                console.log(tab);
                this.type = tab;
            }
        },
        data: function () {
            return {
                type: "",
            };
        }
    }
</script>

<style>
    .nav-pills .nav-link.active {
        color: black !important;
        background-color: orange !important;
    }
</style>
