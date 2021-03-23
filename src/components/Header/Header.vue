<template>
    <div>
        <b-row>
            <div style="margin-left: 30px" class="mb-2">
                <router-link to="/orgchart"><b-button variant="success">OrgChart</b-button></router-link>&#160;
                <router-link to="/configuration"><b-button variant="primary">Configuration</b-button></router-link>
            </div>
        </b-row>
    </div>
</template>

<script>

    export default {
        name: "Header",
        components: {
        },
    }
</script>

<style>

</style>
