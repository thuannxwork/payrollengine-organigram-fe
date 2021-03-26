export default {
    HTTP_CONFIG: {
        HEADERS: {"Access-Control-Allow-Origin": "*", "Content-Type": "application/json"},
    },
    APP: {
        VIEW_MODE_PEOPLE: "people",
        VIEW_MODE_ORG: "org",
        DISPLAY_MODE: "display",
        EDIT_MODE: "edit"
    },
    URI: {
        HOST: "http://localhost:8081",
        PAYROLL_ORGANIGRAM_SERVICE: "/payroll-organigram-service",
        HOST_PAYROLL_ORG_SERVICE: "http://localhost:8081/payroll-organigram-service",
        UNIT: "/unit",
        UNIT_EMPLOYEE: "/unit-employee",
        DELETE: "/delete",
        UPDATE: "/update",
        ROOT_ID: "/1001"
    }
}
